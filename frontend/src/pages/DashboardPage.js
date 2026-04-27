import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

const categories = [
  "All Services",
  "Deep Cleaning",
  "Regular Cleaning",
  "Move-in/out",
  "Office Cleaning",
  "Quick Service (15 min)"
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Services");
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        setServices(res.data);
      } catch (_) {
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const handleAddToCart = async (serviceId, name) => {
    setMessage('');
    try {
      await api.post('/cart/add', { serviceId, name });
      setMessage(`Added ${name} to cart!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      if (err.response?.status === 401) {
         setMessage('Please login to add to cart.');
      } else {
         setMessage(err.response?.data?.message || 'Could not add to cart.');
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="home-page">
      <section className="home-hero-full">
        <div className="hero-content">
          <h1>India's 15 Minute House Help Service</h1>
          <p className="hero-subtitle">Your home, professionally cleaned — exactly when you need it</p>
          
          <div className="hero-badge">
            ⚡ On-demand professional cleaners available 24x7
          </div>
          
          <p className="hero-description">
            No more planning around your house help. Our team of verified professionals are always on time.
          </p>
          
          <div className="hero-actions">
            <button className="hero-btn-primary">Book a Service</button>
            <button className="hero-btn-secondary">View Services</button>
          </div>
        </div>
      </section>

      {message && (
        <div className="toast-message">
          {message}
        </div>
      )}

      <section className="home-services">
        <h2 className="section-title">All Our Services</h2>
        {loadingServices ? (
          <p className="loading-text">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="no-services">No services available yet.</p>
        ) : (
          <div className="service-grid">
            {services.map((service) => (
              <div key={service._id} className="service-card">
                <div className="service-image-container">
                  {service.imageUrl ? (
                    <img src={service.imageUrl} alt={service.name} className="service-image" />
                  ) : (
                    <div className="service-image-placeholder">🧹</div>
                  )}
                </div>
                <div className="service-body">
                  <h3>{service.name}</h3>
                  <p className="service-desc">{service.description}</p>
                  
                  <div className="service-footer">
                    <div className="service-meta">
                      <span className="service-price">₹{service.price || 99}</span>
                      {service.duration && (
                        <span className="service-duration">{service.duration}</span>
                      )}
                    </div>
                    <div className="service-actions">
                      <button className="view-details-btn">View Details</button>
                      <button
                        type="button"
                        className="add-cart-btn"
                        onClick={() => handleAddToCart(service._id, service.name)}
                      >
                        🛒 Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Coming Soon Section */}
      <section className="home-section coming-soon-section">
        <div className="section-header">
          <h2>Coming Soon</h2>
          <h3>Quick Services - 15 Minutes</h3>
          <p>Get professional cleaning in just 15 minutes!</p>
        </div>
        <div className="service-grid">
          <div className="quick-service-card">
            <div className="quick-image">
              <img src="https://i.ibb.co/VWyfvGhq/bathroom.jpg" alt="Bathroom Cleaning" />
            </div>
            <h4>Bathroom Cleaning</h4>
            <p>Sanitization, scrubbing, and mirror cleaning</p>
            <div className="quick-price">
              Starting at ₹69
              <span>⚡ 15 Minutes</span>
            </div>
            <button className="add-cart-btn">ADD TO CART</button>
          </div>
          <div className="quick-service-card">
            <div className="quick-image">
              <img src="https://i.ibb.co/rK8TnvQm/room.jpg" alt="Room Cleaning" />
            </div>
            <h4>Room Cleaning</h4>
            <p>Dusting, vacuuming, bed making, and organizing</p>
            <div className="quick-price">
              Starting at ₹79
              <span>⚡ 15 Minutes</span>
            </div>
            <button className="add-cart-btn">ADD TO CART</button>
          </div>
          <div className="quick-service-card">
            <div className="quick-image">
              <img src="https://i.ibb.co/H5fNRRJ/kitchen-utenisl.png" alt="Kitchen Cleaning" />
            </div>
            <h4>Kitchen Cleaning</h4>
            <p>Counter cleaning, appliance wiping, and sanitization</p>
            <div className="quick-price">
              Starting at ₹39
              <span>⚡ 15 Minutes</span>
            </div>
            <button className="add-cart-btn">ADD TO CART</button>
          </div>
          <div className="quick-service-card">
            <div className="quick-image">
              <img src="/images/laundry_service.png" alt="Laundry Services" />
            </div>
            <h4>Laundry Services</h4>
            <p>Wash, dry, and fold - all in 15 minutes!</p>
            <div className="quick-price">
              Starting at ₹49
              <span>⚡ 15 Minutes</span>
            </div>
            <button className="add-cart-btn">ADD TO CART</button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="home-section why-choose-us-section">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h4>Professional Cleaners</h4>
            <p>Experienced and trained professionals</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h4>Flexible Scheduling</h4>
            <p>Book at your convenience</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h4>Affordable Prices</h4>
            <p>Competitive pricing for quality service</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h4>100% Satisfaction</h4>
            <p>Guaranteed quality service</p>
          </div>
        </div>
      </section>

      {/* User Reviews Section */}
      <section className="home-section reviews-section">
        <div className="section-header">
          <h2>User Reviews and Feedback</h2>
          <p>See how Zynkly has transformed users' experiences through their own words</p>
        </div>
        <div className="reviews-grid">
          <div className="review-card">
            <p className="review-text">"I'd say it was great value for money. The urgency was handled well, without compromising quality. Really satisfied with the experience."</p>
            <div className="reviewer">
              <div className="reviewer-avatar">K</div>
              <div className="reviewer-info">
                <h4>Kirti</h4>
                <span>Sector 56</span>
              </div>
            </div>
          </div>
          <div className="review-card">
            <p className="review-text">"The service was simple and effective. It met my expectations without any hassle. Good overall experience."</p>
            <div className="reviewer">
              <div className="reviewer-avatar">N</div>
              <div className="reviewer-info">
                <h4>Neha</h4>
                <span>Sector 57</span>
              </div>
            </div>
          </div>
          <div className="review-card">
            <p className="review-text">"Great work, my home was left spotless and fresh. The cleaning was thorough, and I appreciated the attention to detail. I'll recommend it. 👍"</p>
            <div className="reviewer">
              <div className="reviewer-avatar">P</div>
              <div className="reviewer-info">
                <h4>Pradnyesh</h4>
                <span>Suncity</span>
              </div>
            </div>
          </div>
          <div className="review-card">
            <p className="review-text">"Seamless experience from booking to completion. The staff was courteous, punctual, and did a fantastic job."</p>
            <div className="reviewer">
              <div className="reviewer-avatar">R</div>
              <div className="reviewer-info">
                <h4>Ritika</h4>
                <span>Sector 57</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="home-section faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          <div className="faq-item">
            <h4>What is Zynkly?</h4>
            <p>Zynkly is India's 15-minute house help service app. We provide professional cleaning services on-demand, scheduled, or recurring basis.</p>
          </div>
          <div className="faq-item">
            <h4>How do I book services?</h4>
            <p>Simply browse our services, add them to your cart, and proceed to checkout. You can choose instant, scheduled, or recurring bookings.</p>
          </div>
          <div className="faq-item">
            <h4>Can I book a recurring service?</h4>
            <p>Yes! You can set up daily, weekly, or monthly recurring services for your convenience.</p>
          </div>
          <div className="faq-item">
            <h4>How can I trust your service?</h4>
            <p>All our professionals are verified and trained. We maintain high quality standards and have thousands of satisfied customers.</p>
          </div>
          <div className="faq-item">
            <h4>How are your services priced?</h4>
            <p>We offer flexible pricing with one-time, hourly, daily, weekly, monthly, and yearly plans. Prices vary by service type.</p>
          </div>
          <div className="faq-item">
            <h4>Where can I use Zynkly?</h4>
            <p>We are currently available in major cities. Check our services page for availability in your area.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
