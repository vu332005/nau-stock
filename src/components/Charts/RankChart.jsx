import { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import { useDashboard } from '../../hooks/useDashboard';

export function RankChart() {
  const { rawData } = useDashboard();
  const [period, setPeriod] = useState('3m');
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Prepare chart data based on period
  const chartData = useMemo(() => {
    const key = period === '3m' ? 'return_3m' : 'return_6m';
    const sorted = [...rawData]
      .filter(t => t[key] !== null && t[key] !== undefined)
      .sort((a, b) => b[key] - a[key]);

    const top10 = sorted.slice(0, 10);
    const bottom10 = sorted.slice(-10).reverse(); // deepest losses first

    const labels = [...top10.map(t => t.ticker), ...bottom10.map(t => t.ticker)];
    const values = [...top10.map(t => t[key] * 100), ...bottom10.map(t => t[key] * 100)];

    const backgroundColors = [
      ...top10.map(() => 'rgba(16, 185, 129, 0.75)'), // Green
      ...bottom10.map(() => 'rgba(244, 63, 94, 0.75)') // Red
    ];

    const borderColors = [
      ...top10.map(() => '#10b981'),
      ...bottom10.map(() => '#f43f5e')
    ];

    return { labels, values, backgroundColors, borderColors };
  }, [rawData, period]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    
    // Destroy existing chart instance if exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: 'Tỷ suất lợi nhuận (%)',
          data: chartData.values,
          backgroundColor: chartData.backgroundColors,
          borderColor: chartData.borderColors,
          borderWidth: 1.5,
          borderRadius: 6,
          barThickness: 14
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0c1224',
            titleColor: '#fff',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                return `Hiệu suất: ${context.parsed.x > 0 ? '+' : ''}${context.parsed.x.toFixed(2)}%`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              callback: value => `${value}%`
            }
          },
          y: {
            grid: { display: false }
          }
        }
      }
    });

    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [chartData]);

  return (
    <div className="chart-card glass-panel col-span-2">
      <div className="chart-header">
        <div className="chart-title-group">
          <h3>Hiệu suất Top Đầu & Cuối</h3>
          <p>Xếp hạng 10 mã tăng giá mạnh nhất và 10 mã giảm giá sâu nhất.</p>
        </div>
        <div className="tab-group">
          <button 
            className={`tab-btn ${period === '3m' ? 'active' : ''}`}
            onClick={() => setPeriod('3m')}
          >
            3 Tháng
          </button>
          <button 
            className={`tab-btn ${period === '6m' ? 'active' : ''}`}
            onClick={() => setPeriod('6m')}
          >
            6 Tháng
          </button>
        </div>
      </div>
      <div className="chart-container">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default RankChart;
