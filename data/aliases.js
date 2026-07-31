/**
 * aliases.js
 * Search index: maps keywords (Indonesian, English, abbreviations, aliases)
 * to a tool destination. Used by search.js for realtime, multilingual search.
 */

const TOOL_INDEX = [
  // ===== Measurement =====
  {
    id: "length",
    title: "Length Converter",
    subtitle: "mm, cm, m, km, inch, feet, yard, mile",
    icon: "ruler",
    color: "blue",
    url: "pages/measurement.html?type=length",
    keywords: [
      "length", "panjang", "jarak", "distance",
      "mm", "millimeter", "milimeter",
      "cm", "centimeter", "centimetre", "sentimeter",
      "m", "meter", "metre",
      "km", "kilometer", "kilometre",
      "in", "inch", "inci", "inches",
      "ft", "feet", "foot", "kaki",
      "yd", "yard",
      "mi", "mile", "mil",
      "nm", "nautical mile"
    ]
  },
  {
    id: "area",
    title: "Area Converter",
    subtitle: "mm², cm², m², km², inch², ft², acre",
    icon: "square",
    color: "blue",
    url: "pages/measurement.html?type=area",
    keywords: ["area", "luas", "m2", "cm2", "mm2", "km2", "acre", "square meter", "square feet", "ft2", "in2"]
  },
  {
    id: "volume",
    title: "Volume Converter",
    subtitle: "mL, L, m³, gallon, quart, pint",
    icon: "box",
    color: "blue",
    url: "pages/measurement.html?type=volume",
    keywords: ["volume", "volume", "liter", "litre", "ml", "milliliter", "l", "m3", "gallon", "galon", "quart", "pint", "fl oz", "fluid ounce", "in3"]
  },
  {
    id: "weight",
    title: "Weight Converter",
    subtitle: "mg, g, kg, ton, oz, lb, stone",
    icon: "weight",
    color: "blue",
    url: "pages/measurement.html?type=weight",
    keywords: ["weight", "berat", "massa", "mass", "mg", "gram", "g", "kg", "kilogram", "ton", "oz", "ounce", "lb", "pound", "lbs", "stone"]
  },
  {
    id: "pressure",
    title: "Pressure Converter",
    subtitle: "Pa, kPa, bar, psi, atm, mmHg",
    icon: "gauge",
    color: "blue",
    url: "pages/measurement.html?type=pressure",
    keywords: ["pressure", "tekanan", "pa", "pascal", "kpa", "kilopascal", "mpa", "bar", "psi", "atm", "atmosphere", "mmhg", "inhg"]
  },
  {
    id: "temperature",
    title: "Temperature Converter",
    subtitle: "Celsius, Fahrenheit, Kelvin, Rankine",
    icon: "thermometer",
    color: "blue",
    url: "pages/measurement.html?type=temperature",
    keywords: ["temperature", "suhu", "celsius", "fahrenheit", "kelvin", "rankine", "c", "f", "k", "derajat"]
  },
  {
    id: "speed",
    title: "Speed Converter",
    subtitle: "m/s, km/h, mph, knot, mach",
    icon: "gauge-circle",
    color: "blue",
    url: "pages/measurement.html?type=speed",
    keywords: ["speed", "kecepatan", "velocity", "ms", "m/s", "kmh", "km/h", "mph", "knot", "kt", "mach"]
  },
  {
    id: "time",
    title: "Time Converter",
    subtitle: "ms, second, minute, hour, day",
    icon: "clock",
    color: "blue",
    url: "pages/measurement.html?type=time",
    keywords: ["time", "waktu", "second", "detik", "minute", "menit", "hour", "jam", "day", "hari"]
  },
  {
    id: "angle",
    title: "Angle Converter",
    subtitle: "degree, radian, gradian, revolution",
    icon: "triangle",
    color: "blue",
    url: "pages/measurement.html?type=angle",
    keywords: ["angle", "sudut", "degree", "derajat", "radian", "rad", "gradian", "revolution"]
  },

  // ===== Torque =====
  {
    id: "torque-unit",
    title: "Torque Unit Converter",
    subtitle: "Nm, lbf-ft, lbf-in, kgf-cm",
    icon: "wrench",
    color: "orange",
    url: "pages/torque.html?tab=unit",
    keywords: ["torque", "torsi", "nm", "newton meter", "lbf-ft", "lbf ft", "lbf-in", "lbf in", "kgf-cm", "kgf cm", "n.m"]
  },
  {
    id: "torque-extension",
    title: "Extension Torque Calculator",
    subtitle: "Adjust torque for wrench extension",
    icon: "ruler",
    color: "orange",
    url: "pages/torque.html?tab=extension",
    keywords: ["extension torque", "torque extension", "torque wrench extension", "kalkulator torsi", "torque calculator", "extension length"]
  },

  // ===== Electrical =====
  {
    id: "voltage",
    title: "Voltage Converter",
    subtitle: "mV, V, kV",
    icon: "zap",
    color: "green",
    url: "pages/electrical.html?type=voltage",
    keywords: ["voltage", "tegangan", "volt", "v", "mv", "kv", "listrik"]
  },
  {
    id: "current",
    title: "Current Converter",
    subtitle: "µA, mA, A, kA",
    icon: "activity",
    color: "green",
    url: "pages/electrical.html?type=current",
    keywords: ["current", "arus", "amp", "ampere", "a", "ma", "ua", "ka"]
  },
  {
    id: "resistance",
    title: "Resistance Converter",
    subtitle: "Ω, kΩ, MΩ",
    icon: "circuit-board",
    color: "green",
    url: "pages/electrical.html?type=resistance",
    keywords: ["resistance", "resistansi", "hambatan", "ohm", "kohm", "mohm"]
  },
  {
    id: "power",
    title: "Power Converter",
    subtitle: "W, kW, MW, hp",
    icon: "flame",
    color: "green",
    url: "pages/electrical.html?type=power",
    keywords: ["power", "daya", "watt", "w", "kw", "mw", "hp", "horsepower"]
  },
  {
    id: "frequency",
    title: "Frequency Converter",
    subtitle: "Hz, kHz, MHz, GHz",
    icon: "waves",
    color: "green",
    url: "pages/electrical.html?type=frequency",
    keywords: ["frequency", "frekuensi", "hz", "hertz", "khz", "mhz", "ghz"]
  },
  {
    id: "capacitance",
    title: "Capacitance Converter",
    subtitle: "pF, nF, µF, F",
    icon: "battery",
    color: "green",
    url: "pages/electrical.html?type=capacitance",
    keywords: ["capacitance", "kapasitansi", "farad", "pf", "nf", "uf", "capacitor", "kapasitor"]
  },

  // ===== General =====
  {
    id: "decimal-fraction",
    title: "Decimal → Fraction (Inch)",
    subtitle: "Convert decimal inch to fraction",
    icon: "divide",
    color: "purple",
    url: "pages/general.html?tab=dec2frac",
    keywords: ["decimal to fraction", "desimal ke pecahan", "fraction", "pecahan", "inch fraction"]
  },
  {
    id: "fraction-decimal",
    title: "Fraction → Decimal",
    subtitle: "Convert fraction to decimal",
    icon: "divide",
    color: "purple",
    url: "pages/general.html?tab=frac2dec",
    keywords: ["fraction to decimal", "pecahan ke desimal", "fraction", "pecahan"]
  },
  {
    id: "number-base",
    title: "Binary / Decimal / Hex / ASCII",
    subtitle: "Number base & ASCII converter",
    icon: "binary",
    color: "purple",
    url: "pages/general.html?tab=base",
    keywords: ["binary", "biner", "decimal", "desimal", "hex", "hexadecimal", "heksadesimal", "ascii", "number base", "basis bilangan"]
  }
];

window.TOOL_INDEX = TOOL_INDEX;
