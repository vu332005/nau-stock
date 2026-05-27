export function KPICard({ 
  glowClass, 
  iconBgClass, 
  Icon, 
  label, 
  value, 
  valueClass = "", 
  children 
}) {
  return (
    <div className={`kpi-card ${glowClass}`}>
      <div className={`kpi-icon-wrapper ${iconBgClass}`}>
        <Icon />
      </div>
      <div className="kpi-info">
        <span className="kpi-label">{label}</span>
        <div className={`kpi-value ${valueClass}`}>{value}</div>
        {children}
      </div>
    </div>
  );
}

export default KPICard;
