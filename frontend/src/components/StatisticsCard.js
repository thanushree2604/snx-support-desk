export default function StatisticsCard({ title, value, icon, accent }) {
  return (
    <div className="glass-card p-4 shadow-sm h-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <small className="text-muted text-uppercase">{title}</small>
          <h3 className={`mt-2 ${accent}`}>{value}</h3>
        </div>
        <div className="text-white bg-primary bg-opacity-20 rounded-3 p-3">{icon}</div>
      </div>
    </div>
  );
}
