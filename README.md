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
│   ├── main.css               # Design system + V2 additions (calculator, tools)
│   └── responsive.css         # Breakpoints
├── js/
│   ├── app.js                  # Home page controller
│   ├── search.js               # Realtime multilingual search + recent/popular searches
│   ├── favorites.js            # localStorage: favorites
│   ├── history.js              # localStorage: recent tools (max 20)
│   ├── settings.js             # localStorage: generic key/value settings
│   ├── calc-history.js         # localStorage: calculation history (max 20)
│   ├── converter-core.js       # Shared realtime unit-converter engine (reused everywhere)
│   ├── measurement.js          # Measurement page controller (12 unit types)
│   ├── torque.js               # Torque: unit converter, extension/crowfoot/angle calc, lookup
│   ├── electrical.js           # Electrical page controller (Converters/Calculators tabs)
│   ├── electrical-calc.js      # Ohm's law, power, voltage drop, resistance, battery, AWG, wire R
│   ├── general.js              # Dec/Frac, Number Base (+Octal)
│   ├── general-calc.js         # Percentage, Ratio, Scientific Notation, Date Diff, Time
│   ├── calculator.js           # Scientific calculator engine
│   ├── tools.js                # Tools page controller
│   ├── tool-compass.js         # Compass (device orientation)
│   ├── tool-timer.js           # Stopwatch + Countdown Timer
│   ├── tool-level.js           # Bubble Level + Protractor (device orientation)
│   └── tool-flashlight.js      # Camera torch shortcut
├── data/
│   ├── units.js                # All unit definitions & conversion factors (20 types)
│   └── aliases.js              # Search index (ID/EN keywords → tool) — 48 tools
└── pages/
    ├── measurement.html
    ├── torque.html
    ├── electrical.html
    ├── general.html
    ├── calculator.html
    └── tools.html
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
- **Fastener Torque Lookup** (di dalam Torque): database referensi per ukuran & grade.

## 🆕 V2 Changelog

**Measurement** — ditambah Density, Flow Rate, Force, Energy (total 12 tipe).

**Torque** — ditambah Crowfoot Calculator, Torque Angle Calculator, dan Fastener Torque Lookup (placeholder).

**Electrical** — halaman kini punya 2 mode (Converters / Calculators). Calculators berisi 9 kalkulator: Ohm's Law, Power, Voltage Drop, Series/Parallel Resistance, Battery Capacity, Battery Runtime, AWG↔mm², Wire Resistance.

**General** — ditambah Percentage, Ratio, Scientific Notation, Date Difference, Time Converter, dan Octal pada Number Base converter, plus link ke **Scientific Calculator** (halaman terpisah, `pages/calculator.html`) dengan trig/log/memory/ANS/parentheses dan history kalkulasi.

**Tools (baru)** — kategori baru di Home berisi: Compass, Stopwatch, Timer, Bubble Level, Protractor/Angle Meter, dan Flashlight — semua memakai sensor perangkat (device orientation / camera torch) dengan fallback pesan "tidak didukung" jika sensor tidak tersedia.

**Search** — kini menampilkan Recent Searches & Popular Searches saat search box kosong/fokus, selain hasil realtime seperti sebelumnya. 48 tool kini dapat dicari.

**History & Favorites** — kapasitas Recent dinaikkan ke 20 item; ditambah `CalcHistory` khusus untuk menyimpan hasil kalkulasi (dipakai Scientific Calculator) dengan copy/delete/clear-all.

**Refactor** — logic konversi unit realtime yang sebelumnya terduplikasi di `measurement.js`, `electrical.js`, dan `torque.js` kini terpusat di satu modul reusable: `js/converter-core.js`.

## 🆕 V3 Changelog — Production Polish

**Settings** (`pages/settings.html`) — Appearance (Dark/Light/System), preferred Units (Metric/Imperial), Decimal Precision (0–5, applied app-wide via `converter-core.js`), Preferences (Auto Copy, Haptic Feedback, Animations, Keep Screen Awake via Wake Lock API), and Data (Export/Import/Reset).

**About** (`pages/about.html`) — logo, version, changelog, privacy policy, license, acknowledgements.

**Export / Import** — one JSON backup covering Favorites, Bookmarks, History, Calc History, Settings, and Notes (`js/export-import.js`).

**Tool Info panels** — every calculator and unit converter now has a collapsible "Info & Formula" panel (Description, Formula, Example, Common Uses, Tips, Copy Formula) via the reusable `js/tool-info.js` + `data/tool-info.js`.

**Home** — added Last Opened Tool, app version footer, Quick Access shortcuts (Calculator/Settings/About/Tools), and an offline-status banner.

**Search** — added typo tolerance (Levenshtein fallback when no direct match is found).

**Reliability** — global error/unhandledrejection handler with friendly toast messages, offline banner, offline.html fallback page.

**Accessibility** — focus-visible outlines, aria-labels on search/nav/buttons, larger minimum touch targets, `aria-live` toast region.

**Performance** — all page scripts now load with `defer`; service worker cache bumped to v3 and covers every new file.

**Code quality** — extracted the duplicated toast/snackbar logic into a single shared `js/toast.js` used by every page; added a lightweight shared `js/ripple.js` for button feedback that respects the Animations setting.

## 🆕 V3.1 Changelog — Full Categories & Deep Linking

**Deep Linking** — every sub-tool switch (`?type=`, `?tab=`, `?tool=`) now uses `history.pushState` + `popstate` listeners across Measurement, Torque, Electrical, General, and Tools. Refresh restores exact state; Browser Back/Forward now steps through in-page tool history correctly.

**Fastener** (`pages/fastener.html`) — Torque Lookup (AN/MS/NAS database with a "verify against the official manual" disclaimer), Thread Chart (UNC/UNF), Drill Size Reference, Rivet Guide, Bolt Grade Identification.

**Aircraft** (`pages/aircraft.html`) — ATA Chapter Reference, Aviation Acronym Dictionary, Standard Atmosphere table, ISA Temperature Calculator, Pressure Altitude Calculator.

**Maintenance** (`pages/maintenance.html`) — Task Checklist, Shift Notes, Job Timer (reuses the existing Stopwatch component), Inspection Interval Calculator.

**Offline database architecture** — new reference data lives in `data/ata.json`, `acronyms.json`, `torque.json`, `threadchart.json`, `drillsizes.json`, `rivets.json`, `boltgrades.json` — fetched via `js/data-loader.js`, not hardcoded in JS.

**Universal Search** — `search.js` now also searches inside the ATA/acronyms/torque databases (e.g. "AN4", "ATA 27") via an async `deepQuery()`, merged with the existing keyword index. Added keyboard navigation (Arrow keys/Enter/Escape) to search suggestions.

**Reusable components** — `js/ui-components.js` extracts ToolCard/ToolRow/EmptyState/FavoriteButton patterns shared by Home and the new reference pages.

**PWA** — service worker bumped to v4, precaches every new page/script/JSON file; reference databases use a stale-while-revalidate strategy (instant from cache, refreshed in the background when online).

---

Dibuat untuk komunitas AME — kontribusi & masukan sangat terbuka.
