import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiHelpCircle, FiTag } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LocationSelector from './LocationSelector';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const itemCount = getItemCount();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Location */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="text-2xl font-bold text-gradient">
                🍔 FoodExpress
              </div>
            </Link>
            <div className="hidden md:block h-8 w-px bg-gray-300" />
            <LocationSelector />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-primary-500 transition">
              <FiTag className="text-lg" />
              <span className="font-medium">Offers</span>
            </Link>

            <Link to="/help" className="flex items-center gap-2 text-gray-700 hover:text-primary-500 transition">
              <FiHelpCircle className="text-lg" />
              <span className="font-medium">Help</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative flex items-center gap-2 text-gray-700 hover:text-primary-500 transition">
                  <FiShoppingCart className="text-xl" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                  <span className="font-medium">Cart</span>
                </Link>

                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-primary-500 transition">
                  <FiUser className="text-xl" />
                  <span className="font-medium">{user?.name || 'Profile'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition"
                >
                  <FiLogOut className="text-xl" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-gray-700 hover:text-primary-500 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-primary-500"
          >
            {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-gray-700 hover:text-primary-500"
            >
              <FiTag />
              <span>Offers</span>
            </Link>

            <Link
              to="/help"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-gray-700 hover:text-primary-500"
            >
              <FiHelpCircle />
              <span>Help</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-gray-700 hover:text-primary-500"
                >
                  <FiShoppingCart />
                  <span>Cart {itemCount > 0 && `(${itemCount})`}</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-gray-700 hover:text-primary-500"
                >
                  <FiUser />
                  <span>{user?.name || 'Profile'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-2 text-gray-700 hover:text-red-500 w-full"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-primary-500"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-4 bg-primary-500 text-white rounded-lg text-center hover:bg-primary-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
