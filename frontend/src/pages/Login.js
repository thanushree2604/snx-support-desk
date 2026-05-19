import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      return alert('Please complete both fields.');
    }

    setLoading(true);
    try {
      const response = await API.post('/auth/login', { email: email.trim().toLowerCase(), password: password.trim() });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('name', user.name);

      const route = user.role === 'admin' ? '/admin' : user.role === 'support' ? '/staff' : '/dashboard';
      navigate(route);
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed.');
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
          <h1>SNX Support Desk</h1>
          <p className="text-muted">Smart IT Service Management Platform</p>
        </div>

        <form className="login-form" onSubmit={login}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control form-control-lg bg-dark text-white border-0"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control form-control-lg bg-dark text-white border-0"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check text-white-50">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
            </div>
            <div>
              <Link className="text-info" to="/forgot">Forgot password?</Link>
            </div>
          </div>

          <button className="btn btn-primary btn-lg w-100" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="text-center mt-3">
            <Link className="text-info" to="/register">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}