import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Footer } from './components/Footer';
import Account from './pages/Account';
import CartPage from './pages/Cart';
import HomePage from './pages/Home';
import Wishlist from './pages/Wishlist';
import AuthPage from './pages/Auth';
import LoginPage from './pages/Login';
import { ToastProvider } from './components/Toast';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handlePageChange = (page: string) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('');
    setTimeout(() => {
      const productsSection = document.querySelector('[data-products-section]');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const currentPage = (location.pathname === '/' ? 'home' : location.pathname.slice(1)) as 'home' | 'cart' | 'account' | 'wishlist' | 'auth' | 'login';
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/login';

  // Redirect to home if already authenticated and on auth page
  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && isAuthPage && location.pathname !== '/') {
      navigate('/');
    }
  }, [isAuthPage, navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAuthPage && <Navbar onNavigate={handlePageChange} currentPage={currentPage} cartCount={cartCount} wishlistCount={wishlistCount} onCategoryChange={handleCategoryChange} onSearch={handleSearch} />}
      <Routes>
        <Route path="/" element={<HomePage onNavigate={handlePageChange} selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} searchQuery={searchQuery} />} />
        <Route path="/cart" element={<CartPage onNavigate={handlePageChange} />} />
        <Route path="/account" element={<Account />} />
        <Route path="/wishlist" element={<Wishlist onNavigate={handlePageChange} />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
      </Router>
    </ToastProvider>
  );
}

export default App;
