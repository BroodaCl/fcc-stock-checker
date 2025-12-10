'use strict';
const mongoose = require('mongoose');
const axios = require('axios');
const crypto = require('crypto');

// CÓDIGO NUEVO (Correcto)
mongoose.connect(process.env.MONGO_URI);

const StockSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  likes: { type: [String], default: [] }
});

const Stock = mongoose.model('Stock', StockSchema);

module.exports = function (app) {

  const anonymizeIP = (ip) => {
    return crypto.createHash('sha256').update(ip).digest('hex');
  };

  const getStockData = async (stockSymbol, like, ip) => {
    const symbol = stockSymbol.toUpperCase();
    // URL del Proxy de FCC para evitar pagar API key
    const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`;
    let price = 0;
    
    try {
      const response = await axios.get(url);
      if (!response.data || response.data === 'Unknown symbol') {
        return { error: 'Relayed Error', stock: symbol };
      }
      price = response.data.latestPrice;
    } catch (err) {
      return { error: 'External API Error' };
    }

    let stockDoc = await Stock.findOne({ symbol });
    if (!stockDoc) {
      stockDoc = new Stock({ symbol, likes: [] });
      await stockDoc.save();
    }

    if (like && ip) {
      const anonymizedIP = anonymizeIP(ip);
      if (!stockDoc.likes.includes(anonymizedIP)) {
        stockDoc.likes.push(anonymizedIP);
        await stockDoc.save();
      }
    }

    return {
      stock: symbol,
      price: price,
      likes: stockDoc.likes.length
    };
  };

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock, like } = req.query;
      const ip = req.ip;
      const isLike = like === 'true';

      if (Array.isArray(stock)) {
        try {
          const [stock1, stock2] = await Promise.all([
            getStockData(stock[0], isLike, ip),
            getStockData(stock[1], isLike, ip)
          ]);

          const stock1Data = {
            stock: stock1.stock,
            price: stock1.price,
            rel_likes: stock1.likes - stock2.likes
          };

          const stock2Data = {
            stock: stock2.stock,
            price: stock2.price,
            rel_likes: stock2.likes - stock1.likes
          };

          return res.json({ stockData: [stock1Data, stock2Data] });
        } catch (e) {
          return res.json({ error: 'Error processing request' });
        }
      } else {
        try {
          const data = await getStockData(stock, isLike, ip);
          return res.json({ stockData: data });
        } catch (e) {
          return res.json({ error: 'Error processing request' });
        }
      }
    });
};