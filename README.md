# AME Toolbox

Digital toolbox untuk **Aircraft Maintenance Engineer (AME)** — berisi converter, calculator, dan reference sederhana. Dibangun sebagai **Progressive Web App (PWA)**: bisa dipakai offline dan di-install ke home screen seperti aplikasi native, tanpa backend/database.

## ✨ Fitur

- **Search realtime** multi-bahasa (Indonesia/Inggris + singkatan): ketik `cm`, `psi`, `torsi`, `awg`, dll.
- **Measurement**: Length, Area, Volume, Weight, Pressure, Temperature, Speed, Time, Angle — semua unit update realtime saat salah satu field diisi.
- **Torque**: unit converter (Nm, lbf-ft, lbf-in, kgf-cm) + **Extension Torque Calculator**.
- **Electrical**: Voltage, Current, Resistance, Power, Frequency, Capacitance.
- **General**: Decimal↔Fraction (inch), Binary/Decimal/Hex/ASCII.
- **Favorites** & **Recent** — tersimpan di `localStorage`, tanpa server.
- **Fastener**, **Aircraft**, **Maintenance** — ditandai *Coming Soon*, tidak error.
- **Dark mode** by default, mobile-first, rounded cards, smooth animation.
- **Offline-ready**: app shell & data di-cache oleh service worker.

## 🧱 Tech Stack

Hanya HTML5, CSS3, dan Vanilla JavaScript (ES6) — tanpa framework, tanpa build step, tanpa backend. Icon dari [Lucide](https://lucide.dev) via CDN.

## 📁 Struktur Project

```
AME-Toolbox/
├── index.html              # Home: search, categories, popular, recent, favorites
├── manifest.json            # PWA manifest
├── service-worker.js        # Offline caching
├── README.md
├── assets/
│   ├── icons/                # PWA icons (72–512px + maskable)
│   └── images/
├── css/
│   ├── main.css              # Design system (dark theme, cards, components)
│   └── responsive.css        # Breakpoints
├── js/
│   ├── app.js                 # Home page controller
│   ├── search.js              # Realtime multilingual search engine
│   ├── favorites.js           # localStorage: favorites
│   ├── history.js             # localStorage: recent tools
│   ├── measurement.js         # Length/area/volume/weight/pressure/temp/speed/time/angle
│   ├── torque.js              # Torque unit converter + extension calculator
│   ├── electrical.js          # Voltage/current/resistance/power/frequency/capacitance
│   └── general.js             # Decimal↔fraction, binary/decimal/hex/ASCII
├── data/
│   ├── units.js               # All unit definitions & conversion factors
│   └── aliases.js             # Search index (ID/EN keywords → tool)
└── pages/
    ├── measurement.html
    ├── torque.html
    ├── electrical.html
    └── general.html
```

## 🚀 Deploy ke GitHub Pages

1. Push seluruh folder `AME-Toolbox` ke repository GitHub.
2. Buka **Settings → Pages** pada repo.
3. Pilih source: `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Simpan — dalam beberapa menit app akan live di `https://<username>.github.io/<repo>/`.
5. Buka di HP → browser akan menawarkan **"Add to Home Screen"** / **Install App**.

Tidak ada langkah build, konfigurasi tambahan, environment variable, atau backend yang diperlukan.

## 🛠️ Menjalankan secara lokal

Karena service worker butuh HTTP (bukan `file://`), jalankan local server sederhana, contoh:

```bash
cd AME-Toolbox
python3 -m http.server 8080
# buka http://localhost:8080
```

## 🧩 Menambah unit / converter baru

1. Tambahkan definisi unit di `data/units.js` (base unit + factor terhadap base).
2. Tambahkan entry pencarian di `data/aliases.js` (title, subtitle, icon, url, keywords ID/EN).
3. Jika kategori baru, tambahkan card di `CATEGORIES` pada `js/app.js`.

Struktur ini modular — setiap fitur punya file JS sendiri, sehingga menambah converter baru tidak menyentuh file lain yang sudah ada.

## 📌 Roadmap (Coming Soon)

- **Fastener**: referensi baut, ulir, torque spec standar.
- **Aircraft Reference**: data referensi cepat (ATA chapter, dsb).
- **Maintenance**: task tracking sederhana.

---

Dibuat untuk komunitas AME — kontribusi & masukan sangat terbuka.
