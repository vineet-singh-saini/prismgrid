function StatCard({ title, value, change, tone = "neutral" }) {
  return (
    <div className={`stat-card stat-card-${tone}`}>
      <span>{title}</span>
      <h3>{value}</h3>
      <p>{change}</p>
    </div>
  );
}

export default StatCard;
