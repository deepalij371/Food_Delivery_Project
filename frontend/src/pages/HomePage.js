import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RestaurantCard from '../components/RestaurantCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import CategoryCarousel from '../components/CategoryCarousel';
import { ShimmerList } from '../components/Shimmer';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchRestaurants(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    applyFilters();
  }, [restaurants, activeFilters]);

  const fetchRestaurants = async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `/api/restaurants?query=${query}` : '/api/restaurants';
      const response = await axios.get(url);
      setRestaurants(response.data.data || []);
      // When fetching new data, we also reset or re-apply local filters (like veg/rating) 
      // but 'filteredRestaurants' will be updated by the next useEffect on 'restaurants' change
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...restaurants];

    // Search is handled by backend now, so we don't filter by name/cuisine here anymore
    // We only apply client-side filters (Rating, Veg, etc.) on the result returned by backend

    // Active filters
    activeFilters.forEach(filter => {
      switch (filter) {
        case 'rating':
          filtered = filtered.filter(r => (r.rating || 4.0) >= 4.0);
          break;
        case 'fastDelivery':
          filtered = filtered.filter(r => parseInt(r.deliveryTime || '30') <= 30);
          break;
        case 'offers':
          filtered = filtered.filter(r => r.offer);
          break;
        case 'pureVeg':
          filtered = filtered.filter(r => r.isVeg);
          break;
        case 'lessThan300':
          filtered = filtered.filter(r => (r.priceForTwo || 300) >= 300 && (r.priceForTwo || 300) <= 600);
          break;
        default:
          break;
      }
    });

    setFilteredRestaurants(filtered);
  };

  const handleFilterChange = (filterId) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative bg-gray-900 text-white py-24 md:py-32"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight"
          >
            Delicious Food, <br className="hidden md:block" /> Delivered To You
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto"
          >
            Explore top-rated restaurants and cafes near you. Order now and satisfy your cravings in minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-xl">
              <SearchBar onSearch={setSearchQuery} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Section */}
      <div className="bg-white py-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryCarousel onCategorySelect={(category) => setSearchQuery(category)} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Filters */}
        <div className="sticky top-20 z-30 bg-gray-50 py-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `Results for "${searchQuery}"` : 'Top Restaurants'}
            </h2>
            <div className="text-sm text-gray-500 font-medium">
              {filteredRestaurants.length} places
            </div>
          </div>
          <div className="mt-4">
            <FilterBar
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Restaurants Grid */}
        <div>
          {loading ? (
            <ShimmerList count={8} />
          ) : filteredRestaurants.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <RestaurantCard restaurant={restaurant} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No restaurants found</h3>
              <p className="text-gray-500 mb-6">Try changing your search or filters to see more results.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilters([]);
                }}
                className="px-6 py-2 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
