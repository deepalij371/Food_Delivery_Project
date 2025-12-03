import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setUser(response.data.data);
            }
            setError(null);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="error-container">
                <p className="error-message">{error || 'Profile not found'}</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <h1 className="profile-name">{user.username}</h1>
                        <p className="profile-role">{user.role}</p>
                    </div>

                    <div className="profile-details">
                        <div className="detail-item">
                            <span className="detail-label">Email</span>
                            <span className="detail-value">{user.email}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Username</span>
                            <span className="detail-value">{user.username}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Account Type</span>
                            <span className="detail-value">{user.role}</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="profile-button">Edit Profile</button>
                        <button className="profile-button secondary">Change Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
