// API Service - Indian Pharmacy Edition with Strict Authentication & Role Management

export const INDIAN_USERS = [
  {
    id: 1,
    username: "admin",
    password: "admin@123",
    role: "ADMIN",
    fullName: "Rajesh Sharma (Admin)",
    phone: "+91 98765 43210",
    email: "admin@crazymedicals.in"
  },
  {
    id: 2,
    username: "pharmacist",
    password: "pharma@123",
    role: "PHARMACIST",
    fullName: "Suresh Patel (Reg. Pharmacist)",
    phone: "+91 98450 12345",
    email: "pharmacist@crazymedicals.in",
    regNo: "PCI/KA-10482"
  },
  {
    id: 3,
    username: "customer",
    password: "customer@123",
    role: "CUSTOMER",
    fullName: "Ananya Verma",
    phone: "+91 99123 45678",
    email: "ananya.verma@gmail.com",
    address: "#42, 3rd Cross, Indiranagar, Bengaluru - 560038"
  }
];

export const INDIAN_MEDICINES = [
  // --- TABLETS & CAPSULES ---
  {
    id: 1,
    name: "Dolo 650mg Tablet",
    type: "Tablet",
    genericName: "Paracetamol (Acetaminophen) 650mg",
    batchNumber: "BAT-DOL-2025-01",
    stockQuantity: 180,
    minStockThreshold: 30,
    unitPrice: 32.50,
    mfgDate: "2025-01-15",
    expDate: "2027-12-31",
    category: { id: 1, name: "Tablets & Capsules" },
    supplier: { id: 1, name: "Micro Labs Ltd." }
  },
  {
    id: 2,
    name: "Augmentin 625 Duo Tablet",
    type: "Tablet",
    genericName: "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
    batchNumber: "BAT-AUG-2025-04",
    stockQuantity: 65,
    minStockThreshold: 20,
    unitPrice: 204.00,
    mfgDate: "2025-02-10",
    expDate: "2027-01-20",
    category: { id: 1, name: "Tablets & Capsules" },
    supplier: { id: 2, name: "GlaxoSmithKline Pharmaceuticals" }
  },
  {
    id: 3,
    name: "Pan-D Capsule",
    type: "Capsule",
    genericName: "Pantoprazole (40mg) + Domperidone (30mg SR)",
    batchNumber: "BAT-PND-2024-11",
    stockQuantity: 8, // Low Stock Alert
    minStockThreshold: 25,
    unitPrice: 195.00,
    mfgDate: "2024-11-01",
    expDate: "2026-11-15",
    category: { id: 1, name: "Tablets & Capsules" },
    supplier: { id: 3, name: "Alkem Laboratories" }
  },
  {
    id: 4,
    name: "Combiflam Tablet",
    type: "Tablet",
    genericName: "Ibuprofen (400mg) + Paracetamol (325mg)",
    batchNumber: "BAT-CMB-2024-08",
    stockQuantity: 210,
    minStockThreshold: 40,
    unitPrice: 46.00,
    mfgDate: "2024-08-15",
    expDate: "2027-08-15",
    category: { id: 1, name: "Tablets & Capsules" },
    supplier: { id: 4, name: "Sanofi India Ltd." }
  },
  {
    id: 5,
    name: "Azithral 500mg Tablet",
    type: "Tablet",
    genericName: "Azithromycin 500mg",
    batchNumber: "BAT-AZI-2024-06",
    stockQuantity: 42,
    minStockThreshold: 15,
    unitPrice: 135.00,
    mfgDate: "2024-06-12",
    expDate: "2026-10-25", // Expiring soon (<30 days)
    category: { id: 1, name: "Tablets & Capsules" },
    supplier: { id: 5, name: "Alembic Pharmaceuticals" }
  },
  {
    id: 6,
    name: "Telma 40 Tablet",
    type: "Tablet",
    genericName: "Telmisartan 40mg (BP Management)",
    batchNumber: "BAT-TEL-2025-03",
    stockQuantity: 95,
    minStockThreshold: 20,
    unitPrice: 118.00,
    mfgDate: "2025-03-01",
    expDate: "2028-02-28",
    category: { id: 1, name: "Tablets & Capsules" },
    supplier: { id: 6, name: "Glenmark Pharmaceuticals" }
  },
  {
    id: 7,
    name: "Shelcal 500 Tablet",
    type: "Tablet",
    genericName: "Elemental Calcium 500mg + Vitamin D3 250 IU",
    batchNumber: "BAT-SHL-2025-02",
    stockQuantity: 6, // Low stock
    minStockThreshold: 20,
    unitPrice: 142.00,
    mfgDate: "2025-02-14",
    expDate: "2027-08-14",
    category: { id: 1, name: "Tablets & Capsules" },
    supplier: { id: 7, name: "Torrent Pharmaceuticals" }
  },
  {
    id: 8,
    name: "Limcee 500mg Chewable",
    type: "Chewable Tablet",
    genericName: "Ascorbic Acid (Vitamin C) 500mg (Orange Flavour)",
    batchNumber: "BAT-LIM-2024-03",
    stockQuantity: 5, // Low stock & expiring soon
    minStockThreshold: 25,
    unitPrice: 28.50,
    mfgDate: "2024-03-10",
    expDate: "2026-10-28", // Expiring soon
    category: { id: 1, name: "Tablets & Capsules" },
    supplier: { id: 8, name: "Abbott Healthcare India" }
  },

  // --- SYRUPS & SUSPENSIONS ---
  {
    id: 9,
    name: "Benadryl Cough Syrup (100ml)",
    type: "Syrup",
    genericName: "Diphenhydramine HCl + Ammonium Chloride",
    batchNumber: "BAT-BND-2025-01",
    stockQuantity: 55,
    minStockThreshold: 15,
    unitPrice: 115.00,
    mfgDate: "2025-01-20",
    expDate: "2027-01-20",
    category: { id: 2, name: "Syrups & Suspensions" },
    supplier: { id: 9, name: "Johnson & Johnson India" }
  },
  {
    id: 10,
    name: "Ascoril-D Plus Syrup (100ml)",
    type: "Syrup",
    genericName: "Dextromethorphan + Phenylephrine + Chlorpheniramine",
    batchNumber: "BAT-ASC-2025-02",
    stockQuantity: 40,
    minStockThreshold: 12,
    unitPrice: 128.00,
    mfgDate: "2025-02-18",
    expDate: "2027-08-18",
    category: { id: 2, name: "Syrups & Suspensions" },
    supplier: { id: 6, name: "Glenmark Pharmaceuticals" }
  },
  {
    id: 11,
    name: "Gelusil Antacid Syrup (200ml)",
    type: "Syrup",
    genericName: "Aluminium Hydroxide + Magnesium Hydroxide + Simethicone",
    batchNumber: "BAT-GEL-2024-09",
    stockQuantity: 7, // Low stock
    minStockThreshold: 15,
    unitPrice: 138.00,
    mfgDate: "2024-09-01",
    expDate: "2026-11-20",
    category: { id: 2, name: "Syrups & Suspensions" },
    supplier: { id: 10, name: "Pfizer India Ltd." }
  },
  {
    id: 12,
    name: "Aristozyme Digestive Syrup (200ml)",
    type: "Syrup",
    genericName: "Diastase (1:1200) + Pepsin (1:3000) Pineapple Flavour",
    batchNumber: "BAT-ARZ-2025-03",
    stockQuantity: 48,
    minStockThreshold: 10,
    unitPrice: 148.00,
    mfgDate: "2025-03-05",
    expDate: "2027-09-05",
    category: { id: 2, name: "Syrups & Suspensions" },
    supplier: { id: 11, name: "Aristo Pharmaceuticals" }
  },
  {
    id: 13,
    name: "Calpol Paediatric Oral Suspension (60ml)",
    type: "Suspension",
    genericName: "Paracetamol Paediatric 120mg/5ml (Strawberry Flavour)",
    batchNumber: "BAT-CLP-2024-05",
    stockQuantity: 35,
    minStockThreshold: 15,
    unitPrice: 42.00,
    mfgDate: "2024-05-15",
    expDate: "2026-10-31", // Expiring soon (<30 days)
    category: { id: 2, name: "Syrups & Suspensions" },
    supplier: { id: 2, name: "GlaxoSmithKline Pharmaceuticals" }
  },
  {
    id: 14,
    name: "Becosules Performance Syrup (225ml)",
    type: "Syrup",
    genericName: "B-Complex + L-Lysine + Amino Acids & Minerals",
    batchNumber: "BAT-BCS-2025-04",
    stockQuantity: 62,
    minStockThreshold: 15,
    unitPrice: 195.00,
    mfgDate: "2025-04-10",
    expDate: "2027-10-10",
    category: { id: 2, name: "Syrups & Suspensions" },
    supplier: { id: 10, name: "Pfizer India Ltd." }
  },
  {
    id: 15,
    name: "Cremaffin Plus Syrup (225ml)",
    type: "Syrup",
    genericName: "Liquid Paraffin + Milk of Magnesia Laxative",
    batchNumber: "BAT-CRF-2025-02",
    stockQuantity: 28,
    minStockThreshold: 10,
    unitPrice: 245.00,
    mfgDate: "2025-02-01",
    expDate: "2027-05-01",
    category: { id: 2, name: "Syrups & Suspensions" },
    supplier: { id: 8, name: "Abbott Healthcare India" }
  },
  {
    id: 16,
    name: "Grilinctus-BM Syrup (100ml)",
    type: "Syrup",
    genericName: "Terbutaline Sulphate + Bromhexine HCl",
    batchNumber: "BAT-GRL-2024-10",
    stockQuantity: 4, // Low stock
    minStockThreshold: 12,
    unitPrice: 108.00,
    mfgDate: "2024-10-10",
    expDate: "2026-11-30",
    category: { id: 2, name: "Syrups & Suspensions" },
    supplier: { id: 12, name: "Franco-Indian Pharmaceuticals" }
  }
];

export const INDIAN_CATEGORIES = [
  { id: 1, name: "Tablets & Capsules", description: "Oral solid dosages, painkillers, antibiotics, BP/Diabetes tablets" },
  { id: 2, name: "Syrups & Suspensions", description: "Liquid oral formulations, cough syrups, antacids, pediatric syrups" },
  { id: 3, name: "Antibiotics & Anti-infectives", description: "Broad-spectrum antibacterial & antifungal medications" },
  { id: 4, name: "Digestive & Antacids", description: "Acidity relief, digestive enzymes, and laxative preparations" },
  { id: 5, name: "Vitamins, Minerals & Calcium", description: "Nutritional supplements, Vitamin C, D3, and multivitamins" }
];

export const INDIAN_SUPPLIERS = [
  { id: 1, name: "Micro Labs Ltd.", contactPerson: "Ramesh Nair", email: "orders@microlabs.in", phone: "+91 80 2234 5678", state: "Karnataka" },
  { id: 2, name: "GlaxoSmithKline India", contactPerson: "Priya Sundaram", email: "distributors@gsk.in", phone: "+91 22 2495 9000", state: "Maharashtra" },
  { id: 3, name: "Alkem Laboratories Ltd.", contactPerson: "Vikas Deshmukh", email: "supply@alkem.com", phone: "+91 22 3982 9999", state: "Maharashtra" },
  { id: 4, name: "Sanofi India Ltd.", contactPerson: "Anil Kulkarni", email: "contact@sanofi.in", phone: "+91 22 2803 2000", state: "Maharashtra" },
  { id: 5, name: "Alembic Pharmaceuticals", contactPerson: "Deepak Mehta", email: "orders@alembic.co.in", phone: "+91 265 2280 550", state: "Gujarat" },
  { id: 6, name: "Glenmark Pharmaceuticals", contactPerson: "Kavita Rao", email: "sales@glenmarkpharma.com", phone: "+91 22 4018 9999", state: "Maharashtra" },
  { id: 7, name: "Torrent Pharmaceuticals", contactPerson: "Jignesh Patel", email: "supply@torrentpharma.com", phone: "+91 79 2659 9000", state: "Gujarat" },
  { id: 8, name: "Abbott Healthcare India", contactPerson: "Sunil Chopra", email: "care@abbott.in", phone: "+91 22 3816 2000", state: "Himachal Pradesh" }
];

const INITIAL_PRESCRIPTIONS = [
  {
    id: 1,
    customerName: "Ananya Verma",
    doctorName: "Dr. K. Srinivas (MBBS, MD)",
    patientName: "Ananya Verma",
    notes: "Rx: Augmentin 625 Duo (1 tab BD x 5 days) + Benadryl Cough Syrup (10ml TDS x 5 days).",
    status: "APPROVED",
    createdAt: "2026-10-05T11:30:00"
  },
  {
    id: 2,
    customerName: "Ananya Verma",
    doctorName: "Dr. Meenakshi Sundaram",
    patientName: "Rohan Verma (Age: 6)",
    notes: "Rx: Calpol Paediatric Syrup 5ml SOS for fever > 100 F.",
    status: "PENDING",
    createdAt: "2026-10-06T10:15:00"
  }
];

const INITIAL_ORDERS = [
  {
    id: 1,
    invoiceNumber: "INV-20261005-7842",
    customerName: "Ananya Verma",
    orderDate: "2026-10-05T12:00:00",
    totalAmount: 236.50,
    cgstAmount: 5.91,
    sgstAmount: 5.91,
    taxAmount: 11.82,
    discountAmount: 10.00,
    netAmount: 238.32,
    paymentMethod: "UPI (Google Pay)",
    status: "COMPLETED",
    items: [
      { medicineName: "Dolo 650mg Tablet", quantity: 1, unitPrice: 32.50, subtotal: 32.50 },
      { medicineName: "Augmentin 625 Duo Tablet", quantity: 1, unitPrice: 204.00, subtotal: 204.00 }
    ]
  }
];

class PharmacyService {
  constructor() {
    this.users = INDIAN_USERS;
    this.medicines = JSON.parse(localStorage.getItem('in_pharmacy_medicines')) || INDIAN_MEDICINES;
    this.categories = JSON.parse(localStorage.getItem('in_pharmacy_categories')) || INDIAN_CATEGORIES;
    this.suppliers = JSON.parse(localStorage.getItem('in_pharmacy_suppliers')) || INDIAN_SUPPLIERS;
    this.prescriptions = JSON.parse(localStorage.getItem('in_pharmacy_prescriptions')) || INITIAL_PRESCRIPTIONS;
    this.orders = JSON.parse(localStorage.getItem('in_pharmacy_orders')) || INITIAL_ORDERS;
    this.currentUser = JSON.parse(localStorage.getItem('in_current_user')) || null;
  }

  save() {
    localStorage.setItem('in_pharmacy_medicines', JSON.stringify(this.medicines));
    localStorage.setItem('in_pharmacy_categories', JSON.stringify(this.categories));
    localStorage.setItem('in_pharmacy_suppliers', JSON.stringify(this.suppliers));
    localStorage.setItem('in_pharmacy_prescriptions', JSON.stringify(this.prescriptions));
    localStorage.setItem('in_pharmacy_orders', JSON.stringify(this.orders));
  }

  // Authentication & Session
  login(username, password) {
    const user = this.users.find(u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password);
    if (!user) {
      throw new Error("Invalid username or password. Please verify credentials.");
    }
    const sessionUser = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone,
      email: user.email,
      regNo: user.regNo || null
    };
    this.currentUser = sessionUser;
    localStorage.setItem('in_current_user', JSON.stringify(sessionUser));
    return sessionUser;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('in_current_user');
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // Dashboard Stats
  async getDashboardStats() {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    const lowStockCount = this.medicines.filter(m => m.stockQuantity <= m.minStockThreshold).length;
    const expiringSoonCount = this.medicines.filter(m => {
      const exp = new Date(m.expDate);
      return exp <= thirtyDaysLater;
    }).length;

    const totalRevenue = this.orders.reduce((acc, curr) => acc + (Number(curr.netAmount) || 0), 0);
    const pendingPrescriptions = this.prescriptions.filter(p => p.status === 'PENDING').length;

    return {
      totalMedicines: this.medicines.length,
      lowStockCount,
      expiringSoonCount,
      totalOrders: this.orders.length,
      totalRevenue: totalRevenue.toFixed(2),
      pendingPrescriptions
    };
  }

  // Medicines
  async getMedicines(search = '', categoryId = null) {
    let list = [...this.medicines];
    if (categoryId && categoryId !== 'ALL') {
      list = list.filter(m => m.category?.id === Number(categoryId) || m.category?.name === categoryId);
    }
    if (!search) return list;
    const s = search.toLowerCase();
    return list.filter(m =>
      m.name.toLowerCase().includes(s) ||
      (m.genericName && m.genericName.toLowerCase().includes(s)) ||
      m.batchNumber.toLowerCase().includes(s)
    );
  }

  async addMedicine(medicineData) {
    const newMed = {
      ...medicineData,
      id: Date.now(),
      stockQuantity: Number(medicineData.stockQuantity),
      minStockThreshold: Number(medicineData.minStockThreshold || 10),
      unitPrice: Number(medicineData.unitPrice)
    };
    this.medicines.unshift(newMed);
    this.save();
    return newMed;
  }

  async updateStock(id, newStock) {
    const med = this.medicines.find(m => m.id === id);
    if (med) {
      med.stockQuantity = Number(newStock);
      this.save();
      return med;
    }
    throw new Error('Medicine not found');
  }

  async deleteMedicine(id) {
    this.medicines = this.medicines.filter(m => m.id !== id);
    this.save();
    return true;
  }

  // Categories & Suppliers
  async getCategories() { return [...this.categories]; }
  async getSuppliers() { return [...this.suppliers]; }

  // Billing & Sale (with Indian GST: CGST 2.5% + SGST 2.5%)
  async createOrder({ customerName, items, discount = 0, paymentMethod = 'UPI (PhonePe/GPay)' }) {
    if (!items || items.length === 0) throw new Error("No items selected");

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const med = this.medicines.find(m => m.id === item.medicineId);
      if (!med) throw new Error(`Medicine ${item.name} not found`);
      if (med.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${med.name}. Available: ${med.stockQuantity}`);
      }

      // Atomically decrement stock
      med.stockQuantity -= item.quantity;

      const itemTotal = med.unitPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        medicineId: med.id,
        medicineName: med.name,
        type: med.type,
        batchNumber: med.batchNumber,
        unitPrice: med.unitPrice,
        quantity: item.quantity,
        subtotal: itemTotal
      });
    }

    const discountAmount = Number(discount) || 0;
    const taxable = Math.max(0, subtotal - discountAmount);

    // Indian GST Breakdown: 5% total (2.5% CGST + 2.5% SGST)
    const cgst = Number((taxable * 0.025).toFixed(2));
    const sgst = Number((taxable * 0.025).toFixed(2));
    const totalTax = cgst + sgst;
    const netAmount = Number((taxable + totalTax).toFixed(2));

    const invoiceNumber = `INV-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: Date.now(),
      invoiceNumber,
      customerName: customerName || "Walk-in Patient",
      orderDate: new Date().toISOString(),
      totalAmount: subtotal.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      cgstAmount: cgst.toFixed(2),
      sgstAmount: sgst.toFixed(2),
      taxAmount: totalTax.toFixed(2),
      netAmount: netAmount.toFixed(2),
      paymentMethod,
      status: "COMPLETED",
      items: orderItems
    };

    this.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  async getOrders() { return [...this.orders]; }

  // Prescriptions
  async getPrescriptions() { return [...this.prescriptions]; }

  async submitPrescription({ customerName, doctorName, patientName, notes, file }) {
    const newPrescription = {
      id: Date.now(),
      customerName: customerName || "Ananya Verma",
      doctorName,
      patientName,
      notes,
      fileName: file ? file.name : "Doctor_Prescription_Scan.pdf",
      status: "PENDING",
      createdAt: new Date().toISOString()
    };
    this.prescriptions.unshift(newPrescription);
    this.save();
    return newPrescription;
  }

  async updatePrescriptionStatus(id, status) {
    const p = this.prescriptions.find(x => x.id === id);
    if (p) {
      p.status = status;
      this.save();
      return p;
    }
    throw new Error("Prescription not found");
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const SESSION_KEY = 'pharmacy_current_user';
const TOKEN_KEY = 'pharmacy_auth_token';

function normalizeMedicine(medicine) {
  const isSyrup = medicine.category?.name?.toLowerCase().includes('syrup')
    || medicine.name?.toLowerCase().includes('syrup');
  return { ...medicine, type: medicine.type || (isSyrup ? 'Syrup' : 'Tablet') };
}

function normalizeOrder(order) {
  const tax = Number(order.taxAmount || 0);
  return {
    ...order,
    customerName: order.customer?.fullName || 'Walk-in Patient',
    cgstAmount: (tax / 2).toFixed(2),
    sgstAmount: (tax / 2).toFixed(2),
    items: (order.orderItems || []).map(item => ({
      medicineId: item.medicine?.id,
      medicineName: item.medicine?.name || 'Medicine',
      type: item.medicine?.type || 'Tablet',
      batchNumber: item.medicine?.batchNumber,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal
    }))
  };
}

function normalizePrescription(prescription) {
  return {
    ...prescription,
    customerName: prescription.customer?.fullName || 'Customer',
    fileName: prescription.filePath || 'No file attached'
  };
}

class DatabasePharmacyService {
  async request(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    const contentType = response.headers.get('content-type') || '';
    const result = contentType.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
      throw new Error(result?.error || result?.message || `Request failed (${response.status})`);
    }
    return result;
  }

  saveSession(user) {
    localStorage.setItem(TOKEN_KEY, user.token);
    const sessionUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  }

  async login(username, password) {
    const user = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    return this.saveSession(user);
  }

  async register(customer) {
    const user = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...customer, role: 'CUSTOMER' })
    });
    return this.saveSession(user);
  }

  async loginWithGoogle(credential) {
    const user = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential })
    });
    return this.saveSession(user);
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
    } catch {
      this.logout();
      return null;
    }
  }

  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  async getMedicines(search = '') {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return (await this.request(`/medicines${query}`)).map(normalizeMedicine);
  }

  async addMedicine(medicine) {
    const payload = {
      ...medicine,
      category: medicine.category?.id ? { id: medicine.category.id } : null,
      supplier: medicine.supplier?.id ? { id: medicine.supplier.id } : null
    };
    return normalizeMedicine(await this.request('/medicines', {
      method: 'POST',
      body: JSON.stringify(payload)
    }));
  }

  async updateMedicine(id, medicine) {
    const payload = {
      ...medicine,
      category: medicine.category?.id ? { id: medicine.category.id } : null,
      supplier: medicine.supplier?.id ? { id: medicine.supplier.id } : null
    };
    return normalizeMedicine(await this.request(`/medicines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }));
  }

  async updateStock(id, newStock) {
    return normalizeMedicine(await this.request(`/medicines/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stockQuantity: Number(newStock) })
    }));
  }

  async deleteMedicine(id) {
    return this.request(`/medicines/${id}`, { method: 'DELETE' });
  }

  async getCategories() {
    return this.request('/categories');
  }

  async createCategory(category) {
    return this.request('/categories', { method: 'POST', body: JSON.stringify(category) });
  }

  async updateCategory(id, category) {
    return this.request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(category) });
  }

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, { method: 'DELETE' });
  }

  async getSuppliers() {
    return this.request('/suppliers');
  }

  async createSupplier(supplier) {
    return this.request('/suppliers', { method: 'POST', body: JSON.stringify(supplier) });
  }

  async updateSupplier(id, supplier) {
    return this.request(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(supplier) });
  }

  async deleteSupplier(id) {
    return this.request(`/suppliers/${id}`, { method: 'DELETE' });
  }

  async getOrders() {
    const user = this.getCurrentUser();
    const path = user?.role === 'CUSTOMER' ? `/orders/customer/${user.id}` : '/orders';
    return (await this.request(path)).map(normalizeOrder);
  }

  async createOrder({ items, discount = 0, paymentMethod = 'CASH' }) {
    const user = this.getCurrentUser();
    const order = await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({
        customerId: user?.role === 'CUSTOMER' ? user.id : null,
        items: items.map(item => ({
          medicineId: item.medicineId,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice)
        })),
        discountAmount: Number(discount) || 0,
        taxRate: 0.05,
        paymentMethod
      })
    });
    return normalizeOrder(order);
  }

  async getPrescriptions() {
    const user = this.getCurrentUser();
    const path = user?.role === 'CUSTOMER'
      ? `/prescriptions/customer/${user.id}`
      : '/prescriptions';
    return (await this.request(path)).map(normalizePrescription);
  }

  async submitPrescription({ doctorName, patientName, notes }) {
    const user = this.getCurrentUser();
    return normalizePrescription(await this.request('/prescriptions', {
      method: 'POST',
      body: JSON.stringify({ customerId: user.id, doctorName, patientName, notes })
    }));
  }

  async updatePrescriptionStatus(id, status) {
    return normalizePrescription(await this.request(`/prescriptions/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }));
  }

  async getPharmacists() {
    return this.request('/admin/pharmacists');
  }

  async updatePharmacist(id, changes) {
    return this.request(`/admin/pharmacists/${id}`, { method: 'PUT', body: JSON.stringify(changes) });
  }

  async deletePharmacist(id) {
    return this.request(`/admin/pharmacists/${id}`, { method: 'DELETE' });
  }

  async getCustomers() {
    return this.request('/admin/customers');
  }

  async createCustomer(credentials) {
    return this.request('/admin/customers', { method: 'POST', body: JSON.stringify(credentials) });
  }

  async updateCustomer(id, changes) {
    return this.request(`/admin/customers/${id}`, { method: 'PUT', body: JSON.stringify(changes) });
  }

  async deleteCustomer(id) {
    return this.request(`/admin/customers/${id}`, { method: 'DELETE' });
  }

  async createPharmacist(credentials) {
    return this.request('/admin/pharmacists', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }
}

export const api = new DatabasePharmacyService();
