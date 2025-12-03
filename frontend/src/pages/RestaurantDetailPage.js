import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './RestaurantDetailPage.css';

const RestaurantDetailPage = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRestaurantDetails();
    }, [id]);

    const fetchRestaurantDetails = async () => {
        try {
            setLoading(true);
            const [restaurantRes, menuRes] = await Promise.all([
                axios.get(`/api/restaurants/${id}`),
                axios.get(`/api/restaurants/${id}/menu`)
            ]);

            if (restaurantRes.data.success) {
                setRestaurant(restaurantRes.data.data);
            }
            if (menuRes.data.success) {
                setMenuItems(menuRes.data.data);
            }
            setError(null);
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
            setError('Failed to load restaurant details.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading restaurant...</p>
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="error-container">
                <p className="error-message">{error || 'Restaurant not found'}</p>
            </div>
        );
    }

    return (
        <div className="restaurant-detail-page">
            <div className="restaurant-header">
                <div className="restaurant-header-content">
                    <h1 className="restaurant-title">{restaurant.name}</h1>
                    <p className="restaurant-info-text">
                        {restaurant.cuisine} • {restaurant.deliveryTime || '30-45 min'} • ⭐ {restaurant.rating || 'New'}
                    </p>
                    <p className="restaurant-address-text">📍 {restaurant.address}</p>
                    <p className="restaurant-contact">📞 {restaurant.phone} • ✉️ {restaurant.email}</p>
                </div>
            </div>

            <div className="menu-section">
                <div className="container">
                    <h2 className="menu-title">Menu</h2>
                    {menuItems.length === 0 ? (
                        <div className="no-menu">
                            <p>No menu items available yet.</p>
                        </div>
                    ) : (
                        <div className="menu-grid">
                            {menuItems.map(item => (
                                <div key={item.id} className="menu-item-card">
                                    <div className="menu-item-image">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} />
                                        ) : (
                                            <div className="placeholder-menu-image">🍽️</div>
                                        )}
                                        {item.isVegetarian && (
                                            <span className="veg-badge">🌱 Veg</span>
                                        )}
                                    </div>
                                    <div className="menu-item-info">
                                        <h3 className="menu-item-name">{item.name}</h3>
                                        {item.category && (
                                            <span className="menu-item-category">{item.category}</span>
                                        )}
                                        <p className="menu-item-description">{item.description}</p>
                                        <div className="menu-item-footer">
                                            <span className="menu-item-price">${item.price.toFixed(2)}</span>
                                            {item.isAvailable ? (
                                                <button className="add-to-cart-btn">Add to Cart</button>
                                            ) : (
                                                <span className="unavailable-badge">Unavailable</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetailPage;
