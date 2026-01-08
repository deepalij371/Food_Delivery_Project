import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiPackage, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
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
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        setOrders([]);
      }
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
                <h2 className="text-2xl font-bold text-gray-800">{user?.fullName || 'User'}</h2>
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
                <div className="flex relative">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex-1 px-6 py-4 font-bold transition-all duration-300 relative z-10 ${activeTab === 'orders'
                      ? 'text-primary-500'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <FiPackage className="inline mr-2" />
                    My Orders
                    {activeTab === 'orders' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 px-6 py-4 font-bold transition-all duration-300 relative z-10 ${activeTab === 'profile'
                      ? 'text-primary-500'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <FiUser className="inline mr-2" />
                    Profile Settings
                    {activeTab === 'profile' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'orders' ? (
                    <motion.div
                      key="orders"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {loading ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                          <p className="text-gray-600 mt-4">Loading orders...</p>
                        </div>
                      ) : orders.length > 0 ? (
                        <div className="space-y-4">
                          {orders.map((order, index) => (
                            <motion.div
                              key={order.id}
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="border border-gray-100 rounded-xl p-5 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 transition-all group"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                    Order #{order.id}
                                  </h3>
                                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-medium">
                                    <FiClock className="text-xs" />
                                    {formatDate(order.createdAt || new Date())}
                                  </p>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${getStatusColor(order.status || 'PENDING')}`}>
                                  {order.status || 'PENDING'}
                                </span>
                              </div>

                              <div className="border-t border-gray-50 pt-4 mt-2">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total Paid</p>
                                    <p className="font-black text-xl text-gray-900">
                                      ₹{order.totalAmount || 0}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => navigate(`/order-tracking/${order.id}`)}
                                    className="bg-gray-50 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-500 hover:text-white transition-all transform active:scale-95"
                                  >
                                    Track Order
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <FiPackage className="text-4xl text-gray-300" />
                          </div>
                          <h3 className="text-2xl font-black text-gray-800 mb-2">
                            No orders yet
                          </h3>
                          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            Your food journey is just beginning! Explore our best restaurants.
                          </p>
                          <button
                            onClick={() => navigate('/')}
                            className="bg-primary-500 text-white px-10 py-4 rounded-2xl hover:bg-primary-600 transition-all font-black text-lg shadow-xl shadow-primary-500/30 transform hover:-translate-y-1"
                          >
                            Browse Restaurants
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-2xl font-black text-gray-900 mb-8">
                        Profile Settings
                      </h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                              Full Name
                            </label>
                            <div className="relative">
                              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                defaultValue={user?.fullName}
                                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-bold text-gray-800"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                              Phone Number
                            </label>
                            <div className="relative">
                              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="tel"
                                defaultValue={user?.phone}
                                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-bold text-gray-800"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                            Email Address (Encrypted)
                          </label>
                          <div className="relative">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="email"
                              defaultValue={user?.email}
                              disabled
                              className="w-full pl-11 pr-4 py-4 bg-gray-100 border-2 border-gray-100 rounded-2xl cursor-not-allowed opacity-60 font-bold text-gray-600"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                            Home Address
                          </label>
                          <div className="relative">
                            <FiMapPin className="absolute left-4 top-4 text-gray-400" />
                            <textarea
                              rows="3"
                              defaultValue={user?.address}
                              className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-bold text-gray-800 resize-none"
                              placeholder="Set your default delivery address"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => toast.success('Profile updated successfully!', {
                            style: {
                              borderRadius: '16px',
                              background: '#333',
                              color: '#fff',
                            },
                          })}
                          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-5 rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all font-black text-lg shadow-xl shadow-primary-500/30 transform hover:-translate-y-1 active:scale-95 mt-4"
                        >
                          Save Profile Changes
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
