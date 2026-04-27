import React, { useState, useEffect } from 'react';
import api from '../api';
import './ServicesPage.css';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        setServices(res.data);
      } catch (_) {
        setMessage('Failed to load services.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleAddToCart = async (serviceId, name) => {
    setMessage('');
    try {
      await api.post('/cart/add', { serviceId, name });
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not add to cart.');
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div className="services-page">
      <h1>Cleaning Services</h1>
      <p className="services-intro">Choose a service and add it to your cart. No prices shown.</p>
      {message && <p className={`services-msg ${message.includes('Added') ? 'success' : 'error'}`}>{message}</p>}

      <div className="service-grid">
        {services.map((service) => (
          <div key={service._id} className="service-card">
            {service.imageUrl && (
              <img src={service.imageUrl} alt={service.name} className="service-image" />
            )}
            {!service.imageUrl && (
              <div className="service-image-placeholder">🧹</div>
            )}
            <div className="service-body">
              <h3>{service.name}</h3>
              <p className="service-desc">{service.description}</p>
              {service.duration && (
                <p className="service-duration">Duration: {service.duration}</p>
              )}
              <div className="service-actions">
                <button
                  type="button"
                  className="add-cart-btn"
                  onClick={() => handleAddToCart(service._id, service.name)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && !loading && (
        <p className="no-services">No services available yet.</p>
      )}
    </div>
  );
};

export default ServicesPage;
