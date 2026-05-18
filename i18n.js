// i18n.js — multilingual support (EN / AR / KU)

const TRANSLATIONS = {
  en: {
    nav: { verify: 'Verify Invoice', how: 'How It Works', about: 'About', contact: 'Contact' },
    hero: {
      badge: '🔒 Secure Document Verification',
      title: 'Verify Invoice <span class="gradient-text">Authenticity</span>',
      desc: 'Instantly verify any invoice or document issued by Loan Management Pro. Scan the QR code or enter the invoice number to confirm it\'s genuine.',
      cta: 'Verify Now',
      learn: 'Learn How →'
    },
    stats: { verified: 'Invoices Verified', secure: 'Secure', free: 'Always Free' },
    verify: {
      label: 'Invoice Verification',
      title: 'Check Your Invoice',
      desc: 'Enter the invoice number from the bottom of your document, or scan the QR code directly.',
      tabManual: 'Enter Code',
      tabScan: 'Scan QR',
      placeholder: 'INV-PAY-ABC123-XYZ...',
      btn: 'Verify Invoice',
      startCamera: 'Start Camera',
      stopCamera: 'Stop Camera',
      scanHint: 'Point your camera at the QR code on the invoice',
      cameraNote: 'Camera permission is required. Your camera is never recorded.',
      recent: 'Recent Verifications'
    },
    result: {
      verified: 'Verified & Authentic',
      verifiedSub: 'This invoice is genuine and was issued by',
      notFound: 'Invoice Not Found',
      notFoundSub: 'No invoice with this code exists in our system.',
      invoice: 'Invoice #',
      customer: 'Customer',
      amount: 'Amount',
      date: 'Date',
      type: 'Type',
      status: 'Status',
      company: 'Company',
      created: 'Issued On',
      verifyCount: 'Times Verified',
      downloadBtn: 'Download Report',
      verifyAnotherBtn: 'Verify Another',
      paymentType: 'Payment Invoice',
      loanType: 'Loan Agreement',
      customerType: 'Customer Statement'
    },
    how: {
      label: 'Simple Process',
      title: 'How Verification Works',
      desc: 'Three steps to confirm any invoice is authentic.',
      step1Title: 'Receive Invoice',
      step1Desc: 'Get your invoice from Loan Management Pro. Every invoice has a unique QR code and invoice number at the bottom.',
      step2Title: 'Scan or Enter Code',
      step2Desc: 'Scan the QR code with your phone camera, or manually type the invoice number into the field above.',
      step3Title: 'Instant Result',
      step3Desc: 'We check our secure database in real time and show you full invoice details — customer, amount, date, and status.'
    },
    about: {
      label: 'About the System',
      title: 'Built for Trust & Transparency',
      desc1: 'Loan Management Pro is a professional desktop application for managing loans, customers, and payments. Every invoice it generates carries a unique verification code.',
      desc2: 'This public verification portal lets anyone confirm that an invoice is genuine and has not been altered.',
      feat1: 'Real-time Firebase database lookup',
      feat2: 'Supports English, Arabic & Kurdish',
      feat3: 'Works on mobile & desktop',
      feat4: 'Free forever — no account needed'
    }
  },

  ar: {
    nav: { verify: 'التحقق من الفاتورة', how: 'كيف يعمل', about: 'عن النظام', contact: 'اتصل بنا' },
    hero: {
      badge: '🔒 التحقق الآمن من المستندات',
      title: 'تحقق من <span class="gradient-text">صحة الفاتورة</span>',
      desc: 'تحقق فوراً من أي فاتورة صادرة عن نظام إدارة القروض. امسح رمز QR أو أدخل رقم الفاتورة للتأكد من صحتها.',
      cta: 'تحقق الآن',
      learn: 'تعرف على الطريقة ←'
    },
    stats: { verified: 'فاتورة تم التحقق منها', secure: 'آمن', free: 'مجاني دائماً' },
    verify: {
      label: 'التحقق من الفواتير',
      title: 'تحقق من فاتورتك',
      desc: 'أدخل رقم الفاتورة من أسفل المستند، أو امسح رمز QR مباشرة.',
      tabManual: 'أدخل الرمز',
      tabScan: 'مسح QR',
      placeholder: 'INV-PAY-ABC123-XYZ...',
      btn: 'التحقق من الفاتورة',
      startCamera: 'تشغيل الكاميرا',
      stopCamera: 'إيقاف الكاميرا',
      scanHint: 'وجّه الكاميرا نحو رمز QR في الفاتورة',
      cameraNote: 'مطلوب إذن الكاميرا. لن يتم تسجيل الكاميرا أبداً.',
      recent: 'عمليات التحقق الأخيرة'
    },
    result: {
      verified: 'تم التحقق — أصيلة',
      verifiedSub: 'هذه الفاتورة أصيلة وصادرة عن',
      notFound: 'الفاتورة غير موجودة',
      notFoundSub: 'لا توجد فاتورة بهذا الرمز في نظامنا.',
      invoice: 'رقم الفاتورة',
      customer: 'العميل',
      amount: 'المبلغ',
      date: 'التاريخ',
      type: 'النوع',
      status: 'الحالة',
      company: 'الشركة',
      created: 'تاريخ الإصدار',
      verifyCount: 'مرات التحقق',
      downloadBtn: 'تنزيل التقرير',
      verifyAnotherBtn: 'تحقق من أخرى',
      paymentType: 'فاتورة دفع',
      loanType: 'عقد قرض',
      customerType: 'كشف حساب عميل'
    },
    how: {
      label: 'عملية بسيطة',
      title: 'كيف يعمل التحقق',
      desc: 'ثلاث خطوات للتأكد من صحة أي فاتورة.',
      step1Title: 'استلام الفاتورة',
      step1Desc: 'احصل على فاتورتك من نظام إدارة القروض. كل فاتورة تحتوي على رمز QR فريد ورقم فاتورة.',
      step2Title: 'مسح أو إدخال الرمز',
      step2Desc: 'امسح رمز QR باستخدام كاميرا هاتفك، أو اكتب رقم الفاتورة يدوياً.',
      step3Title: 'نتيجة فورية',
      step3Desc: 'نتحقق من قاعدة البيانات الآمنة لحظياً ونعرض لك تفاصيل الفاتورة الكاملة.'
    },
    about: {
      label: 'عن النظام',
      title: 'مبني على الثقة والشفافية',
      desc1: 'نظام إدارة القروض هو تطبيق سطح مكتب احترافي لإدارة القروض والعملاء والمدفوعات.',
      desc2: 'تتيح هذه البوابة العامة للتحقق لأي شخص التأكد من صحة الفاتورة وعدم تعديلها.',
      feat1: 'بحث فوري في قاعدة بيانات Firebase',
      feat2: 'يدعم العربية والإنجليزية والكردية',
      feat3: 'يعمل على الجوال وسطح المكتب',
      feat4: 'مجاني دائماً — لا حاجة لحساب'
    }
  },

  ku: {
    nav: { verify: 'پشتڕاستکردنەوەی پسوڵە', how: 'چۆن کار دەکات', about: 'دەربارە', contact: 'پەیوەندی' },
    hero: {
      badge: '🔒 پشتڕاستکردنەوەی بەڵگەنامەی ئاسایشی',
      title: 'پشتڕاستکردنەوەی <span class="gradient-text">ڕاستی پسوڵە</span>',
      desc: 'بە فۆری هەر پسوڵەیەک کە لەلایەن سیستەمی بەڕێوەبردنی قەرز دەرکراوە پشتڕاست بکەرەوە. کۆدی QR بسکانە یان ژمارەی پسوڵەکە بنووسە.',
      cta: 'ئێستا پشتڕاست بکەرەوە',
      learn: 'ئاشنابوون ←'
    },
    stats: { verified: 'پسوڵەی پشتڕاستکراو', secure: 'ئاسایشی', free: 'هەمیشە خۆڕایی' },
    verify: {
      label: 'پشتڕاستکردنەوەی پسوڵە',
      title: 'پسوڵەکەت پشتڕاست بکەرەوە',
      desc: 'ژمارەی پسوڵە لە خوارەوەی بەڵگەکەت بنووسە، یان بەڕاستەوخۆ کۆدی QR بسکانە.',
      tabManual: 'کۆد بنووسە',
      tabScan: 'QR بسکانە',
      placeholder: 'INV-PAY-ABC123-XYZ...',
      btn: 'پسوڵەکە پشتڕاست بکەرەوە',
      startCamera: 'کامێرا دەستپێبکە',
      stopCamera: 'کامێرا ببەستە',
      scanHint: 'کامێراکەت بەرەو کۆدی QR لەسەر پسوڵەکەدا بگێڕە',
      cameraNote: 'مۆڵەتی کامێرا پێویستە. کامێراکەت هەرگیز تۆمار نابێت.',
      recent: 'پشتڕاستکردنەوەی دواتر'
    },
    result: {
      verified: 'پشتڕاستکراو — ڕاستە',
      verifiedSub: 'ئەم پسوڵەیە ڕاستە و دەرکراوە لەلایەن',
      notFound: 'پسوڵە نەدۆزرایەوە',
      notFoundSub: 'هیچ پسوڵەیەک بەم کۆدەوە لە سیستەمەکەماندا نییە.',
      invoice: 'ژمارەی پسوڵە',
      customer: 'کڕیار',
      amount: 'بڕ',
      date: 'ڕۆژ',
      type: 'جۆر',
      status: 'باری',
      company: 'کۆمپانیا',
      created: 'ڕۆژی دەرکردن',
      verifyCount: 'ژمارەی پشتڕاستکردنەوە',
      downloadBtn: 'داگرتنی ڕاپۆرت',
      verifyAnotherBtn: 'یەکێکی تر پشتڕاست بکەرەوە',
      paymentType: 'پسوڵەی پارەدان',
      loanType: 'ڕێکەوتنی قەرز',
      customerType: 'کشتی کڕیار'
    },
    how: {
      label: 'پرۆسەی سادە',
      title: 'پشتڕاستکردنەوە چۆن کار دەکات',
      desc: 'سێ هەنگاو بۆ پشتڕاستکردنەوەی ڕاستی هەر پسوڵەیەک.',
      step1Title: 'پسوڵەکە وەربگرە',
      step1Desc: 'پسوڵەکەت لە سیستەمی بەڕێوەبردنی قەرز وەربگرە. هەر پسوڵەیەک کۆدی QR و ژمارەی پسوڵەی تایبەتی خۆی هەیە.',
      step2Title: 'بسکانە یان کۆد بنووسە',
      step2Desc: 'کۆدی QR بە کامێرای مۆبایلەکەتدا بسکانە، یان ژمارەی پسوڵەکە بە دەست بنووسە.',
      step3Title: 'ئەنجامی فۆری',
      step3Desc: 'بنکەدراوی ئاسایشیمان بە فۆری بپشکنین و وردەکاری تەواوی پسوڵەکەت نیشانت بدەین.'
    },
    about: {
      label: 'دەربارەی سیستەمەکە',
      title: 'دروستکراوە بۆ متمانە و ئاڵوگۆڕی ئاشکرا',
      desc1: 'سیستەمی بەڕێوەبردنی قەرز بەرنامەیەکی ئەسایشی سەر مەیزەیە بۆ بەڕێوەبردنی قەرزەکان، کڕیارەکان و پارەدانەکان.',
      desc2: 'ئەم دەرگایە گشتییە بۆ پشتڕاستکردنەوە ئەیبەخشێت بە هەر کەسێک پشتڕاست بکاتەوە کە پسوڵەکە ڕاستە و دەستکاری نەکراوە.',
      feat1: 'گەڕانی فۆری لە بنکەدراوی Firebase',
      feat2: 'پشتگیری ئینگلیزی، عەرەبی و کوردی',
      feat3: 'لەسەر مۆبایل و سەرمەیزیش کار دەکات',
      feat4: 'هەمیشە خۆڕایی — هیچ هەژمارێک پێویست نییە'
    }
  }
};

// ── Language engine ────────────────────────────────────────────────────────

let currentLang = localStorage.getItem('verify_lang') || 'en';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('verify_lang', lang);

  // Update HTML dir
  const isRTL = lang === 'ar' || lang === 'ku';
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

  // Update active button
  ['en','ar','ku'].forEach(l => {
    document.getElementById(`btn-${l}`)?.classList.toggle('active', l === lang);
  });

  applyTranslations();
}

function t(keyPath) {
  const keys = keyPath.split('.');
  let val = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  for (const k of keys) {
    if (val == null) return keyPath;
    val = val[k];
  }
  return val || (TRANSLATIONS.en[keys[0]]?.[keys[1]] ?? keyPath);
}

function applyTranslations() {
  // data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (text && text !== key) el.innerHTML = text;
  });

  // data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = t(key);
    if (text && text !== key) el.placeholder = text;
  });

  // Update scan button text if scanner is running
  const scanBtn = document.getElementById('scanBtnText');
  if (scanBtn) {
    scanBtn.textContent = window._scannerRunning ? t('verify.stopCamera') : t('verify.startCamera');
  }
}

// Apply on load
document.addEventListener('DOMContentLoaded', () => setLang(currentLang));
