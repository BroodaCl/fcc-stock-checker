const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  
  // Pruebas de números (6 pruebas)
  test('Whole number input', function(done) {
    assert.equal(convertHandler.getNum('32L'), 32);
    done();
  });
  
  test('Decimal input', function(done) {
    assert.equal(convertHandler.getNum('3.2L'), 3.2);
    done();
  });
  
  test('Fractional input', function(done) {
    assert.equal(convertHandler.getNum('1/2L'), 0.5);
    done();
  });
  
  test('Fractional input with decimal', function(done) {
    assert.equal(convertHandler.getNum('5.4/3L'), 1.8);
    done();
  });
  
  test('Invalid double fraction input', function(done) {
    assert.equal(convertHandler.getNum('3/2/3L'), 'invalid number');
    done();
  });
  
  test('No numerical input', function(done) {
    assert.equal(convertHandler.getNum('L'), 1);
    done();
  });
  
  // Pruebas de unidades (4 pruebas)
  test('Read each valid input unit', function(done) {
    let input = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];
    let output = ['gal','L','mi','km','lbs','kg','gal','L','mi','km','lbs','kg'];
    input.forEach(function(ele, i) {
      assert.equal(convertHandler.getUnit(ele), output[i]);
    });
    done();
  });
  
  test('Unknown unit input', function(done) {
    assert.equal(convertHandler.getUnit('34kilograms'), 'invalid unit');
    done();
  });
  
  test('Return unit for each valid input unit', function(done) {
    let input = ['gal','l','mi','km','lbs','kg'];
    let expect = ['L','gal','km','mi','kg','lbs'];
    input.forEach(function(ele, i) {
      assert.equal(convertHandler.getReturnUnit(ele), expect[i]);
    });
    done();
  });
  
  test('Spell-out string for each valid input unit', function(done) {
    let input = ['gal','l','mi','km','lbs','kg'];
    let expect = ['gallons','liters','miles','kilometers','pounds','kilograms'];
    input.forEach(function(ele, i) {
      assert.equal(convertHandler.spellOutUnit(ele), expect[i]);
    });
    done();
  });
  
  // Pruebas de conversión (6 pruebas)
  test('Convert gal to L', function(done) {
    assert.approximately(convertHandler.convert(1, 'gal'), 3.78541, 0.1);
    done();
  });
  
  test('Convert L to gal', function(done) {
    assert.approximately(convertHandler.convert(1, 'L'), 0.26417, 0.1);
    done();
  });
  
  test('Convert mi to km', function(done) {
    assert.approximately(convertHandler.convert(1, 'mi'), 1.60934, 0.1);
    done();
  });
  
  test('Convert km to mi', function(done) {
    assert.approximately(convertHandler.convert(1, 'km'), 0.62137, 0.1);
    done();
  });
  
  test('Convert lbs to kg', function(done) {
    assert.approximately(convertHandler.convert(1, 'lbs'), 0.45359, 0.1);
    done();
  });
  
  test('Convert kg to lbs', function(done) {
    assert.approximately(convertHandler.convert(1, 'kg'), 2.20462, 0.1);
    done();
  });

  
});