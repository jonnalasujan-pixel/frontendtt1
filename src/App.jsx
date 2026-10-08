import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import PharmacistDashboard from './pages/PharmacistDashboard';
import CustomerPortal from './pages/CustomerPortal';
import { api } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('billing');
  const [customerCart, setCustomerCart] = useState([]);

  useEffect(() => {
    // Check if user session already exists
    const user = api.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      if (user.role === 'ADMIN') setActiveTab('dashboard');
      if (user.role === 'PHARMACIST') setActiveTab('billing');
      if (user.role === 'CUSTOMER') setActiveTab('shop');
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'ADMIN') setActiveTab('dashboard');
    if (user.role === 'PHARMACIST') setActiveTab('billing');
    if (user.role === 'CUSTOMER') setActiveTab('shop');
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setCustomerCart([]);
  };

  // If user is not logged in, enforce login screen
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        cartCount={customerCart.length}
      />

      <main className="main-content">
        {currentUser.role === 'ADMIN' && (
          <AdminDashboard activeTab={activeTab} />
        )}

        {currentUser.role === 'PHARMACIST' && (
          <PharmacistDashboard activeTab={activeTab} />
        )}

        {currentUser.role === 'CUSTOMER' && (
          <CustomerPortal
            activeTab={activeTab}
            cart={customerCart}
            setCart={setCustomerCart}
            currentUser={currentUser}
          />
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '1.25rem',
        borderTop: '1px solid #e2e8f0',
        background: '#ffffff',
        fontSize: '0.8rem',
        color: '#64748b'
      }}>
        <div>
          <strong>Crazy Medicals</strong> • Pharmacy Management System (Indian Edition)
        </div>
        <div style={{ marginTop: '4px' }}>
          GSTIN: 29AABCU9603R1ZM | Drug Lic: KA-B2-109481/82 | FSSAI: 11221334000542
        </div>
      </footer>
    </div>
  );
}
