import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Package, AlertTriangle, Clock, Plus, Trash2, Search, Building2, Layers, IndianRupee, Users, UserPlus, Pencil, X } from 'lucide-react';

export default function AdminDashboard({ activeTab }) {
  const [stats, setStats] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pharmacists, setPharmacists] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [pharmacistForm, setPharmacistForm] = useState({ fullName: '', username: '', email: '', phone: '', password: '' });
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [staffError, setStaffError] = useState('');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMedicineId, setEditingMedicineId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ id: null, name: '', description: '' });
  const [supplierForm, setSupplierForm] = useState({ id: null, name: '', contactPerson: '', email: '', phone: '', address: '' });
  const [customerForm, setCustomerForm] = useState({ fullName: '', username: '', email: '', phone: '', password: '' });
  const [editingAccount, setEditingAccount] = useState(null);
  const [accountForm, setAccountForm] = useState({ fullName: '', email: '', phone: '', address: '', password: '' });
  const [managementError, setManagementError] = useState('');

  // New Medicine Form State
  const [newMed, setNewMed] = useState({
    name: '',
    type: 'Tablet',
    genericName: '',
    batchNumber: '',
    stockQuantity: 50,
    minStockThreshold: 15,
    unitPrice: '',
    mfgDate: new Date().toISOString().slice(0, 10),
    expDate: '',
    categoryId: 1,
    supplierId: 1
  });

  const loadData = async () => {
    const s = await api.getDashboardStats();
    setStats(s);
    const m = await api.getMedicines();
    setMedicines(m);
    const c = await api.getCategories();
    setCategories(c);
    const sup = await api.getSuppliers();
    setSuppliers(sup);
    const o = await api.getOrders();
    setOrders(o);
    const staff = await api.getPharmacists();
    setPharmacists(staff);
    const customerAccounts = await api.getCustomers();
    setCustomers(customerAccounts);
  };

  const handleCreatePharmacist = async (e) => {
    e.preventDefault();
    setStaffError('');
    try {
      await api.createPharmacist(pharmacistForm);
      setCreatedCredentials({ ...pharmacistForm });
      setPharmacistForm({ fullName: '', username: '', email: '', phone: '', password: '' });
      setPharmacists(await api.getPharmacists());
    } catch (err) {
      setStaffError(err.message || 'Could not create the pharmacist account.');
    }
  };

  const openMedicineForm = (medicine = null) => {
    setEditingMedicineId(medicine?.id || null);
    setNewMed(medicine ? {
      name: medicine.name,
      type: medicine.type || 'Tablet',
      genericName: medicine.genericName || '',
      batchNumber: medicine.batchNumber,
      stockQuantity: medicine.stockQuantity,
      minStockThreshold: medicine.minStockThreshold,
      unitPrice: medicine.unitPrice,
      mfgDate: medicine.mfgDate,
      expDate: medicine.expDate,
      categoryId: medicine.category?.id || 1,
      supplierId: medicine.supplier?.id || 1
    } : {
      name: '', type: 'Tablet', genericName: '', batchNumber: '', stockQuantity: 50,
      minStockThreshold: 15, unitPrice: '', mfgDate: new Date().toISOString().slice(0, 10),
      expDate: '', categoryId: categories[0]?.id || '', supplierId: suppliers[0]?.id || ''
    });
    setShowAddModal(true);
  };

  const handleSaveMedicine = async (e) => {
    e.preventDefault();
    if (!newMed.name || !newMed.batchNumber || !newMed.unitPrice || !newMed.expDate) {
      alert('Please fill out all required fields');
      return;
    }
    const category = categories.find(c => c.id === Number(newMed.categoryId));
    const supplier = suppliers.find(s => s.id === Number(newMed.supplierId));
    const medicine = {
      ...newMed,
      stockQuantity: Number(newMed.stockQuantity),
      minStockThreshold: Number(newMed.minStockThreshold || 10),
      unitPrice: Number(newMed.unitPrice),
      category,
      supplier
    };

    try {
      if (editingMedicineId) {
        await api.updateMedicine(editingMedicineId, medicine);
      } else {
        await api.addMedicine(medicine);
      }
      setShowAddModal(false);
      setEditingMedicineId(null);
      await loadData();
    } catch (err) {
      alert(err.message || 'Could not save medicine.');
    }
  };

  const openAccountEditor = (type, account) => {
    setEditingAccount({ type, id: account.id });
    setAccountForm({
      fullName: account.fullName,
      email: account.email,
      phone: account.phone || '',
      address: account.address || '',
      password: ''
    });
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    try {
      const update = editingAccount.type === 'customer' ? api.updateCustomer : api.updatePharmacist;
      await update.call(api, editingAccount.id, accountForm);
      setEditingAccount(null);
      await loadData();
    } catch (err) {
      setManagementError(err.message || 'Could not update account.');
    }
  };

  const handleDeleteAccount = async (type, account) => {
    if (!window.confirm(`Delete ${account.fullName}'s account?`)) return;
    try {
      const remove = type === 'customer' ? api.deleteCustomer : api.deletePharmacist;
      await remove.call(api, account.id);
      await loadData();
    } catch (err) {
      alert(err.message || 'Could not delete account.');
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setManagementError('');
    try {
      await api.createCustomer(customerForm);
      setCreatedCredentials({ ...customerForm });
      setCustomerForm({ fullName: '', username: '', email: '', phone: '', password: '' });
      setCustomers(await api.getCustomers());
    } catch (err) {
      setManagementError(err.message || 'Could not create customer account.');
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (categoryForm.id) await api.updateCategory(categoryForm.id, categoryForm);
      else await api.createCategory(categoryForm);
      setCategoryForm({ id: null, name: '', description: '' });
      await loadData();
    } catch (err) {
      alert(err.message || 'Could not save category.');
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    try {
      await api.deleteCategory(category.id);
      await loadData();
    } catch (err) {
      alert(err.message || 'Could not delete category. It may still be used by medicines.');
    }
  };

  const handleSaveSupplier = async (e) => {
    e.preventDefault();
    try {
      if (supplierForm.id) await api.updateSupplier(supplierForm.id, supplierForm);
      else await api.createSupplier(supplierForm);
      setSupplierForm({ id: null, name: '', contactPerson: '', email: '', phone: '', address: '' });
      await loadData();
    } catch (err) {
      alert(err.message || 'Could not save supplier.');
    }
  };

  const handleDeleteSupplier = async (supplier) => {
    if (!window.confirm(`Delete supplier "${supplier.name}"?`)) return;
    try {
      await api.deleteSupplier(supplier.id);
      await loadData();
    } catch (err) {
      alert(err.message || 'Could not delete supplier.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    if (!newMed.name || !newMed.batchNumber || !newMed.unitPrice || !newMed.expDate) {
      alert('Please fill out all required fields');
      return;
    }
    const cat = categories.find(c => c.id === Number(newMed.categoryId)) || { id: 1, name: 'General' };
    const sup = suppliers.find(s => s.id === Number(newMed.supplierId)) || { id: 1, name: 'General Supplier' };

    await api.addMedicine({
      ...newMed,
      category: cat,
      supplier: sup
    });
    setShowAddModal(false);
    setNewMed({
      name: '',
      type: 'Tablet',
      genericName: '',
      batchNumber: '',
      stockQuantity: 50,
      minStockThreshold: 15,
      unitPrice: '',
      mfgDate: new Date().toISOString().slice(0, 10),
      expDate: '',
      categoryId: 1,
      supplierId: 1
    });
    loadData();
  };

  const handleDeleteMedicine = async (id) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      await api.deleteMedicine(id);
      loadData();
    }
  };

  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.genericName && m.genericName.toLowerCase().includes(search.toLowerCase())) ||
    m.batchNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {activeTab === 'staff' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Users size={20} color="#0284c7" /><span>Pharmacist Accounts</span></div>
          </div>
          <div style={{ padding: '1.25rem' }}>
            {staffError && <div className="badge badge-danger" style={{ display: 'block', marginBottom: '1rem', padding: '0.75rem' }}>{staffError}</div>}
            {createdCredentials && (
              <div className="badge badge-success" style={{ display: 'block', marginBottom: '1rem', padding: '0.75rem' }}>
                Account created. Give these credentials to {createdCredentials.fullName}: <strong>{createdCredentials.username}</strong> / <strong>{createdCredentials.password}</strong>
                <button className="btn btn-secondary btn-sm" style={{ marginLeft: '0.75rem' }} onClick={() => setCreatedCredentials(null)}>Dismiss</button>
              </div>
            )}
            <form onSubmit={handleCreatePharmacist} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
              <div className="form-group"><label className="form-label">Full name</label><input className="form-control" required value={pharmacistForm.fullName} onChange={e => setPharmacistForm({ ...pharmacistForm, fullName: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Username</label><input className="form-control" required minLength={3} maxLength={50} value={pharmacistForm.username} onChange={e => setPharmacistForm({ ...pharmacistForm, username: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-control" type="email" required value={pharmacistForm.email} onChange={e => setPharmacistForm({ ...pharmacistForm, email: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={pharmacistForm.phone} onChange={e => setPharmacistForm({ ...pharmacistForm, phone: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Temporary password</label><input className="form-control" type="password" required minLength={8} value={pharmacistForm.password} onChange={e => setPharmacistForm({ ...pharmacistForm, password: e.target.value })} /></div>
              <button className="btn btn-primary" type="submit"><UserPlus size={16} /> Create account</button>
            </form>
          </div>
          <div className="table-responsive">
            <table className="data-table"><thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
              <tbody>{pharmacists.map(person => <tr key={person.id}><td>{person.fullName}</td><td><code>{person.username}</code></td><td>{person.email}</td><td>{person.phone || '—'}</td><td>
                <button className="btn btn-secondary btn-sm" onClick={() => openAccountEditor('pharmacist', person)} title="Edit pharmacist"><Pencil size={14} /></button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAccount('pharmacist', person)} title="Delete pharmacist"><Trash2 size={14} /></button>
              </td></tr>)}</tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Users size={20} color="#0284c7" /><span>Customer Accounts</span></div>
            <span className="badge badge-info">{customers.length} customers</span>
          </div>
          {managementError && <div className="badge badge-danger" style={{ display: 'block', margin: '1rem', padding: '0.75rem' }}>{managementError}</div>}
          {createdCredentials && (
            <div className="badge badge-success" style={{ display: 'block', margin: '1rem', padding: '0.75rem' }}>
              Account created for {createdCredentials.fullName}: <strong>{createdCredentials.username}</strong> / <strong>{createdCredentials.password}</strong>
              <button type="button" className="btn btn-secondary btn-sm" style={{ marginLeft: '0.75rem' }} onClick={() => setCreatedCredentials(null)}>Dismiss</button>
            </div>
          )}
          <form onSubmit={handleCreateCustomer} style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
            <div className="form-group"><label className="form-label">Full name</label><input className="form-control" required value={customerForm.fullName} onChange={e => setCustomerForm({ ...customerForm, fullName: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Username</label><input className="form-control" required minLength={3} maxLength={50} value={customerForm.username} onChange={e => setCustomerForm({ ...customerForm, username: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-control" type="email" required value={customerForm.email} onChange={e => setCustomerForm({ ...customerForm, email: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={customerForm.phone} onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Initial password</label><input className="form-control" type="password" required minLength={8} value={customerForm.password} onChange={e => setCustomerForm({ ...customerForm, password: e.target.value })} /></div>
            <button type="submit" className="btn btn-primary"><UserPlus size={16} /> Add customer</button>
          </form>
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Phone</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.id}>
                    <td>{customer.fullName}</td>
                    <td><code>{customer.username}</code></td>
                    <td>{customer.email}</td>
                    <td>{customer.phone || '—'}</td>
                    <td>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '—'}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => openAccountEditor('customer', customer)} title="Edit customer"><Pencil size={14} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAccount('customer', customer)} title="Delete customer"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && <tr><td colSpan="6">No customer accounts yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      {stats && (
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <Package size={24} />
            </div>
            <div className="metric-data">
              <h3>{stats.totalMedicines}</h3>
              <p>Total Formulations</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
              <AlertTriangle size={24} />
            </div>
            <div className="metric-data">
              <h3>{stats.lowStockCount}</h3>
              <p>Low Stock Batches</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#fee2e2', color: '#b91c1c' }}>
              <Clock size={24} />
            </div>
            <div className="metric-data">
              <h3>{stats.expiringSoonCount}</h3>
              <p>Expiring Soon (&lt;30d)</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#dcfce7', color: '#15803d' }}>
              <IndianRupee size={24} />
            </div>
            <div className="metric-data">
              <h3>₹{stats.totalRevenue}</h3>
              <p>Total Sales ({stats.totalOrders} bills)</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content by Tab */}
      {(activeTab === 'dashboard' || activeTab === 'medicines') && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Package size={20} color="#0284c7" />
              <span>Medicine & Syrup Master Inventory</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search tablet, syrup, batch..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  style={{ width: '250px', paddingLeft: '2rem' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              </div>
              <button className="btn btn-primary" onClick={() => openMedicineForm()}>
                <Plus size={16} /> Add Formulation
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Brand Name / Formula</th>
                  <th>Dosage Type</th>
                  <th>Batch No</th>
                  <th>Category</th>
                  <th>Stock Available</th>
                  <th>MRP (₹)</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((m) => {
                  const isLow = m.stockQuantity <= m.minStockThreshold;
                  const isExpiring = new Date(m.expDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                  return (
                    <tr key={m.id}>
                      <td>
                        <strong>{m.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.genericName || '—'}</div>
                      </td>
                      <td>
                        <span className={`badge ${m.type === 'Syrup' ? 'badge-warning' : 'badge-info'}`}>
                          {m.type || 'Tablet'}
                        </span>
                      </td>
                      <td><code>{m.batchNumber}</code></td>
                      <td>{m.category?.name || 'General'}</td>
                      <td>
                        <strong style={{ color: isLow ? '#b91c1c' : '#0f172a' }}>
                          {m.stockQuantity}
                        </strong> {m.type === 'Syrup' ? 'bottles' : 'units'}
                      </td>
                      <td>₹{Number(m.unitPrice).toFixed(2)}</td>
                      <td>{m.expDate}</td>
                      <td>
                        {isLow && <span className="badge badge-warning">Low Stock</span>}
                        {isExpiring && <span className="badge badge-danger" style={{ marginLeft: '4px' }}>Expiring</span>}
                        {!isLow && !isExpiring && <span className="badge badge-success">Adequate</span>}
                      </td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => openMedicineForm(m)} title="Edit medicine">
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteMedicine(m.id)}
                          title="Delete Medicine"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Suppliers & Categories Tab */}
      {activeTab === 'suppliers' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Building2 size={20} color="#0284c7" />
                <span>Authorized Indian Pharmaceutical Distributors</span>
              </div>
              <form onSubmit={handleSaveSupplier} style={{ padding: '1rem', display: 'grid', gap: '0.6rem' }}>
                <input className="form-control" required placeholder="Supplier name" value={supplierForm.name} onChange={e => setSupplierForm({ ...supplierForm, name: e.target.value })} />
                <input className="form-control" placeholder="Contact person" value={supplierForm.contactPerson} onChange={e => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })} />
                <input className="form-control" type="email" placeholder="Email" value={supplierForm.email} onChange={e => setSupplierForm({ ...supplierForm, email: e.target.value })} />
                <input className="form-control" placeholder="Phone" value={supplierForm.phone} onChange={e => setSupplierForm({ ...supplierForm, phone: e.target.value })} />
                <input className="form-control" placeholder="Address" value={supplierForm.address} onChange={e => setSupplierForm({ ...supplierForm, address: e.target.value })} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary">{supplierForm.id ? 'Save supplier' : 'Add supplier'}</button>
                  {supplierForm.id && <button type="button" className="btn btn-secondary" onClick={() => setSupplierForm({ id: null, name: '', contactPerson: '', email: '', phone: '', address: '' })}>Cancel edit</button>}
                </div>
              </form>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company / Supplier</th>
                    <th>Contact Person</th>
                    <th>Phone / Contact</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map(s => (
                    <tr key={s.id}>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.contactPerson}</td>
                      <td>{s.phone}</td>
                      <td>{s.address || '—'}</td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => setSupplierForm({ ...s })} title="Edit supplier"><Pencil size={14} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSupplier(s)} title="Delete supplier"><Trash2 size={14} /></button>
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
                <Layers size={20} color="#0d9488" />
                <span>Therapeutic Categories</span>
              </div>
              <form onSubmit={handleSaveCategory} style={{ padding: '1rem', display: 'grid', gap: '0.6rem' }}>
                <input className="form-control" required placeholder="Category name" value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} />
                <textarea className="form-control" placeholder="Description" value={categoryForm.description} onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary">{categoryForm.id ? 'Save category' : 'Add category'}</button>
                  {categoryForm.id && <button type="button" className="btn btn-secondary" onClick={() => setCategoryForm({ id: null, name: '', description: '' })}>Cancel edit</button>}
                </div>
              </form>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td style={{ color: '#64748b' }}>{c.description}</td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => setCategoryForm({ ...c })} title="Edit category"><Pencil size={14} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(c)} title="Delete category"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders History Tab */}
      {activeTab === 'orders' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <IndianRupee size={20} color="#15803d" />
              <span>Complete Pharmacy Sales Records (GST Compliant)</span>
            </div>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Patient Name</th>
                  <th>Date & Time</th>
                  <th>Payment Mode</th>
                  <th>Taxable Val</th>
                  <th>GST (5%)</th>
                  <th>Net Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td><code>{o.invoiceNumber}</code></td>
                    <td>{o.customerName}</td>
                    <td>{new Date(o.orderDate).toLocaleString('en-IN')}</td>
                    <td><span className="badge badge-info">{o.paymentMethod}</span></td>
                    <td>₹{Number(o.totalAmount).toFixed(2)}</td>
                    <td>₹{Number(o.taxAmount).toFixed(2)}</td>
                    <td><strong>₹{Number(o.netAmount).toFixed(2)}</strong></td>
                    <td><span className="badge badge-success">{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingAccount && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="card-header">
              <h3 className="card-title">Edit {editingAccount.type} account</h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingAccount(null)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveAccount}>
              <div className="form-group"><label className="form-label">Full name</label><input className="form-control" required value={accountForm.fullName} onChange={e => setAccountForm({ ...accountForm, fullName: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-control" type="email" required value={accountForm.email} onChange={e => setAccountForm({ ...accountForm, email: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={accountForm.phone} onChange={e => setAccountForm({ ...accountForm, phone: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Address</label><textarea className="form-control" value={accountForm.address} onChange={e => setAccountForm({ ...accountForm, address: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">New password (optional)</label><input className="form-control" type="password" minLength={8} value={accountForm.password} onChange={e => setAccountForm({ ...accountForm, password: e.target.value })} /></div>
              {managementError && <div className="badge badge-danger" style={{ display: 'block', marginBottom: '0.75rem', padding: '0.75rem' }}>{managementError}</div>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingAccount(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="card-header">
              <h3 className="card-title">{editingMedicineId ? 'Edit Medicine / Syrup' : 'Add New Medicine / Syrup'}</h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setShowAddModal(false); setEditingMedicineId(null); }}><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveMedicine}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dolo 650mg or Benadryl Syrup"
                    className="form-control"
                    value={newMed.name}
                    onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Dosage Form *</label>
                  <select
                    className="form-control"
                    value={newMed.type}
                    onChange={e => setNewMed({ ...newMed, type: e.target.value })}
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Syrup">Syrup (Liquid)</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Suspension">Oral Suspension</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Active Chemical Composition</label>
                <input
                  type="text"
                  placeholder="e.g. Paracetamol 650mg or Diphenhydramine HCl"
                  className="form-control"
                  value={newMed.genericName}
                  onChange={e => setNewMed({ ...newMed, genericName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Batch Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BAT-2026-IN01"
                    className="form-control"
                    value={newMed.batchNumber}
                    onChange={e => setNewMed({ ...newMed, batchNumber: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Retail MRP (₹) *</label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    placeholder="0.00"
                    className="form-control"
                    value={newMed.unitPrice}
                    onChange={e => setNewMed({ ...newMed, unitPrice: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Stock Units / Bottles *</label>
                  <input
                    type="number"
                    required
                    className="form-control"
                    value={newMed.stockQuantity}
                    onChange={e => setNewMed({ ...newMed, stockQuantity: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Min Stock Alert Limit</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newMed.minStockThreshold}
                    onChange={e => setNewMed({ ...newMed, minStockThreshold: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Mfg Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newMed.mfgDate}
                    onChange={e => setNewMed({ ...newMed, mfgDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={newMed.expDate}
                    onChange={e => setNewMed({ ...newMed, expDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={newMed.categoryId}
                    onChange={e => setNewMed({ ...newMed, categoryId: e.target.value })}
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pharma Manufacturer</label>
                  <select
                    className="form-control"
                    value={newMed.supplierId}
                    onChange={e => setNewMed({ ...newMed, supplierId: e.target.value })}
                  >
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowAddModal(false); setEditingMedicineId(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingMedicineId ? 'Save changes' : 'Save to Master Inventory'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
