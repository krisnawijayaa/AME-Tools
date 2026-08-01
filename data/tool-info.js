/**
 * tool-info.js (data)
 * Educational content per tool: description, formula, example, common
 * uses, and tips. Rendered by js/tool-info.js as a collapsible panel.
 * Only calculators with a real formula get a full entry; plain unit
 * converters fall back to a generic explanation (see tool-info.js).
 */

const TOOL_INFO = {
  "torque-extension": {
    title: "Extension Torque Calculator",
    description: "Saat torque wrench dipasangi extension/adapter, jarak efektif dari titik putar bertambah — sehingga angka yang perlu di-set di wrench lebih rendah dari torque spec sebenarnya agar torque aktual pada fastener tetap benar.",
    formula: "T_setting = T_desired × L / (L + E)",
    example: "Spec 50 N·m, panjang wrench 250 mm, extension 50 mm → setting = 50 × 250/(250+50) = 41.7 N·m.",
    commonUses: "Ruang kerja sempit yang butuh extension/adapter untuk menjangkau fastener.",
    tips: "Selalu ukur L dari centerline drive (bukan dari ujung handle), dan E dari centerline drive wrench ke square adapter."
  },
  "torque-crowfoot": {
    title: "Crowfoot Calculator",
    description: "Crowfoot yang dipasang segaris (in-line) menambah panjang efektif seperti extension biasa. Jika dipasang tegak lurus (90°), panjang efektifnya tidak berubah sehingga tidak perlu koreksi.",
    formula: "In-line: T_setting = T_desired × L / (L + E)  •  90°: T_setting = T_desired",
    example: "Crowfoot in-line 40 mm pada wrench 300 mm, spec 30 N·m → setting = 30 × 300/340 = 26.5 N·m.",
    commonUses: "Fastener di area sempit dengan akses terbatas untuk socket standar.",
    tips: "Cek orientasi crowfoot terhadap wrench sebelum menggunakan hasil kalkulasi."
  },
  "torque-angle": {
    title: "Torque Angle Calculator",
    description: "Beberapa fastener torque-to-yield (TTY) dispesifikasikan sebagai torque awal (snug) diikuti rotasi sudut tambahan, bukan angka torque akhir.",
    formula: "Spec = T_snug + rotate θ° (opsional dalam N pass)",
    example: "Snug 20 N·m, lalu putar tambahan 90°, dalam 2 pass (45° per pass).",
    commonUses: "Kepala silinder, cylinder head bolts, dan fastener struktural TTY.",
    tips: "Selalu ikuti urutan pengencangan (torque sequence) manual pabrikan, alat ini hanya merangkum spesifikasi."
  },
  "ohms-law": {
    title: "Ohm's Law",
    description: "Hubungan dasar antara tegangan, arus, dan resistansi pada rangkaian DC sederhana.",
    formula: "V = I × R",
    example: "I = 2A, R = 10Ω → V = 20V.",
    commonUses: "Troubleshooting rangkaian, menghitung beban, memilih komponen.",
    tips: "Isi dua dari tiga nilai; nilai ketiga dihitung otomatis."
  },
  "power-calc": {
    title: "Power Calculator",
    description: "Daya listrik yang dikonsumsi/dihasilkan oleh suatu beban DC.",
    formula: "P = V × I",
    example: "V = 12V, I = 5A → P = 60W.",
    commonUses: "Menentukan rating komponen, breaker, atau kabel.",
    tips: "Untuk AC, gunakan faktor daya (power factor) tambahan — kalkulator ini untuk DC/resistif."
  },
  "voltage-drop": {
    title: "Voltage Drop Calculator",
    description: "Menghitung penurunan tegangan sepanjang kabel tembaga akibat resistansi kawat, berdasarkan arus, panjang (pulang-pergi), dan luas penampang.",
    formula: "V_drop = 2 × ρ × L × I / A   (ρ tembaga ≈ 0.0171 Ω·mm²/m)",
    example: "I = 10A, L = 5m, A = 2.5mm² → V_drop ≈ 0.68V.",
    commonUses: "Menentukan ukuran kabel yang tepat agar drop tegangan tidak berlebihan.",
    tips: "Jaga voltage drop di bawah ~3% dari tegangan sumber untuk sebagian besar aplikasi."
  },
  "series-resistance": {
    title: "Series Resistance",
    description: "Resistor yang disusun seri menjumlahkan nilai resistansinya secara langsung.",
    formula: "R_total = R1 + R2 + R3 + ...",
    example: "100Ω + 220Ω + 330Ω = 650Ω.",
    commonUses: "Rangkaian pembagi tegangan, pembatas arus.",
    tips: "Urutan resistor tidak memengaruhi hasil total."
  },
  "parallel-resistance": {
    title: "Parallel Resistance",
    description: "Resistor paralel menjumlahkan kebalikan (invers) dari masing-masing nilai.",
    formula: "1/R_total = 1/R1 + 1/R2 + ...",
    example: "100Ω ∥ 220Ω ∥ 330Ω ≈ 56.9Ω.",
    commonUses: "Rangkaian dengan beberapa jalur arus paralel.",
    tips: "R_total selalu lebih kecil dari resistor terkecil dalam rangkaian."
  },
  "battery-capacity": {
    title: "Battery Capacity Calculator",
    description: "Mengonversi kapasitas baterai (Ah) menjadi energi (Wh) berdasarkan tegangan nominal.",
    formula: "E (Wh) = Ah × V",
    example: "10Ah pada 12V → 120Wh.",
    commonUses: "Membandingkan baterai berbeda tegangan/kapasitas secara adil.",
    tips: "Gunakan tegangan nominal (bukan tegangan puncak) untuk estimasi yang akurat."
  },
  "battery-runtime": {
    title: "Battery Runtime Calculator",
    description: "Estimasi lama pemakaian baterai berdasarkan kapasitas dan beban arus konstan.",
    formula: "t (jam) = Ah ÷ I_beban",
    example: "20Ah dengan beban 4A → 5 jam.",
    commonUses: "Perencanaan operasi ground support equipment bertenaga baterai.",
    tips: "Hasil adalah estimasi ideal; efisiensi discharge nyata biasanya lebih rendah pada beban tinggi."
  },
  "awg-converter": {
    title: "AWG ↔ mm²",
    description: "Konversi antara American Wire Gauge dan luas penampang metrik (mm²).",
    formula: "Referensi tabel standar AWG (bukan rumus linear sederhana)",
    example: "12 AWG ≈ 3.309 mm².",
    commonUses: "Menyamakan spesifikasi kabel AWG (umum di pesawat buatan AS) dengan standar metrik.",
    tips: "Selalu cocokkan dengan wiring diagram/manual resmi sebelum mengganti ukuran kabel."
  },
  "wire-resistance": {
    title: "Wire Resistance Calculator",
    description: "Resistansi kabel tembaga berdasarkan panjang dan luas penampang.",
    formula: "R = ρ × L / A   (ρ tembaga ≈ 0.0171 Ω·mm²/m)",
    example: "L = 10m, A = 1.5mm² → R ≈ 0.114Ω.",
    commonUses: "Menghitung rugi-rugi kabel panjang, troubleshooting wiring harness.",
    tips: "Untuk kabel aluminium, resistivitasnya sekitar 1.6x tembaga — hasil ini khusus tembaga."
  },
  "decimal-fraction": {
    title: "Decimal → Fraction (Inch)",
    description: "Membulatkan nilai desimal inch ke pecahan standar (1/64\", 1/32\", 1/16\") yang umum dipakai pada tooling AS.",
    formula: "fraction ≈ round(decimal × denominator) / denominator",
    example: "0.375\" → 3/8\".",
    commonUses: "Membaca hasil pengukuran caliper/mikrometer ke ukuran mata bor/kunci standar.",
    tips: "Presisi 1/64\" cukup untuk sebagian besar hand-tool; gunakan nilai desimal untuk pekerjaan presisi tinggi."
  },
  "fraction-decimal": {
    title: "Fraction → Decimal",
    description: "Mengonversi pecahan inch (termasuk pecahan campuran) menjadi nilai desimal.",
    formula: "decimal = whole + numerator / denominator",
    example: "1 1/2\" → 1.5\".",
    commonUses: "Memasukkan ukuran drawing/manual ke alat ukur digital.",
    tips: "Format yang didukung: '3/8' atau '1 1/2' (spasi antara bilangan bulat dan pecahan)."
  },
  "number-base": {
    title: "Binary / Decimal / Hex / Octal / ASCII",
    description: "Konversi antar sistem bilangan yang umum dipakai dalam elektronik & pemrograman avionik/embedded.",
    formula: "Basis konversi standar (base-2, base-8, base-10, base-16)",
    example: "72 (decimal) = 01001000 (binary) = 110 (octal) = 48 (hex) = 'H' (ASCII).",
    commonUses: "Membaca register/status bit avionik, debugging komunikasi data.",
    tips: "ASCII hanya berlaku untuk nilai 0–255 (1 byte / 1 karakter)."
  },
  "percentage-calculator": {
    title: "Percentage Calculator",
    description: "Dua pertanyaan persentase paling umum: X adalah berapa persen dari Y, dan berapa nilai X% dari Y.",
    formula: "X is % of Y = (X / Y) × 100   •   X% of Y = (X / 100) × Y",
    example: "25 dari 200 = 12.5%. 15% dari 200 = 30.",
    commonUses: "Toleransi spesifikasi, efisiensi, wear limit dalam persen.",
    tips: "Gunakan hasil ini bersama nilai nominal untuk mengecek apakah keausan masih dalam batas."
  },
  "ratio-calculator": {
    title: "Ratio Calculator",
    description: "Menyelesaikan proporsi A:B = C:D ketika tiga dari empat nilai diketahui.",
    formula: "D = (B × C) / A",
    example: "2:5 = 6:? → D = (5×6)/2 = 15.",
    commonUses: "Rasio gear/pulley, campuran cairan (mixing ratio), scaling drawing.",
    tips: "Pastikan satuan A dan C konsisten (atau B dan D) agar rasio tetap valid."
  },
  "scientific-notation": {
    title: "Scientific Notation",
    description: "Mengonversi angka standar ke bentuk mantissa × 10^eksponen, dan sebaliknya.",
    formula: "N = m × 10^e, dengan 1 ≤ |m| < 10",
    example: "0.00045 = 4.5 × 10^-4.",
    commonUses: "Menuliskan nilai sangat kecil/besar (toleransi, resistansi, kapasitansi).",
    tips: "Berguna untuk membaca datasheet komponen elektronik yang memakai notasi ilmiah."
  },
  "date-difference": {
    title: "Date Difference",
    description: "Menghitung selisih hari antara dua tanggal.",
    formula: "diff = date2 − date1 (dalam hari)",
    example: "1 Jan 2026 → 1 Mar 2026 = 59 hari.",
    commonUses: "Due date perawatan berkala, kalibrasi alat, masa berlaku sertifikat.",
    tips: "Gunakan bersama pengingat kalender eksternal untuk task yang kritikal terhadap waktu."
  },
  "scientific-calculator": {
    title: "Scientific Calculator",
    description: "Kalkulator teknik lengkap: operasi dasar, trigonometri, logaritma, memori, dan riwayat perhitungan.",
    formula: "Mendukung + − × ÷ ^ √ sin cos tan log ln, mode DEG/RAD",
    example: "sin(30) pada mode DEG = 0.5.",
    commonUses: "Perhitungan cepat di lapangan tanpa berpindah aplikasi.",
    tips: "Gunakan tombol ANS untuk melanjutkan dari hasil sebelumnya, dan MC/MR/M+/M- untuk menyimpan nilai sementara."
  }
};

window.TOOL_INFO = TOOL_INFO;
