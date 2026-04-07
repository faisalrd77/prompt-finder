import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────── DATA ─────────────────────── */

const CATEGORIES = [
  { id: "all", label: "Semua", icon: "◉", color: "#6366f1" },
  { id: "academic", label: "Akademik", icon: "🎓", color: "#8b5cf6" },
  { id: "research", label: "Riset", icon: "🔬", color: "#06b6d4" },
  { id: "writing", label: "Penulisan", icon: "✍️", color: "#f59e0b" },
  { id: "teaching", label: "Pengajaran", icon: "📚", color: "#10b981" },
  { id: "analysis", label: "Analisis", icon: "📊", color: "#ef4444" },
  { id: "coding", label: "Coding", icon: "💻", color: "#3b82f6" },
  { id: "business", label: "Bisnis", icon: "💼", color: "#ec4899" },
  { id: "creative", label: "Kreatif", icon: "🎨", color: "#f97316" },
  { id: "productivity", label: "Produktivitas", icon: "⚡", color: "#14b8a6" },
];

const PROMPTS_DB = [
  // === AKADEMIK ===
  {
    id: 1, cat: "academic", title: "Systematic Literature Review",
    desc: "Menyusun tinjauan pustaka sistematis dengan protokol PRISMA",
    prompt: `Anda adalah asisten riset akademik senior. Bantu saya menyusun Systematic Literature Review (SLR) dengan protokol PRISMA untuk topik: [TOPIK PENELITIAN].

Langkah yang harus dilakukan:
1. **Rumuskan Research Questions** — buat 2-3 pertanyaan penelitian yang spesifik dan terukur
2. **Tentukan Kriteria Inklusi & Eksklusi** — berdasarkan tahun, bahasa, jenis publikasi, dan relevansi
3. **Strategi Pencarian** — susun string pencarian untuk database Scopus, WoS, dan Google Scholar
4. **Proses Seleksi** — jelaskan tahapan screening (title/abstract → full-text → final inclusion)
5. **Data Extraction Table** — buat template tabel ekstraksi data
6. **Sintesis Temuan** — panduan untuk melakukan thematic synthesis

Format output: Gunakan heading dan subheading yang terstruktur. Referensi menggunakan APA 7th Edition.`,
    tags: ["SLR", "PRISMA", "literature review", "tinjauan pustaka", "scopus"],
    difficulty: "advanced",
  },
  {
    id: 2, cat: "academic", title: "Penyusunan Abstrak IMRaD",
    desc: "Menulis abstrak terstruktur untuk jurnal internasional",
    prompt: `Anda adalah editor jurnal internasional bereputasi (Scopus Q1/Q2). Bantu saya menulis abstrak terstruktur (structured abstract) dengan format IMRaD untuk artikel berjudul: [JUDUL ARTIKEL].

Informasi yang saya berikan:
- Latar belakang: [...]
- Tujuan: [...]
- Metode: [...]
- Hasil utama: [...]
- Kesimpulan: [...]

Instruksi:
1. Tulis abstrak dalam Bahasa Indonesia terlebih dahulu (150-250 kata)
2. Terjemahkan ke Bahasa Inggris akademik yang natural
3. Pastikan mencakup: Background, Purpose, Methods, Results, Conclusion
4. Sertakan 4-6 keywords yang relevan dengan bidang studi
5. Hindari kalimat generik; setiap kalimat harus informatif dan spesifik
6. Gunakan active voice dan past tense untuk methods/results`,
    tags: ["abstrak", "abstract", "IMRaD", "jurnal", "artikel"],
    difficulty: "intermediate",
  },
  {
    id: 3, cat: "academic", title: "Evaluasi Instrumen Penelitian",
    desc: "Mengevaluasi validitas dan reliabilitas instrumen kuesioner",
    prompt: `Anda adalah ahli metodologi penelitian kuantitatif. Evaluasi instrumen penelitian (kuesioner) yang saya lampirkan berdasarkan kriteria berikut:

1. **Content Validity** — Apakah item-item sudah merepresentasikan konstruk yang diukur?
2. **Construct Validity** — Apakah indikator sesuai dengan teori/model yang digunakan?
3. **Face Validity** — Apakah bahasa jelas, tidak ambigu, dan mudah dipahami responden?
4. **Reliabilitas** — Berikan rekomendasi uji reliabilitas yang sesuai (Cronbach's Alpha, Composite Reliability)
5. **Skala Pengukuran** — Apakah skala Likert/semantik diferensial sudah tepat?

Untuk setiap item, berikan:
- Status: ✅ Layak / ⚠️ Perlu Revisi / ❌ Tidak Layak
- Alasan singkat
- Rekomendasi revisi (jika perlu)

Sajikan dalam format tabel yang terstruktur.`,
    tags: ["instrumen", "validitas", "reliabilitas", "kuesioner", "metodologi"],
    difficulty: "advanced",
  },
  {
    id: 4, cat: "academic", title: "Kerangka Teoretis & Konseptual",
    desc: "Menyusun kerangka teori dan kerangka konseptual penelitian",
    prompt: `Anda adalah pembimbing disertasi dengan keahlian dalam [BIDANG ILMU]. Bantu saya menyusun kerangka teoretis dan kerangka konseptual untuk penelitian dengan judul: [JUDUL PENELITIAN].

Langkah:
1. **Identifikasi Grand Theory** — teori utama yang mendasari penelitian
2. **Middle Range Theory** — teori pendukung yang relevan
3. **Operational Theory** — konsep operasional yang dapat diukur
4. **Hubungan Antar Variabel** — jelaskan arah dan sifat hubungan (langsung/tidak langsung, moderasi/mediasi)
5. **Kerangka Konseptual** — deskripsikan model konseptual secara naratif
6. **Hipotesis Penelitian** — rumuskan hipotesis berdasarkan kerangka konseptual

Referensi yang digunakan harus dari jurnal bereputasi (Q1-Q4 Scopus), 5 tahun terakhir. Format APA 7th Edition.`,
    tags: ["teori", "kerangka konseptual", "hipotesis", "variabel", "disertasi"],
    difficulty: "advanced",
  },

  // === RISET ===
  {
    id: 5, cat: "research", title: "Analisis PLS-SEM",
    desc: "Panduan lengkap analisis Partial Least Squares - Structural Equation Modeling",
    prompt: `Anda adalah ahli statistik dengan spesialisasi PLS-SEM (SmartPLS). Bantu saya melakukan analisis data dengan panduan berikut:

**Tahap 1: Evaluasi Model Pengukuran (Outer Model)**
- Convergent Validity: Factor loading (>0.70), AVE (>0.50)
- Discriminant Validity: Fornell-Larcker Criterion, HTMT (<0.90)
- Internal Consistency: Cronbach's Alpha (>0.70), Composite Reliability (>0.70)

**Tahap 2: Evaluasi Model Struktural (Inner Model)**
- Collinearity: VIF (<5.0)
- Path Coefficients: signifikansi (p-value <0.05, t-value >1.96)
- R² (coefficient of determination)
- f² (effect size): 0.02 small, 0.15 medium, 0.35 large
- Q² (predictive relevance): >0 acceptable

**Tahap 3: Model Fit**
- SRMR (<0.08), NFI (>0.90)

Data saya: [LAMPIRKAN DATA/HASIL SMARTPLS]
Berikan interpretasi setiap indikator dan rekomendasi perbaikan jika ada nilai yang di bawah threshold.`,
    tags: ["PLS-SEM", "SmartPLS", "SEM", "structural equation", "statistik"],
    difficulty: "advanced",
  },
  {
    id: 6, cat: "research", title: "Analisis Data Kualitatif",
    desc: "Analisis tematik data wawancara dengan coding sistematis",
    prompt: `Anda adalah peneliti kualitatif berpengalaman. Lakukan analisis tematik terhadap transkrip wawancara yang saya berikan, dengan prosedur berikut:

1. **Familiarisasi Data** — baca ulang transkrip dan identifikasi pola awal
2. **Initial Coding** — beri kode pada setiap unit makna (open coding)
3. **Kategorisasi** — kelompokkan kode ke dalam kategori (axial coding)
4. **Identifikasi Tema** — tentukan tema utama dan sub-tema
5. **Review Tema** — pastikan tema koheren dan didukung data
6. **Penamaan Tema** — beri nama yang deskriptif dan representatif
7. **Matriks Analisis** — sajikan dalam tabel: Tema → Sub-tema → Kode → Kutipan Pendukung

Kode responden: R1, R2, dst. (jaga anonimitas)
Pertanyaan wawancara terkait ditandai dengan Q1, Q2, dst.
Gunakan pendekatan Braun & Clarke (2006).

Transkrip: [TEMPEL DI SINI]`,
    tags: ["kualitatif", "wawancara", "tematik", "coding", "NVivo"],
    difficulty: "intermediate",
  },
  {
    id: 7, cat: "research", title: "Research Gap Finder",
    desc: "Mengidentifikasi celah penelitian dari literatur yang ada",
    prompt: `Anda adalah analis riset yang sangat teliti. Berdasarkan kumpulan artikel/literatur yang saya berikan, identifikasi research gap dengan pendekatan berikut:

1. **Mapping Existing Research** — petakan topik, metode, populasi, dan temuan utama dari setiap artikel
2. **Trend Analysis** — identifikasi tren penelitian 5 tahun terakhir
3. **Methodological Gap** — metode apa yang belum digunakan?
4. **Contextual Gap** — konteks/lokasi/populasi mana yang belum diteliti?
5. **Theoretical Gap** — teori apa yang belum diaplikasikan?
6. **Temporal Gap** — apakah ada studi yang perlu direplikasi dengan data terbaru?
7. **Practical Gap** — rekomendasi praktis apa yang belum diuji secara empiris?

Output yang diharapkan:
- Tabel pemetaan literatur
- 3-5 research gap yang teridentifikasi beserta justifikasi
- Rekomendasi judul penelitian untuk setiap gap

Artikel/literatur: [LAMPIRKAN]`,
    tags: ["research gap", "literatur", "novelty", "state of the art"],
    difficulty: "advanced",
  },
  {
    id: 8, cat: "research", title: "Desain Penelitian Mixed-Method",
    desc: "Menyusun desain penelitian metode campuran (mixed-method)",
    prompt: `Anda adalah metodolog penelitian senior. Bantu saya mendesain penelitian mixed-method untuk topik: [TOPIK].

Susun desain meliputi:
1. **Paradigma Penelitian** — Pragmatisme/Transformatif
2. **Tipe Desain** — Explanatory Sequential, Exploratory Sequential, Convergent, atau Embedded
3. **Fase Kuantitatif** — populasi, sampel, instrumen, teknik analisis
4. **Fase Kualitatif** — partisipan, teknik pengumpulan data, teknik analisis
5. **Integrasi Data** — bagaimana data kuantitatif dan kualitatif diintegrasikan
6. **Timeline Penelitian** — Gantt chart naratif
7. **Validitas & Reliabilitas** — strategi untuk masing-masing fase

Referensikan Creswell & Plano Clark (2018) dan Tashakkori & Teddlie (2010). Format APA.`,
    tags: ["mixed-method", "kuantitatif", "kualitatif", "desain penelitian"],
    difficulty: "advanced",
  },

  // === PENULISAN ===
  {
    id: 9, cat: "writing", title: "Parafrase Akademik Anti-Plagiarisme",
    desc: "Memparafrase teks akademik tanpa mengubah makna",
    prompt: `Anda adalah editor akademik profesional dengan keahlian parafrase. Parafrasekan teks berikut dengan ketentuan:

1. **Ubah struktur kalimat** secara total (bukan sekadar sinonim)
2. **Pertahankan makna** dan akurasi informasi
3. **Gunakan academic writing style** — formal, objektif, presisi
4. **Hindari passive voice berlebihan** — variasikan active dan passive
5. **Pertahankan istilah teknis** yang tidak boleh diubah
6. **Target similarity: <15%** (Turnitin-safe)

Format output:
- Teks asli (untuk referensi)
- Hasil parafrase
- Catatan perubahan signifikan

Teks yang akan diparafrase:
[TEMPEL DI SINI]`,
    tags: ["parafrase", "plagiarisme", "turnitin", "academic writing"],
    difficulty: "beginner",
  },
  {
    id: 10, cat: "writing", title: "Penulisan Discussion Section",
    desc: "Menulis bagian Discussion artikel jurnal",
    prompt: `Anda adalah penulis akademik berpengalaman yang telah mempublikasikan di jurnal Q1 Scopus. Bantu saya menulis bagian Discussion untuk artikel dengan informasi berikut:

- Judul: [JUDUL]
- Temuan utama: [HASIL PENELITIAN]
- Hipotesis: [H1, H2, dst.]
- Teori yang digunakan: [TEORI]

Struktur Discussion yang harus diikuti:
1. **Restatement of findings** — ringkas temuan utama (1 paragraf)
2. **Interpretation** — interpretasi setiap temuan, hubungkan dengan teori
3. **Comparison** — bandingkan dengan studi terdahulu (mendukung/bertentangan)
4. **Explanation** — jelaskan mengapa hasil demikian (reasoning berbasis teori)
5. **Implications** — implikasi teoretis dan praktis
6. **Limitations** — keterbatasan penelitian yang jujur
7. **Future research** — arah penelitian selanjutnya

Gunakan connectors akademik yang kuat. Tulis dalam Bahasa Indonesia dahulu, lalu terjemahkan ke Bahasa Inggris.`,
    tags: ["discussion", "pembahasan", "jurnal", "interpretasi"],
    difficulty: "advanced",
  },
  {
    id: 11, cat: "writing", title: "Email Akademik Profesional",
    desc: "Menulis email formal untuk keperluan akademik",
    prompt: `Anda adalah asisten komunikasi profesional di lingkungan akademik. Bantu saya menulis email untuk keperluan: [PILIH: submission jurnal / undangan reviewer / korespondensi editor / permohonan kolaborasi / cover letter jurnal].

Informasi:
- Penerima: [NAMA & JABATAN]
- Konteks: [JELASKAN SITUASI]
- Tujuan: [APA YANG DIHARAPKAN]

Ketentuan:
1. Gunakan bahasa Inggris akademik formal
2. Struktur: Greeting → Context → Purpose → Action Required → Closing
3. Sopan, ringkas, dan profesional
4. Sertakan subject line yang jelas
5. Berikan 2 versi: formal dan semi-formal`,
    tags: ["email", "korespondensi", "submission", "cover letter"],
    difficulty: "beginner",
  },

  // === PENGAJARAN ===
  {
    id: 12, cat: "teaching", title: "Desain Pembelajaran PBL/PjBL",
    desc: "Merancang skenario Problem/Project-Based Learning",
    prompt: `Anda adalah ahli desain instruksional (instructional designer) dengan pengalaman dalam pendidikan tinggi. Rancang skenario pembelajaran [PBL/PjBL] untuk:

- Mata kuliah: [NAMA MK]
- Capaian Pembelajaran: [CPL/CLO]
- Jumlah mahasiswa: [±N]
- Durasi: [MINGGU]

Komponen yang harus disusun:
1. **Deskripsi Masalah/Proyek** — autentik, kontekstual, menantang
2. **Driving Question** — pertanyaan pemicu yang memotivasi investigasi
3. **Tahapan Pembelajaran** — langkah-langkah per pertemuan
4. **Scaffolding** — bantuan bertahap yang diberikan dosen
5. **Sumber Belajar** — referensi, tools, dan resource yang dibutuhkan
6. **Asesmen** — rubrik penilaian proses dan produk
7. **Refleksi** — mekanisme refleksi mahasiswa

Pastikan desain mengakomodasi pembelajaran abad 21 (4C: Critical Thinking, Creativity, Communication, Collaboration).`,
    tags: ["PBL", "PjBL", "desain pembelajaran", "kurikulum", "RPP"],
    difficulty: "intermediate",
  },
  {
    id: 13, cat: "teaching", title: "Rubrik Penilaian Komprehensif",
    desc: "Membuat rubrik analitik untuk berbagai jenis tugas",
    prompt: `Anda adalah asesor pendidikan berpengalaman. Buat rubrik penilaian analitik untuk tugas: [JENIS TUGAS: presentasi / makalah / portofolio / proyek / ujian praktik].

Spesifikasi:
- Mata kuliah: [NAMA MK]
- Level: [S1/S2/S3]
- Jumlah kriteria: 4-6
- Skala: [4 level: Sangat Baik / Baik / Cukup / Kurang]
- Bobot: sesuaikan dengan kompleksitas kriteria

Untuk setiap sel rubrik, berikan:
1. **Deskriptor kualitatif** yang spesifik dan observable
2. **Rentang skor** yang jelas
3. **Contoh** kinerja di setiap level

Format: Tabel rubrik lengkap yang siap digunakan. Sertakan juga panduan penggunaan rubrik untuk penilai.`,
    tags: ["rubrik", "penilaian", "asesmen", "evaluasi", "portofolio"],
    difficulty: "intermediate",
  },
  {
    id: 14, cat: "teaching", title: "Generator Pertanyaan Diskusi",
    desc: "Membuat pertanyaan diskusi forum berantai berbasis artikel",
    prompt: `Anda adalah fasilitator pembelajaran daring yang ahli dalam merancang diskusi bermakna. Berdasarkan artikel/materi yang saya berikan, buat pertanyaan diskusi forum dengan ketentuan:

1. **Pertanyaan Utama** — berbasis hasil/temuan/pembahasan artikel penelitian
2. **Pertanyaan Lanjutan** — pertanyaan berantai yang menggali lebih dalam
3. **Tingkat Kognitif** — minimal C4 (Analisis) ke atas dalam Taksonomi Bloom
4. **Kontekstualisasi** — hubungkan dengan konteks lokal/nasional
5. **Stimulus** — sertakan kutipan kunci atau data dari artikel sebagai pemicu

Format setiap set pertanyaan:
- Pertanyaan utama (1 paragraf konteks + 1 pertanyaan)
- Pertanyaan lanjutan 1 (mendalami aspek tertentu)
- Pertanyaan lanjutan 2 (meminta solusi/rekomendasi)

Buat 3 set pertanyaan diskusi. Materi: [TEMPEL ARTIKEL/TOPIK]`,
    tags: ["diskusi", "forum", "e-learning", "pertanyaan", "Bloom"],
    difficulty: "intermediate",
  },

  // === ANALISIS ===
  {
    id: 15, cat: "analysis", title: "Analisis SWOT Strategis",
    desc: "Melakukan analisis SWOT komprehensif dengan strategi tindak lanjut",
    prompt: `Anda adalah konsultan strategis berpengalaman. Lakukan analisis SWOT komprehensif untuk: [ORGANISASI/PROGRAM/KEBIJAKAN].

Konteks:
- Profil singkat: [...]
- Tujuan strategis: [...]
- Lingkungan eksternal: [...]

Langkah analisis:
1. **Identifikasi S-W-O-T** — masing-masing minimal 5 poin dengan justifikasi
2. **Matriks TOWS** — strategi kombinasi:
   - SO (Strengths-Opportunities): strategi agresif
   - WO (Weaknesses-Opportunities): strategi perbaikan
   - ST (Strengths-Threats): strategi diversifikasi
   - WT (Weaknesses-Threats): strategi defensif
3. **Prioritasi** — ranking strategi berdasarkan urgency dan feasibility
4. **Action Plan** — untuk 3 strategi prioritas utama

Sajikan dalam format tabel dan narasi.`,
    tags: ["SWOT", "strategi", "manajemen", "perencanaan", "TOWS"],
    difficulty: "intermediate",
  },
  {
    id: 16, cat: "analysis", title: "Review Artikel Jurnal",
    desc: "Melakukan peer review artikel jurnal secara komprehensif",
    prompt: `Anda adalah reviewer jurnal internasional bereputasi (Scopus Q1/Q2). Review artikel yang saya lampirkan dengan framework berikut:

**A. Evaluasi Substansi**
1. Novelty & Originality — apakah memberikan kontribusi baru?
2. Research Questions — apakah jelas dan researchable?
3. Literature Review — apakah komprehensif dan mutakhir?
4. Methodology — apakah tepat dan rigorous?
5. Results — apakah disajikan dengan jelas?
6. Discussion — apakah interpretasi didukung data?
7. Conclusion — apakah menjawab research questions?

**B. Evaluasi Teknis**
1. Struktur dan organisasi
2. Kualitas bahasa (academic English)
3. Referensi (kelengkapan, kemutakhiran, format APA)
4. Tabel dan gambar (informatif, labeled)

**C. Rekomendasi**
- Accept / Minor Revision / Major Revision / Reject
- Daftar revisi yang harus dilakukan (numbered)

Artikel: [LAMPIRKAN]`,
    tags: ["review", "peer review", "jurnal", "evaluasi artikel"],
    difficulty: "advanced",
  },
  {
    id: 17, cat: "analysis", title: "Analisis Kebijakan Pendidikan",
    desc: "Menganalisis kebijakan pendidikan dengan framework analitis",
    prompt: `Anda adalah analis kebijakan pendidikan senior. Analisis kebijakan: [NAMA KEBIJAKAN / REGULASI].

Gunakan framework analisis kebijakan berikut:

1. **Deskripsi Kebijakan** — latar belakang, tujuan, sasaran
2. **Landasan Hukum** — dasar regulasi dan hierarki peraturan
3. **Stakeholder Analysis** — siapa yang terlibat dan terdampak
4. **Content Analysis** — isi pokok kebijakan dan mekanisme implementasi
5. **Impact Assessment** — dampak positif dan negatif (aktual/potensial)
6. **Gap Analysis** — kesenjangan antara tujuan dan implementasi
7. **Benchmarking** — perbandingan dengan kebijakan serupa (nasional/internasional)
8. **Rekomendasi** — perbaikan yang berbasis evidence

Catatan: Jangan mengarang pasal/regulasi. Jika tidak yakin, nyatakan "perlu verifikasi."`,
    tags: ["kebijakan", "policy analysis", "regulasi", "pendidikan"],
    difficulty: "advanced",
  },

  // === CODING ===
  {
    id: 18, cat: "coding", title: "Python Data Analysis Script",
    desc: "Membuat script Python untuk analisis data penelitian",
    prompt: `Anda adalah data scientist yang ahli dalam analisis data penelitian pendidikan/sosial. Buatkan script Python untuk:

Tujuan: [ANALISIS YANG DIINGINKAN: deskriptif / korelasi / regresi / uji beda / faktor analisis]

Data:
- Format: [CSV/Excel]
- Variabel: [DAFTAR VARIABEL]
- Jumlah responden: [N]

Ketentuan script:
1. Import library yang diperlukan (pandas, numpy, scipy, matplotlib, seaborn)
2. Data cleaning dan preprocessing
3. Analisis deskriptif (mean, SD, distribusi)
4. Uji asumsi (normalitas, homogenitas, multikolinearitas)
5. Analisis utama sesuai tujuan
6. Visualisasi hasil (grafik yang publication-ready)
7. Interpretasi output dalam komentar bahasa Indonesia
8. Export hasil ke file

Berikan kode yang clean, well-commented, dan siap dijalankan.`,
    tags: ["Python", "data analysis", "statistik", "pandas", "script"],
    difficulty: "intermediate",
  },
  {
    id: 19, cat: "coding", title: "Web Scraping Jurnal",
    desc: "Script untuk mengambil metadata artikel dari database jurnal",
    prompt: `Anda adalah developer Python yang ahli dalam web scraping akademik. Buatkan script untuk mengambil metadata artikel jurnal dari [Scopus / Google Scholar / Crossref / Semantic Scholar] dengan ketentuan:

Topik pencarian: [KEYWORD]
Jumlah artikel: [N]
Rentang tahun: [TAHUN_AWAL - TAHUN_AKHIR]

Data yang diekstrak:
1. Judul artikel
2. Penulis
3. Tahun publikasi
4. Nama jurnal
5. DOI
6. Abstract
7. Citation count
8. Keywords

Output:
- DataFrame pandas
- Export ke CSV dan Excel
- Visualisasi tren publikasi per tahun

Gunakan API resmi jika tersedia (Crossref API, Semantic Scholar API). Jika scraping, gunakan requests + BeautifulSoup dengan delay yang sopan. Tambahkan error handling yang robust.`,
    tags: ["scraping", "jurnal", "Scopus", "metadata", "Python"],
    difficulty: "advanced",
  },

  // === BISNIS ===
  {
    id: 20, cat: "business", title: "Business Model Canvas",
    desc: "Menyusun Business Model Canvas untuk produk/bisnis digital",
    prompt: `Anda adalah konsultan bisnis digital berpengalaman. Bantu saya menyusun Business Model Canvas (BMC) untuk: [NAMA PRODUK/BISNIS].

Deskripsi singkat: [...]
Target pasar: [...]

Susun 9 elemen BMC:
1. **Customer Segments** — siapa pelanggan utama? (persona detail)
2. **Value Propositions** — nilai unik apa yang ditawarkan?
3. **Channels** — melalui saluran apa menjangkau pelanggan?
4. **Customer Relationships** — bagaimana membangun hubungan?
5. **Revenue Streams** — dari mana pendapatan berasal?
6. **Key Resources** — sumber daya kunci yang dibutuhkan?
7. **Key Activities** — aktivitas utama yang harus dilakukan?
8. **Key Partnerships** — mitra strategis yang dibutuhkan?
9. **Cost Structure** — struktur biaya utama?

Untuk setiap elemen, berikan:
- Penjelasan detail
- Contoh konkret
- Rekomendasi strategis

Tambahkan: analisis kompetitor singkat dan go-to-market strategy.`,
    tags: ["BMC", "bisnis", "startup", "digital", "strategi"],
    difficulty: "intermediate",
  },
  {
    id: 21, cat: "business", title: "Proposal Hibah Penelitian",
    desc: "Menyusun proposal hibah riset (BIMA, Kemendikbud, dll.)",
    prompt: `Anda adalah konsultan penulisan proposal hibah berpengalaman. Bantu saya menyusun proposal hibah penelitian untuk skema: [BIMA / Penelitian Dasar / Penelitian Terapan / PKM / Pengabdian].

Informasi:
- Judul: [...]
- Bidang: [...]
- Tim peneliti: [...]
- Anggaran: [RANGE]
- Durasi: [TAHUN]

Komponen proposal:
1. **Ringkasan** — 500 kata, mencakup urgensi, tujuan, metode, luaran
2. **Pendahuluan** — state of the art, research gap, urgensi
3. **Tinjauan Pustaka** — teori dan studi terdahulu
4. **Metode Penelitian** — desain, populasi, teknik analisis
5. **Jadwal Pelaksanaan** — Gantt chart naratif
6. **Luaran & Target Capaian** — publikasi, HKI, produk
7. **Rencana Anggaran Biaya** — rincian per pos
8. **Daftar Pustaka** — APA, >60% jurnal internasional

Gunakan bahasa yang persuasif namun tetap ilmiah.`,
    tags: ["proposal", "hibah", "BIMA", "pendanaan", "riset"],
    difficulty: "advanced",
  },

  // === KREATIF ===
  {
    id: 22, cat: "creative", title: "Storytelling untuk Presentasi",
    desc: "Membangun narasi menarik untuk presentasi akademik",
    prompt: `Anda adalah communication coach yang ahli dalam academic storytelling. Bantu saya membangun narasi presentasi yang engaging untuk topik: [TOPIK PRESENTASI].

Audiens: [DOSEN / MAHASISWA / PRAKTISI / UMUM]
Durasi: [MENIT]

Struktur narasi:
1. **Hook** (30 detik) — pembuka yang mengejutkan/memukau
   - Pilihan: statistik mengejutkan / pertanyaan retoris / cerita personal / kutipan powerful
2. **Problem** (2 menit) — gambarkan masalah dengan vivid
3. **Journey** (inti) — perjalanan penelitian/pemikiran
4. **Insight** (klimaks) — temuan/solusi utama
5. **Call to Action** (penutup) — apa yang harus dilakukan audiens

Berikan juga:
- 3 analogi yang bisa digunakan
- Transisi antar slide yang smooth
- Tips delivery (intonasi, jeda, gestur)
- Antisipasi pertanyaan audiens (3-5 pertanyaan + jawaban)`,
    tags: ["presentasi", "storytelling", "public speaking", "narasi"],
    difficulty: "beginner",
  },
  {
    id: 23, cat: "creative", title: "Infografis Penelitian",
    desc: "Merancang konsep infografis untuk diseminasi hasil riset",
    prompt: `Anda adalah desainer informasi (information designer). Bantu saya merancang konsep infografis untuk menyebarluaskan hasil penelitian berikut:

- Judul penelitian: [...]
- Temuan utama: [3-5 POIN]
- Data kunci: [ANGKA/STATISTIK PENTING]
- Target audiens: [AKADEMIK / PRAKTISI / PUBLIK]

Rancang:
1. **Layout Structure** — alur baca (top-down / left-right / circular)
2. **Visual Hierarchy** — elemen mana yang paling menonjol
3. **Data Visualization** — jenis chart/diagram untuk setiap data
4. **Color Palette** — 3-4 warna dengan hex code
5. **Typography** — font heading dan body yang direkomendasikan
6. **Iconography** — ikon-ikon yang mewakili konsep
7. **Copy/Text** — teks ringkas untuk setiap section
8. **Dimensi** — ukuran yang sesuai (poster A3 / social media / slide)

Berikan deskripsi visual yang detail agar desainer dapat mengeksekusi.`,
    tags: ["infografis", "visualisasi", "desain", "diseminasi"],
    difficulty: "intermediate",
  },

  // === PRODUKTIVITAS ===
  {
    id: 24, cat: "productivity", title: "Manajemen Proyek Riset",
    desc: "Menyusun rencana dan timeline proyek penelitian",
    prompt: `Anda adalah project manager penelitian yang berpengalaman. Bantu saya menyusun rencana manajemen proyek untuk penelitian: [JUDUL PENELITIAN].

Durasi: [BULAN/TAHUN]
Tim: [JUMLAH & PERAN]
Anggaran: [TOTAL]

Komponen yang harus disusun:
1. **Work Breakdown Structure (WBS)** — dekomposisi tugas hingga level aktivitas
2. **Timeline/Gantt Chart** — milestone dan deadline per aktivitas
3. **Resource Allocation** — siapa mengerjakan apa, kapan
4. **Risk Register** — identifikasi risiko, probabilitas, dampak, mitigasi
5. **Communication Plan** — frekuensi meeting, channel, reporting
6. **Quality Assurance** — mekanisme kontrol kualitas
7. **Monitoring & Evaluation** — indikator keberhasilan dan mekanisme evaluasi

Sajikan dalam format yang siap digunakan. Prioritaskan critical path.`,
    tags: ["manajemen proyek", "timeline", "Gantt", "WBS", "riset"],
    difficulty: "intermediate",
  },
  {
    id: 25, cat: "productivity", title: "Literature Matrix Builder",
    desc: "Membuat matriks pemetaan literatur secara sistematis",
    prompt: `Anda adalah asisten riset yang sangat terorganisir. Bantu saya membuat Literature Review Matrix dari artikel-artikel yang saya berikan.

Kolom matriks:
1. No
2. Author(s) & Year
3. Title
4. Journal / Source
5. Research Objective
6. Methodology (Design, Sample, Analysis)
7. Key Findings
8. Limitations
9. Relevance to My Study
10. Gap Identified

Instruksi:
- Isi setiap kolom dengan ringkas (1-2 kalimat)
- Urutkan secara kronologis
- Tandai artikel yang paling relevan dengan ⭐
- Di akhir matriks, berikan:
  a. Sintesis temuan lintas artikel
  b. Trend metodologi yang digunakan
  c. Research gap yang konsisten muncul
  d. Rekomendasi untuk penelitian saya

Artikel: [LAMPIRKAN / DAFTARKAN]`,
    tags: ["literature matrix", "pemetaan", "review", "tabel literatur"],
    difficulty: "beginner",
  },
  {
    id: 26, cat: "productivity", title: "Lyra 4-D Prompt Optimizer",
    desc: "Mengoptimalkan prompt menggunakan framework Lyra 4-D",
    prompt: `Anda adalah prompt engineer ahli yang menggunakan framework Lyra 4-D. Optimalkan prompt berikut agar menghasilkan output maksimal dari AI:

Prompt asli: [TEMPEL PROMPT]

Proses optimasi Lyra 4-D:
1. **Deconstruct** — urai elemen prompt: tujuan, konteks, format, constraints
2. **Diagnose** — identifikasi kelemahan: ambiguitas, missing context, format tidak jelas
3. **Develop** — kembangkan versi optimal dengan:
   - Role assignment yang spesifik
   - Context yang lengkap
   - Instructions yang step-by-step
   - Output format yang eksplisit
   - Constraints dan guardrails
4. **Deliver** — sajikan prompt final yang siap pakai

Output:
- Optimized Prompt (siap copy-paste)
- Key Improvements (apa yang diubah dan mengapa)
- Techniques Used (teknik prompt engineering yang diterapkan)
- Pro Tip (tips tambahan untuk hasil optimal)`,
    tags: ["prompt engineering", "Lyra", "optimasi", "AI", "framework"],
    difficulty: "intermediate",
  },
  {
    id: 27, cat: "coding", title: "Dashboard Data Interaktif",
    desc: "Membuat dashboard visualisasi data dengan React/HTML",
    prompt: `Anda adalah frontend developer dan data visualization specialist. Buatkan dashboard interaktif untuk menampilkan data: [DESKRIPSI DATA].

Spesifikasi:
- Framework: React dengan Tailwind CSS
- Library chart: Recharts
- Data source: [JSON/CSV yang akan saya berikan]

Komponen dashboard:
1. **Summary Cards** — metrik utama (KPI) di bagian atas
2. **Line Chart** — tren data sepanjang waktu
3. **Bar Chart** — perbandingan antar kategori
4. **Pie/Donut Chart** — distribusi/proporsi
5. **Data Table** — tabel detail dengan sorting dan search
6. **Filter Panel** — filter berdasarkan periode, kategori, dsb.

Ketentuan:
- Responsive (mobile-friendly)
- Dark/light mode toggle
- Export data ke CSV
- Loading states dan error handling
- Animasi transisi yang smooth

Berikan kode lengkap yang siap dijalankan.`,
    tags: ["dashboard", "React", "visualisasi", "chart", "frontend"],
    difficulty: "advanced",
  },
  {
    id: 28, cat: "teaching", title: "Modul Ajar Kurikulum Merdeka",
    desc: "Menyusun modul ajar sesuai Kurikulum Merdeka Belajar",
    prompt: `Anda adalah pengembang kurikulum berpengalaman yang memahami Kurikulum Merdeka. Susun modul ajar untuk:

- Mata pelajaran/kuliah: [...]
- Fase/tingkat: [...]
- Topik: [...]
- Alokasi waktu: [... JP]

Komponen modul:
1. **Informasi Umum** — identitas modul, kompetensi awal, profil Pelajar Pancasila
2. **Capaian Pembelajaran (CP)** — sesuai SK terbaru
3. **Tujuan Pembelajaran (TP)** — ABCD format (Audience, Behavior, Condition, Degree)
4. **Alur Tujuan Pembelajaran (ATP)** — sekuens pembelajaran
5. **Pemahaman Bermakna** — essential understanding
6. **Pertanyaan Pemantik** — 3-5 pertanyaan stimulan
7. **Kegiatan Pembelajaran** — pendahuluan, inti (dengan diferensiasi), penutup
8. **Asesmen** — diagnostik, formatif, sumatif + rubrik
9. **Pengayaan & Remediasi**
10. **Refleksi Guru & Peserta Didik**
11. **Lampiran** — LKPD, bahan ajar, media

Format: Siap cetak dan siap unggah ke platform.`,
    tags: ["modul ajar", "Kurikulum Merdeka", "RPP", "CP", "ATP"],
    difficulty: "intermediate",
  },
  {
    id: 29, cat: "creative", title: "Konten LinkedIn Akademik",
    desc: "Membuat konten LinkedIn untuk personal branding akademik",
    prompt: `Anda adalah content strategist untuk personal branding akademik di LinkedIn. Buatkan konten LinkedIn untuk saya sebagai: [JABATAN/PERAN AKADEMIK].

Topik konten: [TOPIK]
Tujuan: [brand awareness / thought leadership / networking / diseminasi riset]

Buatkan 3 variasi konten:

**Variasi 1: Story-based**
- Hook yang personal dan relatable
- Narasi pengalaman
- Lesson learned + CTA

**Variasi 2: Insight-based**
- Data/fakta mengejutkan sebagai hook
- Analisis singkat
- Perspektif unik + CTA

**Variasi 3: How-to**
- Problem statement
- Step-by-step solusi
- Takeaway + CTA

Untuk setiap variasi:
- Panjang: 150-200 kata
- Gunakan emoji secukupnya (profesional)
- Sertakan 3-5 hashtag relevan
- Format: short paragraphs, line breaks untuk readability`,
    tags: ["LinkedIn", "personal branding", "konten", "akademik", "sosial media"],
    difficulty: "beginner",
  },
  {
    id: 30, cat: "analysis", title: "Evaluasi Program Pendidikan",
    desc: "Mengevaluasi program pendidikan dengan model CIPP",
    prompt: `Anda adalah evaluator program pendidikan berpengalaman. Lakukan evaluasi komprehensif terhadap program: [NAMA PROGRAM] menggunakan Model CIPP (Stufflebeam).

**1. Context Evaluation**
- Kebutuhan apa yang melatarbelakangi program?
- Apakah tujuan program sesuai dengan kebutuhan?
- Bagaimana lingkungan/kondisi yang mempengaruhi?

**2. Input Evaluation**
- Apakah sumber daya (SDM, anggaran, sarana) memadai?
- Apakah desain program sudah tepat?
- Apa alternatif strategi yang bisa digunakan?

**3. Process Evaluation**
- Bagaimana implementasi berjalan?
- Apa kendala yang ditemui?
- Apakah ada penyimpangan dari rencana?

**4. Product Evaluation**
- Apakah tujuan tercapai? (kuantitatif & kualitatif)
- Bagaimana dampak jangka pendek dan panjang?
- Apakah program layak dilanjutkan/dimodifikasi/dihentikan?

Berikan rekomendasi berbasis evidence untuk setiap komponen.`,
    tags: ["evaluasi", "CIPP", "program", "Stufflebeam", "pendidikan"],
    difficulty: "advanced",
  },
];

const DIFFICULTY_MAP = {
  beginner: { label: "Pemula", color: "#10b981", bg: "#ecfdf5" },
  intermediate: { label: "Menengah", color: "#f59e0b", bg: "#fffbeb" },
  advanced: { label: "Lanjutan", color: "#ef4444", bg: "#fef2f2" },
};

/* ─────────────────────── COMPONENT ─────────────────────── */

export default function App() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [favIds, setFavIds] = useState(() => {
    try {
      const saved = localStorage.getItem("pf-favs");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [showFavOnly, setShowFavOnly] = useState(false);
  const searchRef = useRef(null);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem("pf-favs", JSON.stringify([...favIds]));
    } catch {}
  }, [favIds]);

  const filtered = PROMPTS_DB.filter((p) => {
    const matchCat = activeCat === "all" || p.cat === activeCat;
    const matchDiff = activeDifficulty === "all" || p.difficulty === activeDifficulty;
    const matchFav = !showFavOnly || favIds.has(p.id);
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.prompt.toLowerCase().includes(q);
    return matchCat && matchDiff && matchFav && matchSearch;
  });

  const handleCopy = useCallback((id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const toggleFav = useCallback((id) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const catCounts = {};
  PROMPTS_DB.forEach((p) => { catCounts[p.cat] = (catCounts[p.cat] || 0) + 1; });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #0c0c1d 0%, #1a1a2e 40%, #16213e 100%)",
      color: "#e2e8f0",
      fontFamily: "'Instrument Sans', 'DM Sans', system-ui, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(6,182,212,0.1) 100%)",
        borderBottom: "1px solid rgba(99,102,241,0.2)",
        padding: "32px 24px 24px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 150, height: 150, background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
            }}>⚡</div>
            <div>
              <h1 style={{
                fontSize: 26, fontWeight: 700, margin: 0,
                background: "linear-gradient(135deg, #c7d2fe, #a5b4fc, #818cf8)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}>Pustaka Prompt</h1>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Koleksi Prompt Akademik & Profesional Siap Pakai
              </p>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: "12px 0 0", lineHeight: 1.6, maxWidth: 600 }}>
            {PROMPTS_DB.length} prompt siap pakai untuk riset, penulisan, pengajaran, dan produktivitas akademik.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px 60px" }}>

        {/* ── SEARCH ── */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 16, pointerEvents: "none" }}>🔍</div>
          <input
            ref={searchRef}
            type="text"
            placeholder="Cari prompt... (judul, tag, atau kata kunci)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "14px 14px 14px 42px",
              background: "rgba(30,30,60,0.8)", border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 14, color: "#e2e8f0", fontSize: 15,
              outline: "none", boxSizing: "border-box",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(99,102,241,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(99,102,241,0.25)"; e.target.style.boxShadow = "none"; }}
          />
          {search && (
            <button onClick={() => { setSearch(""); searchRef.current?.focus(); }}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(99,102,241,0.2)", border: "none", borderRadius: 8, color: "#a5b4fc", cursor: "pointer", padding: "4px 10px", fontSize: 12 }}>
              ✕ Hapus
            </button>
          )}
        </div>

        {/* ── CATEGORY PILLS ── */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 12, WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCat === cat.id;
            const count = cat.id === "all" ? PROMPTS_DB.length : (catCounts[cat.id] || 0);
            return (
              <button key={cat.id} onClick={() => setActiveCat(cat.id)}
                style={{
                  flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", transition: "all 0.2s",
                  background: isActive ? `linear-gradient(135deg, ${cat.color}dd, ${cat.color}99)` : "rgba(30,30,60,0.6)",
                  color: isActive ? "#fff" : "#94a3b8",
                  boxShadow: isActive ? `0 2px 12px ${cat.color}40` : "none",
                }}>
                <span style={{ fontSize: 14 }}>{cat.icon}</span>
                {cat.label}
                <span style={{ fontSize: 11, opacity: 0.7, background: isActive ? "rgba(255,255,255,0.2)" : "rgba(100,116,139,0.2)", padding: "1px 6px", borderRadius: 6 }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* ── FILTERS ── */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {[{ id: "all", label: "Semua Level" }, ...Object.entries(DIFFICULTY_MAP).map(([k, v]) => ({ id: k, label: v.label }))].map((d) => (
              <button key={d.id} onClick={() => setActiveDifficulty(d.id)}
                style={{
                  padding: "5px 10px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 500,
                  background: activeDifficulty === d.id ? "rgba(99,102,241,0.3)" : "rgba(30,30,60,0.5)",
                  color: activeDifficulty === d.id ? "#a5b4fc" : "#64748b", transition: "all 0.2s",
                }}>{d.label}</button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={() => setShowFavOnly((v) => !v)}
            style={{
              padding: "5px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 4,
              background: showFavOnly ? "rgba(239,68,68,0.2)" : "rgba(30,30,60,0.5)",
              color: showFavOnly ? "#fca5a5" : "#64748b",
            }}>
            {showFavOnly ? "♥" : "♡"} Favorit {favIds.size > 0 && `(${favIds.size})`}
          </button>
        </div>

        {/* ── RESULTS COUNT ── */}
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", padding: "2px 8px", borderRadius: 6, fontWeight: 600, fontSize: 12 }}>{filtered.length}</span>
          prompt ditemukan
          {search && <span> untuk "<strong style={{ color: "#a5b4fc" }}>{search}</strong>"</span>}
        </div>

        {/* ── CARDS ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(30,30,60,0.4)", borderRadius: 16, border: "1px dashed rgba(99,102,241,0.2)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ color: "#94a3b8", fontSize: 15, margin: 0 }}>Tidak ada prompt yang cocok. Coba ubah kata kunci atau filter.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((p) => {
              const isOpen = expandedId === p.id;
              const diff = DIFFICULTY_MAP[p.difficulty];
              const catObj = CATEGORIES.find((c) => c.id === p.cat);
              return (
                <div key={p.id} style={{
                  background: isOpen ? "linear-gradient(135deg, rgba(30,30,65,0.95), rgba(25,25,55,0.95))" : "rgba(25,25,50,0.7)",
                  border: `1px solid ${isOpen ? "rgba(99,102,241,0.35)" : "rgba(99,102,241,0.12)"}`,
                  borderRadius: 14, overflow: "hidden", transition: "all 0.25s ease",
                  boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
                }}>
                  <div onClick={() => setExpandedId(isOpen ? null : p.id)}
                    style={{ padding: "16px 16px 14px", cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: `linear-gradient(135deg, ${catObj?.color || "#6366f1"}30, ${catObj?.color || "#6366f1"}15)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, border: `1px solid ${catObj?.color || "#6366f1"}30`,
                    }}>{catObj?.icon || "📄"}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.3 }}>{p.title}</h3>
                        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: `${diff.color}20`, color: diff.color, fontWeight: 600, flexShrink: 0 }}>{diff.label}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", lineHeight: 1.4 }}>{p.desc}</p>
                      <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                        {p.tags.slice(0, 4).map((t) => (
                          <span key={t} onClick={(e) => { e.stopPropagation(); setSearch(t); }}
                            style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: "rgba(99,102,241,0.1)", color: "#818cf8", cursor: "pointer" }}>
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <button onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 0, lineHeight: 1, color: favIds.has(p.id) ? "#f87171" : "#475569" }}>
                        {favIds.has(p.id) ? "♥" : "♡"}
                      </button>
                      <span style={{ fontSize: 14, color: "#64748b", transform: `rotate(${isOpen ? 180 : 0}deg)`, transition: "transform 0.25s" }}>▾</span>
                    </div>
                  </div>
                  {isOpen && (
                    <div style={{ borderTop: "1px solid rgba(99,102,241,0.12)", padding: 16, animation: "fadeIn 0.25s ease" }}>
                      <div style={{ background: "rgba(10,10,30,0.7)", borderRadius: 12, border: "1px solid rgba(99,102,241,0.1)", overflow: "hidden" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid rgba(99,102,241,0.08)", background: "rgba(99,102,241,0.05)" }}>
                          <span style={{ fontSize: 11, color: "#818cf8", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Prompt Template</span>
                          <button onClick={() => handleCopy(p.id, p.prompt)}
                            style={{
                              padding: "5px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                              fontSize: 12, fontWeight: 600,
                              background: copiedId === p.id ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                              color: "#fff", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                            }}>
                            {copiedId === p.id ? "✓ Tersalin!" : "📋 Salin Prompt"}
                          </button>
                        </div>
                        <pre style={{
                          padding: 16, margin: 0, fontSize: 12.5, lineHeight: 1.7,
                          color: "#cbd5e1", whiteSpace: "pre-wrap", wordBreak: "break-word",
                          fontFamily: "'JetBrains Mono', monospace", maxHeight: 400, overflowY: "auto",
                        }}>{p.prompt}</pre>
                      </div>
                      <div style={{
                        marginTop: 12, padding: "10px 14px", background: "rgba(99,102,241,0.06)",
                        borderRadius: 10, display: "flex", alignItems: "center", gap: 8,
                        border: "1px solid rgba(99,102,241,0.1)",
                      }}>
                        <span style={{ fontSize: 14 }}>💡</span>
                        <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
                          Ganti bagian dalam <strong style={{ color: "#a5b4fc" }}>[KURUNG SIKU]</strong> dengan informasi spesifik Anda sebelum menggunakan prompt ini.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── FOOTER ── */}
        <div style={{ marginTop: 40, textAlign: "center", padding: "20px 0", borderTop: "1px solid rgba(99,102,241,0.1)" }}>
          <p style={{ fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.6 }}>
            Pustaka Prompt — Koleksi prompt akademik & profesional
            <br /><span style={{ color: "#64748b" }}>Built with ⚡ by frd77</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        input::placeholder { color: #4a5568; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.4); }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
