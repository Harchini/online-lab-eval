import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(regNo, password);
      navigate('/questions');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="glass-bg-animated"></div>
      <div className="login-card glass">
        <div className="login-header">
          <div className="login-icon">🎓</div>
          <h1>Student Portal</h1>
          <p>Login with your Register Number</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="regNo">Register Number</label>
            <input
              id="regNo"
              type="text"
              placeholder="e.g. 22CS001"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="back-link">
          <a href="http://localhost:5000">← Back to Home</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
