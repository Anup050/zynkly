import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
    if (isOpen) {
      setLoading(true);
      fetchCart();
    }
  }, [isOpen]);

  const handleRemove = async (serviceId) => {
    setMessage('');
    try {
      const res = await api.delete(`/cart/remove/${serviceId}`);
      setCart(res.data.cart);
    } catch (err) {
      setMessage('Could not remove.');
    }
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h2>Shopping Cart</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="cart-drawer-content">
          {loading ? (
            <p className="cart-msg">Loading...</p>
          ) : cart.length === 0 ? (
            <div className="cart-empty-state">
              <p>Your cart is empty</p>
              <button className="continue-shopping-btn" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {message && <p className="cart-msg error">{message}</p>}
              <ul className="drawer-cart-list">
                {cart.map((item) => (
                  <li key={item.serviceId} className="drawer-cart-item">
                    <span className="cart-item-name">{item.name}</span>
                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => handleRemove(item.serviceId)}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
              <div className="drawer-cart-footer">
                <Link to="/order" className="checkout-btn" onClick={onClose}>
                  Proceed to Order
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
