// app.js — Main application logic

let html5QrCode = null;
window._scannerRunning = false;

// ── On load ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Nav scroll effect
  window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 20);
  });

  // Input live clear button
  const input = document.getElementById('invoiceInput');
  const clearBtn = document.getElementById('clearBtn');
  input?.addEventListener('input', () => {
    clearBtn.style.display = input.value ? 'flex' : 'none';
  });

  // Enter key support
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyInvoice();
  });

  // Auto-fill from URL ?code=INV-...
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code') || params.get('invoice');
  if (code) {
    input.value = code;
    clearBtn.style.display = 'flex';
    setTimeout(() => {
      document.getElementById('verify')?.scrollIntoView({ behavior: 'smooth' });
      verifyInvoice();
    }, 800);
  }

  // Load verification count for hero
  try {
    const total = await getTotalVerifications();
    const el = document.getElementById('statInvoices');
    if (el && total > 0) el.textContent = total.toLocaleString() + '+';
    else if (el) el.textContent = '100+';
  } catch { /* ignore */ }

  // Restore recent verifications from localStorage
  renderRecentChecks();
});

// ── Tab switching ──────────────────────────────────────────────────────────
function switchTab(tab) {
  ['manual','scan'].forEach(t => {
    document.getElementById(`tab-${t}`)?.classList.toggle('active', t === tab);
    document.getElementById(`pane-${t}`)?.classList.toggle('active', t === tab);
  });

  // Stop scanner when switching away
  if (tab !== 'scan' && window._scannerRunning) stopScanner();
}

// ── Nav burger ─────────────────────────────────────────────────────────────
function toggleNav() {
  document.getElementById('navLinks')?.classList.toggle('open');
}

// ── Clear input ────────────────────────────────────────────────────────────
function clearInput() {
  const input = document.getElementById('invoiceInput');
  input.value = '';
  document.getElementById('clearBtn').style.display = 'none';
  document.getElementById('resultArea').style.display = 'none';
  input.focus();
}

// ── Main verify function ───────────────────────────────────────────────────
async function verifyInvoice(codeOverride) {
  const input = document.getElementById('invoiceInput');
  const code  = (codeOverride || input?.value || '').trim();

  if (!code) {
    showToast(t('verify.placeholder') || 'Please enter an invoice number');
    input?.focus();
    return;
  }

  // Set loading state
  const btn = document.getElementById('verifyBtn');
  const btnText = document.getElementById('verifyBtnText');
  const spinner = document.getElementById('btnSpinner');
  if (btn) btn.disabled = true;
  if (btnText) btnText.style.display = 'none';
  if (spinner) spinner.style.display = 'block';

  const resultArea = document.getElementById('resultArea');
  resultArea.style.display = 'none';

  try {
    const result = await lookupInvoice(code);
    await showResult(result, code);

    // Save to recent
    saveRecentCheck(code, result.found);
    renderRecentChecks();
  } catch (err) {
    console.error('Verify error:', err);
    showResult({ found: false, error: err.message }, code);
  } finally {
    if (btn) btn.disabled = false;
    if (btnText) btnText.style.display = 'inline';
    if (spinner) spinner.style.display = 'none';
  }
}

// ── Render result card ─────────────────────────────────────────────────────
async function showResult(result, code) {
  const area = document.getElementById('resultArea');
  area.style.display = 'block';

  if (result.found) {
    const d = result.data;
    const typeLabel = getTypeLabel(d.type);
    const typeBadgeClass = `type-${d.type || 'payment'}`;

    // Increment verification counter
    if (d.id) recordVerification(d.id);

    area.innerHTML = `
      <div class="result-card success">
        <div class="result-header">
          <div class="result-icon ok">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <div class="result-title">${t('result.verified')}</div>
            <div class="result-subtitle">${t('result.verifiedSub')} <strong>${d.company?.name || d.companyName || 'Loan Management Pro'}</strong></div>
          </div>
          <div style="margin-left:auto">
            <span class="type-badge ${typeBadgeClass}">${typeLabel}</span>
          </div>
        </div>

        <div class="result-grid">
          <div class="result-field">
            <label>${t('result.invoice')}</label>
            <span style="font-family:monospace;font-size:12px">${d.invoiceNumber || code}</span>
          </div>
          <div class="result-field">
            <label>${t('result.customer')}</label>
            <span>${d.customer?.name || d.customerName || '—'}</span>
          </div>
          ${getAmountField(d)}
          <div class="result-field">
            <label>${t('result.date')}</label>
            <span>${formatDate(d.date || d.createdAt || d.data?.date)}</span>
          </div>
          <div class="result-field">
            <label>${t('result.company')}</label>
            <span>${d.company?.name || d.companyName || 'Loan Management Pro'}</span>
          </div>
          <div class="result-field">
            <label>${t('result.created')}</label>
            <span>${formatDate(d.createdAt || d.issuedAt)}</span>
          </div>
          ${d.verificationCount !== undefined ? `
          <div class="result-field">
            <label>${t('result.verifyCount')}</label>
            <span>${(d.verificationCount + 1).toLocaleString()}</span>
          </div>` : ''}
          ${getStatusField(d)}
        </div>

        <div class="result-actions">
          <button class="result-btn primary" onclick="downloadVerificationReport(${JSON.stringify(d).replace(/"/g, '&quot;')})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ${t('result.downloadBtn')}
          </button>
          <button class="result-btn ghost" onclick="clearInput(); document.getElementById('invoiceInput').focus();">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
            ${t('result.verifyAnotherBtn')}
          </button>
        </div>
      </div>
    `;
  } else {
    area.innerHTML = `
      <div class="result-card error">
        <div class="result-header">
          <div class="result-icon err">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div>
            <div class="result-title">${t('result.notFound')}</div>
            <div class="result-subtitle">${t('result.notFoundSub')}</div>
          </div>
        </div>
        <p style="color:#64748b;font-size:14px;margin-bottom:16px">
          Code searched: <code style="background:#f1f5f9;padding:2px 8px;border-radius:6px;font-size:13px">${escapeHtml(code)}</code>
        </p>
        <div class="result-actions">
          <button class="result-btn ghost" onclick="clearInput(); document.getElementById('invoiceInput').focus();">
            ${t('result.verifyAnotherBtn')}
          </button>
        </div>
      </div>
    `;
  }

  area.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── Amount field helper ────────────────────────────────────────────────────
function getAmountField(d) {
  let amount = null;
  if (d.data?.amount) amount = d.data.amount;
  else if (d.data?.loanAmount) amount = d.data.loanAmount;
  else if (d.amount) amount = d.amount;
  if (!amount) return '';
  return `<div class="result-field">
    <label>${t('result.amount')}</label>
    <span style="color:#1d4ed8;font-weight:800">${Number(amount).toLocaleString()} IQD</span>
  </div>`;
}

function getStatusField(d) {
  const status = d.data?.status || d.status;
  if (!status) return '';
  const map = { active: '#1d4ed8', completed: '#16a34a', overdue: '#dc2626', pending: '#92400e' };
  const color = map[status] || '#64748b';
  return `<div class="result-field">
    <label>${t('result.status')}</label>
    <span style="color:${color};font-weight:700;text-transform:capitalize">${status}</span>
  </div>`;
}

function getTypeLabel(type) {
  const map = { payment: t('result.paymentType'), loan: t('result.loanType'), customer: t('result.customerType') };
  return map[type] || type || 'Invoice';
}

// ── Download verification report ───────────────────────────────────────────
function downloadVerificationReport(data) {
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch { return; }
  }
  const isRTL = currentLang === 'ar' || currentLang === 'ku';
  const html = `<!DOCTYPE html>
<html lang="${currentLang}" dir="${isRTL ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <title>Verification Report — ${data.invoiceNumber || ''}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans Arabic', Arial, sans-serif; background: #f8fafc; color: #1e293b; padding: 32px; direction: ${isRTL ? 'rtl' : 'ltr'}; }
    .card { background: white; border-radius: 16px; padding: 32px; max-width: 600px; margin: 0 auto; border: 2px solid #86efac; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .badge { background: #dcfce7; color: #166534; padding: 10px 20px; border-radius: 10px; font-size: 16px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 24px; }
    h1 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
    .sub { color: #64748b; font-size: 14px; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    .field { background: #f8fafc; border-radius: 8px; padding: 12px; }
    .field label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; display: block; margin-bottom: 4px; }
    .field span { font-size: 14px; font-weight: 700; }
    .inv-num { font-family: monospace; font-size: 12px; background: #e2e8f0; padding: 8px; border-radius: 6px; margin-bottom: 20px; word-break: break-all; }
    .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">✓ ${t('result.verified')}</div>
    <h1>${data.invoiceNumber || 'Invoice'}</h1>
    <p class="sub">${t('result.verifiedSub')} <strong>${data.company?.name || 'Loan Management Pro'}</strong></p>
    <div class="inv-num">${data.invoiceNumber || ''}</div>
    <div class="grid">
      <div class="field"><label>${t('result.customer')}</label><span>${data.customer?.name || data.customerName || '—'}</span></div>
      <div class="field"><label>${t('result.type')}</label><span>${getTypeLabel(data.type)}</span></div>
      <div class="field"><label>${t('result.created')}</label><span>${formatDate(data.createdAt)}</span></div>
      <div class="field"><label>${t('result.company')}</label><span>${data.company?.name || 'Loan Management Pro'}</span></div>
    </div>
    <div class="footer">
      Verified on ${new Date().toLocaleString()} via loanmanagementpro verification portal<br>
      This report confirms the authenticity of the above invoice.
    </div>
  </div>
  <script>window.addEventListener('load', ()=> setTimeout(()=> window.print(), 600));<\/script>
</body></html>`;

  const win = window.open('', '_blank');
  if (win) { win.document.write(html); win.document.close(); }
}

// ── QR Scanner ─────────────────────────────────────────────────────────────
async function toggleScanner() {
  if (window._scannerRunning) {
    stopScanner();
  } else {
    startScanner();
  }
}

async function startScanner() {
  if (!window.Html5Qrcode) {
    showToast('QR scanner library not loaded.');
    return;
  }

  try {
    html5QrCode = new Html5Qrcode('qr-reader');
    await html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      (decodedText) => {
        // Extract invoice number from URL or use raw text
        let code = decodedText;
        try {
          const url = new URL(decodedText);
          const pathParts = url.pathname.split('/');
          code = pathParts[pathParts.length - 1] || decodedText;
          // Also check query params
          code = url.searchParams.get('code') || url.searchParams.get('invoice') || code;
        } catch { /* not a URL — use as-is */ }

        stopScanner();
        switchTab('manual');

        const input = document.getElementById('invoiceInput');
        if (input) {
          input.value = code;
          document.getElementById('clearBtn').style.display = 'flex';
        }
        verifyInvoice(code);
      },
      () => { /* frame errors — ignore */ }
    );

    window._scannerRunning = true;
    document.getElementById('scanBtnText').textContent = t('verify.stopCamera');
    document.getElementById('scanToggleBtn').style.background = '#dc2626';
  } catch (err) {
    console.error('Scanner error:', err);
    showToast('Could not start camera. Please allow camera access.');
  }
}

function stopScanner() {
  if (html5QrCode && window._scannerRunning) {
    html5QrCode.stop().catch(() => {});
    html5QrCode = null;
  }
  window._scannerRunning = false;
  const btn = document.getElementById('scanToggleBtn');
  if (btn) btn.style.background = '';
  const scanText = document.getElementById('scanBtnText');
  if (scanText) scanText.textContent = t('verify.startCamera');
}

// ── Recent verifications (localStorage) ───────────────────────────────────
function saveRecentCheck(code, found) {
  try {
    const stored = JSON.parse(localStorage.getItem('recent_verifications') || '[]');
    stored.unshift({ code, found, time: Date.now() });
    localStorage.setItem('recent_verifications', JSON.stringify(stored.slice(0, 5)));
  } catch { /* ignore */ }
}

function renderRecentChecks() {
  try {
    const stored = JSON.parse(localStorage.getItem('recent_verifications') || '[]');
    if (!stored.length) return;

    const container = document.getElementById('recentChecks');
    const list = document.getElementById('recentList');
    if (!container || !list) return;

    container.style.display = 'block';
    list.innerHTML = stored.map(item => `
      <div class="recent-item" onclick="verifyInvoice('${escapeHtml(item.code)}')">
        <div class="recent-dot ${item.found ? 'ok' : 'err'}"></div>
        <div class="recent-code">${escapeHtml(item.code)}</div>
        <div class="recent-time">${timeAgo(item.time)}</div>
      </div>
    `).join('');
  } catch { /* ignore */ }
}

// ── Utilities ──────────────────────────────────────────────────────────────
function formatDate(val) {
  if (!val) return '—';
  try {
    // Firestore Timestamp object
    if (val && typeof val === 'object' && val.seconds) {
      return new Date(val.seconds * 1000).toLocaleDateString(
        currentLang === 'ar' || currentLang === 'ku' ? 'ar-IQ' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      );
    }
    return new Date(val).toLocaleDateString(
      currentLang === 'ar' || currentLang === 'ku' ? 'ar-IQ' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  } catch { return String(val); }
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = 'block';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.display = 'none'; }, duration);
}
