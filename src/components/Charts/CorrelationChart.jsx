import { useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import { useDashboard } from '../../hooks/useDashboard';

export function CorrelationChart() {
  const { rawData } = useDashboard();
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const scatterData = useMemo(() => {
    return rawData.map(t => ({
      x: t.return_3m * 100,
      y: t.return_6m * 100,
      ticker: t.ticker
    }));
  }, [rawData]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const backgroundColors = scatterData.map(pt => {
      if (pt.x > 0 && pt.y > 0) return 'rgba(16, 185, 129, 0.6)'; // Emerald
      if (pt.x < 0 && pt.y < 0) return 'rgba(244, 63, 94, 0.6)';  // Rose
      return 'rgba(99, 102, 241, 0.6)'; // Indigo
    });

    const borderColors = scatterData.map(pt => {
      if (pt.x > 0 && pt.y > 0) return '#10b981';
      if (pt.x < 0 && pt.y < 0) return '#f43f5e';
      return '#6366f1';
    });

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

    chartInstanceRef.current = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Cổ phiếu',
          data: scatterData,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
          pointRadius: 6,
          pointHoverRadius: 9,
          pointHoverBorderWidth: 2,
          pointHoverBackgroundColor: '#fff'
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
            borderWidth: 1,
            titleColor: '#fff',
            bodyColor: '#fff',
            callbacks: {
              title: function(context) {
                const pt = context[0].raw;
                return `Cổ phiếu: ${pt.ticker}`;
              },
              label: function(context) {
                const pt = context.raw;
                return [
                  `Biến động 3M: ${pt.x > 0 ? '+' : ''}${pt.x.toFixed(2)}%`,
                  `Biến động 6M: ${pt.y > 0 ? '+' : ''}${pt.y.toFixed(2)}%`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Biến động 3 Tháng (%)',
              font: { weight: '600' }
            },
            grid: { color: 'rgba(255,255,255,0.04)' }
          },
          y: {
            title: {
              display: true,
              text: 'Biến động 6 Tháng (%)',
              font: { weight: '600' }
            },
            grid: { color: 'rgba(255,255,255,0.04)' }
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
  }, [scatterData]);

  return (
    <div className="chart-card glass-panel col-span-3">
      <div className="chart-header">
        <div className="chart-title-group">
          <h3>Tương Quan Biến Động 3M vs 6M</h3>
          <p>Phân tích xu hướng đồng thuận và ngược chiều của dòng tiền giữa ngắn hạn và trung hạn.</p>
        </div>
      </div>
      <div className="chart-container scatter-chart-container">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default CorrelationChart;
