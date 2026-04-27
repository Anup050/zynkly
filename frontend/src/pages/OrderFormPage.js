import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './OrderFormPage.css';

const OrderFormPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    roomNumber: '',
    pgName: '',
    mobileNumber: user?.mobileNumber || '',
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get('/cart');
        setCart(res.data);
      } catch (_) {
        setCart([]);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      customerName: user?.name || prev.customerName,
      mobileNumber: user?.mobileNumber || prev.mobileNumber,
    }));
  }, [user?.name, user?.mobileNumber]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setMessage('Your cart is empty. Add services first.');
      return;
    }
    setMessage('');
    setLoading(true);
    try {
      const services = cart.map((item) => ({ serviceId: item.serviceId, name: item.name }));
      await api.post('/orders', { ...formData, services });
      setMessage('Order placed! You will receive a confirmation email.');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !message) {
    return (
      <div className="order-form-page">
        <p className="order-msg error">Your cart is empty. <a href="/services">Add services</a> first.</p>
      </div>
    );
  }

  return (
    <div className="order-form-page">
      <h1>Place Cleaning Request</h1>

      <div className="order-summary">
        <h3>Services in cart</h3>
        <ul>
          {cart.map((item) => (
            <li key={item.serviceId}>{item.name}</li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label htmlFor="customerName">Name</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="roomNumber">Room Number</label>
          <input
            type="text"
            id="roomNumber"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="pgName">PG Name</label>
          <input
            type="text"
            id="pgName"
            name="pgName"
            value={formData.pgName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>
        {message && (
          <p className={`order-msg ${message.includes('placed') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        <button type="submit" className="submit-order-btn" disabled={loading}>
          {loading ? 'Placing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default OrderFormPage;
