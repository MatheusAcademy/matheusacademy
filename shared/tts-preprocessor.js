/*
 * Matheus Academy TTS Preprocessor
 * Converts text patterns into natural reading for Text-to-Speech
 * Export: window.MA_TTS_PREPROCESS
 */

window.MA_TTS_PREPROCESS = (function() {
  'use strict';

  /**
   * Convert Roman numerals to written text
   * Examples: I -> um, IV -> quatro, XXI -> vinte e um, C -> cem, M -> mil
   */
  function convertRomanNumerals(text) {
    const romanMap = {
      'I': 'um',
      'II': 'dois',
      'III': 'três',
      'IV': 'quatro',
      'V': 'cinco',
      'VI': 'seis',
      'VII': 'sete',
      'VIII': 'oito',
      'IX': 'nove',
      'X': 'dez',
      'XX': 'vinte',
      'XXI': 'vinte e um',
      'XXII': 'vinte e dois',
      'XXX': 'trinta',
      'XL': 'quarenta',
      'L': 'cinquenta',
      'LX': 'sessenta',
      'LXX': 'setenta',
      'LXXX': 'oitenta',
      'XC': 'noventa',
      'C': 'cem',
      'CC': 'duzentos',
      'CCC': 'trezentos',
      'CD': 'quatrocentos',
      'D': 'quinhentos',
      'DC': 'seiscentos',
      'DCC': 'setecentos',
      'DCCC': 'oitocentos',
      'CM': 'novecentos',
      'M': 'mil',
      'MM': 'dois mil'
    };

    let result = text;

    // Match patterns like "Século XXI" -> "Século vinte e um"
    result = result.replace(/\b([A-Za-z]+\s+)((?:XC|XL|LX|XC|CD|CM|M|D|C|L|X|V|I)+)\b/g,
      function(match, prefix, roman) {
        const romanUpper = roman.toUpperCase();
        return prefix + (romanMap[romanUpper] || roman);
      }
    );

    // Match standalone Roman numerals at word boundaries
    result = result.replace(/\b((?:XC|XL|LX|CD|CM|M|D|C|L|X|V|I)+)\b/g,
      function(match) {
        const romanUpper = match.toUpperCase();
        return romanMap[romanUpper] || match;
      }
    );

    return result;
  }

  /**
   * Convert numbers to written text
   * Examples: 1989 -> "mil novecentos e oitenta e nove"
   *          2.271 -> "dois mil duzentos e setenta e um"
   *          42 -> "quarenta e dois"
   */
  function convertNumbersToText(text) {
    const ones = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const tens = ['', 'dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
    const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];

    const scales = [
      { value: 1000000, name: 'milhão', singular: 'um milhão' },
      { value: 1000, name: 'mil', singular: 'mil' },
      { value: 100, name: 'cem', singular: 'cem' }
    ];

    function convertGroupToText(num) {
      if (num === 0) return '';
      if (num < 10) return ones[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) {
        const ten = Math.floor(num / 10);
        const one = num % 10;
        return one === 0 ? tens[ten] : tens[ten] + ' e ' + ones[one];
      }
      if (num < 1000) {
        const hundred = Math.floor(num / 100);
        const rest = num % 100;
        const hundredText = hundred === 1 ? 'cem' : ones[hundred] + 'centos';
        return rest === 0 ? hundredText : hundredText + ' e ' + convertGroupToText(rest);
      }
      return '';
    }

    function convertNumberToWords(num) {
      if (num === 0) return 'zero';

      let result = '';
      let isNegative = false;

      if (num < 0) {
        isNegative = true;
        num = Math.abs(num);
      }

      for (const scale of scales) {
        if (num >= scale.value) {
          const scaleCount = Math.floor(num / scale.value);
          if (scaleCount === 1 && scale.singular) {
            result += scale.singular;
          } else {
            result += convertGroupToText(scaleCount) + ' ' + scale.name;
          }
          num %= scale.value;
          if (num > 0) result += ' ';
        }
      }

      if (num > 0) {
        result += convertGroupToText(num);
      }

      return isNegative ? 'menos ' + result : result;
    }

    // Match numbers with optional decimal/thousand separators
    // Supports: 1989, 1.989, 2,5, etc.
    return text.replace(/\b(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?)\b/g, function(match) {
      // Normalize separators (replace . and , with nothing for integer parsing, keep last , or . for decimals)
      let numStr = match.replace(/\s/g, '');

      // Check if it's a decimal number
      const lastComma = numStr.lastIndexOf(',');
      const lastDot = numStr.lastIndexOf('.');

      let integerPart = numStr;
      let decimalPart = '';

      if (lastComma > lastDot) {
        // Last separator is comma - treat as decimal separator
        integerPart = numStr.substring(0, lastComma).replace(/[.,]/g, '');
        decimalPart = numStr.substring(lastComma + 1);
      } else if (lastDot !== -1 && lastDot > lastComma) {
        // Last separator is dot
        // If only 1-2 digits after dot, it's likely a decimal
        const afterDot = numStr.substring(lastDot + 1);
        if (afterDot.length <= 2 && !numStr.substring(0, lastDot).includes('.')) {
          // Likely decimal (e.g., 1.5)
          integerPart = numStr.substring(0, lastDot).replace(/\./g, '');
          decimalPart = afterDot;
        } else {
          // Thousand separator
          integerPart = numStr.replace(/\./g, '');
        }
      } else {
        integerPart = numStr.replace(/[.,]/g, '');
      }

      let result = '';
      if (integerPart && integerPart !== '0') {
        result = convertNumberToWords(parseInt(integerPart, 10));
      }

      if (decimalPart) {
        result += ' vírgula';
        for (let digit of decimalPart) {
          result += ' ' + ones[parseInt(digit, 10)];
        }
      }

      return result || '0';
    });
  }

  /**
   * Convert dates to natural reading
   * Examples: 1989 -> "mil novecentos e oitenta e nove"
   *          12/05/2020 -> "doze de maio de dois mil e vinte"
   *          "janeiro de 2020" -> "janeiro de dois mil e vinte"
   */
  function convertDates(text) {
    const months = {
      'janeiro': 'janeiro', 'february': 'fevereiro', 'fevereiro': 'fevereiro',
      'march': 'março', 'março': 'março',
      'april': 'abril', 'abril': 'abril',
      'may': 'maio', 'maio': 'maio',
      'june': 'junho', 'junho': 'junho',
      'july': 'julho', 'julho': 'julho',
      'august': 'agosto', 'agosto': 'agosto',
      'september': 'setembro', 'setembro': 'setembro',
      'october': 'outubro', 'outubro': 'outubro',
      'november': 'novembro', 'novembro': 'novembro',
      'december': 'dezembro', 'dezembro': 'dezembro',
      '01': 'janeiro', '02': 'fevereiro', '03': 'março', '04': 'abril',
      '05': 'maio', '06': 'junho', '07': 'julho', '08': 'agosto',
      '09': 'setembro', '10': 'outubro', '11': 'novembro', '12': 'dezembro'
    };

    const ones = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    const tens = ['', 'dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];

    function numToWords(num) {
      if (num < 10) return ones[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) {
        const ten = Math.floor(num / 10);
        const one = num % 10;
        return one === 0 ? tens[ten] : tens[ten] + ' e ' + ones[one];
      }
      return num.toString();
    }

    // Match DD/MM/YYYY or DD-MM-YYYY format
    result = text.replace(/(\d{2})[/\-](\d{2})[/\-](\d{4})/g, function(match, day, month, year) {
      const dayText = numToWords(parseInt(day, 10));
      const monthText = months[month] || month;
      const yearNum = parseInt(year, 10);

      // Convert year to words
      let yearText = '';
      if (yearNum < 1000) {
        yearText = numToWords(yearNum);
      } else if (yearNum < 2000) {
        const thou = Math.floor(yearNum / 1000);
        const rest = yearNum % 1000;
        yearText = ones[thou] + 'mil';
        if (rest > 0) {
          if (rest < 100) {
            yearText += ' e ' + numToWords(rest);
          } else {
            yearText += ' ' + numToWords(rest);
          }
        }
      } else {
        const thou = Math.floor(yearNum / 1000);
        const rest = yearNum % 1000;
        yearText = ones[thou] + 'mil';
        if (rest > 0) {
          yearText += ' e ' + numToWords(rest);
        }
      }

      return dayText + ' de ' + monthText + ' de ' + yearText;
    });

    // Match month-year patterns (ex: "janeiro de 2020")
    let result = text;
    result = result.replace(/\b(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+(\d{4})\b/gi,
      function(match, month, year) {
        const monthText = months[month.toLowerCase()] || month;
        const yearNum = parseInt(year, 10);

        let yearText = '';
        if (yearNum < 2000) {
          const thou = yearNum.toString()[0];
          const rest = yearNum % 1000;
          yearText = ones[parseInt(thou)] + 'mil';
          if (rest > 0) {
            if (rest < 100) {
              yearText += ' e ' + numToWords(rest);
            } else {
              yearText += ' ' + numToWords(rest);
            }
          }
        } else {
          const thou = Math.floor(yearNum / 1000);
          const rest = yearNum % 1000;
          yearText = ones[thou] + 'mil';
          if (rest > 0) {
            yearText += ' e ' + numToWords(rest);
          }
        }

        return monthText + ' de ' + yearText;
      }
    );

    return result;
  }

  /**
   * Main preprocessing function
   * Applies all conversions in proper order
   */
  function preprocess(text) {
    if (!text || typeof text !== 'string') {
      return text;
    }

    // Apply conversions in order
    let result = text;

    // 1. Convert dates first (before numbers)
    result = convertDates(result);

    // 2. Convert Roman numerals
    result = convertRomanNumerals(result);

    // 3. Convert remaining numbers
    result = convertNumbersToText(result);

    return result;
  }

  // Public API
  return {
    convert: preprocess,
    convertRomanNumerals,
    convertNumbersToText,
    convertDates
  };
})();

// Verify installation
console.log('✓ MA_TTS_PREPROCESS loaded', window.MA_TTS_PREPROCESS);
