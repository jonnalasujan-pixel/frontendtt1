import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ShoppingCart, AlertCircle, Clock, CheckCircle, XCircle, Search, RefreshCw, FileText, Plus, Minus, Trash2 } from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';

export default function PharmacistDashboard({ activeTab }) {
  const [medicines, setMedicines] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  
  // POS Billing Desk State
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('Walk-in Patient');
  const [paymentMethod, setPaymentMethod] = useState('UPI (PhonePe/GPay)');
  const [discount, setDiscount] = useState(0);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  const loadData = async () => {
    const m = await api.getMedicines();
    setMedicines(m);
    const p = await api.getPrescriptions();
    setPrescriptions(p);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cart operations
  const addToCart = (med) => {
    const existing = cart.find(item => item.medicineId === med.id);
    if (existing) {
      if (existing.quantity >= med.stockQuantity) {
        alert(`Cannot add more. Only ${med.stockQuantity} units in stock.`);
        return;
      }
      setCart(cart.map(item => item.medicineId === med.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      if (med.stockQuantity < 1) {
        alert('This medicine is currently out of stock!');
        return;
      }
      setCart([...cart, {
        medicineId: med.id,
        name: med.name,
        type: med.type,
        batchNumber: med.batchNumber,
        unitPrice: med.unitPrice,
        stockAvailable: med.stockQuantity,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (medicineId, delta) => {
    setCart(cart.map(item => {
      if (item.medicineId === medicineId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        if (newQty > item.stockAvailable) {
          alert(`Max stock available is ${item.stockAvailable}`);
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (medicineId) => {
    setCart(cart.filter(item => item.medicineId !== medicineId));
  };

  // Indian GST Calculations (2.5% CGST + 2.5% SGST = 5%)
  const subtotal = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const discountVal = Number(discount) || 0;
  const taxable = Math.max(0, subtotal - discountVal);
  const cgstAmount = taxable * 0.025;
  const sgstAmount = taxable * 0.025;
  const grandTotal = taxable + cgstAmount + sgstAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty. Add medicines to proceed.');
      return;
    }

    try {
      const order = await api.createOrder({
        customerName,
        items: cart,
        discount: discountVal,
        paymentMethod
      });
      setGeneratedInvoice(order);
      setCart([]);
      setDiscount(0);
      setCustomerName('Walk-in Patient');
      loadData(); // Refresh stock counts
    } catch (err) {
      alert('Error during billing: ' + err.message);
    }
  };

  const handleRestock = async (id, currentStock, amount) => {
    await api.updateStock(id, currentStock + amount);
    loadData();
  };

  const handlePrescriptionStatus = async (id, status) => {
    await api.updatePrescriptionStatus(id, status);
    loadData();
  };

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.genericName && m.genericName.toLowerCase().includes(search.toLowerCase())) ||
      m.batchNumber.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || m.type?.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesType;
  });

  const lowStockList = medicines.filter(m => m.stockQuantity <= m.minStockThreshold);
  const expiringList = medicines.filter(m => {
    const exp = new Date(m.expDate);
    const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return exp <= thirtyDays;
  });

  return (
    <div>
      {/* Tab 1: POS Billing Counter */}
      {activeTab === 'billing' && (
        <div className="pos-layout">
          {/* Left Side: Product Selector */}
          <div className="card">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
              <div className="card-title">
                <ShoppingCart size={20} color="#0284c7" />
                <span>Quick Medicine Dispensing (POS Counter)</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select
                  className="form-control"
                  style={{ width: '130px', padding: '0.45rem' }}
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                >
                  <option value="ALL">All Forms</option>
                  <option value="Tablet">Tablets</option>
                  <option value="Syrup">Syrups</option>
                  <option value="Capsule">Capsules</option>
                </select>
                <div style={{ position: 'relative', width: '220px' }}>
                  <input
                    type="text"
                    placeholder="Search tablet, syrup..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-control"
                    style={{ paddingLeft: '2rem' }}
                  />
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                </div>
              </div>
            </div>

            <div className="table-responsive" style={{ maxHeight: '550px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Medicine / Syrup</th>
                    <th>Type</th>
                    <th>Batch</th>
                    <th>Available</th>
                    <th>MRP (₹)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map((m) => {
                    const isLow = m.stockQuantity <= m.minStockThreshold;
                    return (
                      <tr key={m.id}>
                        <td>
                          <strong>{m.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.genericName}</div>
                        </td>
                        <td>
                          <span className={`badge ${m.type === 'Syrup' ? 'badge-warning' : 'badge-info'}`}>
                            {m.type || 'Tablet'}
                          </span>
                        </td>
                        <td><code>{m.batchNumber}</code></td>
                        <td>
                          <span style={{ fontWeight: 600, color: isLow ? '#b91c1c' : '#15803d' }}>
                            {m.stockQuantity} {m.type === 'Syrup' ? 'bot' : 'units'}
                          </span>
                        </td>
                        <td><strong>₹{Number(m.unitPrice).toFixed(2)}</strong></td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            disabled={m.stockQuantity <= 0}
                            onClick={() => addToCart(m)}
                          >
                            <Plus size={14} /> Add
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side: Billing Invoice Summary */}
          <div className="card" style={{ height: 'fit-content' }}>
            <div className="card-header">
              <div className="card-title">
                <FileText size={20} color="#0d9488" />
                <span>Patient Bill & Cart</span>
              </div>
              <span className="badge badge-info">{cart.length} items</span>
            </div>

            <div className="form-group">
              <label className="form-label">Patient Name</label>
              <input
                type="text"
                className="form-control"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Walk-in Patient"
              />
            </div>

            {/* Cart Items list */}
            <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No items added yet. Click "+ Add" on tablets or syrups.
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.medicineId} className="cart-item">
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '0.875rem' }}>{item.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        ₹{Number(item.unitPrice).toFixed(2)} • {item.batchNumber}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => updateQuantity(item.medicineId, -1)}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button className="btn btn-secondary btn-sm" onClick={() => updateQuantity(item.medicineId, 1)}>
                        <Plus size={12} />
                      </button>
                      <strong style={{ width: '65px', textAlign: 'right' }}>
                        ₹{(item.unitPrice * item.quantity).toFixed(2)}
                      </strong>
                      <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.medicineId)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Payment & Calculation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <select className="form-control" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  <option value="UPI (PhonePe/GPay)">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="CASH">Cash Counter</option>
                  <option value="CARD">Debit / Credit Card</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Discount (₹)</label>
                <input
                  type="number"
                  step="5"
                  className="form-control"
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b' }}>Taxable Amount:</span>
                <span>₹{taxable.toFixed(2)}</span>
              </div>
              {discountVal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b91c1c', marginBottom: '4px', fontSize: '0.875rem' }}>
                  <span>Discount:</span>
                  <span>-₹{discountVal.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontSize: '0.8rem', color: '#64748b' }}>
                <span>CGST (2.5%):</span>
                <span>₹{cgstAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem', color: '#64748b' }}>
                <span>SGST (2.5%):</span>
                <span>₹{sgstAmount.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.2rem',
                fontWeight: 800,
                borderTop: '1px solid #e2e8f0',
                paddingTop: '6px',
                marginTop: '6px'
              }}>
                <span>Net Total:</span>
                <span style={{ color: '#0284c7' }}>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
              disabled={cart.length === 0}
              onClick={handleCheckout}
            >
              <CheckCircle size={18} /> Complete Sale & Print Tax Bill
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Stock & Expiry Alerts */}
      {activeTab === 'inventory' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Low Stock Warning Card */}
            <div className="card" style={{ borderLeft: '4px solid #b45309' }}>
              <div className="card-header">
                <div className="card-title" style={{ color: '#b45309' }}>
                  <AlertCircle size={20} />
                  <span>Low Stock Warnings ({lowStockList.length})</span>
                </div>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '0.75rem' }}>
                Medicines at or below their re-order threshold:
              </p>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Medicine / Syrup</th>
                      <th>Type</th>
                      <th>Current</th>
                      <th>Threshold</th>
                      <th>Restock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockList.map(m => (
                      <tr key={m.id}>
                        <td><strong>{m.name}</strong></td>
                        <td><span className="badge badge-info">{m.type || 'Tab'}</span></td>
                        <td><strong style={{ color: '#b91c1c' }}>{m.stockQuantity}</strong></td>
                        <td>{m.minStockThreshold}</td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleRestock(m.id, m.stockQuantity, 50)}
                          >
                            <RefreshCw size={12} /> +50 Units
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Expiring Batches Card */}
            <div className="card" style={{ borderLeft: '4px solid #b91c1c' }}>
              <div className="card-header">
                <div className="card-title" style={{ color: '#b91c1c' }}>
                  <Clock size={20} />
                  <span>Expiring Soon (&lt;30 Days) ({expiringList.length})</span>
                </div>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '0.75rem' }}>
                Batches requiring priority clearance or return to supplier:
              </p>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Batch No</th>
                      <th>Expiry Date</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiringList.map(m => (
                      <tr key={m.id}>
                        <td><strong>{m.name}</strong></td>
                        <td><code>{m.batchNumber}</code></td>
                        <td><span className="badge badge-danger">{m.expDate}</span></td>
                        <td>{m.stockQuantity} units</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Full Stock List */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <span>Complete Medicine & Syrup Stock Master</span>
              </div>
              <div style={{ position: 'relative', width: '250px' }}>
                <input
                  type="text"
                  placeholder="Filter stock..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2rem' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              </div>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Type</th>
                    <th>Batch</th>
                    <th>Stock</th>
                    <th>MRP</th>
                    <th>Expiry Date</th>
                    <th>Supplier</th>
                    <th>Quick Restock</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map(m => (
                    <tr key={m.id}>
                      <td>
                        <strong>{m.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.genericName}</div>
                      </td>
                      <td><span className="badge badge-info">{m.type || 'Tab'}</span></td>
                      <td><code>{m.batchNumber}</code></td>
                      <td>
                        <strong>{m.stockQuantity}</strong>
                        {m.stockQuantity <= m.minStockThreshold && (
                          <span className="badge badge-warning" style={{ marginLeft: '6px' }}>Low</span>
                        )}
                      </td>
                      <td>₹{Number(m.unitPrice).toFixed(2)}</td>
                      <td>{m.expDate}</td>
                      <td>{m.supplier?.name || 'General'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleRestock(m.id, m.stockQuantity, 15)}
                            title="Add 15"
                          >
                            +15
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleRestock(m.id, m.stockQuantity, 50)}
                            title="Add 50"
                          >
                            +50
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Prescriptions Queue */}
      {activeTab === 'prescriptions' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FileText size={20} color="#0284c7" />
              <span>Customer Prescription Verification Queue</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Prescription ID</th>
                  <th>Patient Name</th>
                  <th>Doctor Details</th>
                  <th>Notes & Instructions</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map(p => (
                  <tr key={p.id}>
                    <td><code>#RX-{p.id}</code></td>
                    <td>
                      <strong>{p.patientName}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>By {p.customerName}</div>
                    </td>
                    <td>{p.doctorName}</td>
                    <td style={{ maxWidth: '300px' }}>{p.notes}</td>
                    <td>{new Date(p.createdAt).toLocaleString('en-IN')}</td>
                    <td>
                      {p.status === 'PENDING' && <span className="badge badge-warning">Pending Review</span>}
                      {p.status === 'APPROVED' && <span className="badge badge-success">Approved</span>}
                      {p.status === 'REJECTED' && <span className="badge badge-danger">Rejected</span>}
                    </td>
                    <td>
                      {p.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handlePrescriptionStatus(p.id, 'APPROVED')}
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handlePrescriptionStatus(p.id, 'REJECTED')}
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      <InvoiceModal invoice={generatedInvoice} onClose={() => setGeneratedInvoice(null)} />
    </div>
  );
}
