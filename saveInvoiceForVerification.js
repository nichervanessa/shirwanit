// saveInvoiceForVerification.js
// Add this helper to your desktop app (src/utils/saveInvoiceForVerification.js)
// Call it whenever you generate an invoice so it appears on the verification website.

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Saves a generated invoice to the public "invoices" collection in Firestore.
 * The verification website reads from this collection.
 *
 * @param {object} invoiceData  - data used to generate the invoice
 * @param {string} type         - 'payment' | 'loan' | 'customer'
 * @param {string} invoiceNumber - the INV-XXX-YYY-ZZZ string
 * @param {object} customer     - { name, phone, email, id }
 * @param {object} companyInfo  - { name, address, phone, email, website }
 */
export async function saveInvoiceForVerification(invoiceData, type, invoiceNumber, customer, companyInfo) {
  try {
    const docData = {
      invoiceNumber,
      type,
      createdAt: serverTimestamp(),
      issuedAt:  new Date().toISOString(),
      isVerified: true,
      verificationCount: 0,

      // Customer info (public — visible to anyone who verifies)
      customer: {
        name:  customer?.name  || 'Unknown',
        phone: customer?.phone || '',
        email: customer?.email || '',
        id:    customer?.id    || '',
      },

      // Company info
      company: {
        name:    companyInfo.name,
        address: companyInfo.address,
        phone:   companyInfo.phone,
        email:   companyInfo.email,
        website: companyInfo.website,
      },

      // Type-specific data
      data: buildTypeData(invoiceData, type),
    };

    await addDoc(collection(db, 'invoices'), docData);
    console.log('✅ Invoice saved for verification:', invoiceNumber);
  } catch (error) {
    // Non-critical — don't block the invoice generation
    console.warn('⚠️ Could not save invoice for verification:', error.message);
  }
}

function buildTypeData(data, type) {
  if (type === 'payment') {
    return {
      amount:   data.amount,
      date:     data.date,
      loanId:   data.loanId,
      method:   data.method || data.paymentMethod || 'Cash',
      status:   'completed',
    };
  }
  if (type === 'loan') {
    const totalPaid = (data.payments || []).reduce((s, p) => s + (p.amount || 0), 0);
    return {
      loanAmount:     data.amount,
      monthlyPayment: data.monthlyPayment,
      duration:       data.duration,
      startDate:      data.startDate,
      endDate:        data.endDate,
      status:         data.status,
      totalPaid,
      remaining:      data.amount - totalPaid,
    };
  }
  if (type === 'customer') {
    return {
      totalLoans:  data.loans?.length  || 0,
      totalAmount: data.loans?.reduce((s, l) => s + (l.amount || 0), 0) || 0,
      memberSince: data.createdAt,
      status:      'active',
    };
  }
  return {};
}
