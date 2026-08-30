const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat("uk-UA").format(n)+" грн";
const P=window.PRODUCTS||[],C=window.VT_CONFIG||{};
const FALLBACK_IMG="https://cdn.shopify.com/s/files/1/0640/8454/1699/products/natural-linen-duvet-cover-1.jpg?v=1661254233";
function safeImg(url){return String(url||FALLBACK_IMG).replace(/&/g,"&amp;").replace(/"/g,"&quot;")}
function bindImageFallback(root=document){$$("img[data-fallback]",root).forEach(img=>{img.addEventListener("error",()=>{if(img.dataset.fallbackUsed)return;img.dataset.fallbackUsed="1";img.src=FALLBACK_IMG}, {once:true})})}
function card(p){return `<article class="card reveal"><a href="product.html?id=${p.id}"><div class="photo"><img loading="lazy" decoding="async" referrerpolicy="no-referrer" data-fallback src="${safeImg(p.img)}" alt="${p.name}"></div><div class="body"><div class="meta"><span>${p.cat}</span><span>${p.material}</span></div><h3>${p.name}</h3><div class="meta"><span>${p.sizes.join(" · ")}</span><span>${p.group||""}</span></div><div class="row"><span class="price">${money(p.price)}</span><span class="arrow">↗</span></div></div></a></article>`}
function observe(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");io.unobserve(e.target)}}),{threshold:.08});$$(".reveal:not(.show)").forEach(x=>io.observe(x))}
function setupRails(){["#allRail","#pillowRail","#duvetRail","#linenRail","#coverRail"].forEach(sel=>{const e=$(sel);if(!e)return;let cat=e.dataset.cat;e.innerHTML=P.filter(x=>!cat||x.cat===cat).map(card).join("");bindImageFallback(e)})}
function setupCatalog(){
 const g=$("#catalogGrid"); if(!g)return;
 let cat="all",size="all";
 const sizeFilter=$("#sizeFilter");
 const sizeOptions={
  Подушки:[["50×70","50/70"],["70×70","70/70"],["40×60","40/60"]],
  Ковдри:[["Полуторні","Полуторні"],["Двоспальні","Двоспальні"],["Євро розмір","Євро розмір"]]
 };
 function updateSizeOptions(){
  if(!sizeFilter)return;
  const opts=sizeOptions[cat]||[];
  sizeFilter.innerHTML=opts.map((o,i)=>`<button class="chip sizeButton${i===0?" active":""}" type="button" data-size="${o[0]}">${o[1]}</button>`).join("");
  size=opts.length?opts[0][0]:"all";
  sizeFilter.classList.toggle("is-hidden",!opts.length);
  $$(".sizeButtons .sizeButton").forEach(b=>b.onclick=()=>{
   $$(".sizeButtons .sizeButton").forEach(x=>x.classList.remove("active"));
   b.classList.add("active"); size=b.dataset.size; draw();
  });
 }
 function draw(){
  let a=[...P];
  if(cat!=="all")a=a.filter(x=>x.cat===cat);
  if(size!=="all"){
   if(cat==="Ковдри")a=a.filter(x=>x.group===size);
   else a=a.filter(x=>x.sizes.includes(size));
  }
  g.innerHTML=a.map(card).join("");
  bindImageFallback(g);
  $("#resultCount").textContent=`${a.length} товарів`;
  observe();
 }
 $$(".catFilter").forEach(b=>b.onclick=()=>{
  $$(".catFilter").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); cat=b.dataset.cat; updateSizeOptions(); draw();
 });
 const q=new URLSearchParams(location.search).get("cat");
 if(q){const b=$(`.catFilter[data-cat="${q}"]`);if(b){b.classList.add("active");cat=q}}
 updateSizeOptions(); draw();
}
function setupProduct(){
 const d=$("#productDetail"); if(!d)return;
 const id=new URLSearchParams(location.search).get("id"), p=P.find(x=>x.id===id)||P[0];
 let chosen=p.sizes[0],idx=0;
 // Render product information first. The previous version rendered it after
 // binding the gallery, which replaced the DOM nodes and detached the gallery.
 d.innerHTML=`<div class="detailInfo"><span class="eyebrow">${p.cat}</span><h1>${p.name}</h1><p class="muted">${p.desc}</p><div class="price">${money(p.price)}</div><p class="eyebrow" style="margin-top:28px">РОЗМІР</p><div class="sizes">${p.sizes.map((s,i)=>`<button type="button" class="size ${i===0?"active":""}" data-size="${s}">${s}</button>`).join("")}</div><p class="muted">Матеріал: ${p.material}<br>Доставка: Нова Пошта або Укрпошта</p><button class="btn dark" id="add" style="width:100%" type="button">Додати в кошик →</button><a class="btn" id="buyNow" href="order.html" style="width:100%;display:flex;justify-content:center;margin-top:10px">Замовити зараз →</a></div>`;
 const gallery=$("#productMediaThumbs"),img=$("#productMainMedia"),vid=$("#productMainVideo"),counter=$("#mediaCounter"),stage=$("#mediaStage");
 const imgs=(p.media?.images||[]).slice(0,6), v=p.media?.video;
 const items=[...imgs.map((src,n)=>({type:"image",src,alt:`${p.name} — фото ${n+1}`})),...(v?[{type:"video",src:v.src,poster:v.poster||imgs[0]}]:[])];
 function show(i){if(!items.length)return;idx=(i+items.length)%items.length;const x=items[idx];if(x.type==="video"){img.hidden=true;vid.hidden=false;vid.poster=x.poster||"";vid.src=x.src;vid.load()}else{vid.pause();vid.removeAttribute("src");vid.load();vid.hidden=true;img.hidden=false;img.src=x.src;img.alt=x.alt}if(counter)counter.textContent=`${idx+1} / ${items.length}`;$$('.media-thumb',gallery).forEach((b,n)=>b.classList.toggle('active',n===idx))}
 if(gallery){gallery.innerHTML="";items.forEach((x,i)=>{const b=document.createElement("button");b.type="button";b.className="media-thumb"+(x.type==="video"?" video-thumb":"");b.setAttribute("aria-label",x.type==="video"?"Відео товару":`Фото ${i+1} товару`);const im=document.createElement("img");im.src=x.type==="video"?(x.poster||imgs[0]):x.src;im.alt="";im.loading="lazy";im.referrerPolicy="no-referrer";b.append(im);b.onclick=()=>show(i);gallery.append(b)})}
 $(".media-prev")?.addEventListener("click",()=>show(idx-1));$(".media-next")?.addEventListener("click",()=>show(idx+1));
 let sx=0;stage?.addEventListener("touchstart",e=>sx=e.changedTouches[0].clientX,{passive:true});stage?.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45)show(idx+(dx<0?1:-1))},{passive:true});
 vid?.addEventListener("error",()=>{vid.hidden=true;img.hidden=false;if(imgs[0])img.src=imgs[0]});
 $$(".size",d).forEach(b=>b.onclick=()=>{$$(".size",d).forEach(x=>x.classList.remove("active"));b.classList.add("active");chosen=b.dataset.size});
 $("#add",d).onclick=()=>addCart(p,chosen);
 $("#buyNow",d).onclick=()=>{addCart(p,chosen,false);};
 show(0);
}

let cart=JSON.parse(localStorage.getItem("vt_cart")||"[]");
function addCart(p,size,open=true){let x=cart.find(i=>i.id===p.id&&i.size===size);if(x)x.qty++;else cart.push({id:p.id,name:p.name,price:p.price,img:p.img,size,qty:1});localStorage.setItem("vt_cart",JSON.stringify(cart));if(open)openCart();}
function openCart(){const d=$("#drawer");if(!d)return;d.classList.add("open");renderCart();bindImageFallback(document)}
function renderCart(){const box=$("#cartItems");if(!box)return;box.innerHTML=cart.length?cart.map((x,i)=>`<div class="cartItem"><img loading="lazy" decoding="async" referrerpolicy="no-referrer" data-fallback src="${safeImg(x.img)}" alt=""><div><b>${x.name}</b><div class="muted">${x.size} · ${money(x.price)}</div><div>${x.qty} шт.</div></div><button class="icon" onclick="removeItem(${i})">×</button></div>`).join(""):`<p class="muted">Кошик порожній.</p>`;const t=cart.reduce((s,x)=>s+x.price*x.qty,0);$("#cartTotal").textContent=money(t);$$(".count").forEach(x=>x.textContent=cart.reduce((s,i)=>s+i.qty,0))}
function removeItem(i){cart.splice(i,1);localStorage.setItem("vt_cart",JSON.stringify(cart));renderCart();bindImageFallback(document)}
function closeCart(){$("#drawer")?.classList.remove("open")}
function setupCart(){$("#cartOpen")?.addEventListener("click",openCart);$("#cartClose")?.addEventListener("click",closeCart);$("#drawer")?.addEventListener("click",e=>{if(e.target.id==="drawer")closeCart()});renderCart();bindImageFallback(document)}
function makeOrderRef(){const d=new Date();const pad=n=>String(n).padStart(2,"0");return `VT-${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${Date.now().toString(36).toUpperCase()}`}
function paymentPost(data){const f=document.createElement("form");f.method="POST";f.action=C.ORDER_ENDPOINT;f.acceptCharset="UTF-8";Object.entries(data).forEach(([k,v])=>{const i=document.createElement("input");i.type="hidden";i.name=k;i.value=typeof v==="object"?JSON.stringify(v):String(v);f.appendChild(i)});const a=document.createElement("input");a.type="hidden";a.name="action";a.value="createPayment";f.appendChild(a);document.body.appendChild(f);f.submit()}
async function sendOrder(e){e.preventDefault();const fd=new FormData(e.target),data=Object.fromEntries(fd.entries());data.cart=cart.map(x=>({...x}));data.orderReference=makeOrderRef();const product=P.find(p=>p.name===data.product);data.amount=cart.length?cart.reduce((sum,x)=>sum+x.price*x.qty,0):(product?(product.price*Number(data.qty||1)):0);data.currency="UAH";const btn=e.submitter;btn.disabled=true;btn.textContent=data.payment==="online"?"Готуємо оплату…":"Відправляємо…";localStorage.setItem("vt_pending_order",JSON.stringify(data));try{if(data.payment==="online"){paymentPost(data);return}if(!C.ORDER_ENDPOINT)throw new Error("endpoint");await fetch(C.ORDER_ENDPOINT,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(data)});showOrderSuccess(data.orderReference,e.target)}catch(err){alert("Не вдалося відправити заявку. Перевірте Google Apps Script.")}finally{btn.disabled=false;btn.textContent="Продовжити →"}}
function showOrderSuccess(ref,form){const s=$("#success");if(s){$("#successOrder").textContent=ref||"—";s.classList.add("show");form.style.display="none"}localStorage.removeItem("vt_cart");cart=[]}

function setupOrderForm(){
 const f=$("[data-order-form]");if(!f)return;
 const ps=$("select[name=product]",f),ss=$("select[name=size]",f),qtyEl=$("[name=qty]",f);
 P.forEach(p=>{const o=document.createElement("option");o.value=p.name;o.textContent=`${p.name} — ${money(p.price)}`;o.dataset.id=p.id;ps.append(o)});
 function sync(){const p=P.find(x=>x.name===ps.value);ss.innerHTML='<option value="">Оберіть розмір</option>'+(p?p.sizes.map(x=>`<option value="${x}">${x}</option>`).join(""):"");}
 ps.addEventListener("change",sync);
 // Carry the actual cart into checkout. If there is one item, select it and
 // its exact size/quantity automatically. For multiple items, show a summary.
 let pending=JSON.parse(localStorage.getItem("vt_pending_order")||"null");
 if(cart.length){
   const first=cart[0];
   ps.value=first.name;sync();ss.value=first.size;qtyEl.value=first.qty;
   let summary=$("#checkoutCartSummary");
   if(summary)summary.innerHTML=cart.map(x=>`<div class="checkout-cart-row"><span>${x.name} · ${x.size} × ${x.qty}</span><b>${money(x.price*x.qty)}</b></div>`).join("")+`<div class="checkout-cart-total"><span>Разом</span><b>${money(cart.reduce((s,x)=>s+x.price*x.qty,0))}</b></div>`;
 } else if(pending){
   for(const [k,v] of Object.entries(pending)){const el=f.elements[k];if(el&&el.type!=="radio")el.value=v}
   sync();if(pending.size)ss.value=pending.size;
 }
 // Every order link explicitly navigates to checkout and is keyboard/touch safe.
 $$('a[href="order.html"]').forEach(a=>a.addEventListener('click',()=>{window.location.href='order.html'}));
}

document.addEventListener("DOMContentLoaded",()=>{setupRails();setupCatalog();setupProduct();setupCart();setupOrderForm();$$("[data-order-form]").forEach(f=>f.addEventListener("submit",sendOrder));$$(".faqItem").forEach(x=>x.onclick=()=>x.classList.toggle("open"));observe()});
