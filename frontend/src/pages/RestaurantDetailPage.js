import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MenuItemCard from '../components/MenuItemCard';
import { ShimmerMenu } from '../components/Shimmer';
import { useCart } from '../context/CartContext';
import { FiStar, FiClock, FiMapPin, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchRestaurantDetails();
    fetchMenuItems();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await axios.get(`/api/restaurants/${id}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`/api/restaurants/${id}/menu`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    if (restaurant) {
      addToCart(item, {
        id: restaurant.id,
        name: restaurant.name,
        image: restaurant.image
      });
    }
  };

  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const categories = ['All', ...new Set(menuItems.map(item => item.category || 'Other'))];
  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => (item.category || 'Other') === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ShimmerMenu />
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-gray-500 text-lg">Restaurant not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-primary-500 hover:text-primary-600 font-semibold"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-500 mb-6 transition"
        >
          <FiArrowLeft />
          <span>Back to restaurants</span>
        </button>

        {/* Restaurant Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-card p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={restaurant.image || `https://source.unsplash.com/400x300/?restaurant,${restaurant.cuisine}`}
              alt={restaurant.name}
              className="w-full md:w-48 h-48 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{restaurant.name}</h1>
              <p className="text-gray-600 mb-4">{restaurant.cuisine}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-success text-white px-2 py-1 rounded">
                    <FiStar className="fill-current" />
                    <span className="font-semibold">{restaurant.rating || 4.2}</span>
                  </div>
                  <span className="text-gray-600">1000+ ratings</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <FiClock />
                  <span>{restaurant.deliveryTime || '30-35'} mins</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMapPin />
                  <span>{restaurant.address || 'Multiple locations'}</span>
                </div>
              </div>

              {restaurant.offer && (
                <div className="mt-4 bg-primary-50 border border-primary-200 rounded-lg p-3">
                  <p className="text-primary-700 font-semibold">🎁 {restaurant.offer}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAdd={handleAddToCart}
                quantity={getItemQuantity(item.id)}
                onUpdateQuantity={updateQuantity}
              />
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-lg">
              <p className="text-gray-500">No items in this category</p>
            </div>
          )}
        </div>

        {/* Floating Cart Button */}
        {cartItems.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
          >
            <button
              onClick={() => navigate('/cart')}
              className="bg-primary-500 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-primary-600 transition flex items-center gap-3"
            >
              <span className="font-semibold">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
              <span className="border-l border-white/30 pl-3">View Cart</span>
              <span className="font-bold">
                ₹{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
              </span>
            </button>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RestaurantDetailPage;
