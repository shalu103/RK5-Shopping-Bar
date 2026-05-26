/* ════════════════════════════════════════════
   CLOTHING SHOP — app.js
   ════════════════════════════════════════════ */

'use strict';

// ── State ──────────────────────────────────
let products    = [];
let storeInfo   = {};
let currentProductId = null;

// ── Init ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderProducts();
  renderStoreInfo();
  document.getElementById('footerYear').textContent = new Date().getFullYear();
  setupHamburger();
});

// ════════════════════════════════════════════
//  DATA — load / save
// ════════════════════════════════════════════
function loadData() {
  try {
    products  = JSON.parse(localStorage.getItem('shop_products') || '[]');
    storeInfo = JSON.parse(localStorage.getItem('shop_info')     || '{}');
  } catch {
    products  = [];
    storeInfo = {};
  }
}

function saveProducts() {
  localStorage.setItem('shop_products', JSON.stringify(products));
}

function saveStore() {
  localStorage.setItem('shop_info', JSON.stringify(storeInfo));
}

// ════════════════════════════════════════════
//  NAVIGATION
// ════════════════════════════════════════════
function showSection(id, btn) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  // Show target
  const section = document.getElementById(id + 'Section');
  if (section) section.classList.add('active');

  // Mark active nav button
  if (btn) {
    btn.classList.add('active');
  } else {
    const navBtn = document.querySelector(`.nav-btn[data-section="${id}"]`);
    if (navBtn) navBtn.classList.add('active');
  }

  // Toggle hero
  const hero = document.getElementById('heroSection');
  if (hero) hero.style.display = (id === 'shop') ? '' : 'none';

  // Section-specific init
  if (id === 'shop')  renderProducts();
  if (id === 'about') renderStoreInfo();

  // Close mobile menu
  const nav = document.getElementById('mainNav');
  if (nav) nav.classList.remove('open');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ════════════════════════════════════════════
//  HAMBURGER (mobile menu)
// ════════════════════════════════════════════
function setupHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && e.target !== btn) {
      nav.classList.remove('open');
    }
  });
}

// ════════════════════════════════════════════
//  IMAGE HANDLING
// ════════════════════════════════════════════

/** Compress and preview selected image */
function previewImage(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      // Resize to max 700px, quality 0.7
      const canvas = document.createElement('canvas');
      const MAX = 700;
      let w = img.width, h = img.height;
      if (w > h) { if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; } }
      else        { if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; } }
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const compressed = canvas.toDataURL('image/jpeg', 0.70);

      const preview   = document.getElementById('imgPreview');
      const removeBtn = document.getElementById('imgRemoveBtn');
      const placeholder = document.getElementById('uploadPlaceholder');

      preview.src           = compressed;
      preview.style.display = 'block';
      if (removeBtn)    removeBtn.style.display = 'block';
      if (placeholder)  placeholder.style.display = 'none';
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

/** Remove selected image */
function removeImage() {
  const preview   = document.getElementById('imgPreview');
  const removeBtn = document.getElementById('imgRemoveBtn');
  const placeholder = document.getElementById('uploadPlaceholder');
  const input     = document.getElementById('imageInput');

  preview.src           = '';
  preview.style.display = 'none';
  if (removeBtn)   removeBtn.style.display = 'none';
  if (placeholder) placeholder.style.display = '';
  if (input)       input.value = '';
}

// ════════════════════════════════════════════
//  FORM VALIDATION
// ════════════════════════════════════════════
function clearFieldError(inputId, errId) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  if (input) input.classList.remove('invalid');
  if (err)   err.classList.remove('show');
  // Also clear global error banner
  const errMsg = document.getElementById('errorMsg');
  if (errMsg) errMsg.style.display = 'none';
}

function clearAllValidation() {
  ['pName', 'pCategory', 'pPrice'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('invalid');
  });
  ['errName', 'errCategory', 'errPrice'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
  });
  const errMsg = document.getElementById('errorMsg');
  if (errMsg) errMsg.style.display = 'none';
}

// ════════════════════════════════════════════
//  ADD PRODUCT
// ════════════════════════════════════════════
function addProduct() {
  clearAllValidation();

  const name     = (document.getElementById('pName')?.value     || '').trim();
  const category = (document.getElementById('pCategory')?.value || '').trim();
  const price    = (document.getElementById('pPrice')?.value    || '').trim();

  // Validate
  let valid = true;

  if (!name) {
    document.getElementById('pName')?.classList.add('invalid');
    document.getElementById('errName')?.classList.add('show');
    valid = false;
  }
  if (!category) {
    document.getElementById('pCategory')?.classList.add('invalid');
    document.getElementById('errCategory')?.classList.add('show');
    valid = false;
  }
  if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
    document.getElementById('pPrice')?.classList.add('invalid');
    document.getElementById('errPrice')?.classList.add('show');
    valid = false;
  }

  if (!valid) {
    document.querySelector('.invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Build product object
  const imgEl = document.getElementById('imgPreview');
  const hasImg = imgEl && imgEl.style.display !== 'none' && imgEl.src;

  const product = {
    id:       Date.now(),
    name,
    category,
    price:    parseFloat(price),
    sizes:    (document.getElementById('pSizes')?.value    || '').trim(),
    material: (document.getElementById('pMaterial')?.value || '').trim(),
    color:    (document.getElementById('pColor')?.value    || '').trim(),
    desc:     (document.getElementById('pDesc')?.value     || '').trim(),
    stock:    document.getElementById('pStock')?.value || 'In Stock',
    img:      hasImg ? imgEl.src : null,
    date:     Date.now(),
  };

  products.unshift(product);

  // Try to save
  let savedWithoutImage = false;
  try {
    saveProducts();
  } catch (e) {
    // Storage full — remove image and retry
    product.img = null;
    products[0] = product;
    savedWithoutImage = true;
    try {
      saveProducts();
    } catch (e2) {
      products.shift(); // revert
      showFormError('❌ Storage is full! Please delete some old products first, then try again.');
      return;
    }
  }

  // Reset form
  resetProductForm();

  // Show feedback
  if (savedWithoutImage) {
    showFormError('⚠️ Saved without photo — storage was full. Use smaller images or delete old products.');
  } else {
    const successEl = document.getElementById('successMsg');
    if (successEl) {
      successEl.style.display = 'block';
      setTimeout(() => { successEl.style.display = 'none'; }, 4000);
    }
    showToast('Product added successfully! ✅', 'success');
  }
}

function resetProductForm() {
  ['pName', 'pPrice', 'pSizes', 'pMaterial', 'pColor', 'pDesc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const cat = document.getElementById('pCategory');
  const stk = document.getElementById('pStock');
  if (cat) cat.value = '';
  if (stk) stk.value = 'In Stock';
  removeImage();
  clearAllValidation();
}

function showFormError(text) {
  const el = document.getElementById('errorMsg');
  if (!el) return;
  el.textContent = text;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ════════════════════════════════════════════
//  RENDER PRODUCTS
// ════════════════════════════════════════════
function renderProducts() {
  const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const cat    = document.getElementById('categoryFilter')?.value || '';
  const sort   = document.getElementById('sortFilter')?.value || 'newest';

  // Filter
  let list = products.filter(p => {
    const matchSearch = !search
      || p.name.toLowerCase().includes(search)
      || (p.desc     || '').toLowerCase().includes(search)
      || (p.color    || '').toLowerCase().includes(search)
      || (p.material || '').toLowerCase().includes(search)
      || (p.category || '').toLowerCase().includes(search);
    const matchCat = !cat || p.category === cat;
    return matchSearch && matchCat;
  });

  // Sort
  if (sort === 'price-low')  list.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => b.date - a.date);

  // Update count
  const countEl = document.getElementById('productCount');
  if (countEl) {
    if (list.length === 0) {
      countEl.textContent = products.length === 0
        ? 'No products yet'
        : 'No products match your search';
    } else {
      countEl.textContent = `${list.length} product${list.length !== 1 ? 's' : ''} available`;
    }
  }

  const grid = document.getElementById('productGrid');
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="no-products">
        <span class="empty-icon">🛍️</span>
        <h3>${products.length === 0 ? 'No products yet!' : 'Nothing found'}</h3>
        <p>${products.length === 0
          ? 'Go to "Add Product" to list your first item.'
          : 'Try a different search or filter.'}</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map((p, i) => {
    const badgeClass = p.stock === 'In Stock'      ? 'badge-instock'
                     : p.stock === 'Limited Stock' ? 'badge-limited'
                     : 'badge-outstock';
    const delay = Math.min(i * 0.05, 0.3);
    return `
      <div class="product-card" onclick="openProduct(${p.id})" style="animation-delay:${delay}s">
        <div class="product-img-wrap">
          ${p.img ? `<img src="${p.img}" alt="${escapeHtml(p.name)}" loading="lazy">` : '👗'}
        </div>
        <div class="product-info">
          <div class="product-category">${escapeHtml(p.category)}</div>
          <div class="product-name">${escapeHtml(p.name)}</div>
          <div class="product-price">₹${p.price.toLocaleString('en-IN')}</div>
          ${p.sizes ? `<div class="product-size">📏 ${escapeHtml(p.sizes)}</div>` : ''}
          ${p.desc  ? `<div class="product-desc-preview">${escapeHtml(p.desc.slice(0, 90))}${p.desc.length > 90 ? '…' : ''}</div>` : ''}
          <span class="badge ${badgeClass}">${escapeHtml(p.stock)}</span>
        </div>
      </div>`;
  }).join('');
}

// ════════════════════════════════════════════
//  PRODUCT DETAIL MODAL
// ════════════════════════════════════════════
function openProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  currentProductId = id;

  // Image
  const pmImg = document.getElementById('pmImg');
  if (pmImg) {
    pmImg.innerHTML = p.img
      ? `<img src="${p.img}" alt="${escapeHtml(p.name)}">`
      : '👗';
  }

  // Text fields
  setText('pmCategory', p.category);
  setText('pmName',     p.name);
  setText('pmPrice',    '₹' + p.price.toLocaleString('en-IN'));
  setText('pmDesc',     p.desc || '');

  // Tags
  const tags = [];
  if (p.color)    tags.push('🎨 ' + p.color);
  if (p.material) tags.push('🧵 ' + p.material);
  if (p.sizes)    tags.push('📏 ' + p.sizes);
  const tagsEl = document.getElementById('pmTags');
  if (tagsEl) {
    tagsEl.innerHTML = tags.map(t => `<span class="pm-tag">${escapeHtml(t)}</span>`).join('');
  }

  // Badge
  const badgeEl = document.getElementById('pmStock');
  if (badgeEl) {
    const cls = p.stock === 'In Stock'      ? 'badge-instock'
              : p.stock === 'Limited Stock' ? 'badge-limited'
              : 'badge-outstock';
    badgeEl.textContent = p.stock;
    badgeEl.className = `badge ${cls}`;
  }

  // WhatsApp button — show only if store has WhatsApp set
  const waBtn = document.getElementById('pmWhatsapp');
  if (waBtn) {
    const waNum = (storeInfo.whatsapp || '').replace(/\D/g, '');
    waBtn.style.display = waNum ? '' : 'none';
  }

  document.getElementById('productModal')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal')?.classList.remove('open');
  document.body.style.overflow = '';
  currentProductId = null;
}

// Delete from detail modal
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pmDelete')?.addEventListener('click', () => {
    if (!currentProductId) return;
    if (!confirm('Delete this product? This cannot be undone.')) return;
    products = products.filter(p => p.id !== currentProductId);
    saveProducts();
    closeProductModal();
    renderProducts();
    showToast('Product deleted', 'error');
  });
});

// WhatsApp enquiry
function enquireWhatsApp() {
  const p = products.find(x => x.id === currentProductId);
  if (!p) return;
  const waNum = (storeInfo.whatsapp || '').replace(/\D/g, '');
  if (!waNum) return;
  const msg = encodeURIComponent(
    `Hi! I'm interested in *${p.name}* (₹${p.price.toLocaleString('en-IN')}) from your shop. Is it available?`
  );
  window.open(`https://wa.me/${waNum}?text=${msg}`, '_blank');
}

// ════════════════════════════════════════════
//  STORE INFO MODAL
// ════════════════════════════════════════════
function openStoreModal() {
  const s = storeInfo;
  setValue('sName',     s.name     || '');
  setValue('sAddress',  s.address  || '');
  setValue('sPhone',    s.phone    || '');
  setValue('sWhatsapp', s.whatsapp || '');
  setValue('sEmail',    s.email    || '');
  setValue('sHours',    s.hours    || '');
  setValue('sAbout',    s.about    || '');
  document.getElementById('storeModal')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeStoreModal() {
  document.getElementById('storeModal')?.classList.remove('open');
  document.body.style.overflow = '';
}

function saveStoreInfo() {
  storeInfo = {
    name:     (document.getElementById('sName')?.value     || '').trim(),
    address:  (document.getElementById('sAddress')?.value  || '').trim(),
    phone:    (document.getElementById('sPhone')?.value    || '').trim(),
    whatsapp: (document.getElementById('sWhatsapp')?.value || '').trim(),
    email:    (document.getElementById('sEmail')?.value    || '').trim(),
    hours:    (document.getElementById('sHours')?.value    || '').trim(),
    about:    (document.getElementById('sAbout')?.value    || '').trim(),
  };
  saveStore();
  closeStoreModal();
  renderStoreInfo();
  showToast('Store info saved! ✅', 'success');
}

function renderStoreInfo() {
  const s = storeInfo;

  setText('storeAddress', s.address || 'Click "Edit Store Info" to add your address.');
  setLink('storePhone',    s.phone    || '—', s.phone    ? 'tel:' + s.phone : '#');
  setLink('storeEmail',    s.email    || '—', s.email    ? 'mailto:' + s.email : '#');
  setText('storeHours',   s.hours    || '—');
  setText('storeAbout',   s.about    || '—');

  // WhatsApp link
  const wa    = (s.whatsapp || '').replace(/\D/g, '');
  const waEl  = document.getElementById('storeWhatsapp');
  if (waEl) {
    waEl.textContent = s.whatsapp || '—';
    waEl.href = wa ? `https://wa.me/${wa}` : '#';
  }

  // Update branding if name is set
  if (s.name) {
    const logoEl = document.getElementById('logoText');
    const heroEl = document.getElementById('heroShopName');
    const footEl = document.getElementById('footerShopName');
    if (logoEl) logoEl.textContent = '👗 ' + s.name;
    if (heroEl) heroEl.textContent = s.name;
    if (footEl) footEl.textContent = s.name;
    document.title = s.name;
  }
}

// ════════════════════════════════════════════
//  OVERLAY CLICK HANDLERS
// ════════════════════════════════════════════
function handleOverlayClick(event, modalId) {
  if (event.target.id === modalId) {
    if (modalId === 'storeModal')   closeStoreModal();
    if (modalId === 'productModal') closeProductModal();
  }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal();
    closeStoreModal();
  }
});

// ════════════════════════════════════════════
//  TOAST NOTIFICATION
// ════════════════════════════════════════════
let toastTimer = null;

function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = 'toast show' + (type ? ' ' + type : '');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

// ════════════════════════════════════════════
//  UTILITY HELPERS
// ════════════════════════════════════════════
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setLink(id, text, href) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.href = href;
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}
