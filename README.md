# 🚀 Panduan Deploy — Prompt Finder

## Apa Ini?
Prompt Finder adalah aplikasi web berisi **30 prompt akademik & profesional** siap pakai.
Aplikasi ini bisa di-deploy sebagai **website** dan bisa di-**install di HP Android/iPhone** 
layaknya aplikasi native (PWA — Progressive Web App).

---

## OPSI 1: Deploy ke Vercel (Gratis & Paling Mudah)

### Prasyarat
- Akun GitHub (gratis): https://github.com
- Akun Vercel (gratis): https://vercel.com

### Langkah-Langkah

#### 1. Upload ke GitHub
```
a. Buka https://github.com → klik tombol "+" → "New repository"
b. Nama repository: prompt-finder
c. Pilih "Public"
d. Klik "Create repository"
e. Upload semua file dari folder ini ke repository tersebut
   - Cara mudah: klik "uploading an existing file" di halaman repo
   - Drag & drop seluruh isi folder ini
   - Klik "Commit changes"
```

#### 2. Deploy di Vercel
```
a. Buka https://vercel.com → Login dengan akun GitHub
b. Klik "Add New..." → "Project"
c. Pilih repository "prompt-finder" dari daftar
d. Framework Preset: pilih "Vite"
e. Klik "Deploy"
f. Tunggu 1-2 menit → website Anda sudah live!
```

#### 3. Akses Website
```
Setelah deploy berhasil, Vercel akan memberikan URL seperti:
   https://prompt-finder-xxxx.vercel.app

Anda bisa menambahkan custom domain jika punya (opsional).
```

---

## OPSI 2: Deploy ke Netlify (Alternatif Gratis)

```
a. Buka https://netlify.com → Login dengan GitHub
b. Klik "Add new site" → "Import an existing project"
c. Pilih repository "prompt-finder"
d. Build command: npm run build
e. Publish directory: dist
f. Klik "Deploy site"
```

---

## OPSI 3: Deploy ke GitHub Pages (Gratis)

#### 1. Edit vite.config.js — tambahkan base path:
```js
export default defineConfig({
  plugins: [react()],
  base: '/prompt-finder/',  // ← tambahkan ini
  build: { outDir: 'dist' },
})
```

#### 2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

#### 3. Tambahkan script di package.json:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

#### 4. Jalankan:
```bash
npm run deploy
```

Website akan tersedia di: `https://[username].github.io/prompt-finder/`

---

## 📱 Install di HP (PWA — Progressive Web App)

Setelah website live, aplikasi ini bisa di-install di HP **tanpa Play Store / App Store**:

### Android (Chrome)
```
1. Buka URL website di Chrome HP
2. Ketuk menu titik tiga (⋮) di pojok kanan atas
3. Pilih "Tambahkan ke layar utama" / "Add to Home Screen"
4. Ketuk "Tambahkan"
5. Ikon "Prompt Finder" akan muncul di home screen
6. Buka seperti aplikasi biasa — tampil full screen tanpa address bar
```

### iPhone (Safari)
```
1. Buka URL website di Safari
2. Ketuk ikon Share (kotak dengan panah ke atas)
3. Scroll ke bawah, pilih "Tambahkan ke Layar Utama"
4. Ketuk "Tambahkan"
5. Aplikasi akan muncul di home screen
```

---

## 🛠 Menjalankan Secara Lokal (Opsional — untuk Developer)

Jika ingin menjalankan di komputer sendiri untuk pengembangan:

```bash
# 1. Pastikan Node.js sudah terinstal (v18+)
#    Download: https://nodejs.org

# 2. Buka terminal/command prompt, masuk ke folder proyek
cd prompt-finder-deploy

# 3. Install dependencies
npm install

# 4. Jalankan development server
npm run dev

# 5. Buka browser → http://localhost:5173
```

---

## 📂 Struktur File

```
prompt-finder-deploy/
├── index.html              ← Halaman utama
├── package.json            ← Konfigurasi proyek & dependencies
├── vite.config.js          ← Konfigurasi build tool (Vite)
├── .gitignore              ← File yang diabaikan Git
├── public/
│   ├── manifest.json       ← Konfigurasi PWA
│   ├── sw.js               ← Service Worker (offline support)
│   ├── icon.svg            ← Ikon vektor
│   ├── icon-192.png        ← Ikon PWA 192x192
│   └── icon-512.png        ← Ikon PWA 512x512
└── src/
    ├── main.jsx            ← Entry point aplikasi
    └── App.jsx             ← Komponen utama (semua logika & UI)
```

---

## ✏️ Cara Menambah / Mengedit Prompt

Buka file `src/App.jsx`, cari array `PROMPTS_DB`, lalu tambahkan objek baru:

```javascript
{
  id: 31,                          // nomor urut (harus unik)
  cat: "academic",                 // kategori (lihat CATEGORIES)
  title: "Judul Prompt Baru",      // judul singkat
  desc: "Deskripsi singkat",       // 1 kalimat penjelasan
  prompt: `Isi prompt lengkap...`, // template prompt
  tags: ["tag1", "tag2"],          // kata kunci untuk pencarian
  difficulty: "intermediate",      // beginner / intermediate / advanced
},
```

Setelah mengedit, deploy ulang:
- Vercel: cukup push ke GitHub → otomatis redeploy
- Netlify: sama, otomatis redeploy setelah push

---

## ❓ FAQ

**Q: Apakah benar-benar gratis?**
A: Ya. Vercel, Netlify, dan GitHub Pages semuanya menyediakan tier gratis yang lebih dari cukup.

**Q: Berapa batas pengunjung?**
A: Vercel free tier: 100GB bandwidth/bulan (sangat cukup untuk ribuan pengunjung).

**Q: Bisa pakai domain sendiri?**
A: Ya. Di Vercel/Netlify, masuk ke Settings → Domains → tambahkan domain Anda.

**Q: Apakah data favorit tersimpan?**
A: Ya, favorit disimpan di localStorage browser masing-masing pengguna.

**Q: Bisa diakses offline?**
A: Ya, berkat Service Worker (PWA), setelah pertama kali dibuka, 
   aplikasi bisa diakses meskipun koneksi internet terputus.

---

## 📝 Catatan

- Aplikasi ini **tidak memerlukan backend/server** — sepenuhnya berjalan di browser
- Semua data prompt tersimpan di dalam kode (client-side)
- Fitur AI Generator memerlukan API key Anthropic jika ingin diaktifkan 
  (saat ini dihapus dari versi deploy untuk keamanan)
- Untuk menambahkan fitur AI Generator, tambahkan kembali komponen tersebut 
  dan simpan API key di environment variable Vercel (Settings → Environment Variables)

---

Dibuat oleh Bang Dongoran | FKIP UMSU
