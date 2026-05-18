# 🔍 Loan Management Pro — Invoice Verification Website

A free, public website that lets anyone verify invoices issued by the **Loan Management Pro** desktop app.  
Hosted on **GitHub Pages** (free forever). Connected to your existing **Firebase** project.

**Live site after deployment:** `https://YOUR-USERNAME.github.io/lmp-verify`

---

## ✨ Features

| Feature | Details |
|---|---|
| **Manual code entry** | Type the invoice number from the bottom of the document |
| **QR scanner** | Scan the QR code with phone camera directly in the browser |
| **Real-time lookup** | Reads from the same Firebase project as the desktop app |
| **3 languages** | English / Arabic (RTL) / Kurdish Sorani (RTL) |
| **Verification report** | Download a printable PDF confirmation |
| **Recent history** | Remembers last 5 verifications in the browser |
| **Auto-fill from URL** | Link directly: `https://your-site/?code=INV-PAY-...` |
| **Mobile friendly** | Works on all screen sizes |

---

## 🚀 Deploy to GitHub Pages (Step by Step)

### Step 1 — Create a GitHub repository

1. Go to [github.com](https://github.com) → click **New repository**
2. Name it: `lmp-verify` (or anything you like)
3. Set it to **Public**
4. Click **Create repository**

### Step 2 — Upload these files

**Option A — GitHub web interface (easiest):**
1. Open your new repository
2. Click **Add file → Upload files**
3. Drag and drop ALL files from this folder
4. Important: also upload the `.github/workflows/deploy.yml` file
   - Click **Add file → Create new file**
   - Name it: `.github/workflows/deploy.yml`
   - Paste the content from the `deploy.yml` file
5. Click **Commit changes**

**Option B — Git command line:**
```bash
cd qr-verify-site
git init
git add .
git commit -m "Initial deploy"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/lmp-verify.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. In your repository, go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Click **Save**

The site will automatically build and deploy. Check the **Actions** tab to see progress.
After ~2 minutes your site will be live at: `https://YOUR-USERNAME.github.io/lmp-verify`

---

## 🔥 Firebase Setup (Connect to your desktop app data)

### Step 1 — Update Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com) → your project
2. Click **Firestore Database → Rules**
3. Replace the rules with the content from `firestore.rules`
4. Click **Publish**

This allows the public website to READ invoices, while only authenticated users (desktop app) can WRITE.

### Step 2 — Add invoice saving to the desktop app

When you generate an invoice in the desktop app, also save it to the `invoices` collection:

1. Copy `saveInvoiceForVerification.js` to `src/utils/` in your desktop app
2. In `ReportsAndInvoices.jsx`, import and call it when generating:

```javascript
import { saveInvoiceForVerification } from '../utils/saveInvoiceForVerification';

// Inside generateInvoiceHTML(), after building the invoice:
const invoiceNumber = buildInvoiceNumber(type, data.id);
const customer = getCustomerForPayment(data); // or getCustomerById

// Save to Firebase (non-blocking)
saveInvoiceForVerification(data, type, invoiceNumber, customer, companyInfo);
```

### Step 3 — Create the invoices collection index (optional but faster)

In Firebase Console → Firestore → Indexes → Add index:
- Collection: `invoices`
- Fields: `invoiceNumber` (Ascending)
- Query scope: Collection

---

## 🌍 Custom Domain (Optional)

To use your own domain like `verify.yourcompany.com`:

1. In GitHub repository → **Settings → Pages → Custom domain**
2. Enter your domain and click **Save**
3. In your DNS provider, add a CNAME record:
   - Name: `verify`
   - Value: `YOUR-USERNAME.github.io`
4. Enable **Enforce HTTPS**

---

## 📁 File Structure

```
qr-verify-site/
├── index.html              ← Main page (hero, verify, how-it-works, about)
├── style.css               ← All styling
├── firebase-config.js      ← Firebase initialization + lookup functions
├── i18n.js                 ← EN/AR/KU translations
├── app.js                  ← QR scanner, result rendering, verification logic
├── firestore.rules         ← Paste into Firebase Console
├── saveInvoiceForVerification.js  ← Add to desktop app
├── .github/
│   └── workflows/
│       └── deploy.yml      ← Auto-deploy on git push
└── README.md
```

---

## 🔗 QR Code URL Format

The desktop app generates QR codes with this URL pattern:
```
https://YOUR-USERNAME.github.io/lmp-verify?code=INV-PAY-ABC123-XYZ9
```

When someone scans the QR code, they land directly on the verification result.

To update the QR code base URL in the desktop app, edit `ReportsAndInvoices.jsx`:
```javascript
const buildQRCodeURL = (invoiceNumber) => {
  const verifyUrl = 'https://YOUR-USERNAME.github.io/lmp-verify';
  return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`${verifyUrl}?code=${invoiceNumber}`)}`;
};
```

---

## 🛡️ Security Notes

- The Firebase **client config** (API key, project ID) in `firebase-config.js` is safe to be public.  
  It only identifies your project — it does NOT grant admin access.
- Real security comes from **Firestore Rules** (`firestore.rules`) which control who can read/write.
- The **Admin SDK private key** (`serviceConfig.json`) must NEVER be in this website or the desktop app frontend. It belongs only on a private server.
- The `invoices` collection only stores data you explicitly write there — your private `users/` data remains protected.

---

## 📞 Support

Built by **BlackCode Soft Company LTD**  
Email: nichervan.essa@outlook.com  
GitHub: [@nichervanessa](https://github.com/nichervanessa)
