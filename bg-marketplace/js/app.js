// BG Marketplace - carrito + filtros + WhatsApp
// Edita PRODUCTS para cambiar nombre, precio, estado e imagen.

const PRODUCTS = [{'id': 'aretes-1', 'name': 'Aretes Doble Uso', 'category': 'Aretes', 'price': 21000, 'currency': 'COP', 'img': 'assets/imagenes/aretes-1.jpg', 'status': 'soldout'}, {'id': 'aretes-2', 'name': 'Aretes Dorados', 'category': 'Aretes', 'price': 18000, 'currency': 'COP', 'img': 'assets/imagenes/aretes-2.jpg', 'status': 'soldout'}, {'id': 'earcuff-1', 'name': 'Ear Cuff (Unidad)', 'category': 'Ear Cuff', 'price': 9000, 'currency': 'COP', 'img': 'assets/imagenes/earcuff-1.jpg', 'status': 'available'}, {'id': 'collar-1', 'name': 'Collar Stainless Steel', 'category': 'Collares', 'price': 28000, 'currency': 'COP', 'img': 'assets/imagenes/collar-1.jpg', 'status': 'available'}, {'id': 'collar-2', 'name': 'Collar (Últimas Unidades)', 'category': 'Collares', 'price': 28000, 'currency': 'COP', 'img': 'assets/imagenes/collar-2.jpg', 'status': 'available', 'badge': 'ÚLTIMAS UNIDADES'}, {'id': 'set-1', 'name': 'Set con 2 Cadenas', 'category': 'Sets', 'price': 42000, 'currency': 'COP', 'img': 'assets/imagenes/set-1.jpg', 'status': 'available'}, {'id': 'pulsera-1', 'name': 'Pulsera BG', 'category': 'Pulseras', 'price': 36000, 'currency': 'COP', 'img': 'assets/imagenes/pulsera-1.jpg', 'status': 'available'}, {'id': 'tobillera-1', 'name': 'Tobillera BG', 'category': 'Tobilleras', 'price': 22000, 'currency': 'COP', 'img': 'assets/imagenes/tobillera-1.jpg', 'status': 'available'}, {'id': 'anillo-1', 'name': 'Anillo BG', 'category': 'Anillos', 'price': 14000, 'currency': 'COP', 'img': 'assets/imagenes/anillo-1.jpg', 'status': 'available'}];

const fmtCOP = (n) => new Intl.NumberFormat('es-CO').format(n);

function loadCart(){
  try { return JSON.parse(localStorage.getItem('bg_cart') || '[]'); } catch(e) { return []; }
}
function saveCart(cart){
  localStorage.setItem('bg_cart', JSON.stringify(cart));
}
function cartCount(cart){
  return cart.reduce((acc, it) => acc + it.qty, 0);
}
function cartTotal(cart){
  return cart.reduce((acc, it) => acc + it.qty * it.price, 0);
}

function setCountBadge(){
  const cart = loadCart();
  const el = document.querySelector('[data-cart-count]');
  if(el) el.textContent = cartCount(cart);
}

function addToCart(productId){
  const p = PRODUCTS.find(x => x.id === productId);
  if(!p || p.status === 'soldout') return;
  const cart = loadCart();
  const existing = cart.find(x => x.id === productId);
  if(existing) existing.qty += 1;
  else cart.push({ id:p.id, name:p.name, price:p.price, img:p.img, qty:1 });
  saveCart(cart);
  setCountBadge();
  openDrawer();
  renderCart();
}

function incQty(id){
  const cart = loadCart();
  const it = cart.find(x => x.id === id);
  if(!it) return;
  it.qty += 1;
  saveCart(cart);
  setCountBadge();
  renderCart();
}
function decQty(id){
  let cart = loadCart();
  const it = cart.find(x => x.id === id);
  if(!it) return;
  it.qty -= 1;
  if(it.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart(cart);
  setCountBadge();
  renderCart();
}

function buildWhatsAppMessage(cart){
  const lines = [];
  lines.push('Hola BG Accessories ✨, quiero hacer este pedido:');
  lines.push('');
  cart.forEach(it => {
    lines.push(`- ${it.name} x${it.qty} = ${fmtCOP(it.qty*it.price)} COP`);
  });
  lines.push('');
  const total = cartTotal(cart);
  lines.push(`Total: ${fmtCOP(total)} COP`);
  lines.push('');
  lines.push('Gracias 🙏');
  return encodeURIComponent(lines.join('\n'));
}

function openDrawer(){
  document.querySelector('.drawer')?.classList.add('open');
  document.querySelector('.drawerBackdrop')?.classList.add('open');
}
function closeDrawer(){
  document.querySelector('.drawer')?.classList.remove('open');
  document.querySelector('.drawerBackdrop')?.classList.remove('open');
}

function renderProducts(list){
  const grid = document.querySelector('[data-grid]');
  if(!grid) return;
  grid.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card' + (p.status === 'soldout' ? ' soldout' : '');
    card.innerHTML = `
      <div class="imgwrap"><img src="${p.img}" alt="${p.name}"></div>
      <div class="body">
        <div class="titleRow">
          <h3>${p.name}</h3>
          ${p.badge ? `<span class="badge gold">${p.badge}</span>` : (p.status==='soldout' ? '<span class="badge">AGOTADO</span>' : '')}
        </div>
        <div class="meta">${p.category} · 100% Stainless Steel</div>
        <div class="row">
          <div class="price">$${fmtCOP(p.price)} COP</div>
          <div class="small">${p.status==='soldout' ? 'Sin stock' : 'Disponible'}</div>
        </div>
        <button class="btnAdd" ${p.status==='soldout' ? 'disabled' : ''} data-add="${p.id}">
          ${p.status==='soldout' ? 'No disponible' : 'Agregar al carrito'}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.getAttribute('data-add')));
  });
}

function renderCart(){
  const cart = loadCart();
  const body = document.querySelector('[data-cart-body]');
  const totalEl = document.querySelector('[data-cart-total]');
  const emptyEl = document.querySelector('[data-cart-empty]');

  if(!body || !totalEl) return;

  if(cart.length === 0){
    body.innerHTML = '';
    totalEl.textContent = '0';
    if(emptyEl) emptyEl.style.display = 'block';
    return;
  }
  if(emptyEl) emptyEl.style.display = 'none';

  body.innerHTML = '';
  cart.forEach(it => {
    const row = document.createElement('div');
    row.className = 'cartItem';
    row.innerHTML = `
      <img src="${it.img}" alt="${it.name}">
      <div class="ciBody">
        <div style="display:flex; justify-content:space-between; gap:10px;">
          <div>
            <div style="font-weight:700; font-size:14px;">${it.name}</div>
            <div class="small">$${fmtCOP(it.price)} COP</div>
          </div>
          <div class="price">$${fmtCOP(it.qty*it.price)} COP</div>
        </div>
        <div class="qtyRow">
          <div class="small">Cantidad</div>
          <div class="qtyBtns">
            <button aria-label="Disminuir" data-dec="${it.id}">−</button>
            <div style="min-width:26px; text-align:center;">${it.qty}</div>
            <button aria-label="Aumentar" data-inc="${it.id}">+</button>
          </div>
        </div>
      </div>
    `;
    body.appendChild(row);
  });

  body.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => incQty(b.getAttribute('data-inc'))));
  body.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => decQty(b.getAttribute('data-dec'))));

  totalEl.textContent = fmtCOP(cartTotal(cart));
}

function initFilters(){
  const chips = document.querySelectorAll('[data-chip]');
  const all = PRODUCTS.slice();
  let currentCategory = 'Todos';
  let currentSearch = '';

  const apply = () => {
    let filtered = all;
    if(currentCategory !== 'Todos') filtered = filtered.filter(p => p.category === currentCategory);
    if(currentSearch.trim()) {
      const q = currentSearch.trim().toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    renderProducts(filtered);
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.getAttribute('data-chip');
      apply();
    });
  });

  const input = document.querySelector('[data-search]');
  if(input){
    input.addEventListener('input', (e) => {
      currentSearch = e.target.value || '';
      apply();
    });
  }

  apply();
}

function initDrawer(){
  document.querySelector('[data-open-cart]')?.addEventListener('click', () => { openDrawer(); renderCart(); });
  document.querySelector('[data-close-cart]')?.addEventListener('click', closeDrawer);
  document.querySelector('.drawerBackdrop')?.addEventListener('click', closeDrawer);

  // WhatsApp
  document.querySelector('[data-whatsapp]')?.addEventListener('click', () => {
    const cart = loadCart();
    if(cart.length === 0) return;
    const phone = document.querySelector('[data-whatsapp]')?.getAttribute('data-phone') || '';
    const msg = buildWhatsAppMessage(cart);
    const url = `https://wa.me/${phone}?text=${msg}`;
    window.open(url, '_blank');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setCountBadge();
  initFilters();
  initDrawer();
});
