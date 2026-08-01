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
    title: "Binary / Decimal / Hex / Octal / ASCII",
    subtitle: "Number base & ASCII converter",
    icon: "binary",
    color: "purple",
    url: "pages/general.html?tab=base",
    keywords: ["binary", "biner", "decimal", "desimal", "hex", "hexadecimal", "heksadesimal", "octal", "oktal", "ascii", "number base", "basis bilangan"]
  },

  // ===== V2: More Measurement =====
  {
    id: "density",
    title: "Density Converter",
    subtitle: "kg/m³, g/cm³, lb/ft³, specific gravity",
    icon: "layers",
    color: "blue",
    url: "pages/measurement.html?type=density",
    keywords: ["density", "densitas", "kerapatan", "kg/m3", "g/cm3", "lb/ft3", "specific gravity", "sg"]
  },
  {
    id: "flowrate",
    title: "Flow Rate Converter",
    subtitle: "L/min, GPM, CFM, m³/hr",
    icon: "droplets",
    color: "blue",
    url: "pages/measurement.html?type=flowrate",
    keywords: ["flow rate", "laju aliran", "debit", "l/min", "gpm", "cfm", "m3/hr", "gph"]
  },
  {
    id: "force",
    title: "Force Converter",
    subtitle: "N, kN, kgf, lbf, dyne",
    icon: "move-down",
    color: "blue",
    url: "pages/measurement.html?type=force",
    keywords: ["force", "gaya", "newton", "n", "kn", "kgf", "lbf", "dyne"]
  },
  {
    id: "energy",
    title: "Energy Converter",
    subtitle: "J, kJ, cal, kcal, Wh, kWh, BTU",
    icon: "battery-charging",
    color: "blue",
    url: "pages/measurement.html?type=energy",
    keywords: ["energy", "energi", "joule", "kalori", "calorie", "wh", "kwh", "btu"]
  },

  // ===== V2: More Torque =====
  {
    id: "torque-crowfoot",
    title: "Crowfoot Calculator",
    subtitle: "Torque setting for crowfoot adapters",
    icon: "wrench",
    color: "orange",
    url: "pages/torque.html?tab=crowfoot",
    keywords: ["crowfoot", "crow foot", "crowfoot calculator", "torque crowfoot", "kalkulator crowfoot"]
  },
  {
    id: "torque-angle",
    title: "Torque Angle Calculator",
    subtitle: "Torque-to-yield: snug torque + rotation angle",
    icon: "rotate-cw",
    color: "orange",
    url: "pages/torque.html?tab=angle",
    keywords: ["torque angle", "torque to yield", "tty", "sudut torsi", "turn of nut", "angle calculator"]
  },
  {
    id: "torque-lookup",
    title: "Fastener Torque Lookup",
    subtitle: "AN/MS/NAS bolt torque reference database",
    icon: "book-open",
    color: "purple",
    url: "pages/fastener.html?tool=torquelookup",
    keywords: ["fastener torque", "torque spec", "torque lookup", "bolt torque table", "tabel torsi baut", "an3", "an4", "an5", "an6", "an7", "an8", "ms bolt", "nas bolt"]
  },
  {
    id: "thread-chart",
    title: "Thread Chart",
    subtitle: "UNC/UNF major diameter, TPI, tap drill",
    icon: "cog",
    color: "purple",
    url: "pages/fastener.html?tool=threadchart",
    keywords: ["thread chart", "unc", "unf", "tap drill", "ulir baut", "thread pitch"]
  },
  {
    id: "drill-size-reference",
    title: "Drill Size Reference",
    subtitle: "Number/letter/fraction drill to decimal inch",
    icon: "circle-dot",
    color: "purple",
    url: "pages/fastener.html?tool=drillsize",
    keywords: ["drill size", "ukuran mata bor", "drill bit chart", "number drill", "letter drill"]
  },
  {
    id: "rivet-guide",
    title: "Rivet Guide",
    subtitle: "AN470 / MS20426 diameter, head type, drill",
    icon: "circle-dot",
    color: "purple",
    url: "pages/fastener.html?tool=rivets",
    keywords: ["rivet", "rivet guide", "an470", "ms20426", "paku keling", "solid rivet"]
  },
  {
    id: "bolt-grade",
    title: "Bolt Grade Identification",
    subtitle: "SAE/metric head marking reference",
    icon: "cog",
    color: "purple",
    url: "pages/fastener.html?tool=boltgrade",
    keywords: ["bolt grade", "grade baut", "sae grade 5", "sae grade 8", "metric class 8.8", "bolt marking"]
  },
  {
    id: "ata-chapters",
    title: "ATA Chapter Reference",
    subtitle: "ATA iSpec 2200 chapter numbering",
    icon: "book-open",
    color: "blue",
    url: "pages/aircraft.html?tool=ata",
    keywords: ["ata", "ata chapter", "ata 27", "ata 32", "flight controls", "landing gear chapter", "manual chapter"]
  },
  {
    id: "aviation-acronyms",
    title: "Aviation Acronym Dictionary",
    subtitle: "Common AMT/maintenance abbreviations",
    icon: "book-open",
    color: "blue",
    url: "pages/aircraft.html?tool=acronyms",
    keywords: ["acronym", "singkatan", "mel", "aog", "ndt", "amm", "ipc", "srm", "aviation abbreviation"]
  },
  {
    id: "standard-atmosphere",
    title: "Standard Atmosphere (ISA)",
    subtitle: "ISA temperature & pressure ratio table",
    icon: "cloud",
    color: "blue",
    url: "pages/aircraft.html?tool=stdatm",
    keywords: ["standard atmosphere", "isa", "atmosfer standar", "tropopause"]
  },
  {
    id: "isa-temperature",
    title: "ISA Temperature Calculator",
    subtitle: "Standard temperature & ISA deviation by altitude",
    icon: "thermometer",
    color: "blue",
    url: "pages/aircraft.html?tool=isatemp",
    keywords: ["isa temperature", "isa deviation", "suhu isa", "oat"]
  },
  {
    id: "pressure-altitude",
    title: "Pressure Altitude Calculator",
    subtitle: "Field elevation + altimeter setting",
    icon: "gauge",
    color: "blue",
    url: "pages/aircraft.html?tool=pressurealt",
    keywords: ["pressure altitude", "altimeter setting", "density altitude", "29.92"]
  },
  {
    id: "task-checklist",
    title: "Task Checklist",
    subtitle: "Simple local checklist for your shift/job",
    icon: "clipboard-list",
    color: "orange",
    url: "pages/maintenance.html?tool=checklist",
    keywords: ["checklist", "task checklist", "to-do", "daftar tugas"]
  },
  {
    id: "shift-notes",
    title: "Shift Notes",
    subtitle: "Timestamped shift handover notes",
    icon: "sticky-note",
    color: "orange",
    url: "pages/maintenance.html?tool=shiftnotes",
    keywords: ["shift notes", "catatan shift", "handover notes", "log book"]
  },
  {
    id: "job-timer",
    title: "Job Timer",
    subtitle: "Stopwatch for tracking job duration",
    icon: "timer",
    color: "orange",
    url: "pages/maintenance.html?tool=jobtimer",
    keywords: ["job timer", "waktu kerja", "stopwatch pekerjaan"]
  },
  {
    id: "inspection-interval",
    title: "Inspection Interval Calculator",
    subtitle: "Next due date from last inspection + interval",
    icon: "calendar-days",
    color: "orange",
    url: "pages/maintenance.html?tool=interval",
    keywords: ["inspection interval", "interval inspeksi", "due date", "jatuh tempo inspeksi", "calendar inspection"]
  },

  // ===== V2: Electrical Calculators =====
  {
    id: "ohms-law",
    title: "Ohm's Law Calculator",
    subtitle: "V = I × R",
    icon: "activity",
    color: "green",
    url: "pages/electrical.html?mode=calc",
    keywords: ["ohm's law", "ohms law", "hukum ohm", "v=ir", "voltage current resistance"]
  },
  {
    id: "power-calc",
    title: "Power Calculator",
    subtitle: "P = V × I",
    icon: "flame",
    color: "green",
    url: "pages/electrical.html?mode=calc",
    keywords: ["power calculator", "kalkulator daya", "p=vi", "watt calculator"]
  },
  {
    id: "voltage-drop",
    title: "Voltage Drop Calculator",
    subtitle: "Cable voltage drop by length & gauge",
    icon: "trending-down",
    color: "green",
    url: "pages/electrical.html?mode=calc",
    keywords: ["voltage drop", "drop tegangan", "cable voltage drop", "wire voltage drop"]
  },
  {
    id: "series-resistance",
    title: "Series Resistance Calculator",
    subtitle: "R total = R1 + R2 + ...",
    icon: "circuit-board",
    color: "green",
    url: "pages/electrical.html?mode=calc",
    keywords: ["series resistance", "resistansi seri", "total resistance series"]
  },
  {
    id: "parallel-resistance",
    title: "Parallel Resistance Calculator",
    subtitle: "1/R total = 1/R1 + 1/R2 + ...",
    icon: "circuit-board",
    color: "green",
    url: "pages/electrical.html?mode=calc",
    keywords: ["parallel resistance", "resistansi paralel", "total resistance parallel"]
  },
  {
    id: "battery-capacity",
    title: "Battery Capacity Calculator",
    subtitle: "Ah × V = Wh",
    icon: "battery",
    color: "green",
    url: "pages/electrical.html?mode=calc",
    keywords: ["battery capacity", "kapasitas baterai", "ah to wh", "battery energy"]
  },
  {
    id: "battery-runtime",
    title: "Battery Runtime Calculator",
    subtitle: "Estimated hours = Ah ÷ load current",
    icon: "battery",
    color: "green",
    url: "pages/electrical.html?mode=calc",
    keywords: ["battery runtime", "waktu pakai baterai", "battery life calculator"]
  },
  {
    id: "awg-converter",
    title: "AWG ↔ mm² Converter",
    subtitle: "Wire gauge to cross-section area",
    icon: "cable",
    color: "green",
    url: "pages/electrical.html?mode=calc",
    keywords: ["awg", "awg to mm2", "wire gauge", "kabel awg", "american wire gauge"]
  },
  {
    id: "wire-resistance",
    title: "Wire Resistance Calculator",
    subtitle: "R = ρ × L / A",
    icon: "cable",
    color: "green",
    url: "pages/electrical.html?mode=calc",
    keywords: ["wire resistance", "resistansi kabel", "kabel tembaga", "copper wire resistance"]
  },

  // ===== V2: More General =====
  {
    id: "percentage-calculator",
    title: "Percentage Calculator",
    subtitle: "X is what % of Y, and X% of Y",
    icon: "percent",
    color: "purple",
    url: "pages/general.html?tab=percentage",
    keywords: ["percentage", "persen", "percentage calculator", "kalkulator persen"]
  },
  {
    id: "ratio-calculator",
    title: "Ratio Calculator",
    subtitle: "A:B = C:D",
    icon: "divide",
    color: "purple",
    url: "pages/general.html?tab=ratio",
    keywords: ["ratio", "rasio", "ratio calculator", "perbandingan"]
  },
  {
    id: "scientific-notation",
    title: "Scientific Notation Converter",
    subtitle: "Standard number ↔ mantissa × 10^exponent",
    icon: "sigma",
    color: "purple",
    url: "pages/general.html?tab=scinotation",
    keywords: ["scientific notation", "notasi ilmiah", "exponent", "mantissa"]
  },
  {
    id: "date-difference",
    title: "Date Difference",
    subtitle: "Days between two dates",
    icon: "calendar-days",
    color: "purple",
    url: "pages/general.html?tab=datediff",
    keywords: ["date difference", "selisih tanggal", "days between dates", "date calculator"]
  },
  {
    id: "time-general",
    title: "Time Converter",
    subtitle: "ms, second, minute, hour, day",
    icon: "clock",
    color: "purple",
    url: "pages/general.html?tab=time",
    keywords: ["time converter", "konversi waktu"]
  },
  {
    id: "scientific-calculator",
    title: "Scientific Calculator",
    subtitle: "Full engineering calculator with history",
    icon: "calculator",
    color: "purple",
    url: "pages/calculator.html",
    keywords: ["scientific calculator", "kalkulator ilmiah", "engineering calculator", "calculator", "kalkulator", "sin cos tan", "log ln"]
  },

  // ===== V2: Tools =====
  {
    id: "compass",
    title: "Compass",
    subtitle: "Digital heading, N/S/E/W",
    icon: "compass",
    color: "green",
    url: "pages/tools.html?tool=compass",
    keywords: ["compass", "kompas", "heading", "arah mata angin", "north"]
  },
  {
    id: "stopwatch",
    title: "Stopwatch",
    subtitle: "Start, lap, reset",
    icon: "timer",
    color: "green",
    url: "pages/tools.html?tool=stopwatch",
    keywords: ["stopwatch", "stop watch", "lap timer"]
  },
  {
    id: "timer",
    title: "Timer",
    subtitle: "Countdown timer",
    icon: "hourglass",
    color: "green",
    url: "pages/tools.html?tool=timer",
    keywords: ["timer", "countdown", "hitung mundur", "pengingat waktu"]
  },
  {
    id: "level",
    title: "Bubble Level",
    subtitle: "Surface level using device sensor",
    icon: "gauge",
    color: "green",
    url: "pages/tools.html?tool=level",
    keywords: ["bubble level", "waterpas", "level", "spirit level"]
  },
  {
    id: "protractor",
    title: "Protractor / Angle Meter",
    subtitle: "Angle measurement using device sensor",
    icon: "triangle",
    color: "green",
    url: "pages/tools.html?tool=protractor",
    keywords: ["protractor", "angle meter", "busur derajat", "pengukur sudut"]
  },
  {
    id: "flashlight",
    title: "Flashlight",
    subtitle: "Camera LED torch shortcut",
    icon: "flashlight",
    color: "green",
    url: "pages/tools.html?tool=flashlight",
    keywords: ["flashlight", "senter", "torch", "lampu senter"]
  }
];

window.TOOL_INDEX = TOOL_INDEX;
