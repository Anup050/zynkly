import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (_) {
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (serviceId) => {
    setMessage('');
    try {
      const res = await api.delete(`/cart/remove/${serviceId}`);
      setCart(res.data.cart);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not remove.');
    }
  };

  const handleClear = async () => {
    setMessage('');
    try {
      const res = await api.delete('/cart/clear');
      setCart(res.data.cart);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not clear cart.');
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {message && <p className="cart-msg error">{message}</p>}

      {cart.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/services" className="cart-link-btn">Browse Services</Link>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.serviceId} className="cart-item">
                <span className="cart-item-name">{item.name}</span>
                <button
                  type="button"
                  className="cart-remove-btn"
                  onClick={() => handleRemove(item.serviceId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-footer">
            <button type="button" onClick={handleClear} className="clear-btn">
              Clear Cart
            </button>
            <Link to="/order" className="checkout-btn">Proceed to Order</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
