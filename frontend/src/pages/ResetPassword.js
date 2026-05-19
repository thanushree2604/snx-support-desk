import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const submit = async (event) => {
    event.preventDefault();
    if (!password || !confirm) return alert('Enter and confirm a new password.');
    if (password !== confirm) return alert('Passwords do not match.');
    if (!token) return alert('Reset token missing.');

    setLoading(true);
    try {
      await API.post('/auth/reset', { token, password: password.trim() });
      alert('Password reset successful. Please sign in.');
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background"></div>
      <div className="login-frame glass-card shadow-lg">
        <div className="login-brand text-center mb-4">
          <h1>Choose a new password</h1>
          <p className="text-muted">Reset token is required to update your account.</p>
        </div>

        <form className="login-form" onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">New password</label>
            <input
              type="password"
              className="form-control form-control-lg bg-dark text-white border-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm password</label>
            <input
              type="password"
              className="form-control form-control-lg bg-dark text-white border-0"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
          <button className="btn btn-primary btn-lg w-100" disabled={loading}>
            {loading ? 'Resetting…' : 'Reset password'}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link className="text-info" to="/">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
