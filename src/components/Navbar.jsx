import React from 'react';
import { Pill, LogOut, ShoppingBag, UserCheck } from 'lucide-react';

export default function Navbar({ currentUser, activeTab, setActiveTab, onLogout, cartCount }) {
  if (!currentUser) return null;

  const getNavLinks = () => {
    switch (currentUser.role) {
      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Admin Dashboard' },
          { id: 'medicines', label: 'Medicine & Syrup Master' },
          { id: 'suppliers', label: 'Suppliers & Categories' },
          { id: 'orders', label: 'Pharmacy Sales Records' },
          { id: 'staff', label: 'Pharmacist Accounts' },
          { id: 'customers', label: 'Customer Accounts' }
        ];
      case 'PHARMACIST':
        return [
          { id: 'billing', label: 'POS Billing Counter' },
          { id: 'inventory', label: 'Stock & Expiry Alerts' },
          { id: 'prescriptions', label: 'Prescription Queue' }
        ];
      case 'CUSTOMER':
        return [
          { id: 'shop', label: 'Medicines & Syrups' },
          { id: 'upload_rx', label: 'Submit Prescription' },
          { id: 'my_orders', label: 'My Orders & Invoices' }
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <Pill size={22} />
        </div>
        <div>
          <span>Crazy Medicals</span>
          <span style={{ fontSize: '0.7rem', display: 'block', color: '#64748b', fontWeight: 500 }}>
            Pharmacy Management System • Reg: DL-KA-89421
          </span>
        </div>
      </div>

      <div className="nav-links">
        {getNavLinks().map((link) => (
          <button
            key={link.id}
            className={`nav-btn ${activeTab === link.id ? 'active' : ''}`}
            onClick={() => setActiveTab(link.id)}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {currentUser.role === 'CUSTOMER' && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('shop')}
            style={{ position: 'relative' }}
          >
            <ShoppingBag size={16} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="badge badge-primary" style={{ background: '#0284c7', color: 'white', marginLeft: '4px' }}>
                {cartCount}
              </span>
            )}
          </button>
        )}

        {/* Authenticated User Badge */}
        <div className="role-badge-container" style={{ padding: '0.35rem 0.75rem' }}>
          <UserCheck size={16} color="#0284c7" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.825rem', color: '#0f172a' }}>
              {currentUser.fullName}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              Logged in as <strong className={`role-${currentUser.role}`}>{currentUser.role}</strong>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onLogout}
          title="Sign Out"
          style={{ borderColor: '#e2e8f0', color: '#b91c1c' }}
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
