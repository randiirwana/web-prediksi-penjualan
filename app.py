from flask import Flask, render_template, request, jsonify
import numpy as np
import pandas as pd
import joblib
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import base64
import io
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)

# Load model dan scaler
try:
    model = load_model('model_penjualan_lstm.h5')
    scaler = joblib.load('scaler_penjualan.pkl')
    print("✅ Model dan scaler berhasil dimuat!")
except Exception as e:
    print(f"❌ Error loading model/scaler: {e}")
    model = None
    scaler = None

# Load dataset untuk mendapatkan data terbaru
try:
    df = pd.read_csv('dataset_penjualan.csv')
    df['Order Date'] = pd.to_datetime(df['Order Date'], format='mixed', dayfirst=True)
    df_daily = df.groupby('Order Date')['Sales'].sum().reset_index()
    df_daily.set_index('Order Date', inplace=True)
    df_daily = df_daily.sort_index()
    print("✅ Dataset berhasil dimuat!")
except Exception as e:
    print(f"❌ Error loading dataset: {e}")
    df_daily = None

@app.route('/')
def index():
    """Halaman utama aplikasi"""
    if df_daily is not None:
        # Statistik data
        stats = {
            'total_days': len(df_daily),
            'avg_sales': round(df_daily['Sales'].mean(), 2),
            'max_sales': round(df_daily['Sales'].max(), 2),
            'min_sales': round(df_daily['Sales'].min(), 2),
            'start_date': df_daily.index.min().strftime('%Y-%m-%d'),
            'end_date': df_daily.index.max().strftime('%Y-%m-%d')
        }
        
        # Data terbaru (60 hari terakhir)
        recent_data = df_daily.tail(60)
        
        # Siapkan data untuk chart interaktif
        chart_data = {
            'labels': recent_data.index.strftime('%Y-%m-%d').tolist(),
            'sales': recent_data['Sales'].tolist()
        }
        
        return render_template('index.html', stats=stats, chart_data=chart_data)
    else:
        return render_template('index.html', error="Dataset tidak dapat dimuat")

@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint untuk prediksi penjualan"""
    try:
        if model is None or scaler is None:
            return jsonify({'error': 'Model belum dimuat'})
        
        # Ambil data terbaru (60 hari terakhir)
        recent_data = df_daily.tail(60)
        recent_scaled = scaler.transform(recent_data[['Sales']])
        
        # Reshape untuk LSTM
        X_pred = recent_scaled.reshape(1, 60, 1)
        
        # Prediksi
        prediction_scaled = model.predict(X_pred)
        prediction = scaler.inverse_transform(prediction_scaled)
        
        # Tanggal prediksi
        last_date = df_daily.index.max()
        pred_date = last_date + timedelta(days=1)
        
        return jsonify({
            'success': True,
            'prediction': round(float(prediction[0][0]), 2),
            'date': pred_date.strftime('%Y-%m-%d'),
            'last_actual': round(float(recent_data['Sales'].iloc[-1]), 2),
            'last_date': last_date.strftime('%Y-%m-%d')
        })
        
    except Exception as e:
        return jsonify({'error': f'Error dalam prediksi: {str(e)}'})

@app.route('/forecast', methods=['POST'])
def forecast():
    """Endpoint untuk forecast beberapa hari ke depan"""
    try:
        if model is None or scaler is None:
            return jsonify({'error': 'Model belum dimuat'})
        
        days = int(request.json.get('days', 7))  # Default 7 hari
        if days > 30:
            days = 30  # Maksimal 30 hari
        
        # Ambil data terbaru
        recent_data = df_daily.tail(60)
        recent_scaled = scaler.transform(recent_data[['Sales']])
        
        forecasts = []
        current_data = recent_scaled.copy()
        
        for i in range(days):
            # Prediksi hari berikutnya
            X_pred = current_data.reshape(1, 60, 1)
            pred_scaled = model.predict(X_pred)
            pred_actual = scaler.inverse_transform(pred_scaled)
            
            # Update data untuk prediksi berikutnya
            current_data = np.append(current_data[1:], pred_scaled, axis=0)
            
            # Tanggal prediksi
            pred_date = df_daily.index.max() + timedelta(days=i+1)
            
            forecasts.append({
                'date': pred_date.strftime('%Y-%m-%d'),
                'sales': round(float(pred_actual[0][0]), 2)
            })
        
        return jsonify({
            'success': True,
            'forecasts': forecasts,
            'days': days
        })
        
    except Exception as e:
        return jsonify({'error': f'Error dalam forecast: {str(e)}'})

@app.route('/chart-data')
def get_chart_data():
    """Endpoint untuk mendapatkan data chart"""
    try:
        if df_daily is None:
            return jsonify({'error': 'Dataset tidak tersedia'})
        
        # Data terbaru (60 hari terakhir)
        recent_data = df_daily.tail(60)
        
        # Siapkan data untuk chart interaktif
        chart_data = {
            'labels': recent_data.index.strftime('%Y-%m-%d').tolist(),
            'sales': recent_data['Sales'].tolist(),
            'success': True
        }
        
        return jsonify(chart_data)
    except Exception as e:
        return jsonify({'error': f'Error loading chart data: {str(e)}'})

if __name__ == '__main__':
    import os
    
    # Production settings untuk Railway
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    
    print("🚀 Starting Flask application...")
    print(f"📱 Aplikasi akan berjalan di port: {port}")
    print(f"🔧 Debug mode: {debug}")
    print("📊 Status endpoint: /status")
    print("🔄 Reload endpoint: /reload")
    
    app.run(debug=debug, host='0.0.0.0', port=port)
