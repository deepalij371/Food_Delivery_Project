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
    fetchRestaurants();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, activeFilters, restaurants]);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('/api/restaurants');
      // The API returns { success: true, message: "...", data: [...] }
      // axios puts the body in response.data, so the array is in response.data.data
      setRestaurants(response.data.data || []); 
      setFilteredRestaurants(response.data.data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...restaurants];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Order food online from your favorite restaurants
            </h1>
            <p className="text-xl md:text-2xl text-white/95 mb-8">
              Get your food delivered in minutes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <SearchBar onSearch={setSearchQuery} />
          </motion.div>
        </div>
      </div>

      {/* Category Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CategoryCarousel onCategorySelect={(category) => setSearchQuery(category)} />
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <FilterBar
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Restaurants Grid */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : 'Top restaurants near you'}
          </h2>
          <p className="text-gray-600 mb-6">
            {filteredRestaurants.length} restaurants found
          </p>

          {loading ? (
            <ShimmerList count={8} />
          ) : filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No restaurants found</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilters([]);
                }}
                className="mt-4 text-primary-500 hover:text-primary-600 font-semibold"
              >
                Clear filters
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
