import { useMemo } from 'react';
import { Database, TrendingUp, Award, TrendingDown } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { KPICard } from './KPICard';
import { formatPercent } from '../../utils/format';

export function KPICardsGrid() {
  const { rawData } = useDashboard();

  const stats = useMemo(() => {
    if (!rawData || rawData.length === 0) {
      return {
        total: 0,
        avg3m: 0,
        countUp3m: 0,
        countDown3m: 0,
        avg6m: 0,
        countUp6m: 0,
        countDown6m: 0,
        bestTicker: "N/A",
        bestReturn: 0
      };
    }

    const tickersCount = rawData.length;

    // 3M Averages and Counts
    const returns3m = rawData.map(t => t.return_3m).filter(v => v !== null && v !== undefined);
    const avg3m = returns3m.length > 0 ? returns3m.reduce((a, b) => a + b, 0) / returns3m.length : 0;
    const countUp3m = rawData.filter(t => t.return_3m > 0).length;
    const countDown3m = rawData.filter(t => t.return_3m < 0).length;

    // 6M Averages and Counts
    const returns6m = rawData.map(t => t.return_6m).filter(v => v !== null && v !== undefined);
    const avg6m = returns6m.length > 0 ? returns6m.reduce((a, b) => a + b, 0) / returns6m.length : 0;
    const countUp6m = rawData.filter(t => t.return_6m > 0).length;
    const countDown6m = rawData.filter(t => t.return_6m < 0).length;

    // Top Performer (6M)
    let bestTicker = null;
    let bestReturn = -Infinity;
    rawData.forEach(t => {
      if (t.return_6m !== null && t.return_6m !== undefined && t.return_6m > bestReturn) {
        bestReturn = t.return_6m;
        bestTicker = t.ticker;
      }
    });

    return {
      total: tickersCount,
      avg3m,
      countUp3m,
      countDown3m,
      avg6m,
      countUp6m,
      countDown6m,
      bestTicker,
      bestReturn
    };
  }, [rawData]);

  return (
    <div className="kpi-grid">
      {/* Total Tickers Card */}
      <KPICard
        glowClass="glow-teal"
        iconBgClass="teal-bg"
        Icon={Database}
        label="Tổng số mã"
        value={`${stats.total} mã`}
      >
        <span className="kpi-desc">Danh sách vốn hóa lớn nhất VN</span>
      </KPICard>

      {/* 3M Performance Card */}
      <KPICard
        glowClass="glow-emerald"
        iconBgClass="emerald-bg"
        Icon={TrendingUp}
        label="Hiệu suất TB (3M)"
        value={formatPercent(stats.avg3m, true)}
        valueClass={stats.avg3m >= 0 ? "text-up" : "text-down"}
      >
        <div className="kpi-sub-stats">
          <span className="stat-up">
            <TrendingUp size={12} />
            <span>{stats.countUp3m}</span>
          </span>
          <span className="stat-down">
            <TrendingDown size={12} />
            <span>{stats.countDown3m}</span>
          </span>
        </div>
      </KPICard>

      {/* 6M Performance Card */}
      <KPICard
        glowClass="glow-indigo"
        iconBgClass="indigo-bg"
        Icon={TrendingUp}
        label="Hiệu suất TB (6M)"
        value={formatPercent(stats.avg6m, true)}
        valueClass={stats.avg6m >= 0 ? "text-up" : "text-down"}
      >
        <div className="kpi-sub-stats">
          <span className="stat-up">
            <TrendingUp size={12} />
            <span>{stats.countUp6m}</span>
          </span>
          <span className="stat-down">
            <TrendingDown size={12} />
            <span>{stats.countDown6m}</span>
          </span>
        </div>
      </KPICard>

      {/* Top Performer Card */}
      <KPICard
        glowClass="glow-violet"
        iconBgClass="violet-bg"
        Icon={Award}
        label="Cổ phiếu nổi bật (6M)"
        value=""
      >
        <div className="top-performer">
          <span className="ticker-badge">{stats.bestTicker}</span>
          <span className="return-val text-up">{formatPercent(stats.bestReturn, true)}</span>
        </div>
      </KPICard>
    </div>
  );
}

export default KPICardsGrid;
