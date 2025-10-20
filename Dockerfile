FROM python:3.12-slim

# Pastikan log tampil langsung dan tidak membuat .pyc
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instal dependensi terlebih dahulu (layer cache)
COPY requirements.txt ./
RUN pip install --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r requirements.txt

# Salin source code
COPY . .

# Koyeb menyediakan PORT; default ke 8080
ENV PORT=8080
EXPOSE 8080

# Jalankan via gunicorn (app adalah objek Flask di app.py)
CMD ["gunicorn", "--workers", "2", "--threads", "4", "--timeout", "120", "--bind", "0.0.0.0:${PORT}", "app:app"]


