
/* =========================================================
   CUSTOMER APP
   ========================================================= */
const qtyIn = pid => C.cart[pid] || 0;
function cartLines() { return Object.entries(C.cart).filter(([, q]) => q > 0).map(([pid, q]) => ({p:prodById(pid), q})).filter(x => x.p); }
const catName = c => t(c === 'Handicrafts' ? 'Crafts' : c);
function addCtl(p, s) {
  if (!isOpen(s)) return `<button class="add" type="button" disabled>${t('Closed')}</button>`;
  if (p.stock <= 0) return `<button class="add" type="button" disabled>${t('Sold out')}</button>`;
  const q = qtyIn(p.id);
  if (!q) return `<button class="add" type="button" data-act="c-add" data-v="${esc(p.id)}" aria-label="${esc(t('Add'))} ${esc(p.name)}">${t('ADD')} +</button>`;
  return `<div class="step" role="group" aria-label="${esc(p.name)}"><button type="button" data-act="c-qty" data-v="${esc(p.id)}|-1" aria-label="${esc(t('One less'))}">−</button><span>${q}</span><button type="button" data-act="c-qty" data-v="${esc(p.id)}|1" ${q >= p.stock ? 'disabled' : ''} aria-label="${esc(t('One more'))}">+</button></div>`;
}
function pcard(p, s, extra = '') {
  return `<div class="pcard">
    <button type="button" class="r-shop" data-act="c-shop" data-v="${esc(s.id)}" style="display:grid;gap:8px" aria-label="${esc(p.name)} · ${esc(s.name)}">${thumb(p, 'lg')}<span class="nm">${esc(p.name)}</span></button>
    <span class="sh">${extra || esc(s.name)}</span>
    <div class="ft"><span class="price">${rs(p.price)}</span>${addCtl(p, s)}</div>
  </div>`;
}
function shopCard(s) {
  const n = liveOrders(s.id, 30).length, fav = C.favs.has(s.id), off = offersFor(s.id)[0];
  return `<div class="shopcard" role="button" tabindex="0" data-act="c-shop" data-v="${esc(s.id)}">
    <span class="mono">${esc(s.name[0])}</span>
    <span class="row-main"><span class="row-t">${esc(s.name)}</span>
      <span class="row-m">${ratingChip(s)} · ${t(s.category)} · ${esc(s.area)}</span>
      <span class="meta">${isOpen(s) ? `<span class="badge b-plain">⏱ ${Number(s.readyMins) || 30} ${t('min')}</span>` : `<span class="badge b-closed">${t('Closed now')}</span>`}${s.deliveryOn ? `<span class="badge b-plain">🛵 ${deliveryRange(s)} ${t('min')}</span>` : ''}${off ? `<span class="badge b-offer">🎁 ${esc(offerTitle(off).split(' · ')[0])}</span>` : ''}${n < 3 ? `<span class="badge b-gem">${t('Local Gem')}</span>` : ''}</span></span>
    <button class="heart" type="button" data-act="c-fav" data-v="${esc(s.id)}" aria-pressed="${fav}" aria-label="${esc(fav ? t('Remove from favourites') : t('Save to favourites'))}">${ICON.heart}</button>
  </div>`;
}
const VOICE = window.SpeechRecognition || window.webkitSpeechRecognition;
function renderCustomer() {
  const myActive = S.orders.filter(o => o.deviceId === DEVICE && !['completed','cancelled'].includes(o.status)).length;
  let body;
  switch (C.screen) {
    case 'search': body = cSearch(); break;
    case 'cat': body = cCat(); break;
    case 'shop': body = cShop(); break;
    case 'track': body = cTrack(); break;
    case 'orders': body = cOrders(); break;
    case 'saved': body = cSaved(); break;
    default: body = cHome();
  }
  const lines = cartLines(), count = lines.reduce((a, l) => a + l.q, 0), sub = lines.reduce((a, l) => a + l.p.price * l.q, 0);
  const bagShop = shopById(C.cartShop);
  const showSearch = C.screen !== 'track';
  return `
  <header class="top"><div class="gut">
    <div class="top-in">
      <button class="brand" type="button" data-act="c-home" aria-label="Nukkad home">${ICON.logo}<b>nukkad</b></button>
      <div class="top-r">${connChip()}${langBtn()}
        <label class="loc">${ICON.pin}<span class="sr">${t('Your area')}</span><select id="c-area" data-act="c-area">${['All', ...areas()].map(a => `<option value="${esc(a)}" ${a === C.area ? 'selected' : ''}>${a === 'All' ? t('All areas') : esc(a)}</option>`).join('')}</select></label>
      </div>
    </div>
    ${showSearch ? `<div class="searchwrap">
      <form class="search" id="c-search" role="search" autocomplete="off">${ICON.search}
        <input id="c-q" type="search" placeholder="${esc(t('Search notebook, saree, toor dal…'))}" value="${esc(C.qDraft)}" aria-label="${esc(t('Search products near you'))}" aria-controls="sugg" aria-autocomplete="list">
        ${VOICE ? `<button class="mic ${C.listening ? 'on' : ''}" type="button" data-act="c-voice" aria-label="${esc(t('Search by voice'))}">${ICON.mic}</button>` : ''}
        <button class="btn btn-go btn-sm" type="submit">${t('Search')}</button>
      </form>
      <div id="sugg" class="sugg" hidden></div>
    </div>` : ''}
  </div></header>
  <main class="gut ${FX.enter ? 'enter' : ''}">${body}</main>
  ${count && !C.sheet && C.screen !== 'track' ? `<div class="bagbar ${C.bump ? 'bump' : ''}"><button type="button" data-act="c-bag">
    <span class="bi">${ICON.bag}</span><span style="min-width:0"><b>${t('{n} items', {n:count})} · ${rs(sub)}</b><small>${esc(bagShop ? bagShop.name : '')}</small></span><span class="go">${t('View bag')} →</span></button></div>` : ''}
  ${nav([['home', t('Home'), 'home'], ['search', t('Search'), 'search'], ['saved', t('Saved'), 'heart'], ['orders', t('Orders'), 'bag', myActive]], C.tab, 'c-tab')}
  ${C.sheet === 'bag' ? cBagSheet() : ''}${C.sheet === 'switch' ? cSwitchSheet() : ''}`;
}
function cHome() {
  const a = C.area, g = gems(a), pop = popular(a), rec = recommended(a), shops = S.shops.filter(s => inArea(s, a)).sort((x, y) => isOpen(y) - isOpen(x) || shopRating(y.id).avg - shopRating(x.id).avg);
  const name = C.form.name ? ', ' + esc(C.form.name.split(' ')[0]) : '';
  const gem = g[0] && g[0].s;
  const favShops = S.shops.filter(s => C.favs.has(s.id));
  const offers = S.offers.filter(o => o.active !== false && inArea(shopById(o.shopId), a) && isOpen(shopById(o.shopId))).slice(0, 6);
  const hadOrders = S.orders.some(o => o.deviceId === DEVICE);
  if (S.conn === 'connecting' && !S.shops.length) return `<div class="skel" style="height:150px"></div><div class="skel" style="height:80px"></div><div class="skel" style="height:220px"></div>`;
  return `
  ${installCard('Nukkad')}
  <div class="sec"><p class="eyebrow">${t('Namaste')}${name} 👋</p><h1 class="h1">${t('What do you need from your street today?')}</h1></div>
  <div class="sec">
    <div class="hero" id="hero" aria-label="${esc(t('Highlights'))}">
      <div class="slide"><div><h3>${t('Ready in about 20 minutes')}</h3><p>${t('Order from shops on your street. Pick it up on your way home.')}</p><button class="btn" type="button" data-act="c-jump" data-v="shops">${t('Explore shops')}</button></div><span class="big" aria-hidden="true">🛍️</span></div>
      <div class="slide s2"><div><h3>${t('Discover Local Gems')}</h3><p>${gem ? t('{shop} and other small shops near you.', {shop:esc(gem.name)}) : t('Small shops near you that deserve a visit.')}</p>${gem ? `<button class="btn" type="button" data-act="c-shop" data-v="${esc(gem.id)}">${t('Visit {shop}', {shop:esc(gem.name.split(' ')[0])})}</button>` : ''}</div><span class="big" aria-hidden="true">🪔</span></div>
      <div class="slide s3"><div><h3>${t('Your money stays on your street')}</h3><p>${t('Zero commission. Pay the shop directly by UPI or cash.')}</p><button class="btn" type="button" data-act="c-focus-search">${t('Start shopping')}</button></div><span class="big" aria-hidden="true">🤝</span></div>
    </div>
    <div class="dots" aria-hidden="true">${[0, 1, 2].map(i => `<i class="${i === C.slide ? 'on' : ''}"></i>`).join('')}</div>
  </div>
  <div class="cats">${['Stationery','Grocery','Clothing','Electronics','Handicrafts'].map(c => `<button class="cat" type="button" data-act="c-cat" data-v="${c}"><span class="th" style="background:${tint(c)}">${CATEMO[c]}</span>${catName(c)}</button>`).join('')}</div>
  ${offers.length ? `<section class="sec"><div class="sec-h"><h2 class="h2">${t('Offers from shops')} 🎁</h2><span class="small muted">${t('Paid by the shop, not hidden in prices')}</span></div>
    <div class="hscroll offers">${offers.map(o => { const s = shopById(o.shopId); return `<button class="offer" type="button" data-act="c-shop" data-v="${esc(s.id)}"><span class="o-k">${o.kind === 'freedel' ? '🛵' : o.pct + '%'}</span><b>${esc(offerTitle(o))}</b><span class="row-m">${esc(s.name)}</span></button>`; }).join('')}</div></section>` : ''}
  ${rec.length ? `<section class="sec"><div class="sec-h"><h2 class="h2">${hadOrders || C.favs.size ? t('Recommended for you') : t('Picked for you')} ✨</h2><span class="small muted">${t('Based on what you like')}</span></div>
    <div class="hscroll">${rec.map(({p, s, why}) => pcard(p, s, `<span title="${esc(why)}">${esc(s.name)}</span>`)).join('')}</div></section>` : ''}
  ${favShops.length ? `<section class="sec"><div class="sec-h"><h2 class="h2">${t('Your favourites')}</h2><button class="link" type="button" data-act="c-tab" data-v="saved">${t('See all')}</button></div>
    <div class="hscroll">${favShops.map(s => `<button class="gem" type="button" data-act="c-shop" data-v="${esc(s.id)}"><span class="mono">${esc(s.name[0])}</span><b>${esc(s.name)}</b><span class="row-m">${ratingChip(s)}</span></button>`).join('')}</div></section>` : ''}
  ${g.length ? `<section class="sec"><div class="sec-h"><h2 class="h2">${t('Local Gems')} 💎</h2><span class="small muted">${t('Small shops worth a visit')}</span></div>
    <div class="hscroll">${g.map(({s}) => `<button class="gem" type="button" data-act="c-shop" data-v="${esc(s.id)}"><span class="mono">${esc(s.name[0])}</span><b>${esc(s.name)}</b><span class="row-m">${t(s.category)} · ${esc(s.area)}</span><span class="tag">${t('Hidden gem')}</span></button>`).join('')}</div></section>` : ''}
  ${pop.length ? `<section class="sec"><div class="sec-h"><h2 class="h2">${t('Popular near you')} 🔥</h2><span class="small muted">${t('Ordered this month')}</span></div>
    <div class="hscroll">${pop.map(({p, s, sold}) => pcard(p, s, esc(s.name) + ' · ' + t('{n} sold', {n:sold}))).join('')}</div></section>` : ''}
  <div class="assure">
    <div>${ICON.clock}<b>${t('Now or pick a time')}</b></div>
    <div>${ICON.truck}<b>${t('Pickup or shop delivery')}</b></div>
    <div>${ICON.shield}<b>${t('Pay the shop by UPI')}</b></div>
  </div>
  <section class="sec" id="shops"><div class="sec-h"><h2 class="h2">${a === 'All' ? t('All shops') : t('Shops in {area}', {area:esc(a)})}</h2><span class="small muted">${t('{n} shops', {n:shops.length})}</span></div>
    ${shops.length ? `<div class="shopcards">${shops.map(shopCard).join('')}</div>` : `<div class="empty"><span class="big">🏘️</span><b>${t('No shops here yet')}</b><span>${t('Pick another area at the top.')}</span></div>`}
  </section>
  <a class="foot-link" href="${IN_CLAUDE ? '#seller' : 'seller/'}"><span><b>${t('Own a shop?')}</b><br><span class="small muted">${t('Open Nukkad for Shops. Free, no commission.')}</span></span><span class="arrow" aria-hidden="true">→</span></a>`;
}
function cSearch() {
  if (!C.q) {
    const pop = popular(C.area).slice(0, 4);
    return `<div class="sec"><h1 class="h1" style="font-size:25px">${t('Find it on your street')}</h1><p class="sub">${t('Type or tap the mic. English, हिंदी or ಕನ್ನಡ all work.')}</p></div>
    ${C.recent.length ? `<section class="sec"><div class="sec-h"><h2 class="h2">${t('Recent')}</h2><button class="link" type="button" data-act="c-clear-recent">${t('Clear')}</button></div>
      <div class="chips">${C.recent.map(q => `<button class="chip" type="button" data-act="c-chip" data-v="${esc(q)}">🕘 ${esc(q)}</button>`).join('')}</div></section>` : ''}
    <section class="sec"><h2 class="h2">${t('Try these')}</h2><div class="chips">${['notebook','saree','toor dal','charger','pen','printer ink','honey','चावल','ಸೀರೆ'].map(q => `<button class="chip" type="button" data-act="c-chip" data-v="${q}">${q}</button>`).join('')}</div></section>
    ${pop.length ? `<section class="sec"><h2 class="h2">${t('Popular near you')}</h2><div class="pgrid">${pop.map(({p, s}) => pcard(p, s)).join('')}</div></section>` : ''}`;
  }
  let res = search(C.q, C.area);
  if (C.sort === 'price') res = [...res].sort((a, b) => a.p.price - b.p.price);
  if (C.sort === 'rating') res = [...res].sort((a, b) => shopRating(b.s.id).avg - shopRating(a.s.id).avg);
  if (C.sort === 'stock') res = res.filter(r => r.p.stock > 0 && isOpen(r.s));
  const where = C.area === 'All' ? '' : ' · ' + C.area;
  let h = `<button class="back" type="button" data-act="c-search-reset">‹ ${t('New search')}</button>
    <div class="sec"><h1 class="h1" style="font-size:25px">“${esc(C.q)}”</h1><p class="sub">${t('{n} results', {n:res.length})}${esc(where)}</p></div>
    <div class="chips" role="group" aria-label="${esc(t('Sort'))}">${[['best', t('Best match')], ['price', t('Lowest price')], ['rating', t('Top rated')], ['stock', t('In stock now')]].map(([k, l]) => `<button class="chip" type="button" data-act="c-sort" data-v="${k}" aria-pressed="${C.sort === k}">${l}</button>`).join('')}</div>`;
  if (!res.length) return h + `<div class="empty"><span class="big">📡</span><b>${t('No shop here has this yet')}</b>
    <span>${t('We’ve told shops nearby that people want “{q}”. Try another area, or check back soon.', {q:esc(C.q)})}</span>
    ${C.area !== 'All' ? `<button class="btn btn-ghost btn-sm" type="button" data-act="c-all-areas">${t('Search all areas')}</button>` : ''}</div>`;
  const groups = new Map();
  for (const r of res) { const k = r.p.name.toLowerCase(); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); }
  for (const rows of groups.values()) {
    let best = -1;
    if (rows.length > 1) rows.forEach((r, i) => { if (r.p.stock > 0 && isOpen(r.s) && (best < 0 || r.p.price < rows[best].p.price)) best = i; });
    h += `<div class="card result"><div class="r-name">${thumb(rows[0].p)}<span class="row-main"><span>${esc(rows[0].p.name)}</span>${rows.length > 1 ? `<span class="r-cmp">${t('Compare {n} shops', {n:rows.length})}</span>` : `<span class="row-m">${esc(rows[0].p.desc || t(rows[0].p.category))}</span>`}</span></div>
      <ul class="r-rows">${rows.map((r, i) => `<li>
        <button type="button" class="r-shop" data-act="c-shop" data-v="${esc(r.s.id)}"><span class="row-main"><span class="row-t">${esc(r.s.name)}</span>
          <span class="row-m">${ratingChip(r.s)} · ${isOpen(r.s) ? '⏱ ' + (Number(r.s.readyMins) || 30) + ' ' + t('min') : t('Closed now')}</span>
          <span class="meta">${i === best ? `<span class="badge b-best">${t('Best price')}</span>` : ''}${r.orders < 3 ? `<span class="badge b-gem">${t('Local Gem')}</span>` : ''}${stockBadge(r.p.stock)}${fresh(r.p)}</span></span></button>
        <span class="r-right"><span class="price">${rs(r.p.price)}</span>${addCtl(r.p, r.s)}</span></li>`).join('')}</ul></div>`;
  }
  return h;
}
function cCat() {
  const c = C.cat;
  const items = S.products.filter(p => p.active !== false && (p.category === c || (shopById(p.shopId) || {}).category === c)).map(p => ({p, s:shopById(p.shopId)})).filter(x => inArea(x.s, C.area))
    .sort((a, b) => (isOpen(b.s) && b.p.stock > 0) - (isOpen(a.s) && a.p.stock > 0) || a.p.price - b.p.price);
  return `<button class="back" type="button" data-act="c-home">‹ ${t('Home')}</button>
  <div class="sec" style="grid-template-columns:auto 1fr;align-items:center;gap:12px"><span class="th" style="background:${tint(c)}">${CATEMO[c] || '🛍️'}</span><div><h1 class="h1" style="font-size:25px">${catName(c)}</h1><p class="sub">${t('{n} items', {n:items.length})}</p></div></div>
  ${items.length ? `<div class="pgrid">${items.map(({p, s}) => pcard(p, s)).join('')}</div>` : `<div class="empty"><span class="big">${CATEMO[c] || '🛍️'}</span><b>${t('Nothing here yet')}</b><span>${t('Try “All areas” at the top.')}</span></div>`}`;
}
function cShop() {
  const s = shopById(C.shopId);
  if (!s) return `<button class="back" type="button" data-act="c-home">‹ ${t('Home')}</button><div class="empty"><b>${t('This shop isn’t listed any more')}</b></div>`;
  const all = S.products.filter(p => p.shopId === s.id && p.active !== false);
  const cats = [...new Set(all.map(p => p.category))];
  const ps = C.shopCat === 'All' ? all : all.filter(p => p.category === C.shopCat);
  const fav = C.favs.has(s.id), rt = shopRating(s.id), offs = offersFor(s.id);
  const reviews = S.ratings.filter(r => r.shopId === s.id && r.text).sort((a, b) => tAt(b) - tAt(a)).slice(0, 3);
  return `
  <button class="back" type="button" data-act="${C.q ? 'c-back-search' : 'c-home'}">‹ ${C.q ? t('Back to results') : t('Home')}</button>
  <div class="shophero">
    <button class="heart" type="button" data-act="c-fav" data-v="${esc(s.id)}" aria-pressed="${fav}" aria-label="${esc(fav ? t('Remove from favourites') : t('Save to favourites'))}">${ICON.heart}</button>
    <div style="display:flex;gap:12px;align-items:center;position:relative;z-index:1"><span class="mono">${esc(s.name[0])}</span>
      <div style="min-width:0"><p class="eyebrow" style="color:var(--marigold-2)">${t(s.category)} · ${esc(s.area)}</p><h1 class="h1">${esc(s.name)}</h1></div></div>
    ${s.desc ? `<p class="sub" style="position:relative;z-index:1">${esc(s.desc)}</p>` : ''}
    <div class="stats3">
      <div><b>${rt.n ? '★ ' + rt.avg.toFixed(1) : t('New')}</b><span>${rt.n ? t('{n} ratings', {n:rt.n}) : t('no ratings yet')}</span></div>
      <div><b>${isOpen(s) ? '⏱ ' + (Number(s.readyMins) || 30) + ' ' + t('min') : t('Closed')}</b><span>${t('pickup ready')}</span></div>
      <div><b>${s.deliveryOn ? '🛵 ' + deliveryRange(s) : t('Pickup')}</b><span>${s.deliveryOn ? t('min delivery') + ' · ' + rs(s.deliveryFee) : t('only')}</span></div>
    </div>
  </div>
  ${!isOpen(s) ? `<p class="note">${t('This shop is closed right now. You can look around and order once they open.')}</p>` : ''}
  ${offs.length ? `<div class="offerline">${offs.map(o => `<span>🎁 ${esc(offerTitle(o))}</span>`).join('')}</div>` : ''}
  <p class="row-m">📍 ${esc(s.address || s.area)} · ${t('Pay by UPI or cash')}</p>
  ${cats.length > 1 ? `<div class="chips" role="group" aria-label="${esc(t('Filter'))}">${['All', ...cats].map(c => `<button class="chip" type="button" data-act="c-shopcat" data-v="${esc(c)}" aria-pressed="${C.shopCat === c}">${c === 'All' ? t('All items') : t(c)}</button>`).join('')}</div>` : ''}
  <ul class="prods">${ps.length ? ps.map(p => `<li class="prod ${p.stock <= 0 || !isOpen(s) ? 'off' : ''}">${thumb(p)}
    <div class="row-main"><span class="row-t">${esc(p.name)}</span>${p.desc ? `<span class="row-m">${esc(p.desc)}</span>` : ''}<span class="meta"><span class="price">${rs(p.price)}</span>${stockBadge(p.stock)}${fresh(p)}</span></div>
    ${addCtl(p, s)}</li>`).join('') : `<li class="empty"><span class="big">📦</span><b>${t('No products listed yet')}</b></li>`}</ul>
  ${reviews.length ? `<section class="sec"><h2 class="h2">${t('What customers say')}</h2>${reviews.map(r => `<div class="card review">${stars(r.stars)}<p>${esc(r.text)}</p><span class="row-m">${ago(tAt(r))}</span></div>`).join('')}</section>` : ''}`;
}
function cBagSheet() {
  const s = shopById(C.cartShop), lines = cartLines(), f = C.form;
  if (!s || !lines.length) { C.sheet = null; return ''; }
  const deliv = f.mode === 'delivery' && s.deliveryOn, fee0 = deliv ? Number(s.deliveryFee) || 0 : 0;
  const sub = lines.reduce((a, l) => a + l.p.price * l.q, 0);
  const off = bestOffer(s.id, sub, fee0), nxt = nextOffer(s.id, sub);
  const disc = off && off.o.kind === 'pct' ? off.save : 0, fee = off && off.o.kind === 'freedel' ? 0 : fee0;
  const total = sub - disc + fee;
  const slots = slotsFor(), tog = together(lines);
  return `<div class="scrim" data-act="c-sheet-close"></div>
  <div class="sheet ${FX.sheet ? '' : 'still'}" role="dialog" aria-modal="true" aria-label="${esc(t('Your bag'))}">
    <span class="grab" aria-hidden="true"></span>
    <div class="sheet-h"><div><h2 class="h2">${t('Your bag')}</h2><p class="row-m">${esc(s.name)} · ${ratingChip(s)}</p></div>
      <button class="icon-btn" type="button" data-act="c-sheet-close" aria-label="${esc(t('Close'))}">×</button></div>
    <ul class="lines">${lines.map(({p, q}) => `<li>${thumb(p)}<span class="row-main"><span class="row-t">${esc(p.name)}</span><span class="row-m">${rs(p.price)} ${t('each')}</span></span>
      <span class="r-right"><span class="price">${rs(p.price * q)}</span>${addCtl(p, s)}</span></li>`).join('')}</ul>
    ${tog.length ? `<div class="sec"><h3 class="small" style="font-weight:800">${t('Often bought together')}</h3><div class="hscroll mini">${tog.map(p => `<div class="pcard">${thumb(p, 'lg')}<span class="nm">${esc(p.name)}</span><div class="ft"><span class="price">${rs(p.price)}</span>${addCtl(p, s)}</div></div>`).join('')}</div></div>` : ''}
    ${off ? `<p class="okbox">🎁 ${t('{offer} applied. You save {amt}.', {offer:esc(offerTitle(off.o).split(' · ')[0]), amt:rs(off.save)})}</p>` : nxt ? `<p class="note">🎁 ${t('Add {amt} more to get: {offer}', {amt:rs(nxt.need), offer:esc(offerTitle(nxt.o).split(' · ')[0])})}</p>` : ''}
    <form id="c-checkout" class="sec" novalidate>
      <fieldset><legend>${t('How do you want it?')}</legend>
        <label class="opt"><input type="radio" name="mode" value="pickup" data-act="c-mode" ${deliv ? '' : 'checked'}><b>🏪 ${t('Pick up')}</b><span>${t('Free')} · ~${Number(s.readyMins) || 30} ${t('min')}</span></label>
        <label class="opt ${s.deliveryOn ? '' : 'disabled'}"><input type="radio" name="mode" value="delivery" data-act="c-mode" ${deliv ? 'checked' : ''} ${s.deliveryOn ? '' : 'disabled'}><b>🛵 ${t('Delivery')}</b><span>${s.deliveryOn ? deliveryRange(s) + ' ' + t('min') + ' · ' + rs(s.deliveryFee) : t('Not offered')}</span></label>
      </fieldset>
      <div class="sec"><span class="field"><span>${t('When?')}</span></span>
        <div class="chips slots" role="group" aria-label="${esc(t('When?'))}">
          <button class="chip" type="button" data-act="c-when" data-v="now" aria-pressed="${C.when === 'now'}">⚡ ${t('Now')} · ${deliv ? deliveryRange(s) : (Number(s.readyMins) || 30)} ${t('min')}</button>
          ${slots.map(sl => `<button class="chip" type="button" data-act="c-when" data-v="${esc(sl.key)}" aria-pressed="${C.when === sl.key}">${ICON.cal}${esc(sl.day)} ${esc(sl.label)}</button>`).join('')}
        </div></div>
      <label class="field"><span>${t('Your name')}</span><input id="c-name" data-bind="name" value="${esc(f.name)}" autocomplete="name"></label>
      <label class="field"><span>${t('Phone')} <i>(${t('so the shop can reach you')})</i></span><input id="c-phone" type="tel" inputmode="tel" data-bind="phone" value="${esc(f.phone)}" autocomplete="tel"></label>
      ${deliv ? `<label class="field"><span>${t('Delivery address')}</span><input id="c-addr" data-bind="address" value="${esc(f.address)}" autocomplete="street-address"></label>` : ''}
      <label class="field"><span>${t('Note for the shop')} <i>(${t('optional')})</i></span><input id="c-note" data-bind="note" value="${esc(f.note)}" placeholder="${esc(t('e.g. Please pack separately'))}"></label>
      <div class="totals"><div><span>${t('Items')}</span><span>${rs(sub)}</span></div>
        ${disc ? `<div class="save"><span>${t('Shop offer')}</span><span>− ${rs(disc)}</span></div>` : ''}
        <div><span>${deliv ? t('Delivery') : t('Pickup')}</span><span>${deliv ? (fee ? rs(fee) : `<s>${rs(fee0)}</s> ${t('Free')}`) : t('Free')}</span></div>
        <div><span>${t('Nukkad fee')}</span><span>₹0</span></div>
        <div class="grand"><span>${t('To pay the shop')}</span><span>${rs(total)}</span></div></div>
      ${C.err ? `<p class="error" role="alert">${esc(C.err)}</p>` : ''}
      <button class="btn btn-go wide" type="submit" style="padding:15px">${t('Place order')} · ${rs(total)}</button>
      <p class="small muted" style="text-align:center">${t('Pay {shop} by UPI after ordering, or cash at pickup.', {shop:esc(s.name)})}</p>
    </form>
  </div>`;
}
function cSwitchSheet() {
  const cur = shopById(C.cartShop), next = C.pendingAdd ? shopById((prodById(C.pendingAdd) || {}).shopId) : null;
  return `<div class="scrim" data-act="c-sheet-close"></div>
  <div class="sheet ${FX.sheet ? '' : 'still'}" role="dialog" aria-modal="true" aria-label="${esc(t('Start a new bag?'))}">
    <span class="grab" aria-hidden="true"></span>
    <h2 class="h2">${t('Start a new bag?')}</h2>
    <p class="sub">${t('Your bag has items from {a}. Each order goes to one shop, so we’ll clear it and add this from {b}.', {a:esc(cur ? cur.name : ''), b:esc(next ? next.name : '')})}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button class="btn btn-ghost" type="button" data-act="c-sheet-close">${t('Keep my bag')}</button><button class="btn btn-go" type="button" data-act="c-switch-yes">${t('Start new bag')}</button></div>
  </div>`;
}
function ringFor(o, s) {
  const mins = o.mode === 'delivery' ? Number(s.deliveryMins) || 45 : Number(s.readyMins) || 30;
  const base = o.when && o.when !== 'now' ? new Date(o.when).getTime() - mins * 60e3 : tAt(o);
  const elapsed = (Date.now() - base) / 6e4;
  let pct, label, sub;
  if (o.status === 'ready' || o.status === 'completed') { pct = 1; label = o.status === 'completed' ? '✓' : (o.mode === 'delivery' ? '🛵' : '✓'); sub = o.status === 'completed' ? t('All done') : (o.mode === 'delivery' ? t('On the way') : t('Go pick it up')); }
  else if (o.status === 'cancelled') { pct = 0; label = '—'; sub = t('Cancelled'); }
  else if (o.when && o.when !== 'now' && elapsed < 0) { pct = .05; label = ICON.cal; sub = t('Scheduled for {when}', {when:whenText(o)}); }
  else { pct = Math.min(.95, Math.max(.05, elapsed / mins)); const left = Math.max(1, Math.round(mins - elapsed)); label = left + 'm'; sub = o.status === 'pending' ? t('Waiting for the shop to accept') : t('Packing your order'); }
  const r = 30, c = 2 * Math.PI * r;
  return `<div class="ring"><div class="ring-wrap"><svg viewBox="0 0 72 72" aria-hidden="true"><circle class="bgc" cx="36" cy="36" r="${r}" fill="none" stroke-width="7"/><circle class="fgc" cx="36" cy="36" r="${r}" fill="none" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - pct)).toFixed(1)}"/></svg><b>${label}</b></div>
    <div><b style="font-size:16px">${esc(sub)}</b><p class="row-m">${o.status === 'pending' || o.status === 'confirmed' ? (o.mode === 'delivery' ? t('Delivery in about {r} min', {r:deliveryRange(s)}) : t('Usually ready in about {n} min', {n:Number(s.readyMins) || 30})) : t('Updated {ago}', {ago:ago(o.statusAt || tAt(o))})}</p></div></div>`;
}
function upiLink(o, s) {
  return `upi://pay?pa=${encodeURIComponent(s.upi || '')}&pn=${encodeURIComponent(s.name)}&am=${encodeURIComponent(Number(o.total).toFixed(2))}&cu=INR&tn=${encodeURIComponent('Nukkad ' + o.id)}`;
}
function payCard(o, s) {
  if (o.status === 'cancelled') return '';
  if (o.paid === 'confirmed') return `<p class="okbox">✓ ${t('Payment received by the shop')}</p>`;
  if (!s.upi) return `<p class="note">💵 ${t('Pay {amt} by cash when you collect it.', {amt:rs(o.total)})}</p>`;
  const claimed = o.paid === 'claimed' || C.paidClaim.has(o.id), link = upiLink(o, s), svg = qrSvg(link, 3);
  return `<div class="card sec paycard">
    <div class="sec-h"><h2 class="h2">${t('Pay the shop by UPI')}</h2><span class="price">${rs(o.total)}</span></div>
    ${claimed ? `<p class="okbox">✓ ${t('You marked this as paid. The shop will confirm.')}</p>` : `
    <a class="btn btn-go wide" href="${esc(link)}">${t('Pay with GPay / PhonePe / Paytm')}</a>
    ${svg ? `<details><summary class="small" style="cursor:pointer;font-weight:800">${t('Paying from another phone? Show QR')}</summary><div class="qrbox">${svg}</div></details>` : ''}
    <p class="small muted">${t('Money goes straight to {upi}. Nukkad never touches it.', {upi:esc(s.upi)})}${/@nukkad$/.test(s.upi) ? ' ' + t('(Demo UPI ID. It won’t accept money.)') : ''}</p>
    <button class="btn btn-ghost btn-sm" type="button" data-act="c-paid" data-v="${esc(o.id)}">${t('I’ve paid')}</button>`}
  </div>`;
}
function rateCard(o, s) {
  if (o.status !== 'completed') return '';
  const mine = S.ratings.find(r => r.orderId === o.id);
  if (mine) return `<div class="card sec"><h2 class="h2">${t('Thanks for rating!')}</h2>${stars(mine.stars)}${mine.text ? `<p>${esc(mine.text)}</p>` : ''}</div>`;
  const d = C.rateDraft[o.id] || {stars:0, text:''};
  return `<div class="card sec ratecard">
    <h2 class="h2">${t('How was {shop}?', {shop:esc(s.name)})}</h2>
    <div class="rate" role="radiogroup" aria-label="${esc(t('Rating'))}">${[1, 2, 3, 4, 5].map(i => `<button type="button" role="radio" aria-checked="${d.stars === i}" class="${i <= d.stars ? 'on' : ''}" data-act="c-rate" data-v="${esc(o.id)}|${i}" aria-label="${i} ${esc(t('stars'))}">${ICON.star}</button>`).join('')}</div>
    ${d.stars ? `<textarea id="rv-${esc(o.id)}" data-rate="${esc(o.id)}" rows="2" placeholder="${esc(t('Say something nice (optional)'))}">${esc(d.text)}</textarea>
    <button class="btn btn-forest" type="button" data-act="c-rate-send" data-v="${esc(o.id)}">${t('Send rating')}</button>` : `<p class="small muted">${t('Tap a star. It helps small shops get found.')}</p>`}
  </div>`;
}
function cTrack() {
  const o = S.orders.find(x => x.id === C.orderId);
  if (!o) return `<button class="back" type="button" data-act="c-tab" data-v="orders">‹ ${t('My orders')}</button><div class="empty"><b>${t('Order not found')}</b></div>`;
  const s = shopById(o.shopId) || {name:t('the shop'), whatsapp:'', readyMins:30};
  const msg = orderMsg(o, s), steps = stepsFor(o), idx = steps.findIndex(x => x.k === o.status);
  return `
  <button class="back" type="button" data-act="c-tab" data-v="orders">‹ ${t('My orders')}</button>
  <div class="sec"><p class="eyebrow">${esc(o.id)} · ${esc(s.name)}</p><h1 class="h1" style="font-size:26px">${esc(statusText(o))}</h1>
    <p class="sub">${o.status === 'cancelled' ? t('Nothing was charged. Your items went back on the shelf.') : t('This page updates by itself.') + ' ' + connChip()}</p></div>
  <div class="card">${ringFor(o, s)}</div>
  ${rateCard(o, s)}
  ${o.status !== 'cancelled' ? `<div class="card"><ol class="track">${steps.map((st, i) => `<li class="${i < idx || o.status === 'completed' ? 'done' : i === idx ? 'now' : ''}">
    <span class="dot">${i < idx || o.status === 'completed' ? '✓' : i + 1}</span><div><b>${esc(st.t)}</b><span>${esc(st.s)}</span></div></li>`).join('')}</ol></div>` : ''}
  ${payCard(o, s)}
  <div class="card sec">
    <ul class="lines">${o.items.map(i => { const p = prodById(i.pid) || {name:i.name, category:''}; return `<li>${thumb(p)}<span class="row-main"><span class="row-t">${esc(i.name)}</span><span class="row-m">${i.qty} × ${rs(i.price)}</span></span><span class="price">${rs(i.price * i.qty)}</span></li>`; }).join('')}</ul>
    <div class="totals">${o.discount ? `<div class="save"><span>${t('Shop offer')}</span><span>− ${rs(o.discount)}</span></div>` : ''}${o.fee ? `<div><span>${t('Delivery')}</span><span>${rs(o.fee)}</span></div>` : ''}<div class="grand"><span>${t('To pay the shop')}</span><span>${rs(o.total)}</span></div></div>
    <p class="small muted">${o.mode === 'delivery' ? '🛵 ' + t('Delivery to {addr}', {addr:esc(o.address)}) : '🏪 ' + t('Pickup from {place}', {place:esc(s.address || s.name)})} · ${ICON.cal ? '' : ''}🗓 ${esc(whenText(o))}</p>
  </div>
  ${o.status !== 'cancelled' && o.status !== 'completed' ? `<div class="sec">
    <a class="btn btn-wa wide" href="${esc(waLink(s.whatsapp, msg))}" target="_blank" rel="noopener">${t('Send a copy on WhatsApp')}</a>
    <details><summary class="small" style="cursor:pointer;font-weight:800">${t('Preview the message')}</summary><div class="bubble" style="margin-top:8px">${fmtWa(msg)}</div></details>
  </div>` : `<button class="btn btn-go wide" type="button" data-act="c-reorder" data-v="${esc(o.id)}">↻ ${t('Order again')}</button>`}
  <button class="btn btn-ghost wide" type="button" data-act="c-home">${t('Keep shopping')}</button>`;
}
function cOrders() {
  const my = S.orders.filter(o => o.deviceId === DEVICE).sort((a, b) => tAt(b) - tAt(a));
  const active = my.filter(o => !['completed','cancelled'].includes(o.status)), past = my.filter(o => ['completed','cancelled'].includes(o.status));
  const card = o => { const s = shopById(o.shopId); const live = !['completed','cancelled'].includes(o.status); const rated = S.ratings.some(r => r.orderId === o.id); return `<div class="ocard">
    <button class="ocard-h" type="button" data-act="c-track" data-v="${esc(o.id)}"><span class="mono">${esc((s ? s.name : 'S')[0])}</span>
      <span class="row-main"><span class="row-t">${esc(s ? s.name : t('Shop'))}</span><span class="row-m">${esc(o.id)} · ${ago(tAt(o))} · ${rs(o.total)}</span></span>${statusPill(o)}</button>
    <p class="row-m">${o.items.map(i => `${i.qty} × ${esc(i.name)}`).join(', ')}${o.when && o.when !== 'now' ? ' · 🗓 ' + esc(whenText(o)) : ''}</p>
    <div class="o-act">${live ? `<button class="btn btn-forest btn-sm" type="button" data-act="c-track" data-v="${esc(o.id)}">${t('Track order')}</button>` : `<button class="btn btn-ghost btn-sm" type="button" data-act="c-reorder" data-v="${esc(o.id)}">↻ ${t('Order again')}</button>${o.status === 'completed' && !rated ? `<button class="btn btn-link" type="button" data-act="c-track" data-v="${esc(o.id)}">★ ${t('Rate')}</button>` : ''}`}</div></div>`; };
  if (!my.length) return `<h1 class="h1" style="font-size:26px">${t('My orders')}</h1><div class="empty"><span class="big">🛍️</span><b>${t('No orders yet')}</b><span>${t('Find something on your street and track it live here.')}</span><button class="btn btn-go btn-sm" type="button" data-act="c-home">${t('Start shopping')}</button></div>`;
  return `<h1 class="h1" style="font-size:26px">${t('My orders')}</h1>
  ${active.length ? `<section class="sec"><h2 class="h2">${t('On the way')}</h2>${active.map(card).join('')}</section>` : ''}
  ${past.length ? `<section class="sec"><h2 class="h2">${t('Past orders')}</h2>${past.map(card).join('')}</section>` : ''}`;
}
function cSaved() {
  const favs = S.shops.filter(s => C.favs.has(s.id));
  return `<h1 class="h1" style="font-size:26px">${t('Saved shops')}</h1>
  ${favs.length ? `<div class="shopcards">${favs.map(shopCard).join('')}</div>` : `<div class="empty"><span class="big">💚</span><b>${t('No saved shops yet')}</b><span>${t('Tap the heart on a shop to keep it here.')}</span><button class="btn btn-go btn-sm" type="button" data-act="c-home">${t('Browse shops')}</button></div>`}`;
}

/* ---------- Customer actions ---------- */
function cGo(screen, tab) { C.screen = screen; if (tab) C.tab = tab; C.err = ''; FX.enter = true; render(); scrollTop(); }
function addOne(pid) {
  const p = prodById(pid); if (!p) return;
  if (C.cartShop && C.cartShop !== p.shopId && cartLines().length) { C.pendingAdd = pid; C.sheet = 'switch'; FX.sheet = true; render(); return; }
  C.cartShop = p.shopId; C.cart[pid] = Math.min(p.stock, (C.cart[pid] || 0) + 1);
  C.bump = true; buzz(15); render(); C.bump = false;
}
async function cRunSearch(q) {
  q = norm(q); if (!q) return;
  const res = search(q, C.area);
  C.q = q; C.qDraft = q; C.sort = 'best'; C.screen = 'search'; C.tab = 'search';
  C.recent = [q, ...C.recent.filter(x => x !== q)].slice(0, 6); ls('recent', JSON.stringify(C.recent));
  FX.enter = true; render(); scrollTop();
  if (C.area !== 'All') await put('searches', {id:'q' + Date.now().toString(36) + rid(3), q:norm(synify(q)), area:C.area, results:res.length, at:Date.now()});
}
function celebrate(o, s) {
  const fx = $('#fx'); if (!fx) return;
  const colors = ['#EE9A2E','#F5B04E','#8FD1AE','#F7F1E5','#E0475B','#5CC08A'];
  fx.innerHTML = `<div class="success" role="status"><div class="confetti" aria-hidden="true">${Array.from({length:36}, (_, i) => `<i style="left:${(i * 37) % 100}%;background:${colors[i % colors.length]};animation-delay:${(i % 9) * .08}s;transform:rotate(${i * 23}deg)"></i>`).join('')}</div>
    <div><div class="tick">${ICON.check}</div><h2>${t('Order placed!')}</h2><p>${t('{shop} has it', {shop:esc(s.name)})} · ${esc(o.id)}</p></div></div>`;
  buzz([30, 50, 30]);
  setTimeout(() => { fx.innerHTML = ''; }, 1900);
}
async function cPlaceOrder() {
  const s = shopById(C.cartShop), f = C.form, lines = cartLines();
  const err = m => { C.err = m; FX.sheet = false; render(); };
  if (!s || !lines.length) return err(t('Your bag is empty.'));
  if (!isOpen(s)) return err(t('{shop} is closed right now. Try again once they open.', {shop:s.name}));
  if (!f.name.trim()) return err(t('Add your name so the shop knows who it’s for.'));
  const phone = cleanPhone(f.phone);
  if (f.phone.trim() && phone.length < 12) return err(t('Check the phone number. It needs 10 digits.'));
  const deliv = f.mode === 'delivery' && s.deliveryOn;
  if (deliv && !f.address.trim()) return err(t('Add a delivery address.'));
  for (const {p, q} of lines) if (p.stock < q) return err(t('Only {n} left of {name}. Lower the quantity.', {n:p.stock, name:p.name}));
  const fee0 = deliv ? Number(s.deliveryFee) || 0 : 0, sub = lines.reduce((a, l) => a + l.p.price * l.q, 0);
  const off = bestOffer(s.id, sub, fee0), disc = off && off.o.kind === 'pct' ? off.save : 0, fee = off && off.o.kind === 'freedel' ? 0 : fee0;
  const o = {id:'NK-' + rid(4).toUpperCase(), shopId:s.id, buyer:f.name.trim(), phone, deviceId:DEVICE,
    items:lines.map(({p, q}) => ({pid:p.id, name:p.name, price:p.price, qty:q})), fee, discount:disc, offerId:off ? off.o.id : null, total:sub - disc + fee,
    status:'pending', mode:deliv ? 'delivery' : 'pickup', address:deliv ? f.address.trim() : '', note:f.note.trim(), when:C.when, paid:'', at:Date.now()};
  ls('name', o.buyer); ls('phone', f.phone.trim()); if (deliv) ls('addr', o.address);
  if (!seenStatus) seenStatus = {};
  seenStatus[o.id] = 'pending';
  const problem = await placeOrderBackend(o);
  if (problem) return err(problem);
  celebrate(o, s);
  C.cart = {}; C.cartShop = null; C.sheet = null; f.note = ''; C.when = 'now'; C.orderId = o.id; C.screen = 'track'; C.tab = 'orders'; C.err = '';
  FX.enter = true; render(); scrollTop();
}
function cReorder(id) {
  const o = S.orders.find(x => x.id === id); if (!o) return;
  const s = shopById(o.shopId);
  if (!s || !isOpen(s)) { toast(t('{shop} is closed right now. Try again once they open.', {shop:s ? s.name : ''})); return; }
  C.cart = {}; C.cartShop = s.id; let missing = 0;
  for (const it of o.items) { const p = prodById(it.pid); if (p && p.stock > 0 && p.active !== false) C.cart[p.id] = Math.min(p.stock, it.qty); else missing++; }
  if (!cartLines().length) { toast(t('Those items are out of stock right now.')); return; }
  if (missing) toast(t('{n} out-of-stock items were left out.', {n:missing}));
  C.sheet = 'bag'; FX.sheet = true; render();
}
let recog = null;
function startVoice() {
  if (!VOICE) return;
  if (C.listening && recog) { try { recog.stop(); } catch (e) { /* ignore */ } return; }
  try {
    recog = new VOICE(); recog.lang = LANGS[LANG].voice; recog.interimResults = true; recog.maxAlternatives = 1;
    recog.onresult = ev => { const txt = Array.from(ev.results).map(r => r[0].transcript).join(' ').trim(); C.qDraft = txt; const i = $('#c-q'); if (i) i.value = txt; if (ev.results[ev.results.length - 1].isFinal) { C.listening = false; cRunSearch(txt); } };
    recog.onerror = ev => { C.listening = false; render(); if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') toast(t('Allow the microphone to search by voice.')); };
    recog.onend = () => { if (C.listening) { C.listening = false; render(); } };
    C.listening = true; render(); recog.start(); toast('🎙 ' + t('Listening… say a product'));
  } catch (e) { C.listening = false; toast(t('Voice search isn’t available here. Try typing.')); render(); }
}
function showSugg() {
  const box = $('#sugg'); if (!box) return;
  const list = suggestions(C.qDraft, C.area);
  if (!C.qDraft.trim() || !list.length) { box.hidden = true; box.innerHTML = ''; return; }
  const hl = tx => { let h = esc(tx); toks(C.qDraft).forEach(k => { if (k.length > 1) h = h.replace(new RegExp('(' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); }); return h; };
  box.innerHTML = list.map(x => x.kind === 'p'
    ? `<button type="button" data-act="c-chip" data-v="${esc(x.p.name.toLowerCase())}">${thumb(x.p)}<span>${hl(x.p.name)}<small>${rs(x.p.price)} · ${esc(x.s.name)}</small></span></button>`
    : `<button type="button" data-act="c-shop" data-v="${esc(x.s.id)}"><span class="th" style="background:var(--sage)">🏪</span><span>${hl(x.s.name)}<small>${t('Shop')} · ${esc(x.s.area)}</small></span></button>`).join('');
  box.hidden = false;
}
Object.assign(ACT, {
  'c-home': () => { C.q = ''; C.qDraft = ''; cGo('home', 'home'); },
  'c-tab': v => {
    if (v === 'home') { C.q = ''; C.qDraft = ''; cGo('home', 'home'); }
    else if (v === 'search') { C.q = ''; cGo('search', 'search'); setTimeout(() => $('#c-q')?.focus(), 50); }
    else cGo(v, v);
  },
  'c-chip': v => { const b = $('#sugg'); if (b) b.hidden = true; cRunSearch(v); },
  'c-search-reset': () => { C.q = ''; C.qDraft = ''; cGo('search', 'search'); setTimeout(() => $('#c-q')?.focus(), 50); },
  'c-clear-recent': () => { C.recent = []; ls('recent', '[]'); render(); },
  'c-sort': v => { C.sort = v; render(); },
  'c-all-areas': () => { C.area = 'All'; ls('area', 'All'); render(); },
  'c-back-search': () => cGo('search'),
  'c-cat': v => { C.cat = v; cGo('cat'); },
  'c-shop': (v, el, e) => {
    if (e.target.closest('.heart')) return;
    const b = $('#sugg'); if (b) b.hidden = true;
    if (C.shopId !== v) C.shopCat = 'All';
    C.shopId = v; cGo('shop');
  },
  'c-shopcat': v => { C.shopCat = v; render(); },
  'c-fav': (v, el, e) => {
    e.stopPropagation();
    if (C.favs.has(v)) { C.favs.delete(v); toast(t('Removed from favourites')); } else { C.favs.add(v); buzz(15); toast('💚 ' + t('Saved to favourites')); }
    ls('favs', JSON.stringify([...C.favs])); render();
  },
  'c-add': v => addOne(v),
  'c-qty': v => {
    const [pid, d] = v.split('|'), p = prodById(pid); if (!p) return;
    C.cart[pid] = Math.max(0, Math.min(p.stock, (C.cart[pid] || 0) + Number(d)));
    if (!cartLines().length) { C.cartShop = null; if (C.sheet === 'bag') C.sheet = null; }
    if (Number(d) > 0) { if (!C.cartShop) C.cartShop = p.shopId; C.bump = true; buzz(10); }
    render(); C.bump = false;
  },
  'c-bag': () => { C.sheet = 'bag'; C.err = ''; FX.sheet = true; render(); },
  'c-sheet-close': () => { C.sheet = null; C.pendingAdd = null; render(); },
  'c-switch-yes': () => { const pid = C.pendingAdd; C.cart = {}; C.cartShop = null; C.sheet = null; C.pendingAdd = null; addOne(pid); toast(t('Started a new bag')); },
  'c-when': v => { C.when = v; render(); },
  'c-track': v => { C.orderId = v; cGo('track', 'orders'); },
  'c-reorder': v => cReorder(v),
  'c-jump': v => document.getElementById(v)?.scrollIntoView({behavior:'smooth', block:'start'}),
  'c-focus-search': () => $('#c-q')?.focus(),
  'c-voice': () => startVoice(),
  'c-paid': async v => { C.paidClaim.add(v); ls('paid', JSON.stringify([...C.paidClaim])); await patch('orders', v, {paid:'claimed'}); toast(t('Thanks! The shop will confirm your payment.')); render(); },
  'c-rate': v => { const [id, n] = v.split('|'); C.rateDraft[id] = {...(C.rateDraft[id] || {text:''}), stars:Number(n)}; buzz(10); render(); },
  'c-rate-send': async v => {
    const d = C.rateDraft[v], o = S.orders.find(x => x.id === v); if (!d || !d.stars || !o) return;
    await put('ratings', {id:'r-' + v, orderId:v, shopId:o.shopId, stars:d.stars, text:String(d.text || '').trim().slice(0, 280), deviceId:DEVICE, at:Date.now()});
    delete C.rateDraft[v]; toast('⭐ ' + t('Thanks! Your rating helps small shops get found.')); render();
  },
});
Object.assign(CHANGE, {
  'c-area': el => { C.area = el.value; ls('area', el.value); FX.enter = true; render(); },
  'c-mode': el => { C.form.mode = el.value; C.err = ''; render(); },
});
SUBMIT['c-search'] = () => { const b = $('#sugg'); if (b) b.hidden = true; cRunSearch(C.qDraft); };
SUBMIT['c-checkout'] = () => cPlaceOrder();
document.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.bind) C.form[el.dataset.bind] = el.value;
  if (el.dataset.rate) { const id = el.dataset.rate; C.rateDraft[id] = {...(C.rateDraft[id] || {stars:0}), text:el.value}; }
  if (el.id === 'c-q') { C.qDraft = el.value; showSugg(); }
});
document.addEventListener('focusin', e => { if (e.target.id === 'c-q') showSugg(); });
document.addEventListener('focusout', e => { if (e.target.id === 'c-q') setTimeout(() => { const b = $('#sugg'); if (b && !b.contains(document.activeElement)) b.hidden = true; }, 180); });
