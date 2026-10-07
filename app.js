(function () {
  const WHATSAPP = '5538984197926';
  const STORAGE_CART = 'cris_cart_v1';
  const STORAGE_FAV = 'cris_favorites_v1';

  const products = [
    { id: 'renda-preto', name: 'Conjunto Renda Elegance — Preto', price: 69.99, category: 'conjuntos', image: 'assets/conjunto-preto.jpeg', color: 'Preto', stock: 10 },
    { id: 'renda-vermelho', name: 'Conjunto Renda Elegance — Vermelho', price: 69.99, category: 'conjuntos', image: 'assets/conjunto-vermelho.jpeg', color: 'Vermelho', stock: 10 },
    { id: 'renda-rosa', name: 'Conjunto Renda Elegance — Rosa', price: 69.99, category: 'conjuntos', image: 'assets/conjunto-rosa.jpeg', color: 'Rosa', stock: 10 },
    { id: 'coracoes-azul', name: 'Conjunto Corações Azul', price: 69.99, category: 'conjuntos', image: 'assets/conjunto-coracoes-azul.jpeg', color: 'Branco e Azul', stock: 10 },
    { id: 'calcinha-renda-strass', name: 'Calcinha de Renda com Strass', price: 25.00, category: 'calcinhas', image: 'assets/calcinha-renda-strass.jpeg', color: 'Preta, Vermelha e Rosa', stock: 5 }
  ];

  const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (_) { return fallback; } };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  let cart = read(STORAGE_CART, []);
  let favorites = read(STORAGE_FAV, []);

  function toast(message) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(window.__crisToast);
    window.__crisToast = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const countEl = document.getElementById('cartCount');
    const totalEl = document.getElementById('total');
    const itemsEl = document.getElementById('items');
    if (countEl) countEl.textContent = count;
    if (totalEl) totalEl.textContent = money(total);
    if (!itemsEl) return;
    if (!cart.length) {
      itemsEl.innerHTML = '<div class="h-full flex flex-col items-center justify-center text-center text-gray-500"><i data-lucide="shopping-bag" class="w-10 h-10 mb-4"></i><p>Sua sacola está vazia.</p><a href="#produtos" class="text-marsala font-semibold mt-3">Ver produtos</a></div>';
    } else {
      itemsEl.innerHTML = cart.map(item => `<div class="flex gap-4 border-b pb-5 mb-5">
        <img src="${item.image}" alt="${item.name}" class="w-20 h-24 object-cover bg-rose/20">
        <div class="flex-1"><div class="flex justify-between gap-3"><h3 class="font-serif">${item.name}</h3><button class="remove-item text-gray-400" data-id="${item.id}" aria-label="Remover"><i data-lucide="trash-2" class="w-4"></i></button></div>
        <p class="text-xs text-gray-500 mt-1">Tamanho ${item.size || 'P'} • ${item.color}</p><p class="font-semibold mt-2">${money(item.price)}</p>
        <div class="flex items-center gap-3 mt-3"><button class="qty border w-8 h-8" data-id="${item.id}" data-change="-1">−</button><span>${item.qty}</span><button class="qty border w-8 h-8" data-id="${item.id}" data-change="1">+</button></div></div></div>`).join('');
    }
    if (window.lucide) lucide.createIcons();
    save(STORAGE_CART, cart);
  }

  function addToCart(id, size) {
    const product = products.find(p => p.id === id) || products[0];
    const selectedSize = size || 'P';
    const key = `${product.id}-${selectedSize}`;
    const existing = cart.find(item => item.key === key);
    const limit = product.stock;
    if (existing) {
      if (existing.qty >= limit) return toast(`Estoque disponível: ${limit} unidade(s).`);
      existing.qty += 1;
    } else {
      cart.push({ key, id: product.id, name: product.name, price: product.price, image: product.image, color: product.color, size: selectedSize, qty: 1 });
    }
    renderCart();
    toast('Adicionado à sacola.');
  }

  function openCart() { document.getElementById('cart')?.classList.remove('hidden'); document.body.classList.add('overflow-hidden'); renderCart(); }
  function closeCart() { document.getElementById('cart')?.classList.add('hidden'); document.body.classList.remove('overflow-hidden'); }

  function renderFavorites() {
    const el = document.getElementById('favCount');
    if (!el) return;
    el.textContent = favorites.length;
    el.classList.toggle('hidden', !favorites.length);
    el.classList.toggle('flex', !!favorites.length);
    document.querySelectorAll('.fav').forEach(btn => {
      const id = btn.dataset.id;
      btn.classList.toggle('text-marsala', favorites.includes(id));
    });
  }

  function toggleFavorite(id) {
    favorites = favorites.includes(id) ? favorites.filter(x => x !== id) : [...favorites, id];
    save(STORAGE_FAV, favorites);
    renderFavorites();
    toast(favorites.includes(id) ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.');
  }

  function initHome() {
    const grid = document.getElementById('grid');
    if (grid) {
      grid.innerHTML = products.map(p => `<article class="card product" data-category="${p.category}" data-search="${p.name.toLowerCase()} ${p.color.toLowerCase()}">
        <div class="relative bg-rose/20 aspect-[3/4] overflow-hidden"><span class="absolute z-10 top-3 left-3 bg-marsala text-white text-[10px] px-3 py-1">Disponível</span>
        <button class="fav absolute z-10 top-3 right-3 bg-white/90 rounded-full w-9 h-9" data-id="${p.id}" aria-label="Favoritar"><i data-lucide="heart" class="w-4 mx-auto"></i></button>
        <a href="produto.html?produto=${encodeURIComponent(p.id)}"><img class="w-full h-full object-cover" src="${p.image}" alt="${p.name}"></a></div>
        <div class="pt-4"><p class="text-[10px] uppercase tracking-widest text-gray-400">${p.category === 'calcinhas' ? 'Calcinhas' : 'Conjuntos'}</p><h3 class="serif text-lg mt-1">${p.name}</h3>
        <div class="flex gap-2 mt-2"><i class="w-4 h-4 rounded-full bg-black ring-1 ring-gray-300"></i><i class="w-4 h-4 rounded-full bg-red-600 ring-1 ring-gray-300"></i><i class="w-4 h-4 rounded-full bg-pink-500 ring-1 ring-gray-300"></i></div>
        <small class="block mt-2 text-gray-500">Tamanhos: P, M e G</small><strong class="block mt-3">${money(p.price)}</strong><small class="text-gray-500">ou em até 12x*</small>
        <button class="buy mt-4 w-full bg-marsala text-white py-3 text-xs uppercase tracking-wider" data-id="${p.id}">Comprar</button></div></article>`).join('');
    }

    document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(b => b.classList.remove('bg-marsala','text-white'));
      btn.classList.add('bg-marsala','text-white');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.product').forEach(card => card.classList.toggle('hidden', filter !== 'todos' && card.dataset.category !== filter));
    }));

    document.addEventListener('click', e => {
      const buy = e.target.closest('.buy');
      if (buy) { addToCart(buy.dataset.id, 'P'); openCart(); return; }
      const fav = e.target.closest('.fav');
      if (fav) { e.preventDefault(); toggleFavorite(fav.dataset.id); return; }
    });

    const search = document.getElementById('search');
    search?.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      document.querySelectorAll('.product').forEach(card => card.classList.toggle('hidden', q && !card.dataset.search.includes(q)));
    });

    document.getElementById('searchBtn')?.addEventListener('click', () => document.getElementById('searchBox')?.classList.toggle('hidden'));
    document.getElementById('menuBtn')?.addEventListener('click', () => document.getElementById('mobileNav')?.classList.toggle('hidden'));
    document.getElementById('cartBtn')?.addEventListener('click', openCart);
    document.getElementById('closeCart')?.addEventListener('click', closeCart);
    document.getElementById('cartBg')?.addEventListener('click', closeCart);
    document.getElementById('checkout')?.addEventListener('click', () => { if (!cart.length) return toast('Sua sacola está vazia.'); location.href = 'checkout.html'; });

    document.addEventListener('click', e => {
      const qty = e.target.closest('.qty');
      if (qty) {
        const item = cart.find(x => x.id === qty.dataset.id);
        if (!item) return;
        item.qty += Number(qty.dataset.change);
        if (item.qty <= 0) cart = cart.filter(x => x !== item);
        renderCart();
      }
      const remove = e.target.closest('.remove-item');
      if (remove) { cart = cart.filter(x => x.id !== remove.dataset.id); renderCart(); }
    });

    const sizeOpen = () => { const m = document.getElementById('sizeModal'); if (m) { m.classList.remove('hidden'); m.classList.add('flex'); } };
    const sizeClose = () => { const m = document.getElementById('sizeModal'); if (m) { m.classList.add('hidden'); m.classList.remove('flex'); } };
    document.getElementById('sizeBtn')?.addEventListener('click', sizeOpen);
    document.getElementById('sizeBtn2')?.addEventListener('click', sizeOpen);
    document.getElementById('closeSize')?.addEventListener('click', sizeClose);
    document.getElementById('closeSize2')?.addEventListener('click', sizeClose);
    document.getElementById('sizeModal')?.addEventListener('click', e => { if (e.target.id === 'sizeModal') sizeClose(); });

    const slides = [...document.querySelectorAll('.slide')]; let current = 0;
    const showSlide = n => slides.forEach((s,i) => s.classList.toggle('active', i === n));
    document.getElementById('next')?.addEventListener('click', () => { current = (current + 1) % slides.length; showSlide(current); });
    document.getElementById('prev')?.addEventListener('click', () => { current = (current - 1 + slides.length) % slides.length; showSlide(current); });
    if (slides.length > 1) setInterval(() => { current = (current + 1) % slides.length; showSlide(current); }, 6000);

    document.getElementById('newsletter')?.addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast('Cadastro realizado. Obrigada!'); });
    renderFavorites(); renderCart();
  }

  function initProduct() {
    const params = new URLSearchParams(location.search);
    const product = products.find(p => p.id === params.get('produto')) || products[0];
    const image = document.querySelector('[data-product-image]');
    if (image) { image.src = product.image; image.alt = product.name; }
    document.querySelectorAll('[data-product-name]').forEach(el => el.textContent = product.name);
    document.querySelectorAll('[data-product-price]').forEach(el => el.textContent = money(product.price));
    const typeEl = document.getElementById('productType');
    const colorsEl = document.getElementById('productColors');
    const descEl = document.getElementById('productDescription');
    if (typeEl) typeEl.textContent = product.category === 'calcinhas' ? 'Calcinha' : 'Conjunto Premium';
    if (colorsEl) colorsEl.textContent = product.color;
    if (descEl) descEl.textContent = product.category === 'calcinhas'
      ? 'Calcinha de renda com detalhes em strass, disponível nas cores preta, vermelha e rosa. Tamanhos P, M e G.'
      : 'Conjunto de renda delicado e sofisticado, pensado para unir beleza e conforto.';
    document.querySelectorAll('[data-product-buy]').forEach(btn => btn.addEventListener('click', () => { const size = document.querySelector('input[name="size"]:checked')?.value || 'P'; addToCart(product.id, size); location.href = 'checkout.html'; }));
    document.querySelectorAll('[data-product-cart]').forEach(btn => btn.addEventListener('click', () => { const size = document.querySelector('input[name="size"]:checked')?.value || 'P'; addToCart(product.id, size); }));
    document.querySelectorAll('.size-option').forEach(label => label.addEventListener('click', () => { document.querySelectorAll('.size-option').forEach(x => x.classList.remove('ring-2','ring-marsala')); label.classList.add('ring-2','ring-marsala'); }));
    document.getElementById('whatsappProduct')?.addEventListener('click', () => { const size = document.querySelector('input[name="size"]:checked')?.value || 'P'; const msg = encodeURIComponent(`Olá, Cris Moda Íntima! Tenho interesse no ${product.name}, tamanho ${size}. Gostaria de saber a disponibilidade e o frete.`); window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank'); });
  }

  function initCheckout() {
    const list = document.getElementById('checkoutItems');
    const totalEl = document.getElementById('checkoutTotal');
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (list) list.innerHTML = cart.length ? cart.map(i => `<div class="flex justify-between gap-4 py-3 border-b"><span>${i.name} <small class="text-gray-500">× ${i.qty}</small></span><b>${money(i.price * i.qty)}</b></div>`).join('') : '<p class="text-gray-500">Sua sacola está vazia.</p>';
    if (totalEl) totalEl.textContent = money(cartTotal);
    document.getElementById('checkoutForm')?.addEventListener('submit', e => {
      e.preventDefault();
      if (!cart.length) return toast('Adicione um produto antes de finalizar.');
      const data = new FormData(e.target); const lines = cart.map(i => `• ${i.name} — tamanho ${i.size} — ${i.qty}x — ${money(i.price * i.qty)}`).join('\n');
      const msg = encodeURIComponent(`Olá, Cris Moda Íntima! Quero finalizar meu pedido:\n\n${lines}\n\nTotal: ${money(cartTotal)}\nNome: ${data.get('name')}\nCEP: ${data.get('cep')}\nPagamento: ${data.get('payment')}`);
      window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    if (document.getElementById('grid')) initHome();
    if (document.querySelector('[data-product-name]')) initProduct();
    if (document.getElementById('checkoutForm')) initCheckout();
  });
})();
