# FoodExpress Frontend

A modern, professional food delivery application frontend built with React, inspired by Swiggy's user experience.

## Features

### 🎨 Modern UI/UX
- **Swiggy-inspired design** with smooth animations and transitions
- **Responsive layout** that works on all devices
- **Professional color scheme** with orange primary colors
- **Smooth animations** using Framer Motion
- **Shimmer loading effects** for better perceived performance

### 🛒 Shopping Experience
- **Smart cart management** with quantity controls
- **Restaurant-specific carts** (prevents mixing items from different restaurants)
- **Real-time cart updates** with toast notifications
- **Persistent cart** using localStorage

### 🔍 Search & Filter
- **Real-time search** for restaurants and cuisines
- **Advanced filters**: Rating, Fast Delivery, Offers, Pure Veg, Price Range
- **Category-based menu browsing**

### 🔐 Authentication
- **Secure JWT-based authentication**
- **Protected routes** for authenticated users
- **User profile management**
- **Order history tracking**

### 📱 Components
- **RestaurantCard** - Beautiful restaurant cards with ratings and offers
- **MenuItemCard** - Interactive menu items with add to cart
- **SearchBar** - Smart search with clear functionality
- **FilterBar** - Multi-select filter chips
- **Shimmer** - Loading placeholders for better UX
- **Navbar** - Responsive navigation with cart badge
- **Footer** - Professional footer with links

## Tech Stack

- **React 19.2.0** - Latest React with concurrent features
- **React Router DOM 7.9.6** - Client-side routing
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **Framer Motion 12.23.25** - Animation library
- **Axios 1.13.2** - HTTP client
- **React Hot Toast 2.4.1** - Toast notifications
- **React Icons 5.5.0** - Icon library

## Installation

### Prerequisites
- Node.js 16+ and npm
- Backend services running on port 8080

### Steps

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

The application will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── FilterBar.js          # Filter chips component
│   │   ├── Footer.js             # Footer component
│   │   ├── MenuItemCard.js       # Menu item with add to cart
│   │   ├── Navbar.js             # Navigation bar
│   │   ├── RestaurantCard.js     # Restaurant card component
│   │   ├── SearchBar.js          # Search input component
│   │   └── Shimmer.js            # Loading placeholders
│   ├── context/
│   │   ├── AuthContext.js        # Authentication state management
│   │   └── CartContext.js        # Cart state management
│   ├── pages/
│   │   ├── CartPage.js           # Shopping cart page
│   │   ├── HomePage.js           # Main landing page
│   │   ├── LoginPage.js          # Login page
│   │   ├── ProfilePage.js        # User profile & orders
│   │   ├── RegisterPage.js       # Registration page
│   │   └── RestaurantDetailPage.js # Restaurant menu page
│   ├── App.js                    # Main app component
│   ├── App.css                   # Global styles
│   ├── index.js                  # Entry point
│   └── index.css                 # Tailwind imports
├── package.json
└── tailwind.config.js            # Tailwind configuration
```

## Key Features Implementation

### Context API
- **AuthContext**: Manages user authentication state, login, logout
- **CartContext**: Manages cart items, quantities, restaurant info

### Protected Routes
- Uses custom `ProtectedRoute` and `PublicRoute` components
- Redirects based on authentication status
- Shows loading state during auth check

### Cart Management
- Prevents mixing items from different restaurants
- Persistent storage using localStorage
- Real-time quantity updates
- Automatic total calculation with fees and taxes

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile devices
- Grid layouts that adapt to screen size
- Touch-friendly buttons and controls

## Color Scheme

```javascript
Primary: #FC8019 (Orange)
Success: #48C479 (Green)
Warning: #FFC700 (Yellow)
Dark: #111827 to #F9FAFB (Gray scale)
```

## API Integration

The frontend expects the following API endpoints:

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders

## Environment Variables

The app uses a proxy configuration in `package.json`:
```json
"proxy": "http://localhost:8080"
```

This proxies all API requests to the backend server.

## Development Tips

1. **Hot Reload**: Changes are automatically reflected
2. **Console Errors**: Check browser console for errors
3. **Network Tab**: Monitor API calls in browser DevTools
4. **React DevTools**: Install React DevTools extension for debugging

## Performance Optimizations

- Lazy loading images with `loading="lazy"`
- Shimmer effects for perceived performance
- Optimized re-renders with proper state management
- Memoization where needed
- Code splitting with React.lazy (can be added)

## Future Enhancements

- [ ] Add payment gateway integration
- [ ] Real-time order tracking with WebSocket
- [ ] Push notifications
- [ ] PWA support for offline functionality
- [ ] Advanced search with autocomplete
- [ ] Favorites/Wishlist feature
- [ ] Rating and review system
- [ ] Multiple delivery addresses
- [ ] Coupon code system

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational purposes.
