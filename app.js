(() => {
  const WHATSAPP = '5538984197926';
  const CART_KEY = 'cris_cart_v2';
  const products = [
  {
    id: 'renda-preto',
    name: 'Conjunto Renda Elegance — Preto',
    price: 69.99,
    category: 'conjuntos',
    image: 'conjunto-preto.jpeg',
    color: 'Preto'
  },
  {
    id: 'renda-vermelho',
    name: 'Conjunto Renda Elegance — Vermelho',
    price: 69.99,
    category: 'conjuntos',
    image: 'conjunto-vermelho.jpeg',
    color: 'Vermelho'
  },
  {
    id: 'renda-rosa',
    name: 'Conjunto Renda Elegance — Rosa',
    price: 69.99,
    category: 'conjuntos',
    image: 'conjunto-rosa.jpeg',
    color: 'Rosa'
  },
  {
    id: 'coracoes-azul',
    name: 'Conjunto Corações Azul',
    price: 69.99,
    category: 'conjuntos',
    image: 'conjunto-coracoes-azul.jpeg',
    color: 'Azul'
  },
  {
    id: 'calcinha-renda-strass',
    name: 'Calcinha de Renda com Strass',
    price: 25.00,
    category: 'calcinhas',
    image: 'calcinha-renda-strass.jpeg',
    color: 'Preta, Vermelha e Rosa'
  },
  {
    id: 'sutia-tomara-que-caia-nude',
    name: 'Sutiã Tomara que Caia',
    price: 47.99,
    category: 'soutiens',
    image: 'sutia-tomara-que-caia-nude.jpeg',
    color: 'Nude'
  }
  ];
  const sizes = ['P','M','G'];
  const money = v => Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const load = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } };
  let cart = load();
  const save = () => localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const toast = msg => { const el=document.getElementById('toast'); if(!el)return; el.textContent=msg; el.classList.add('show'); clearTimeout(window.__toast); window.__toast=setTimeout(()=>el.classList.remove('show'),2200); };
  const count = () => cart.reduce((n,i)=>n+i.qty,0);
  const total = () => cart.reduce((n,i)=>n+i.price*i.qty,0);

  function renderCart(){
    const cc=document.getElementById('cartCount'); if(cc)cc.textContent=count();
    const totalEl=document.getElementById('total'); if(totalEl)totalEl.textContent=money(total());
    const items=document.getElementById('items'); if(!items)return;
    if(!cart.length){items.innerHTML='<div class="h-full flex flex-col items-center justify-center text-center text-gray-500"><p>Sua sacola está vazia.</p><a href="#produtos" class="text-marsala font-semibold mt-3">Ver produtos</a></div>';}
    else items.innerHTML=cart.map(i=>`<div class="flex gap-3 border-b pb-4 mb-4"><img src="${i.image}" class="w-20 h-24 object-cover" alt="${i.name}"><div class="flex-1"><div class="flex justify-between gap-2"><h3 class="font-semibold text-sm">${i.name}</h3><button class="remove-item text-gray-400" data-key="${i.key}">×</button></div><p class="text-xs text-gray-500 mt-1">Tamanho ${i.size} • ${i.color}</p><p class="font-semibold mt-2">${money(i.price)}</p><div class="flex items-center gap-3 mt-2"><button class="qty border w-8 h-8" data-key="${i.key}" data-change="-1">−</button><span>${i.qty}</span><button class="qty border w-8 h-8" data-key="${i.key}" data-change="1">+</button></div></div></div>`).join('');
    save(); if(window.lucide)lucide.createIcons();
  }
  function openCart(){document.getElementById('cart')?.classList.remove('hidden');document.body.classList.add('overflow-hidden');renderCart();}
  function closeCart(){document.getElementById('cart')?.classList.add('hidden');document.body.classList.remove('overflow-hidden');}
  function add(id,size){
    const p=products.find(x=>x.id===id); if(!p)return;
    const s=size||'P'; const key=`${id}-${s}`; const existing=cart.find(x=>x.key===key);
    if(existing) existing.qty++; else cart.push({key,id,name:p.name,price:p.price,image:p.image,color:p.color,size:s,qty:1});
    renderCart(); toast(`${p.name} — tamanho ${s} adicionado à sacola.`); openCart();
  }
  function card(p){
    return `<article class="card product border bg-white p-3" data-category="${p.category}" data-search="${p.name.toLowerCase()} ${p.color.toLowerCase()}">
      <a href="produto.html?produto=${encodeURIComponent(p.id)}"><div class="relative bg-rose/20 aspect-[3/4] overflow-hidden"><img class="w-full h-full object-cover" src="${p.image}" alt="${p.name}" loading="lazy"></div></a>
      <div class="pt-4"><p class="text-[10px] uppercase tracking-widest text-gray-400">${p.category==='calcinhas'?'Calcinhas':'Conjuntos'}</p><h3 class="serif text-lg mt-1">${p.name}</h3><p class="text-xs text-gray-500 mt-1">${p.color}</p><strong class="block mt-3 text-lg">${money(p.price)}</strong>
      <div class="mt-3"><p class="text-xs font-semibold mb-2">Escolha o tamanho:</p><div class="flex flex-wrap gap-2">${sizes.map(s=>`<button class="size-choice border px-3 py-2 text-xs" data-id="${p.id}" data-size="${s}">${s}</button>`).join('')}</div></div>
      <button class="buy mt-4 w-full bg-marsala text-white py-3 text-xs uppercase tracking-wider" data-id="${p.id}" data-size="P">Comprar</button></div></article>`;
  }
  function initHome(){
    const grid=document.getElementById('grid'); if(!grid)return;
    grid.innerHTML=products.map(card).join('');
    document.querySelectorAll('.size-choice').forEach(b=>b.addEventListener('click',()=>{
      const parent=b.closest('.product'); parent.querySelectorAll('.size-choice').forEach(x=>x.classList.remove('bg-marsala','text-white'));
      b.classList.add('bg-marsala','text-white'); const buy=parent.querySelector('.buy'); buy.dataset.size=b.dataset.size;
    }));
    document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('bg-marsala','text-white'));btn.classList.add('bg-marsala','text-white');const f=btn.dataset.filter;document.querySelectorAll('.product').forEach(x=>x.classList.toggle('hidden',f!=='todos'&&x.dataset.category!==f));}));
    document.getElementById('search')?.addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();document.querySelectorAll('.product').forEach(x=>x.classList.toggle('hidden',!!q&&!x.dataset.search.includes(q)));});
  }
  function initProduct(){
    const id=new URLSearchParams(location.search).get('produto')||products[0].id; const p=products.find(x=>x.id===id)||products[0];
    document.querySelector('[data-product-name]')?.replaceChildren(document.createTextNode(p.name));
    const img=document.querySelector('[data-product-image]'); if(img){img.src=p.image;img.alt=p.name;}
    const price=document.querySelector('[data-product-price]'); if(price)price.textContent=money(p.price);
    const colors=document.getElementById('productColors'); if(colors)colors.textContent=p.color;
    document.querySelectorAll('.size-option').forEach(x=>x.addEventListener('click',()=>{document.querySelectorAll('.size-option').forEach(y=>y.classList.remove('ring-2','ring-marsala'));x.classList.add('ring-2','ring-marsala');}));
    document.querySelector('[data-product-cart]')?.addEventListener('click',()=>add(p.id,document.querySelector('input[name=size]:checked')?.value||'P'));
    document.querySelector('[data-product-buy]')?.addEventListener('click',()=>add(p.id,document.querySelector('input[name=size]:checked')?.value||'P'));
    document.getElementById('whatsappProduct')?.addEventListener('click',()=>{const s=document.querySelector('input[name=size]:checked')?.value||'P';window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá, Cris Moda Íntima! Tenho interesse no ${p.name}, tamanho ${s}. Gostaria de saber disponibilidade e frete.`)}`,'_blank');});
  }
  function initCheckout(){
    const list=document.getElementById('checkoutItems'); if(list)list.innerHTML=cart.length?cart.map(i=>`<div class="flex justify-between gap-4 py-3 border-b"><span>${i.name}<small class="block text-gray-500">Tamanho ${i.size} • ${i.qty}x</small></span><b>${money(i.price*i.qty)}</b></div>`).join(''):'<p class="text-gray-500">Sua sacola está vazia.</p>';
    const t=document.getElementById('checkoutTotal'); if(t)t.textContent=money(total());
    document.getElementById('checkoutForm')?.addEventListener('submit',e=>{e.preventDefault();if(!cart.length){toast('Adicione um produto antes de finalizar.');return;}const d=new FormData(e.target);const lines=cart.map(i=>`• ${i.name} — tamanho ${i.size} — ${i.qty}x — ${money(i.price*i.qty)}`).join('\n');const msg=encodeURIComponent(`Olá, Cris Moda Íntima! Quero finalizar meu pedido:\n\n${lines}\n\nTotal: ${money(total())}\nNome: ${d.get('name')}\nCEP: ${d.get('cep')}\nPagamento: ${d.get('payment')}`);window.open(`https://wa.me/${WHATSAPP}?text=${msg}`,'_blank');});
  }
  document.addEventListener('click',e=>{
    const buy=e.target.closest('.buy'); if(buy){add(buy.dataset.id,buy.dataset.size||'P');return;}
    const q=e.target.closest('.qty'); if(q){const i=cart.find(x=>x.key===q.dataset.key);if(i){i.qty+=Number(q.dataset.change);if(i.qty<=0)cart=cart.filter(x=>x!==i);renderCart();}return;}
    const r=e.target.closest('.remove-item'); if(r){cart=cart.filter(x=>x.key!==r.dataset.key);renderCart();}
  });
  document.addEventListener('DOMContentLoaded',()=>{
    if(window.lucide)lucide.createIcons();
    initHome(); initProduct(); initCheckout(); renderCart();
    document.getElementById('cartBtn')?.addEventListener('click',openCart);document.getElementById('closeCart')?.addEventListener('click',closeCart);document.getElementById('cartBg')?.addEventListener('click',closeCart);document.getElementById('checkout')?.addEventListener('click',()=>{if(cart.length)location.href='checkout.html';else toast('Sua sacola está vazia.');});document.getElementById('searchBtn')?.addEventListener('click',()=>document.getElementById('searchBox')?.classList.toggle('hidden'));document.getElementById('menuBtn')?.addEventListener('click',()=>document.getElementById('mobileNav')?.classList.toggle('hidden'));
  });
})();
