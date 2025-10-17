# Profitly

Profitly adalah platform manajemen bisnis cerdas yang membantu pelaku usaha mandiri seperti pelajar, pemilik kedai dan freelancer. 
Bertujuan agar mereka memahami performa bisnis dengan cara yang sederhana namun mendalam.

Dengan tampilan retro-modern yang interaktif dan analitik berbasis AI, Profitly memudahkan pengguna melihat data, menguji strategi, dan menemukan keputusan terbaik untuk meningkatkan keuntungan.

---

## 1. Gambaran Umum

Profitly dibangun sebagai solusi all-in-one untuk mengelola bisnis.  
Alih-alih mencatat manual di buku atau spreadsheet, pengguna dapat menganalisis performa, menghitung margin, memantau tren, dan menguji strategi promosi langsung dari dashboard interaktif.

---

## 2. Struktur Direktori

Struktur proyek ini dibuat sederhana agar mudah dikembangkan secara lokal (jika tertarik) baik di sisi **Next.js** maupun **Streamlit**.

```

profitlysite/
├── components/          # Komponen UI yang dapat digunakan
├── pages/               # Halaman Next.js utama
│   ├── case/            # Halaman dokumentasi & studi kasus
│   └── dashboard/       # Dashboard utama aplikasi
│
├── public/              # Aset publik (gambar, ikon, preview)
├── store/               # Manajemen state 
├── styles/              # Konfigurasi Tailwind & CSS global
├── utils/               # Fungsi utilitas & helper
└── streamlitpages/      # Modul analitik AI & eksperimen bisnis
    ├── predict/         # Prediksi dan analisis performa
    ├── rate/            # Analisis sentimen dan ulasan konsumen
    └── smartdecision/   # Laboratorium simulasi keputusan bisnis

````

---

## 3. Fitur Utama

Profitly memiliki 5 fitur utama yang memenuhi kebutuhan lengkap sebuah bisnis dari pencatatan, analisis, hingga pembelajaran berbasis kasus nyata.

### 1. **Sistem Manajemen Barang**
Kelola daftar produk, catat modal, harga jual, dan target profit.  
Setiap perubahan akan dihitung secara otomatis untuk menampilkan margin keuntungan dalam bentuk nominal dan persentase.  

---

### 2. **Dashboard Analisis**
Tampilan performa penjualan dalam bentuk grafik, dan ringkasan harian hingga prediksi penjualan.
Fitur ini membantu pengguna memahami fluktuasi pendapatan dan memantau pertumbuhan bisnis dari waktu ke waktu.  
Visualisasinya dibuat agar mudah dipahami bahkan tanpa latar belakang ekonomi dan statistik.

---

### 3. **Pembuat Paket (Bundle Creator)**
Buat kombinasi produk dengan strategi harga tertentu.  
Fitur ini membantu menentukan bundel terbaik untuk memaksimalkan laba dan menarik perhatian para konsumen. Cocok sebagai referensi untuk *loyalty program*

---

### 4. **Analisa Rating Konsumen**
Masukkan komentar pelanggan dan biarkan AI menganalisis sentimen di baliknya : apakah positif, netral, atau negatif.  
Hasilnya akan diubah menjadi *insight* yang bisa ditindaklanjuti, seperti peningkatan kualitas layanan atau produk melalui AI.

---

### 5. **SmartDecision Lab**
Sebuah laboratorium eksperimen untuk menguji keberhasilan strategi bisnis.  
Kamu bisa mensimulasikan promosi, potongan harga, atau perubahan strategi, lalu menganalisa dampaknya terhadap performa penjualan melalui statistik dan analisis otomatis.  
Analisa stastik dan AI otomatis hanya dengan input penghasilan!

---

## 4. Studi Kasus & Dokumentasi

Profitly juga memiliki halaman **Case Study** yang berfungsi sebagai panduan interaktif bagi pengguna baru.  

---

## 5. Teknologi yang Digunakan

| **Kategori** | **Teknologi**                                 | **Deskripsi**                                                                                                                                           |
| ------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | Next.js, Tailwind CSS, GSAP                   | Membangun UI utama dalam website.                                 |
| **Analysis** | Streamlit, Scikit-learn, Transformers, Gemini | Menjalankan modul analitik. |
| **Design**   | Figma, Ibis Paint                             | Merancang elemen visual dan aset.                                         |


---

## 6. Cara Menjalankan Proyek

### **Frontend (Next.js)**
```bash
cd profitlysite
npm install
npm run dev
````

Akses di `http://localhost:3000`

### **Contoh Streamlit**

```bash
cd streamlitpages/smartdecision
pip install -r requirements.txt
streamlit run main.py
```

Akses di `http://localhost:8501`

---

**By Nabeel Adriansyah - SMAN 1 Rejang Lebong**