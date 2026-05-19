export default function RoleBadge({ role }) {
  const label = role ? role.toLowerCase() : 'guest';
  const formattedRole = label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <span className="badge bg-secondary ms-2" style={{ fontSize: '0.85rem' }}>
      {formattedRole}
    </span>
  );
}
