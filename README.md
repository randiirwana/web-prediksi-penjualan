# Aplikasi Web Prediksi Penjualan dengan LSTM

Aplikasi web Flask yang menggunakan model LSTM untuk memprediksi penjualan harian berdasarkan data historis.

## 🚀 Fitur

- **Prediksi Single Day**: Prediksi penjualan untuk hari berikutnya
- **Multi-Day Forecast**: Prediksi penjualan untuk beberapa hari ke depan (maksimal 30 hari)
- **Visualisasi Data**: Chart data penjualan historis 60 hari terakhir
- **Statistik Dashboard**: Menampilkan statistik lengkap data penjualan
- **Responsive Design**: Interface yang responsif untuk desktop dan mobile

## 📋 Persyaratan

- Python 3.8+
- Model LSTM yang sudah ditraining (`model_penjualan_lstm.h5`)
- Scaler yang sudah disimpan (`scaler_penjualan.pkl`)
- Dataset CSV (`dataset_penjualan.csv`)

## 🛠️ Instalasi

1. **Clone atau download project ini**

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Pastikan file-file berikut ada di direktori root:**
   - `model_penjualan_lstm.h5` (model LSTM yang sudah ditraining)
   - `scaler_penjualan.pkl` (scaler yang sudah disimpan)
   - `dataset_penjualan.csv` (dataset penjualan)

## 🚀 Cara Menjalankan

1. **Jalankan aplikasi Flask:**
   ```bash
   python app.py
   ```

2. **Buka browser dan akses:**
   ```
   http://localhost:5000
   ```

3. **Aplikasi akan otomatis:**
   - Load model LSTM dan scaler
   - Load dataset penjualan
   - Menampilkan dashboard dengan statistik
   - Menampilkan chart data historis

## 📱 Cara Menggunakan

### Prediksi Single Day
1. Klik tombol **"Prediksi Sekarang"**
2. Sistem akan memprediksi penjualan untuk hari berikutnya
3. Hasil akan ditampilkan dengan tanggal dan nilai prediksi

### Multi-Day Forecast
1. Masukkan jumlah hari yang ingin diprediksi (1-30 hari)
2. Klik tombol **"Forecast"**
3. Sistem akan menampilkan tabel prediksi untuk setiap hari

### Dashboard
- **Statistics Cards**: Menampilkan total hari data, rata-rata penjualan, penjualan tertinggi/terendah
- **Chart**: Visualisasi data penjualan 60 hari terakhir
- **Model Info**: Informasi tentang model LSTM yang digunakan

## 🏗️ Struktur Project

```
├── app.py                          # Main Flask application
├── requirements.txt                 # Python dependencies
├── README.md                       # Dokumentasi
├── templates/
│   └── index.html                  # Template HTML utama
├── static/
│   ├── style.css                   # Custom CSS
│   └── script.js                   # JavaScript functionality
├── model_penjualan_lstm.h5         # Model LSTM (harus ada)
├── scaler_penjualan.pkl            # Scaler (harus ada)
└── dataset_penjualan.csv           # Dataset penjualan (harus ada)
```

## 🔧 Konfigurasi

### Model Configuration
- **Timesteps**: 60 hari (dapat diubah di `app.py`)
- **Normalisasi**: MinMaxScaler (0,1)
- **Architecture**: LSTM dengan 2 layer LSTM + Dense layers

### Server Configuration
- **Host**: 0.0.0.0 (accessible from all interfaces)
- **Port**: 5000
- **Debug Mode**: Enabled (untuk development)

## 🐛 Troubleshooting

### Error: Model tidak dapat dimuat
- Pastikan file `model_penjualan_lstm.h5` ada di direktori root
- Pastikan model sudah ditraining dengan benar

### Error: Scaler tidak dapat dimuat
- Pastikan file `scaler_penjualan.pkl` ada di direktori root
- Pastikan scaler sudah disimpan dengan benar

### Error: Dataset tidak dapat dimuat
- Pastikan file `dataset_penjualan.csv` ada di direktori root
- Pastikan format CSV sudah benar

### Error: Port sudah digunakan
- Ubah port di `app.py`: `app.run(port=5001)`
- Atau matikan aplikasi lain yang menggunakan port 5000

## 📊 API Endpoints

### GET /
- **Description**: Halaman utama dashboard
- **Response**: HTML page dengan dashboard

### POST /predict
- **Description**: Prediksi penjualan untuk hari berikutnya
- **Response**: JSON dengan hasil prediksi
```json
{
  "success": true,
  "prediction": 1834.56,
  "date": "2024-01-15",
  "last_actual": 1654.32,
  "last_date": "2024-01-14"
}
```

### POST /forecast
- **Description**: Prediksi penjualan untuk beberapa hari
- **Body**: `{"days": 7}`
- **Response**: JSON dengan array prediksi
```json
{
  "success": true,
  "forecasts": [
    {"date": "2024-01-15", "sales": 1834.56},
    {"date": "2024-01-16", "sales": 1923.45}
  ],
  "days": 7
}
```

## 🎨 Customization

### Mengubah Theme
Edit file `static/style.css` untuk mengubah warna dan styling.

### Mengubah Model
Ganti file `model_penjualan_lstm.h5` dengan model LSTM baru yang sudah ditraining.

### Mengubah Dataset
Ganti file `dataset_penjualan.csv` dengan dataset penjualan baru.

## 📝 License

Project ini dibuat untuk keperluan pembelajaran dan demonstrasi model LSTM untuk prediksi penjualan.

## 🤝 Contributing

Silakan fork project ini dan submit pull request untuk perbaikan atau fitur baru.

## 📞 Support

Jika ada masalah atau pertanyaan, silakan buat issue di repository ini.
