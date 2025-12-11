function ConvertHandler() {
  
  // Separa el número del texto (ej: "3.5gal" -> 3.5)
  this.getNum = function(input) {
    let result;
    // Busca donde empieza la primera letra
    let firstCharIndex = input.search(/[a-z]/i);
    
    // Si no hay letras, todo es número. Si empieza con letra, asumimos 1.
    let numStr = firstCharIndex >= 0 ? input.slice(0, firstCharIndex) : input;
    
    if (numStr.length === 0) {
      return 1;
    }

    // Manejar fracciones (ej: 1/2)
    if (numStr.includes('/')) {
      let split = numStr.split('/');
      // Si hay más de una barra (ej: 3/2/3), es error
      if (split.length !== 2) {
        return 'invalid number';
      }
      result = parseFloat(split[0]) / parseFloat(split[1]);
    } else {
      result = parseFloat(numStr);
    }

    if (isNaN(result)) {
      return 'invalid number';
    }

    return result;
  };

  // Separa la unidad (ej: "3.5gal" -> "gal")
  this.getUnit = function(input) {
    let firstCharIndex = input.search(/[a-z]/i);
    if (firstCharIndex < 0) return 'invalid unit';
    
    let unit = input.slice(firstCharIndex);
    const validUnits = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
    
    let lowerUnit = unit.toLowerCase();
    
    if (validUnits.includes(lowerUnit)) {
      // Regla: Litros debe ser 'L' mayúscula, el resto minúscula
      return lowerUnit === 'l' ? 'L' : lowerUnit;
    }
    
    return 'invalid unit';
  };

  this.getReturnUnit = function(initUnit) {
    const unitMap = {
      'gal': 'L',
      'L': 'gal',
      'mi': 'km',
      'km': 'mi',
      'lbs': 'kg',
      'kg': 'lbs'
    };
    // Normalizamos a 'L' o minúsculas para buscar en el mapa
    let lookup = initUnit === 'l' || initUnit === 'L' ? 'L' : initUnit.toLowerCase();
    return unitMap[lookup];
  };

  this.spellOutUnit = function(unit) {
    const spellMap = {
      'gal': 'gallons',
      'L': 'liters',
      'mi': 'miles',
      'km': 'kilometers',
      'lbs': 'pounds',
      'kg': 'kilograms'
    };
    let lookup = unit === 'l' || unit === 'L' ? 'L' : unit.toLowerCase();
    return spellMap[lookup];
  };

  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
    
    // Normalizamos para el switch
    let lookup = initUnit === 'l' || initUnit === 'L' ? 'L' : initUnit.toLowerCase();

    switch(lookup) {
      case 'gal': result = initNum * galToL; break;
      case 'L': result = initNum / galToL; break;
      case 'lbs': result = initNum * lbsToKg; break;
      case 'kg': result = initNum / lbsToKg; break;
      case 'mi': result = initNum * miToKm; break;
      case 'km': result = initNum / miToKm; break;
    }
    
    return parseFloat(result.toFixed(5));
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
}

module.exports = ConvertHandler;