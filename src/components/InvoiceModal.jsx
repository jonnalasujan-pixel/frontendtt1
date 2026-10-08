import React from 'react';
import { Printer, X, CheckCircle2 } from 'lucide-react';

export default function InvoiceModal({ invoice, onClose }) {
  if (!invoice) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534' }}>
            <CheckCircle2 size={24} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Tax Invoice Generated</h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Printable Indian Tax Invoice */}
        <div className="invoice-box printable-area">
          <div style={{ textAlign: 'center', borderBottom: '1px solid #000', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '0.5px' }}>
              CRAZY MEDICALS
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0 }}>
              Retail Chemist & Druggist • 24x7 Pharmacy Services
            </p>
            <p style={{ fontSize: '0.75rem', color: '#334155', margin: 0 }}>
              Shop No. 12, Main Market Road, Indiranagar, Bengaluru - 560038
            </p>
            <p style={{ fontSize: '0.75rem', color: '#334155', margin: '2px 0 0 0' }}>
              <strong>GSTIN:</strong> 29AABCU9603R1ZM | <strong>D.L. No:</strong> KA-B2-109481/82
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.75rem' }}>
            <div>
              <strong>Tax Invoice No:</strong> {invoice.invoiceNumber}<br />
              <strong>Patient/Customer:</strong> {invoice.customerName}
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong>Date & Time:</strong> {new Date(invoice.orderDate).toLocaleString('en-IN')}<br />
              <strong>Mode of Payment:</strong> {invoice.paymentMethod}
            </div>
          </div>

          <table style={{ width: '100%', fontSize: '0.825rem', borderCollapse: 'collapse', marginBottom: '0.75rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000' }}>
                <th style={{ textAlign: 'left', padding: '4px 0' }}>Particulars (Item)</th>
                <th style={{ textAlign: 'center', padding: '4px 0' }}>Type</th>
                <th style={{ textAlign: 'center', padding: '4px 0' }}>Batch</th>
                <th style={{ textAlign: 'center', padding: '4px 0' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '4px 0' }}>MRP (₹)</th>
                <th style={{ textAlign: 'right', padding: '4px 0' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items && invoice.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px dashed #cbd5e1' }}>
                  <td style={{ padding: '5px 0' }}>{item.medicineName}</td>
                  <td style={{ textAlign: 'center', fontSize: '0.75rem' }}>{item.type || 'Tab'}</td>
                  <td style={{ textAlign: 'center', fontSize: '0.75rem' }}>{item.batchNumber || 'BAT-01'}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right' }}>₹{Number(item.unitPrice).toFixed(2)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{Number(item.subtotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span>Subtotal (Taxable Value):</span>
              <span>₹{Number(invoice.totalAmount).toFixed(2)}</span>
            </div>
            {Number(invoice.discountAmount) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b91c1c', marginBottom: '3px' }}>
                <span>Discount Allowed:</span>
                <span>-₹{Number(invoice.discountAmount).toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: '0.8rem', color: '#475569' }}>
              <span>CGST (2.5%):</span>
              <span>₹{invoice.cgstAmount ? Number(invoice.cgstAmount).toFixed(2) : (Number(invoice.taxAmount)/2).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: '0.8rem', color: '#475569' }}>
              <span>SGST (2.5%):</span>
              <span>₹{invoice.sgstAmount ? Number(invoice.sgstAmount).toFixed(2) : (Number(invoice.taxAmount)/2).toFixed(2)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.1rem',
              fontWeight: 800,
              borderTop: '2px solid #000',
              paddingTop: '6px',
              marginTop: '6px'
            }}>
              <span>Net Payable (₹):</span>
              <span>₹{Number(invoice.netAmount).toFixed(2)}</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.725rem', color: '#475569', borderTop: '1px dotted #94a3b8', paddingTop: '0.5rem' }}>
            <div>* Goods once sold cannot be returned after 48 hours without bill. Keep medicines away from direct sunlight *</div>
            <strong>Thank you! Wish you a speedy recovery. (Crazy Medicals)</strong>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={16} /> Print Tax Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
