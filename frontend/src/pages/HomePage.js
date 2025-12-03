import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/restaurants');
            if (response.data.success) {
                setRestaurants(response.data.data);
            }
            setError(null);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setError('Failed to load restaurants. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading restaurants...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={fetchRestaurants} className="retry-button">Retry</button>
            </div>
        );
    }

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Delicious Food, Delivered Fast</h1>
                    <p className="hero-subtitle">Order from your favorite restaurants and get it delivered to your doorstep</p>
                </div>
            </section>

            <section className="restaurants-section">
                <div className="container">
                    <h2 className="section-title">Popular Restaurants</h2>
                    {restaurants.length === 0 ? (
                        <div className="no-restaurants">
                            <p>No restaurants available at the moment.</p>
                        </div>
                    ) : (
                        <div className="restaurants-grid">
                            {restaurants.map(restaurant => (
                                <Link 
                                    to={`/restaurant/${restaurant.id}`} 
                                    key={restaurant.id} 
                                    className="restaurant-card"
                                >
                                    <div className="restaurant-image">
                                        {restaurant.imageUrl ? (
                                            <img src={restaurant.imageUrl} alt={restaurant.name} />
                                        ) : (
                                            <div className="placeholder-image">🍽️</div>
                                        )}
                                        {restaurant.isOpen ? (
                                            <span className="status-badge open">Open</span>
                                        ) : (
                                            <span className="status-badge closed">Closed</span>
                                        )}
                                    </div>
                                    <div className="restaurant-info">
                                        <h3 className="restaurant-name">{restaurant.name}</h3>
                                        <p className="restaurant-cuisine">{restaurant.cuisine || 'Various'}</p>
                                        <div className="restaurant-details">
                                            <span className="rating">⭐ {restaurant.rating || 'New'}</span>
                                            <span className="delivery-time">🕐 {restaurant.deliveryTime || '30-45 min'}</span>
                                        </div>
                                        <p className="restaurant-address">📍 {restaurant.address}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
