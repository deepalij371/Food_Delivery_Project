import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiPackage, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-warning text-white',
      CONFIRMED: 'bg-blue-500 text-white',
      PREPARING: 'bg-purple-500 text-white',
      OUT_FOR_DELIVERY: 'bg-primary-500 text-white',
      DELIVERED: 'bg-success text-white',
      CANCELLED: 'bg-red-500 text-white',
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-card p-6"
            >
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="text-4xl text-primary-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'User'}</h2>
                <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
              </div>

              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <FiMail className="text-primary-500" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <FiPhone className="text-primary-500" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <FiMapPin className="text-primary-500" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-medium">{user?.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full mt-6 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-semibold"
              >
                Logout
              </button>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-card"
            >
              {/* Tabs */}
              <div className="border-b">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex-1 px-6 py-4 font-semibold transition ${
                      activeTab === 'orders'
                        ? 'text-primary-500 border-b-2 border-primary-500'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <FiPackage className="inline mr-2" />
                    My Orders
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 px-6 py-4 font-semibold transition ${
                      activeTab === 'profile'
                        ? 'text-primary-500 border-b-2 border-primary-500'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <FiUser className="inline mr-2" />
                    Profile Settings
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'orders' && (
                  <div>
                    {loading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading orders...</p>
                      </div>
                    ) : orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-800">
                                  Order #{order.id}
                                </h3>
                                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                  <FiClock className="text-xs" />
                                  {formatDate(order.createdAt || new Date())}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status || 'PENDING')}`}>
                                {order.status || 'PENDING'}
                              </span>
                            </div>

                            <div className="border-t pt-3">
                              <p className="text-sm text-gray-600 mb-2">
                                {order.items?.length || 0} items
                              </p>
                              <div className="flex justify-between items-center">
                                <p className="font-bold text-gray-800">
                                  Total: ₹{order.totalAmount || 0}
                                </p>
                                <button
                                  onClick={() => navigate(`/order/${order.id}`)}
                                  className="text-primary-500 hover:text-primary-600 text-sm font-semibold"
                                >
                                  View Details →
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          No orders yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Start ordering from your favorite restaurants
                        </p>
                        <button
                          onClick={() => navigate('/')}
                          className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition font-semibold"
                        >
                          Browse Restaurants
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                      Profile Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.name}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={user?.email}
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          defaultValue={user?.phone}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <textarea
                          rows="3"
                          defaultValue={user?.address}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <button
                        onClick={() => toast.success('Profile updated successfully!')}
                        className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-semibold"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
