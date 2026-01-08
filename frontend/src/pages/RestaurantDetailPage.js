import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
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
  const [isVegOnly, setIsVegOnly] = useState(false);

  useEffect(() => {
    fetchRestaurantDetails();
    fetchMenuItems();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      setRestaurant(response.data.data);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await api.get(`/restaurants/${id}/menu`);
      setMenuItems(response.data.data || []);
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
        image: restaurant.imageUrl
      });
    }
  };

  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const categories = ['All', ...new Set(menuItems.map(item => item.category || 'Other'))];

  const filteredItems = menuItems.filter(item => {
    const categoryMatch = selectedCategory === 'All' || (item.category || 'Other') === selectedCategory;
    const vegMatch = !isVegOnly || item.isVeg;
    return categoryMatch && vegMatch;
  });

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
              src={restaurant.imageUrl || `https://source.unsplash.com/400x300/?restaurant,${restaurant.cuisine}`}
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

        {/* Menu Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sticky top-16 bg-gray-50/95 backdrop-blur-sm z-30 py-4 border-b border-gray-200">
          {/* Category Tabs */}
          <div className="overflow-x-auto">
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition text-sm font-medium ${selectedCategory === category
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Veg Only Toggle */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 w-fit">
            <span className="text-sm font-bold text-gray-700">Veg Only</span>
            <button
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isVegOnly ? 'bg-success' : 'bg-gray-200'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isVegOnly ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MenuItemCard
                    item={item}
                    onAdd={handleAddToCart}
                    quantity={getItemQuantity(item.id)}
                    onUpdateQuantity={updateQuantity}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300"
            >
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-500 font-medium">No items found matching your filters</p>
              <button
                onClick={() => { setSelectedCategory('All'); setIsVegOnly(false); }}
                className="mt-4 text-primary-500 hover:text-primary-600 font-semibold underline"
              >
                Clear all filters
              </button>
            </motion.div>
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
