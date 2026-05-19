import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (!email) return alert('Enter your email address.');

    setLoading(true);
    try {
      await API.post('/auth/forgot', { email: email.trim().toLowerCase() });
      alert('If the email exists, reset instructions have been sent.');
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to process reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background"></div>
      <div className="login-frame glass-card shadow-lg">
        <div className="login-brand text-center mb-4">
          <h1>Reset password</h1>
          <p className="text-muted">Enter your email and we will send a reset link.</p>
        </div>

        <form className="login-form" onSubmit={submit}>
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
          <button className="btn btn-primary btn-lg w-100" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link className="text-info" to="/">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
