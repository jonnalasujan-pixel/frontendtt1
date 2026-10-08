import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, ShoppingBag, Plus, Minus, Trash2, CheckCircle2, Upload, FileText, IndianRupee } from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';

export default function CustomerPortal({ activeTab, cart, setCart, currentUser }) {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  // Prescription Form
  const [rxForm, setRxForm] = useState({
    doctorName: '',
    patientName: currentUser?.fullName || 'Ananya Verma',
    notes: ''
  });
  const [rxSuccess, setRxSuccess] = useState(false);

  const loadData = async () => {
    const m = await api.getMedicines();
    setMedicines(m);
    const c = await api.getCategories();
    setCategories(c);
    const o = await api.getOrders();
    setOrders(o);
    const p = await api.getPrescriptions();
    setPrescriptions(p);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addToCart = (med) => {
    const existing = cart.find(i => i.medicineId === med.id);
    if (existing) {
      if (existing.quantity >= med.stockQuantity) {
        alert('Cannot add more than available stock');
        return;
      }
      setCart(cart.map(i => i.medicineId === med.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      if (med.stockQuantity < 1) {
        alert('Medicine is currently out of stock');
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

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.medicineId === id) {
        const q = item.quantity + delta;
        if (q <= 0) return null;
        if (q > item.stockAvailable) return item;
        return { ...item, quantity: q };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(i => i.medicineId !== id));
  };

  // Indian GST Calculation
  const cartSubtotal = cart.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0);
  const cartTax = cartSubtotal * 0.05; // 5% GST
  const cartTotal = cartSubtotal + cartTax;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const order = await api.createOrder({
        customerName: currentUser?.fullName || 'Ananya Verma',
        items: cart,
        discount: 0,
        paymentMethod: 'UPI (PhonePe/Google Pay)'
      });
      setGeneratedInvoice(order);
      setCart([]);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRxSubmit = async (e) => {
    e.preventDefault();
    if (!rxForm.doctorName || !rxForm.notes) {
      alert('Please fill out doctor name and prescription notes');
      return;
    }
    await api.submitPrescription({
      customerName: currentUser?.fullName || 'Ananya Verma',
      patientName: rxForm.patientName,
      doctorName: rxForm.doctorName,
      notes: rxForm.notes,
      file: { name: 'Rx_Dr_' + rxForm.doctorName.replace(/\s+/g, '_') + '.pdf' }
    });
    setRxSuccess(true);
    setRxForm({ doctorName: '', patientName: currentUser?.fullName || 'Ananya Verma', notes: '' });
    loadData();
    setTimeout(() => setRxSuccess(false), 5000);
  };

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.genericName && m.genericName.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCategory === 'ALL' || m.category?.name === selectedCategory;
    const matchesType = selectedType === 'ALL' || m.type?.toLowerCase().includes(selectedType.toLowerCase());
    return matchesSearch && matchesCat && matchesType;
  });

  return (
    <div>
      {/* Tab 1: Shop / Browse Medicines & Syrups */}
      {activeTab === 'shop' && (
        <div style={{ display: 'grid', gridTemplateColumns: cart.length > 0 ? '1.5fr 1fr' : '1fr', gap: '1.5rem' }}>
          <div>
            {/* Filter & Search Toolbar */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <input
                    type="text"
                    placeholder="Search tablets (Dolo, Augmentin) or syrups (Benadryl, Ascoril)..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="form-control"
                    style={{ paddingLeft: '2rem' }}
                  />
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    className={`btn btn-sm ${selectedType === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedType('ALL')}
                  >
                    All Types
                  </button>
                  <button
                    className={`btn btn-sm ${selectedType === 'Tablet' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedType('Tablet')}
                  >
                    Tablets
                  </button>
                  <button
                    className={`btn btn-sm ${selectedType === 'Syrup' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedType('Syrup')}
                  >
                    Syrups (Liquid)
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingTop: '4px' }}>
                <button
                  className={`btn btn-sm ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedCategory('ALL')}
                >
                  All Categories
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    className={`btn btn-sm ${selectedCategory === c.name ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedCategory(c.name)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Medicine Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {filteredMedicines.map(m => {
                const inStock = m.stockQuantity > 0;
                return (
                  <div key={m.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: 0 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <span className={`badge ${m.type === 'Syrup' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.72rem' }}>
                          {m.type || 'Tablet'}
                        </span>
                        {inStock ? (
                          <span className="badge badge-success">In Stock ({m.stockQuantity})</span>
                        ) : (
                          <span className="badge badge-danger">Out of Stock</span>
                        )}
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 4px 0' }}>{m.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
                        {m.genericName || 'Standard formulation'}
                      </p>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                        Batch: {m.batchNumber} • Exp: {m.expDate}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                      <strong style={{ fontSize: '1.25rem', color: '#0f172a' }}>
                        ₹{Number(m.unitPrice).toFixed(2)}
                      </strong>
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={!inStock}
                        onClick={() => addToCart(m)}
                      >
                        <Plus size={14} /> Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Sidebar */}
          {cart.length > 0 && (
            <div className="card" style={{ height: 'fit-content', position: 'sticky', top: '80px' }}>
              <div className="card-header">
                <div className="card-title">
                  <ShoppingBag size={20} color="#0284c7" />
                  <span>My Pharmacy Cart ({cart.length})</span>
                </div>
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '1rem' }}>
                {cart.map(item => (
                  <div key={item.medicineId} className="cart-item">
                    <div style={{ flex: 1 }}>
                      <strong>{item.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>₹{Number(item.unitPrice).toFixed(2)} each</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => updateQuantity(item.medicineId, -1)}><Minus size={12} /></button>
                      <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                      <button className="btn btn-secondary btn-sm" onClick={() => updateQuantity(item.medicineId, 1)}><Plus size={12} /></button>
                      <strong style={{ width: '55px', textAlign: 'right' }}>₹{(item.unitPrice * item.quantity).toFixed(2)}</strong>
                      <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.medicineId)}><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Subtotal:</span>
                  <span>₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Est. GST (5%):</span>
                  <span>₹{cartTax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 'bold', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                  <span>Total Amount:</span>
                  <span style={{ color: '#0284c7' }}>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }} onClick={handleCheckout}>
                <CheckCircle2 size={16} /> Pay via UPI & Order
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Upload / Submit Prescription */}
      {activeTab === 'upload_rx' && (
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Upload size={20} color="#0284c7" />
                <span>Submit Doctor Prescription</span>
              </div>
            </div>

            {rxSuccess && (
              <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} />
                <span>Prescription submitted! Our pharmacist (Suresh Patel) is reviewing it for dispensing.</span>
              </div>
            )}

            <form onSubmit={handleRxSubmit}>
              <div className="form-group">
                <label className="form-label">Patient Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={rxForm.patientName}
                  onChange={e => setRxForm({ ...rxForm, patientName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Consulting Doctor's Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. K. Srinivas (MBBS, MD)"
                  className="form-control"
                  value={rxForm.doctorName}
                  onChange={e => setRxForm({ ...rxForm, doctorName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prescription Details / Medicine Notes *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="List prescribed medicines, dosage frequency (e.g. 1 tab morning & night after food)..."
                  className="form-control"
                  value={rxForm.notes}
                  onChange={e => setRxForm({ ...rxForm, notes: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Upload Scanned Prescription (PDF / JPG)</label>
                <div style={{ border: '2px dashed #cbd5e1', padding: '1.5rem', textAlign: 'center', borderRadius: '8px', background: '#f8fafc' }}>
                  <FileText size={32} color="#94a3b8" style={{ margin: '0 auto 8px auto' }} />
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Select scanned copy or camera photo of prescription
                  </p>
                  <input type="file" style={{ marginTop: '8px', fontSize: '0.85rem' }} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}>
                Submit to Pharmacist for Verification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: My Orders & History */}
      {activeTab === 'my_orders' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <ShoppingBag size={20} color="#0284c7" />
                <span>My Past Medicine Orders & Tax Invoices</span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice No</th>
                    <th>Date</th>
                    <th>Net Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td><code>{o.invoiceNumber}</code></td>
                      <td>{new Date(o.orderDate).toLocaleDateString('en-IN')}</td>
                      <td><strong>₹{Number(o.netAmount).toFixed(2)}</strong></td>
                      <td><span className="badge badge-success">{o.status}</span></td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => setGeneratedInvoice(o)}>
                          View Tax Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <FileText size={20} color="#0d9488" />
                <span>My Submitted Prescriptions</span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map(p => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.doctorName}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.notes}</div>
                      </td>
                      <td>{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        {p.status === 'PENDING' && <span className="badge badge-warning">Under Review</span>}
                        {p.status === 'APPROVED' && <span className="badge badge-success">Approved</span>}
                        {p.status === 'REJECTED' && <span className="badge badge-danger">Rejected</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Receipt Modal */}
      <InvoiceModal invoice={generatedInvoice} onClose={() => setGeneratedInvoice(null)} />
    </div>
  );
}
