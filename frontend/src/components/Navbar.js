import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiHelpCircle, FiTag, FiSearch } from 'react-icons/fi';
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
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 py-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Location */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="text-2xl font-black text-primary-500 tracking-tighter hover:scale-105 transition-transform duration-200">
                FOODAPP
              </div>
            </Link>
            <div className="hidden lg:block">
              <LocationSelector />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="flex items-center gap-2 text-gray-700 hover:text-primary-500 transition-colors font-semibold group">
              <FiSearch className="text-xl group-hover:scale-110 transition-transform" />
              <span className="text-sm">Search</span>
            </Link>

            <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-primary-500 transition-colors font-semibold group">
              <FiTag className="text-xl group-hover:scale-110 transition-transform" />
              <span className="text-sm">Offers</span>
            </Link>

            <Link to="/help" className="flex items-center gap-2 text-gray-700 hover:text-primary-500 transition-colors font-semibold group">
              <FiHelpCircle className="text-xl group-hover:scale-110 transition-transform" />
              <span className="text-sm">Help</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative flex items-center gap-2 text-gray-700 hover:text-primary-500 transition-colors font-semibold group">
                  <FiShoppingCart className="text-xl group-hover:scale-110 transition-transform" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-success text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                      {itemCount}
                    </span>
                  )}
                  <span className="text-sm">Cart</span>
                </Link>

                <div className="group relative">
                  <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-primary-500 transition-colors font-semibold">
                    <FiUser className="text-xl" />
                    <span className="text-sm">{user?.fullName || user?.name || 'Profile'}</span>
                  </Link>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 hidden group-hover:block animate-fade-in">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 flex items-center gap-2 transition-colors"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-500 font-bold text-sm transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gray-900 text-white rounded font-bold text-sm hover:bg-gray-800 transition-all shadow-sm active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
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
                  <span>{user?.fullName || user?.name || 'Profile'}</span>
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
