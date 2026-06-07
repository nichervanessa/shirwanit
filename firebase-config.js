// firebase-config.js
// Same Firebase project as SHIRWAN IT desktop app (Lendvora)
// Client-side config is safe to be public — it only identifies the project.
// Security is enforced by Firestore Security Rules (see README).

const firebaseConfig = {
  apiKey:            "AIzaSyA08-aVBU-uWOi3Xp-kBNTnU1Rmm8YNbOk",
  authDomain:        "loan-management-pro.firebaseapp.com",
  projectId:         "loan-management-pro",
  storageBucket:     "loan-management-pro.firebasestorage.app",
  messagingSenderId: "476913016250",
  appId:             "1:476913016250:web:517a22235e70c3021bd183"
};

// Initialize Firebase (compat SDK)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ── Public read helper ─────────────────────────────────────────────────────
// Searches the top-level "invoices" collection for a matching invoice number.
// The desktop app must write to this collection when generating an invoice.
// See README.md for the Firestore structure and security rules.

async function lookupInvoice(invoiceNumber) {
  const clean = invoiceNumber.trim().toUpperCase();

  // 1. Try exact match on invoiceNumber field
  const exact = await db.collection('invoices')
    .where('invoiceNumber', '==', clean)
    .limit(1)
    .get();

  if (!exact.empty) {
    return { found: true, data: { id: exact.docs[0].id, ...exact.docs[0].data() } };
  }

  // 2. Try partial prefix match (user may have typed only part of the code)
  const prefix = await db.collection('invoices')
    .orderBy('invoiceNumber')
    .startAt(clean)
    .endAt(clean + '\uf8ff')
    .limit(1)
    .get();

  if (!prefix.empty) {
    return { found: true, data: { id: prefix.docs[0].id, ...prefix.docs[0].data() } };
  }

  return { found: false };
}

// ── Verification counter ───────────────────────────────────────────────────
// Increments verificationCount on the invoice document (optional analytics)
async function recordVerification(docId) {
  try {
    await db.collection('invoices').doc(docId).update({
      verificationCount: firebase.firestore.FieldValue.increment(1),
      lastVerifiedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) {
    // Non-critical — don't throw
    console.warn('Could not update verification count:', e.message);
  }
}

// ── Stats counter (for hero section) ──────────────────────────────────────
async function getTotalVerifications() {
  try {
    const snap = await db.collection('stats').doc('verifications').get();
    if (snap.exists) return snap.data().total || 0;
    return 0;
  } catch {
    return 0;
  }
}

// ── Firebase Auth (for staff login) ───────────────────────────────────────
// firebase.auth() is available via the Firebase Auth compat SDK loaded in index.html
