import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './VerifyEmailPage.css';

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { otp });
      await refreshUser();
      navigate('/', { replace: true });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMessage('');
    setLoading(true);
    try {
      await api.post('/auth/resend-otp');
      setMessage('OTP sent to your email.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page-center">
        <p>Please log in first.</p>
      </div>
    );
  }

  return (
    <div className="verify-page">
      <div className="verify-card">
        <h2>Verify your Gmail</h2>
        <p className="verify-hint">We sent a 6-digit OTP to your Gmail: <strong>{user.email}</strong>. Check your inbox and enter it below.</p>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            className="otp-input"
            required
          />
          <button type="submit" className="verify-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        <button type="button" onClick={handleResend} className="resend-btn" disabled={loading}>
          Resend OTP
        </button>
        {message && <p className={`verify-msg ${message.includes('sent') ? 'success' : 'error'}`}>{message}</p>}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
