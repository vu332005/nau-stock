import { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import { useDashboard } from '../../hooks/useDashboard';

export function DistributionChart() {
  const { rawData } = useDashboard();
  const [period, setPeriod] = useState('3m');
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const bucketData = useMemo(() => {
    const key = period === '3m' ? 'return_3m' : 'return_6m';
    const values = rawData.map(t => t[key] * 100).filter(v => !isNaN(v));

    const buckets = [
      { label: '< -30%', min: -Infinity, max: -30, count: 0 },
      { label: '-30% đến -15%', min: -30, max: -15, count: 0 },
      { label: '-15% đến 0%', min: -15, max: 0, count: 0 },
      { label: '0% đến 15%', min: 0, max: 15, count: 0 },
      { label: '15% đến 30%', min: 15, max: 30, count: 0 },
      { label: '> 30%', min: 30, max: Infinity, count: 0 }
    ];

    values.forEach(v => {
      for (let b of buckets) {
        if (v >= b.min && v < b.max) {
          b.count++;
          break;
        }
      }
    });

    return buckets;
  }, [rawData, period]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: bucketData.map(b => b.label),
        datasets: [{
          label: 'Số lượng cổ phiếu',
          data: bucketData.map(b => b.count),
          backgroundColor: [
            'rgba(244, 63, 94, 0.7)',
            'rgba(244, 63, 94, 0.45)',
            'rgba(244, 63, 94, 0.25)',
            'rgba(16, 185, 129, 0.25)',
            'rgba(16, 185, 129, 0.5)',
            'rgba(16, 185, 129, 0.75)'
          ],
          borderColor: [
            '#f43f5e', '#f43f5e', '#f43f5e', '#10b981', '#10b981', '#10b981'
          ],
          borderWidth: 1.5,
          borderRadius: 6,
          barThickness: 28
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0c1224',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { stepSize: 5 }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [bucketData]);

  return (
    <div className="chart-card glass-panel">
      <div className="chart-header">
        <div className="chart-title-group">
          <h3>Phân Bổ Hiệu Suất</h3>
          <p>Số lượng cổ phiếu chia theo tỷ suất sinh lời.</p>
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

export default DistributionChart;
