import RankChart from './RankChart';
import DistributionChart from './DistributionChart';
import CorrelationChart from './CorrelationChart';

export function ChartSection() {
  return (
    <section className="charts-section" id="charts-section">
      <RankChart />
      <DistributionChart />
      <CorrelationChart />
    </section>
  );
}

export default ChartSection;
