export default function StatusBadge({ status }) {
  const classes = {
    Open: 'badge bg-primary',
    Assigned: 'badge bg-info',
    'In Progress': 'badge bg-warning text-dark',
    Resolved: 'badge bg-success',
    Closed: 'badge bg-secondary',
    Pending: 'badge bg-muted text-dark',
    Dependent: 'badge bg-danger'
  };

  return <span className={classes[status] || 'badge bg-light text-dark'}>{status}</span>;
}
