import { useMemo } from 'react';
import { X } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { formatPercent, getRank3m, getRank6m, getTrendDetails } from '../../utils/format';

export function TickerModal() {
  const { 
    rawData, 
    selectedTicker, 
    isModalOpen, 
    closeTickerModal 
  } = useDashboard();

  // Find the selected stock details
  const item = useMemo(() => {
    if (!selectedTicker) return null;
    return rawData.find(t => t.ticker === selectedTicker);
  }, [rawData, selectedTicker]);

  // Compute rankings and trend details
  const modalInfo = useMemo(() => {
    if (!item) return null;

    const rank3m = getRank3m(rawData, item.ticker);
    const rank6m = getRank6m(rawData, item.ticker);
    const trend = getTrendDetails(item);

    // Style progress bars
    const maxAbsReturn = 2.30; // Max absolute return in 6m (THD is 2.30)
    const pct3m = Math.min(100, Math.max(0, (Math.abs(item.return_3m) / maxAbsReturn) * 100));
    const pct6m = Math.min(100, Math.max(0, (Math.abs(item.return_6m) / maxAbsReturn) * 100));

    const color3m = item.return_3m >= 0 ? "var(--color-up)" : "var(--color-down)";
    const color6m = item.return_6m >= 0 ? "var(--color-up)" : "var(--color-down)";

    return {
      rank3m,
      rank6m,
      trend,
      pct3m,
      pct6m,
      color3m,
      color6m
    };
  }, [rawData, item]);

  if (!item || !modalInfo) return null;

  const r3mClass = item.return_3m >= 0 ? "text-up" : "text-down";
  const r6mClass = item.return_6m >= 0 ? "text-up" : "text-down";

  const handleDetailedAnalysis = () => {
    closeTickerModal();
    // Scroll to scatter plot and highlight it
    const element = document.getElementById("charts-section");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`modal ${isModalOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && closeTickerModal()}>
      <div className="modal-content glass-panel animated-scale">
        <div className="modal-header">
          <div className="modal-ticker-title">
            <h2 id="modal-ticker-symbol">{item.ticker}</h2>
            <span className={`badge badge-lg ${modalInfo.trend.modalBadgeClass}`} id="modal-ticker-trend">
              {modalInfo.trend.modalBadgeText}
            </span>
          </div>
          <button className="btn-close" id="modal-close-btn" onClick={closeTickerModal}>
            <X size={16} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="performance-compare-cards">
            {/* 3 Months Performance */}
            <div className="compare-card">
              <span className="compare-label">Lợi nhuận 3 Tháng</span>
              <div className={`compare-value ${r3mClass}`} id="modal-3m-val">
                {formatPercent(item.return_3m, true)}
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  id="modal-3m-bar" 
                  style={{ width: `${modalInfo.pct3m}%`, backgroundColor: modalInfo.color3m }}
                ></div>
              </div>
            </div>
            
            {/* 6 Months Performance */}
            <div className="compare-card">
              <span className="compare-label">Lợi nhuận 6 Tháng</span>
              <div className={`compare-value ${r6mClass}`} id="modal-6m-val">
                {formatPercent(item.return_6m, true)}
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  id="modal-6m-bar" 
                  style={{ width: `${modalInfo.pct6m}%`, backgroundColor: modalInfo.color6m }}
                ></div>
              </div>
            </div>
          </div>

          <div className="modal-analysis-section">
            <h4>Đánh giá kỹ thuật sơ bộ</h4>
            <p id="modal-analysis-text">
              {modalInfo.trend.analysisText}
            </p>
          </div>

          <div className="modal-stats-table">
            <div className="stat-row">
              <span>Xếp hạng hiệu suất 3M</span>
              <strong id="modal-rank-3m">#{modalInfo.rank3m} / {rawData.length}</strong>
            </div>
            <div className="stat-row">
              <span>Xếp hạng hiệu suất 6M</span>
              <strong id="modal-rank-6m">#{modalInfo.rank6m} / {rawData.length}</strong>
            </div>
            <div className="stat-row">
              <span>Độ biến động tương quan</span>
              <strong id="modal-correlation-type">{modalInfo.trend.correlationType}</strong>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-outline" id="modal-cancel-btn" onClick={closeTickerModal}>
            Đóng
          </button>
          <button className="btn btn-primary" id="modal-view-chart-btn" onClick={handleDetailedAnalysis}>
            Phân Tích Chi Tiết
          </button>
        </div>
      </div>
    </div>
  );
}

export default TickerModal;
