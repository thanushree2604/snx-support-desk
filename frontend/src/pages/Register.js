import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (event) => {
    event.preventDefault();
    if (!name || !email || !password) {
      return alert('Please complete all fields.');
    }

    setLoading(true);
    try {
      await API.post('/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        role
      });
      alert('Registration complete. Please sign in.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background"></div>
      <div className="login-frame glass-card shadow-lg">
        <div className="login-brand text-center mb-4">
          <img src="/snx-logo.svg" alt="SNX Support Desk Logo" style={{ height: '80px', width: 'auto', marginBottom: '20px' }} />
          <h1>Join SNX Support Desk</h1>
          <p className="text-muted">Smart IT Service Management Platform — register and start tracking tickets instantly.</p>
        </div>

        <form className="login-form" onSubmit={register}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control form-control-lg bg-dark text-white border-0"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control form-control-lg bg-dark text-white border-0"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select form-select-lg bg-dark text-white border-0"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="support">Support</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              className="form-control form-control-lg bg-dark text-white border-0"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
            />
          </div>
          <button className="btn btn-outline-light btn-lg w-100" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <div className="text-center mt-4">
            <small className="text-muted">
              Already registered? <Link className="text-info" to="/login">Sign in</Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}
