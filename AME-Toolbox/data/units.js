/**
 * units.js
 * Master unit definitions for AME Toolbox.
 * Every unit type has a base unit (factor = 1) and other units store
 * a factor to convert FROM base unit TO that unit, except temperature
 * which needs custom formulas (handled in measurement.js).
 */

const UNIT_DATA = {
  length: {
    label: "Length",
    labelId: "Panjang",
    icon: "ruler",
    base: "m",
    units: {
      mm: { name: "Millimeter", symbol: "mm", factor: 1000 },
      cm: { name: "Centimeter", symbol: "cm", factor: 100 },
      m:  { name: "Meter", symbol: "m", factor: 1 },
      km: { name: "Kilometer", symbol: "km", factor: 0.001 },
      in: { name: "Inch", symbol: "in", factor: 39.3700787 },
      ft: { name: "Foot", symbol: "ft", factor: 3.2808399 },
      yd: { name: "Yard", symbol: "yd", factor: 1.0936133 },
      mi: { name: "Mile", symbol: "mi", factor: 0.0006213712 },
      nm: { name: "Nautical Mile", symbol: "NM", factor: 0.0005399568 }
    }
  },
  area: {
    label: "Area",
    labelId: "Luas",
    icon: "square",
    base: "m2",
    units: {
      mm2: { name: "Square Millimeter", symbol: "mm²", factor: 1000000 },
      cm2: { name: "Square Centimeter", symbol: "cm²", factor: 10000 },
      m2:  { name: "Square Meter", symbol: "m²", factor: 1 },
      km2: { name: "Square Kilometer", symbol: "km²", factor: 0.000001 },
      in2: { name: "Square Inch", symbol: "in²", factor: 1550.0031 },
      ft2: { name: "Square Foot", symbol: "ft²", factor: 10.7639104 },
      yd2: { name: "Square Yard", symbol: "yd²", factor: 1.19599005 },
      acre:{ name: "Acre", symbol: "acre", factor: 0.00024710538 }
    }
  },
  volume: {
    label: "Volume",
    labelId: "Volume",
    icon: "box",
    base: "l",
    units: {
      ml:  { name: "Milliliter", symbol: "mL", factor: 1000 },
      l:   { name: "Liter", symbol: "L", factor: 1 },
      m3:  { name: "Cubic Meter", symbol: "m³", factor: 0.001 },
      gal_us: { name: "US Gallon", symbol: "gal (US)", factor: 0.264172052 },
      gal_uk: { name: "UK Gallon", symbol: "gal (UK)", factor: 0.219969157 },
      qt:  { name: "US Quart", symbol: "qt", factor: 1.05668821 },
      pt:  { name: "US Pint", symbol: "pt", factor: 2.11337642 },
      floz:{ name: "US Fluid Ounce", symbol: "fl oz", factor: 33.8140227 },
      in3: { name: "Cubic Inch", symbol: "in³", factor: 61.0237441 }
    }
  },
  weight: {
    label: "Weight",
    labelId: "Berat",
    icon: "weight",
    base: "kg",
    units: {
      mg: { name: "Milligram", symbol: "mg", factor: 1000000 },
      g:  { name: "Gram", symbol: "g", factor: 1000 },
      kg: { name: "Kilogram", symbol: "kg", factor: 1 },
      t:  { name: "Metric Ton", symbol: "t", factor: 0.001 },
      oz: { name: "Ounce", symbol: "oz", factor: 35.2739619 },
      lb: { name: "Pound", symbol: "lb", factor: 2.20462262 },
      st: { name: "Stone", symbol: "st", factor: 0.157473044 }
    }
  },
  pressure: {
    label: "Pressure",
    labelId: "Tekanan",
    icon: "gauge",
    base: "pa",
    units: {
      pa:  { name: "Pascal", symbol: "Pa", factor: 1 },
      kpa: { name: "Kilopascal", symbol: "kPa", factor: 0.001 },
      mpa: { name: "Megapascal", symbol: "MPa", factor: 0.000001 },
      bar: { name: "Bar", symbol: "bar", factor: 0.00001 },
      psi: { name: "PSI", symbol: "psi", factor: 0.000145038 },
      atm: { name: "Atmosphere", symbol: "atm", factor: 0.00000986923 },
      mmhg:{ name: "mmHg", symbol: "mmHg", factor: 0.00750062 },
      inhg:{ name: "inHg", symbol: "inHg", factor: 0.0002953 }
    }
  },
  temperature: {
    label: "Temperature",
    labelId: "Suhu",
    icon: "thermometer",
    base: "c",
    // temperature uses custom conversion (non-linear), handled in measurement.js
    units: {
      c: { name: "Celsius", symbol: "°C" },
      f: { name: "Fahrenheit", symbol: "°F" },
      k: { name: "Kelvin", symbol: "K" },
      r: { name: "Rankine", symbol: "°R" }
    }
  },
  speed: {
    label: "Speed",
    labelId: "Kecepatan",
    icon: "gauge-circle",
    base: "ms",
    units: {
      ms:   { name: "Meter/second", symbol: "m/s", factor: 1 },
      kmh:  { name: "Kilometer/hour", symbol: "km/h", factor: 3.6 },
      mph:  { name: "Miles/hour", symbol: "mph", factor: 2.23693629 },
      kt:   { name: "Knot", symbol: "kt", factor: 1.94384449 },
      fts:  { name: "Feet/second", symbol: "ft/s", factor: 3.2808399 },
      mach: { name: "Mach (approx)", symbol: "Mach", factor: 0.0029386 }
    }
  },
  time: {
    label: "Time",
    labelId: "Waktu",
    icon: "clock",
    base: "s",
    units: {
      ms:  { name: "Millisecond", symbol: "ms", factor: 1000 },
      s:   { name: "Second", symbol: "s", factor: 1 },
      min: { name: "Minute", symbol: "min", factor: 1/60 },
      hr:  { name: "Hour", symbol: "hr", factor: 1/3600 },
      day: { name: "Day", symbol: "day", factor: 1/86400 }
    }
  },
  angle: {
    label: "Angle",
    labelId: "Sudut",
    icon: "triangle",
    base: "deg",
    units: {
      deg: { name: "Degree", symbol: "°", factor: 1 },
      rad: { name: "Radian", symbol: "rad", factor: 0.0174532925 },
      grad:{ name: "Gradian", symbol: "grad", factor: 1.11111111 },
      rev: { name: "Revolution", symbol: "rev", factor: 0.00277777778 }
    }
  },
  torque: {
    label: "Torque",
    labelId: "Torsi",
    icon: "wrench",
    base: "nm",
    units: {
      nm:     { name: "Newton-meter", symbol: "N·m", factor: 1 },
      lbfft:  { name: "Pound-force foot", symbol: "lbf·ft", factor: 0.737562149 },
      lbfin:  { name: "Pound-force inch", symbol: "lbf·in", factor: 8.85074579 },
      kgfcm:  { name: "Kilogram-force cm", symbol: "kgf·cm", factor: 10.1971621 }
    }
  },
  voltage: {
    label: "Voltage",
    labelId: "Tegangan",
    icon: "zap",
    base: "v",
    units: {
      mv: { name: "Millivolt", symbol: "mV", factor: 1000 },
      v:  { name: "Volt", symbol: "V", factor: 1 },
      kv: { name: "Kilovolt", symbol: "kV", factor: 0.001 }
    }
  },
  current: {
    label: "Current",
    labelId: "Arus",
    icon: "activity",
    base: "a",
    units: {
      ua: { name: "Microampere", symbol: "µA", factor: 1000000 },
      ma: { name: "Milliampere", symbol: "mA", factor: 1000 },
      a:  { name: "Ampere", symbol: "A", factor: 1 },
      ka: { name: "Kiloampere", symbol: "kA", factor: 0.001 }
    }
  },
  resistance: {
    label: "Resistance",
    labelId: "Resistansi",
    icon: "circuit-board",
    base: "ohm",
    units: {
      ohm:  { name: "Ohm", symbol: "Ω", factor: 1 },
      kohm: { name: "Kilohm", symbol: "kΩ", factor: 0.001 },
      mohm: { name: "Megaohm", symbol: "MΩ", factor: 0.000001 }
    }
  },
  power: {
    label: "Power",
    labelId: "Daya",
    icon: "flame",
    base: "w",
    units: {
      w:  { name: "Watt", symbol: "W", factor: 1 },
      kw: { name: "Kilowatt", symbol: "kW", factor: 0.001 },
      mw: { name: "Megawatt", symbol: "MW", factor: 0.000001 },
      hp: { name: "Horsepower", symbol: "hp", factor: 0.00134102209 }
    }
  },
  frequency: {
    label: "Frequency",
    labelId: "Frekuensi",
    icon: "waves",
    base: "hz",
    units: {
      hz:  { name: "Hertz", symbol: "Hz", factor: 1 },
      khz: { name: "Kilohertz", symbol: "kHz", factor: 0.001 },
      mhz: { name: "Megahertz", symbol: "MHz", factor: 0.000001 },
      ghz: { name: "Gigahertz", symbol: "GHz", factor: 0.000000001 }
    }
  },
  capacitance: {
    label: "Capacitance",
    labelId: "Kapasitansi",
    icon: "battery",
    base: "f",
    units: {
      pf: { name: "Picofarad", symbol: "pF", factor: 1000000000000 },
      nf: { name: "Nanofarad", symbol: "nF", factor: 1000000000 },
      uf: { name: "Microfarad", symbol: "µF", factor: 1000000 },
      f:  { name: "Farad", symbol: "F", factor: 1 }
    }
  }
};

// Export for use in other scripts (no bundler, so attach to window)
window.UNIT_DATA = UNIT_DATA;
