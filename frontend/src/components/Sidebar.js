import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const role = localStorage.getItem('role');
  const menu = [
    { label: 'Dashboard', path: '/dashboard', roles: ['user', 'support', 'admin'] },
    { label: 'Live Chat', path: '/chat', roles: ['user', 'support', 'admin'] },
    { label: 'Help & Support', path: '/help', roles: ['user', 'support', 'admin'] },
    { label: 'Feedback', path: '/feedback', roles: ['user', 'support', 'admin'] },
    { label: 'Admin Panel', path: '/admin', roles: ['admin'] },
    { label: 'Support Board', path: '/staff', roles: ['support'] }
  ];

  return (
    <div className="d-flex flex-column gap-3 p-4 glass-card h-100">
      <div className="d-flex align-items-center gap-2 mb-2">
        <img src="/snx-logo.svg" alt="SNX Support Desk Logo" style={{ height: '40px', width: 'auto' }} />
        <div>
          <h5 className="mb-0 text-white">SNX Support Desk</h5>
          <p className="text-muted small mb-0">Secure ticketing and live agent coordination.</p>
        </div>
      </div>
      <nav className="nav flex-column gap-2">
        {menu.filter((item) => item.roles.includes(role)).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link px-3 py-2 rounded-3 ${isActive ? 'bg-white bg-opacity-10' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
