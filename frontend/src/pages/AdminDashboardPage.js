import React, { useState, useEffect } from 'react';
import api from '../api';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('orders');

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/all');
      setOrders(res.data);
    } catch (_) {
      setOrders([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (_) {
      setUsers([]);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchUsers()]);
      setLoading(false);
    };
    load();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setMessage('');
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setMessage('Status updated.');
      fetchOrders();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update.');
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        <button
          type="button"
          className={tab === 'orders' ? 'tab active' : 'tab'}
          onClick={() => setTab('orders')}
        >
          Cleaning Requests
        </button>
        <button
          type="button"
          className={tab === 'users' ? 'tab active' : 'tab'}
          onClick={() => setTab('users')}
        >
          Customers
        </button>
      </div>

      {message && <p className="admin-msg">{message}</p>}

      {tab === 'orders' && (
        <section className="admin-orders">
          <h2>All Cleaning Requests</h2>
          {orders.length === 0 ? (
            <p className="no-data">No orders yet.</p>
          ) : (
            <div className="admin-order-list">
              {orders.map((order) => (
                <div key={order._id} className="admin-order-card">
                  <div className="admin-order-header">
                    <span className="order-id">{order._id.slice(-8)}</span>
                    <span className={`order-status status-${order.orderStatus?.toLowerCase()}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p><strong>Customer:</strong> {order.customerName}</p>
                  <p><strong>Contact:</strong> {order.mobileNumber}</p>
                  <p><strong>Room:</strong> {order.roomNumber}, <strong>PG:</strong> {order.pgName}</p>
                  <p><strong>Services:</strong> {order.services?.map((s) => s.name).join(', ')}</p>
                  <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                  {order.userId && (
                    <p><strong>User email:</strong> {order.userId.email}</p>
                  )}
                  <div className="status-control">
                    <label htmlFor={`status-${order._id}`}>Update status:</label>
                    <select
                      id={`status-${order._id}`}
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'users' && (
        <section className="admin-users">
          <h2>Customer Details</h2>
          {users.length === 0 ? (
            <p className="no-data">No users yet.</p>
          ) : (
            <div className="admin-user-list">
              {users.map((user) => (
                <div key={user._id} className="admin-user-card">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  {user.mobileNumber && <p><strong>Mobile:</strong> {user.mobileNumber}</p>}
                  <p><strong>Verified:</strong> {user.isVerified ? 'Yes' : 'No'}</p>
                  <p><strong>Admin:</strong> {user.isAdmin ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default AdminDashboardPage;
