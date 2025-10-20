# Deployment Guide

## Railway Deployment

### Langkah-langkah Deploy ke Railway:

1. **Persiapan Repository**
   - Pastikan semua file model (`.h5`, `.pkl`, `.csv`) ada di repo
   - File `requirements.txt` sudah sesuai
   - File `Procfile` sudah benar

2. **Konfigurasi Railway**
   - Buat project baru di Railway
   - Connect ke GitHub repository
   - Set builder ke NIXPACKS (bukan Dockerfile)
   - Set variables: `PYTHON_VERSION=3.12.6`

3. **Deploy**
   - Railway akan otomatis build dan deploy
   - Cek logs untuk memastikan aplikasi berjalan
   - Test endpoint `/health` untuk healthcheck

### Troubleshooting:

- **Build gagal**: Pastikan Python 3.12 dan dependencies kompatibel
- **Healthcheck gagal**: Cek apakah aplikasi listen di port yang benar
- **Model tidak load**: Pastikan file model ada di repo

### Endpoints:

- `GET /` - Halaman utama
- `GET /health` - Health check
- `POST /predict` - Prediksi penjualan
- `POST /forecast` - Forecast beberapa hari
- `GET /chart-data` - Data untuk chart
