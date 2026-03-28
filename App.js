// ===== TECHKART v2 =====

const PRODUCTS = [
  { id:1,  name:"Wireless Headphones",  price:1500, emoji:"🎧", cat:"Audio",       badge:"hot",  rating:4.5, reviews:128, origPrice:1999 },
  { id:2,  name:"Smart Watch",          price:1000, emoji:"⌚", cat:"Wearables",   badge:"new",  rating:4.3, reviews:87,  origPrice:1299 },
  { id:3,  name:"Bluetooth Speaker",    price:1500, emoji:"🔊", cat:"Audio",       badge:"top",  rating:4.7, reviews:214, origPrice:1999 },
  { id:4,  name:"Laptop Stand",         price:800,  emoji:"💻", cat:"Accessories", badge:"sale", rating:4.2, reviews:63,  origPrice:999  },
  { id:5,  name:"Gaming Mouse",         price:1300, emoji:"🖱️", cat:"Gaming",      badge:"hot",  rating:4.6, reviews:175, origPrice:1699 },
  { id:6,  name:"Phone Charger",        price:650,  emoji:"🔌", cat:"Accessories", badge:"",     rating:4.0, reviews:42,  origPrice:799  },
  { id:7,  name:"Tablet Holder",        price:1000, emoji:"📱", cat:"Accessories", badge:"new",  rating:4.1, reviews:55,  origPrice:1199 },
  { id:8,  name:"USB Drive 128GB",      price:1150, emoji:"💾", cat:"Storage",     badge:"sale", rating:4.4, reviews:99,  origPrice:1499 },
  { id:9,  name:"Mechanical Keyboard",  price:2200, emoji:"⌨️", cat:"Gaming",      badge:"hot",  rating:4.8, reviews:302, origPrice:2999 },
  { id:10, name:"Webcam HD 1080p",      price:1800, emoji:"📸", cat:"Accessories", badge:"new",  rating:4.3, reviews:77,  origPrice:2299 },
  { id:11, name:"RGB Mouse Pad XL",     price:550,  emoji:"🎮", cat:"Gaming",      badge:"",     rating:4.2, reviews:44,  origPrice:699  },
  { id:12, name:"Noise Cancel Earbuds", price:1750, emoji:"🎵", cat:"Audio",       badge:"top",  rating:4.6, reviews:188, origPrice:2199 },
  { id:13, name:"Portable SSD 500GB",   price:3200, emoji:"🗂️", cat:"Storage",     badge:"new",  rating:4.7, reviews:136, origPrice:3999 },
  { id:14, name:"USB-C Hub 7-in-1",     price:1100, emoji:"🔗", cat:"Accessories", badge:"sale", rating:4.5, reviews:92,  origPrice:1399 },
  { id:15, name:"Smart LED Desk Lamp",  price:900,  emoji:"💡", cat:"Smart Home",  badge:"new",  rating:4.3, reviews:61,  origPrice:1199 },
];

const CATS = ["All", ...new Set(PRODUCTS.map(p => p.cat))];

let cart = [];
let wishlist = [];
let activeCat = "All";
let searchQuery = "";
let sortMode = "default";

// ===== UTILS =====
function formatINR(n) { return '₹' + n.toLocaleString('en-IN'); }
function genOrderId() { return 'TK' + Date.now().toString(36).toUpperCase().slice(-6); }

function starsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ===== NAV =====
function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (el) el.classList.add('active');
  if (id === 'cart')     renderCart();
  if (id === 'checkout') renderOrderReview();
  if (id === 'wishlist') renderWishlist();
  if (id === 'products') { buildCategoryBtns(); renderProducts(); }
  window.scrollTo(0,0);
}

document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', e => e.preventDefault()));

// ===== BADGE UPDATES =====
function updateCartBadge() {
  document.getElementById('cartBadge').textContent = cart.reduce((s,c)=>s+c.qty,0);
}

function updateWishBadge() {
  const el = document.getElementById('wishBadge');
  el.textContent = wishlist.length;
  el.style.display = wishlist.length ? 'flex' : 'none';
}

// ===== PRODUCT CARD =====
function makeCard(p, gridClass='') {
  const inCart = !!cart.find(c=>c.id===p.id);
  const inWish = wishlist.includes(p.id);
  const badgeHTML = p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge}</span>` : '<span></span>';
  const origHTML = p.origPrice ? `<span class="product-price-orig">${formatINR(p.origPrice)}</span>` : '';

  const d = document.createElement('div');
  d.className = `product-card ${inWish ? 'wishlisted' : ''}`;
  d.innerHTML = `
    <div class="card-top">
      ${badgeHTML}
      <button class="wish-btn ${inWish?'active':''}" onclick="toggleWish(${p.id},this)" title="Wishlist">♡</button>
    </div>
    <div class="product-img-wrap">${p.emoji}</div>
    <div class="product-cat">${p.cat}</div>
    <div class="product-name">${p.name}</div>
    <div class="star-row">
      <span class="stars">${starsHTML(p.rating)}</span>
      <span class="star-count">${p.rating} (${p.reviews})</span>
    </div>
    <div class="product-price-row">
      <span class="product-price">${formatINR(p.price)}</span>
      ${origHTML}
    </div>
    <button class="btn-cart ${inCart?'added':''}" onclick="addToCart(${p.id},this)">
      ${inCart ? '✓ In Cart' : '+ Add to Cart'}
    </button>
  `;
  return d;
}

// ===== HOME FEATURED =====
function renderFeatured() {
  const g = document.getElementById('featuredGrid');
  g.innerHTML = '';
  PRODUCTS.filter(p=>['hot','top'].includes(p.badge)).slice(0,4).forEach(p=>g.appendChild(makeCard(p)));
}

// ===== PRODUCTS PAGE =====
function buildCategoryBtns() {
  const wrap = document.getElementById('catBtns');
  wrap.innerHTML = '';
  CATS.forEach(cat => {
    const b = document.createElement('button');
    b.className = `filter-btn ${cat===activeCat?'cat-active':''}`;
    b.textContent = cat;
    b.onclick = () => { activeCat = cat; renderProducts(); buildCategoryBtns(); };
    wrap.appendChild(b);
  });
}

function renderProducts() {
  const g = document.getElementById('productsGrid');
  g.innerHTML = '';

  let list = [...PRODUCTS];
  if (activeCat !== 'All') list = list.filter(p=>p.cat===activeCat);
  if (searchQuery) list = list.filter(p=>p.name.toLowerCase().includes(searchQuery));

  if (sortMode === 'low')  list.sort((a,b)=>a.price-b.price);
  if (sortMode === 'high') list.sort((a,b)=>b.price-a.price);
  if (sortMode === 'rating') list.sort((a,b)=>b.rating-a.rating);
  if (sortMode === 'reviews') list.sort((a,b)=>b.reviews-a.reviews);

  document.getElementById('resultsCount').innerHTML = `Showing <span>${list.length}</span> product${list.length!==1?'s':''}`;

  if (!list.length) {
    g.innerHTML = '<div class="no-results"><div class="icon">🔍</div><p>No products found</p><small>Try a different search or category</small></div>';
    return;
  }
  list.forEach(p => g.appendChild(makeCard(p)));
}

// ===== WISHLIST =====
function toggleWish(id, btn) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(w=>w!==id);
    btn.classList.remove('active');
    btn.closest('.product-card').classList.remove('wishlisted');
  } else {
    wishlist.push(id);
    btn.classList.add('active');
    btn.textContent = '♥';
    btn.closest('.product-card').classList.add('wishlisted');
    // heart animation
    btn.style.transform = 'scale(1.4)';
    setTimeout(()=>btn.style.transform='', 300);
  }
  updateWishBadge();
  // Sync all wish buttons across pages
  document.querySelectorAll('.wish-btn').forEach(b => {
    const pid = parseInt(b.getAttribute('onclick').match(/\d+/)[0]);
    if (wishlist.includes(pid)) { b.classList.add('active'); b.textContent='♥'; b.closest('.product-card')?.classList.add('wishlisted'); }
    else { b.classList.remove('active'); b.textContent='♡'; b.closest('.product-card')?.classList.remove('wishlisted'); }
  });
}

function renderWishlist() {
  const g = document.getElementById('wishlistGrid');
  g.innerHTML = '';
  if (!wishlist.length) {
    g.innerHTML = '<div class="empty-state"><span class="icon">🤍</span><h3>Your wishlist is empty</h3><p>Tap ♡ on any product to save it here.</p></div>';
    return;
  }
  const items = PRODUCTS.filter(p=>wishlist.includes(p.id));
  items.forEach(p=>g.appendChild(makeCard(p)));
}

// ===== CART =====
function addToCart(pid, btn) {
  const p = PRODUCTS.find(x=>x.id===pid);
  const ex = cart.find(c=>c.id===pid);
  if (ex) ex.qty++;
  else cart.push({...p, qty:1});
  updateCartBadge();
  btn.textContent = '✓ In Cart';
  btn.classList.add('added');
  // pulse effect
  btn.style.transform = 'scale(1.05)';
  setTimeout(()=>btn.style.transform='',200);
}

function changeQty(id, delta) {
  const item = cart.find(c=>c.id===id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c=>c.id!==id);
  updateCartBadge();
  renderCart();
  syncCartButtons();
}

function removeFromCart(id) {
  cart = cart.filter(c=>c.id!==id);
  updateCartBadge();
  renderCart();
  syncCartButtons();
}

function syncCartButtons() {
  document.querySelectorAll('.btn-cart').forEach(btn => {
    const pid = parseInt(btn.getAttribute('onclick')?.match(/\d+/)?.[0]);
    if (!pid) return;
    if (cart.find(c=>c.id===pid)) { btn.textContent='✓ In Cart'; btn.classList.add('added'); }
    else { btn.textContent='+ Add to Cart'; btn.classList.remove('added'); }
  });
}

function renderCart() {
  const list = document.getElementById('cartList');
  const summary = document.getElementById('cartSummary');
  list.innerHTML = ''; summary.innerHTML = '';

  if (!cart.length) {
    list.innerHTML = `<div class="empty-state"><span class="icon">🛒</span><h3>Cart is empty</h3><p>Add some products to get started.</p><button class="btn-primary" onclick="showPage('products',document.querySelectorAll('.nav-link')[1])">Browse Products</button></div>`;
    return;
  }

  cart.forEach(item => {
    const d = document.createElement('div');
    d.className = 'cart-item';
    d.innerHTML = `
      <div class="cart-item-icon">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-cat">${item.cat}</div>
        <div class="cart-item-price">${formatINR(item.price)} each &nbsp;·&nbsp; <strong>${formatINR(item.price*item.qty)}</strong></div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
        <span class="qty-display">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
      </div>
      <button class="btn-remove" onclick="removeFromCart(${item.id})">✕</button>
    `;
    list.appendChild(d);
  });

  const sub = cart.reduce((s,c)=>s+c.price*c.qty, 0);
  const del = 49;
  const tax = Math.round(sub * 0.05);
  const total = sub + del + tax;

  summary.innerHTML = `
    <div class="summary-title">Order Summary</div>
    <div class="summary-row"><span>Subtotal (${cart.reduce((s,c)=>s+c.qty,0)} items)</span><span>${formatINR(sub)}</span></div>
    <div class="summary-row"><span>Delivery</span><span>${formatINR(del)}</span></div>
    <div class="summary-row"><span>GST (5%)</span><span>${formatINR(tax)}</span></div>
    <div class="summary-row total"><span>Total</span><span>${formatINR(total)}</span></div>
    <button class="btn-gold btn-full" onclick="goCheckout()">Proceed to Checkout →</button>
    <button class="btn-outline-sm" onclick="showPage('products',document.querySelectorAll('.nav-link')[1])">Continue Shopping</button>
  `;
}

function goCheckout() {
  if (!cart.length) return;
  showPage('checkout', null);
}

// ===== CHECKOUT =====
function renderOrderReview() {
  const box = document.getElementById('orderReview');
  if (!box) return;
  const sub = cart.reduce((s,c)=>s+c.price*c.qty,0);
  const del = 49;
  const tax = Math.round(sub*0.05);
  const total = sub+del+tax;
  let rows = cart.map(c=>`<div class="or-item"><span class="or-item-name">${c.emoji} ${c.name} ×${c.qty}</span><span>${formatINR(c.price*c.qty)}</span></div>`).join('');
  box.innerHTML = `
    <div class="or-title">Your Order (${cart.reduce((s,c)=>s+c.qty,0)} items)</div>
    ${rows}
    <div class="or-item" style="color:var(--text-dim);margin-top:4px"><span>Delivery</span><span>${formatINR(del)}</span></div>
    <div class="or-item" style="color:var(--text-dim)"><span>GST (5%)</span><span>${formatINR(tax)}</span></div>
    <div class="or-total"><span>Grand Total</span><span>${formatINR(total)}</span></div>
  `;
}

function placeOrder() {
  const name    = document.getElementById('custName').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const phone   = document.getElementById('custPhone').value.trim();
  const pin     = document.getElementById('custPin').value.trim();
  if (!name)    { alert('Please enter your name.'); return; }
  if (!address) { alert('Please enter your address.'); return; }
  if (!phone)   { alert('Please enter your phone number.'); return; }
  if (!pin)     { alert('Please enter your PIN code.'); return; }
  if (!cart.length) { alert('Cart is empty!'); return; }

  const total = cart.reduce((s,c)=>s+c.price*c.qty,0) + 49 + Math.round(cart.reduce((s,c)=>s+c.price*c.qty,0)*0.05);
  const oid = genOrderId();

  document.getElementById('successMsg').textContent =
    `Thank you, ${name}! Your order worth ${formatINR(total)} will be delivered to ${address}. We'll contact you at ${phone}.`;
  document.getElementById('successOrderId').innerHTML = `Order ID: <span>${oid}</span>`;

  cart = [];
  updateCartBadge();
  ['custName','custAddress','custPhone','custPin'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  renderFeatured();
  syncCartButtons();
  showPage('success', null);
}

// ===== INIT =====
renderFeatured();
buildCategoryBtns();
renderProducts();
updateCartBadge();
updateWishBadge();