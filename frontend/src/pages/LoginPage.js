import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, login, refreshUser } = useAuth();
  const error = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setMessage('Please enter your email.');
      return;
    }
    setMessage('');
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { email: trimmed });
      setMessage('OTP sent! Check your email.');
      setEmailSent(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setMessage('Please enter the OTP.');
      return;
    }
    setMessage('');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email: email.trim(), otp: otp.trim() });
      setMessage(res.data.message || 'Verified!');
      await refreshUser();
      navigate('/', { replace: true });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setMessage('');
    setLoading(true);
    try {
      await api.post('/auth/resend-otp', { email: email.trim() });
      setMessage('OTP sent again. Check your email.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to resend.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="page-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Enter your details to access your account.</p>
        {error && (
          <p className="login-error">
            {decodeURIComponent(error.replace(/\+/g, ' '))}
          </p>
        )}
        {message && (
          <p className={`login-msg ${message.includes('sent') || message.includes('Verified') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}

        {!emailSent ? (
          <>
            <form onSubmit={handleSendOtp} className="auth-form">
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Login via OTP'}
              </button>
            </form>
            <div className="divider-container">
              <span className="divider-text">Or continue with</span>
            </div>
            <button type="button" onClick={login} className="google-btn">
              <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" />
              Sign in with Google
            </button>
          </>
        ) : (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <p className="otp-hint">We sent a 6-digit OTP to <strong>{email}</strong></p>
            <div className="input-group">
              <label>Enter OTP</label>
              <input
                type="text"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="auth-input otp-input"
                required
              />
            </div>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Log in'}
            </button>
            <div className="otp-actions">
              <button type="button" onClick={handleResendOtp} className="text-btn" disabled={loading}>
                Resend OTP
              </button>
              <button type="button" onClick={() => { setEmailSent(false); setOtp(''); setMessage(''); }} className="text-btn">
                Change Email
              </button>
            </div>
          </form>
        )}

        <p className="switch-auth">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
        {user && !user.isVerified && !emailSent && (
          <p className="hint">Please verify your email to continue.</p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
