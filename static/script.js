// JavaScript untuk aplikasi prediksi penjualan

let salesChart = null;

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const predictBtn = document.getElementById('predictBtn');
    const forecastBtn = document.getElementById('forecastBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const predictionResult = document.getElementById('predictionResult');
    const forecastResult = document.getElementById('forecastResult');
    const predictionContent = document.getElementById('predictionContent');
    const forecastContent = document.getElementById('forecastContent');

    // Single prediction
    predictBtn.addEventListener('click', function() {
        showLoading();
        hideResults();
        
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();
            if (data.success) {
                showPredictionResult(data);
            } else {
                showError(data.error || 'Terjadi kesalahan dalam prediksi');
            }
        })
        .catch(error => {
            hideLoading();
            showError('Error: ' + error.message);
        });
    });

    // Multi-day forecast
    forecastBtn.addEventListener('click', function() {
        const days = document.getElementById('forecastDays').value;
        
        if (!days || days < 1 || days > 30) {
            showError('Masukkan jumlah hari antara 1-30');
            return;
        }
        
        showLoading();
        hideResults();
        
        fetch('/forecast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ days: parseInt(days) })
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();
            if (data.success) {
                showForecastResult(data);
            } else {
                showError(data.error || 'Terjadi kesalahan dalam forecast');
            }
        })
        .catch(error => {
            hideLoading();
            showError('Error: ' + error.message);
        });
    });

    function showLoading() {
        loadingSpinner.style.display = 'block';
        predictBtn.disabled = true;
        forecastBtn.disabled = true;
    }

    function hideLoading() {
        loadingSpinner.style.display = 'none';
        predictBtn.disabled = false;
        forecastBtn.disabled = false;
    }

    function hideResults() {
        predictionResult.style.display = 'none';
        forecastResult.style.display = 'none';
    }

    function showPredictionResult(data) {
        predictionContent.innerHTML = `
            <div class="row">
                <div class="col-6">
                    <strong>Tanggal:</strong><br>
                    ${data.date}
                </div>
                <div class="col-6">
                    <strong>Prediksi:</strong><br>
                    <span class="h4 text-white">$${data.prediction}</span>
                </div>
            </div>
            <hr class="my-3" style="border-color: rgba(255,255,255,0.3);">
            <div class="row">
                <div class="col-6">
                    <small><strong>Data Terakhir:</strong><br>
                    ${data.last_date}</small>
                </div>
                <div class="col-6">
                    <small><strong>Penjualan Terakhir:</strong><br>
                    $${data.last_actual}</small>
                </div>
            </div>
        `;
        predictionResult.style.display = 'block';
    }

    function showForecastResult(data) {
        let forecastHtml = `
            <h6 class="mb-3">
                <i class="fas fa-calendar-week me-2"></i>
                Forecast ${data.days} Hari ke Depan
            </h6>
            <div class="table-responsive">
                <table class="table table-sm text-white">
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Prediksi Penjualan</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        data.forecasts.forEach(forecast => {
            forecastHtml += `
                <tr>
                    <td>${forecast.date}</td>
                    <td><strong>$${forecast.sales}</strong></td>
                </tr>
            `;
        });
        
        forecastHtml += `
                    </tbody>
                </table>
            </div>
            <div class="mt-3">
                <small>
                    <i class="fas fa-info-circle me-1"></i>
                    Rata-rata forecast: $${(data.forecasts.reduce((sum, f) => sum + f.sales, 0) / data.forecasts.length).toFixed(2)}
                </small>
            </div>
        `;
        
        forecastContent.innerHTML = forecastHtml;
        forecastResult.style.display = 'block';
    }

    function showError(message) {
        const errorHtml = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            </div>
        `;
        
        // Show error in prediction result area
        predictionContent.innerHTML = errorHtml;
        predictionResult.style.display = 'block';
    }

    // Auto-format input for forecast days
    document.getElementById('forecastDays').addEventListener('input', function() {
        let value = parseInt(this.value);
        if (value > 30) this.value = 30;
        if (value < 1) this.value = 1;
    });

    // Add some interactive effects
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click effect to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Initialize interactive chart
    initializeChart();
    
    // Chart control buttons
    document.getElementById('zoomIn').addEventListener('click', zoomIn);
    document.getElementById('zoomOut').addEventListener('click', zoomOut);
    document.getElementById('resetZoom').addEventListener('click', resetZoom);
});

function initializeChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    const chartLoading = document.getElementById('chartLoading');
    
    // Show loading
    chartLoading.style.display = 'block';
    
    // Fetch chart data
    fetch('/chart-data')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                createInteractiveChart(ctx, data);
                chartLoading.style.display = 'none';
            } else {
                showChartError(data.error);
            }
        })
        .catch(error => {
            console.error('Error loading chart:', error);
            showChartError('Gagal memuat data chart');
        });
}

function createInteractiveChart(ctx, data) {
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Penjualan Harian ($)',
                data: data.sales,
                borderColor: '#2E86AB',
                backgroundColor: 'rgba(46, 134, 171, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#2E86AB',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#2E86AB',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Data Penjualan 60 Hari Terakhir',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#333'
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#2E86AB',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            return 'Tanggal: ' + context[0].label;
                        },
                        label: function(context) {
                            return 'Penjualan: $' + context.parsed.y.toLocaleString();
                        },
                        afterLabel: function(context) {
                            const value = context.parsed.y;
                            const avg = context.dataset.data.reduce((a, b) => a + b, 0) / context.dataset.data.length;
                            const percentage = ((value - avg) / avg * 100).toFixed(1);
                            return 'vs Rata-rata: ' + (percentage >= 0 ? '+' : '') + percentage + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Tanggal',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        maxTicksLimit: 10,
                        callback: function(value, index, values) {
                            const date = new Date(this.getLabelForValue(value));
                            return date.toLocaleDateString('id-ID', { 
                                month: 'short', 
                                day: 'numeric' 
                            });
                        }
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Penjualan ($)',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            hover: {
                animationDuration: 300
            }
        }
    });
}

function showChartError(message) {
    const chartContainer = document.getElementById('salesChart').parentElement;
    chartContainer.innerHTML = `
        <div class="text-center text-danger">
            <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
            <p>${message}</p>
            <button class="btn btn-primary btn-sm" onclick="location.reload()">
                <i class="fas fa-redo me-2"></i>Coba Lagi
            </button>
        </div>
    `;
}

function updateChart() {
    if (salesChart) {
        fetch('/chart-data')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    salesChart.data.labels = data.labels;
                    salesChart.data.datasets[0].data = data.sales;
                    salesChart.update('active');
                }
            })
            .catch(error => {
                console.error('Error updating chart:', error);
            });
    }
}

// Chart zoom functions
function zoomIn() {
    if (salesChart) {
        const currentRange = salesChart.scales.x.max - salesChart.scales.x.min;
        const newRange = currentRange * 0.8;
        const center = (salesChart.scales.x.max + salesChart.scales.x.min) / 2;
        
        salesChart.options.scales.x.min = Math.max(0, center - newRange / 2);
        salesChart.options.scales.x.max = Math.min(salesChart.data.labels.length - 1, center + newRange / 2);
        salesChart.update();
    }
}

function zoomOut() {
    if (salesChart) {
        const currentRange = salesChart.scales.x.max - salesChart.scales.x.min;
        const newRange = Math.min(currentRange * 1.2, salesChart.data.labels.length - 1);
        const center = (salesChart.scales.x.max + salesChart.scales.x.min) / 2;
        
        salesChart.options.scales.x.min = Math.max(0, center - newRange / 2);
        salesChart.options.scales.x.max = Math.min(salesChart.data.labels.length - 1, center + newRange / 2);
        salesChart.update();
    }
}

function resetZoom() {
    if (salesChart) {
        salesChart.options.scales.x.min = undefined;
        salesChart.options.scales.x.max = undefined;
        salesChart.update();
    }
}
