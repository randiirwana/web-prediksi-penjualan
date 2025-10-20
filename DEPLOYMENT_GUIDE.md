# 🚀 PANDUAN DEPLOY KE RAILWAY

## 📋 Persiapan File Deployment

Semua file yang diperlukan sudah dibuat:
- ✅ `Procfile` - Konfigurasi startup Railway
- ✅ `railway.json` - Konfigurasi deployment Railway  
- ✅ `requirements.txt` - Dependencies dengan gunicorn
- ✅ `app.py` - Updated untuk production environment
- ✅ `.gitignore` - File yang diabaikan Git

## 🔧 Langkah-langkah Deploy ke Railway

### 1. **Persiapan Git Repository**

```bash
# Inisialisasi Git repository (jika belum)
git init

# Tambahkan semua file ke Git
git add .

# Commit perubahan
git commit -m "Initial commit for Railway deployment"

# Buat repository di GitHub (opsional)
# Push ke GitHub jika ingin backup
```

### 2. **Setup Railway Account**

1. **Daftar di Railway:**
   - Buka [railway.app](https://railway.app)
   - Klik "Sign Up" dan daftar dengan GitHub/GitLab/Email

2. **Install Railway CLI (Opsional):**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

### 3. **Deploy via Railway Dashboard**

#### **Metode 1: GitHub Integration (Recommended)**

1. **Push ke GitHub:**
   ```bash
   # Buat repository di GitHub
   git remote add origin https://github.com/username/repo-name.git
   git push -u origin main
   ```

2. **Connect di Railway:**
   - Login ke Railway dashboard
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository Anda
   - Railway akan otomatis detect Python dan deploy

#### **Metode 2: Railway CLI**

```bash
# Login ke Railway
railway login

# Deploy langsung dari folder
railway deploy

# Atau buat project baru
railway new
railway up
```

### 4. **Konfigurasi Environment Variables**

Di Railway dashboard, tambahkan environment variables:

```
FLASK_ENV=production
PORT=5000
```

### 5. **Upload Model Files**

**PENTING:** Model files harus diupload ke Railway:

1. **Via Railway Dashboard:**
   - Upload `model_penjualan_lstm.h5`
   - Upload `scaler_penjualan.pkl` 
   - Upload `dataset_penjualan.csv`

2. **Via Git (Recommended):**
   ```bash
   # Pastikan file model ada di repository
   git add model_penjualan_lstm.h5 scaler_penjualan.pkl dataset_penjualan.csv
   git commit -m "Add model files"
   git push
   ```

## 🔍 Troubleshooting

### **Error: Model tidak ditemukan**
```bash
# Pastikan file model ada di root directory
ls -la *.h5 *.pkl *.csv
```

### **Error: Port binding**
```python
# Pastikan app.py menggunakan PORT environment variable
port = int(os.environ.get('PORT', 5000))
```

### **Error: Dependencies**
```bash
# Pastikan requirements.txt lengkap
pip install -r requirements.txt
```

### **Error: Memory limit**
```python
# Tambahkan di railway.json untuk memory lebih besar
{
  "deploy": {
    "memory": "1GB"
  }
}
```

## 📊 Monitoring Deployment

### **Railway Dashboard:**
- **Logs**: Monitor aplikasi logs
- **Metrics**: CPU, Memory usage
- **Deployments**: Status deployment

### **Health Check:**
- URL: `https://your-app.railway.app/status`
- Response: JSON dengan status model dan dataset

## 🌐 Akses Aplikasi

Setelah deploy berhasil:
- **URL**: `https://your-app-name.railway.app`
- **Status**: `https://your-app-name.railway.app/status`
- **Chart Data**: `https://your-app-name.railway.app/chart-data`

## 💡 Tips Optimasi

### **1. Performance:**
```python
# Tambahkan caching untuk model loading
from functools import lru_cache

@lru_cache(maxsize=1)
def load_model():
    return load_model('model_penjualan_lstm.h5')
```

### **2. Error Handling:**
```python
# Tambahkan error page
@app.errorhandler(500)
def internal_error(error):
    return render_template('error.html'), 500
```

### **3. Security:**
```python
# Tambahkan CORS jika diperlukan
from flask_cors import CORS
CORS(app)
```

## 🎯 Checklist Deployment

- [ ] File `Procfile` ada
- [ ] File `railway.json` ada  
- [ ] File `requirements.txt` lengkap
- [ ] File `app.py` menggunakan PORT environment variable
- [ ] File model (`.h5`, `.pkl`, `.csv`) ada di repository
- [ ] Git repository sudah di-push
- [ ] Railway project sudah dibuat
- [ ] Environment variables sudah diset
- [ ] Deployment berhasil
- [ ] Aplikasi bisa diakses via URL

## 🚀 Setelah Deploy Berhasil

1. **Test aplikasi:**
   - Buka URL Railway
   - Test prediksi single day
   - Test multi-day forecast
   - Test chart interaktif

2. **Share aplikasi:**
   - URL bisa dibagikan ke siapa saja
   - Aplikasi akan online 24/7
   - Otomatis update saat push ke GitHub

**Selamat! Aplikasi prediksi penjualan LSTM Anda sudah online di Railway!** 🎉
