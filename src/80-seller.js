
/* =========================================================
   SELLER APP
   ========================================================= */
function sHeader(s) {
  return `<header class="top"><div class="gut"><div class="top-in">
    <button class="brand" type="button" data-act="s-tab" data-v="orders">${ICON.logoShop}<b>nukkad</b><span>${t('for shops')}</span></button>
    <div class="top-r">${connChip()}${langBtn()}</div></div>
    ${s ? `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding-bottom:10px">
      <div class="row-main"><span class="row-t" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(s.name)}</span><span class="row-m">${esc(s.area)} · ${ratingChip(s)}</span></div>
      <button class="openpill" type="button" data-act="s-open" aria-pressed="${isOpen(s)}">${isOpen(s) ? t('Open') : t('Closed')}<span class="sw" aria-hidden="true"></span></button>
    </div>` : ''}
  </div></header>`;
}
function renderSeller() {
  const s = V.shopId ? shopById(V.shopId) : null;
  if (!s) {
    if (V.shopId && S.conn !== 'connecting') { V.shopId = null; ls('seller-shop', null); }
    return V.reg ? sRegister() : sLogin();
  }
  if (V.poster) return sPoster(s);
  const mine = S.orders.filter(o => o.shopId === s.id);
  const nNew = mine.filter(o => o.status === 'pending').length;
  let body;
  switch (V.tab) {
    case 'products': body = sProducts(s); break;
    case 'insights': body = sInsights(s); break;
    case 'shop': body = sSettings(s); break;
    default: body = sOrders(s, mine);
  }
  return `${sHeader(s)}
  <main class="gut ${FX.enter ? 'enter' : ''}">${body}</main>
  ${nav([['orders', t('Orders'), 'bag', nNew], ['products', t('Products'), 'box'], ['insights', t('Insights'), 'chart'], ['shop', t('Shop'), 'shop']], V.tab, 's-tab')}`;
}
function sLogin() {
  const pick = V.pick ? shopById(V.pick) : null;
  return `${sHeader(null)}
  <main class="gut ${FX.enter ? 'enter' : ''}">
    ${installCard('Nukkad for Shops')}
    <div class="sec"><p class="eyebrow">${t('Shop login')}</p><h1 class="h1">${t('Your shop, organised.')}</h1>
      <p class="sub">${t('Orders, stock and what your street is searching for, in one place. No commission.')}</p></div>
    ${pick ? `<div class="card sec" style="justify-items:center;text-align:center">
        <span class="mono">${esc(pick.name[0])}</span><b>${esc(pick.name)}</b><span class="row-m">${t('Enter your 4-digit PIN')}${S.backend !== 'supabase' || /^s\d+$/.test(pick.id) ? ' · ' + t('demo PIN 1234') : ''}</span>
        <div class="pinrow ${V.pinErr ? 'bad' : ''}" aria-label="${V.pin.length} / 4">${[0, 1, 2, 3].map(i => `<span class="${i < V.pin.length ? 'on' : ''}">${i < V.pin.length ? '•' : ''}</span>`).join('')}</div>
        ${V.pinErr ? `<p class="error" role="alert" style="justify-self:stretch">${t('That PIN doesn’t match. Try again.')}</p>` : ''}
        <div class="keypad" style="width:100%;max-width:300px">${['1','2','3','4','5','6','7','8','9','back','0','change'].map(k => k === 'back' ? `<button type="button" data-act="s-key" data-v="back" aria-label="${esc(t('Delete'))}">⌫</button>` : k === 'change' ? `<button type="button" data-act="s-pick" data-v="" style="font-size:13px">${t('Change shop')}</button>` : `<button type="button" data-act="s-key" data-v="${k}">${k}</button>`).join('')}</div>
      </div>` : `<div class="sec"><h2 class="h2">${t('Pick your shop')}</h2>
      ${S.conn === 'connecting' && !S.shops.length ? '<div class="skel" style="height:64px"></div><div class="skel" style="height:64px"></div>' : ''}
      <div class="login-shops">${S.shops.map(x => `<button class="login-shop" type="button" data-act="s-pick" data-v="${esc(x.id)}">
        <span class="mono">${esc(x.name[0])}</span><span class="row-main"><span class="row-t">${esc(x.name)}</span><span class="row-m">${t(x.category)} · ${esc(x.area)}</span></span><span aria-hidden="true" class="muted">›</span></button>`).join('')}</div></div>
      <button class="btn btn-go wide" type="button" data-act="s-reg">＋ ${t('Register a new shop')}</button>`}
    <a class="btn btn-link" href="${IN_CLAUDE ? '#' : '../'}" style="justify-self:center">${t('Open the customer app')}</a>
  </main>`;
}
function sRegister() {
  const r = V.reg;
  return `${sHeader(null)}
  <main class="gut ${FX.enter ? 'enter' : ''}">
    <button class="back" type="button" data-act="s-reg-cancel">‹ ${t('Back to login')}</button>
    <div class="sec"><h1 class="h1">${t('Put your shop online')}</h1><p class="sub">${t('Takes two minutes. Free, and you keep every rupee you sell.')}</p></div>
    <form id="s-register" class="card sec" novalidate>
      <label class="field"><span>${t('Shop name')}</span><input id="r-name" data-rbind="name" value="${esc(r.name)}" placeholder="${esc(t('e.g. Lakshmi Stores'))}"></label>
      <div class="sec"><span class="field"><span>${t('What do you sell?')}</span></span><div class="chips" style="flex-wrap:wrap;margin:0;padding:0">${CATS.map(c => `<button class="chip" type="button" data-act="s-regcat" data-v="${c}" aria-pressed="${c === r.category}">${CATEMO[c]} ${t(c)}</button>`).join('')}</div></div>
      <label class="field"><span>${t('Area')}</span><input id="r-area" data-rbind="area" value="${esc(r.area)}" list="area-list" placeholder="Jayanagar"><datalist id="area-list">${areas().map(a => `<option value="${esc(a)}">`).join('')}</datalist></label>
      <label class="field"><span>${t('Address')}</span><input id="r-addr" data-rbind="address" value="${esc(r.address)}"></label>
      <label class="field"><span>${t('WhatsApp number')}</span><input id="r-wa" type="tel" inputmode="tel" data-rbind="whatsapp" value="${esc(r.whatsapp)}"></label>
      <label class="field"><span>${t('UPI ID')} <i>(${t('optional, for online payments')})</i></span><input id="r-upi" data-rbind="upi" value="${esc(r.upi)}" placeholder="yourname@okaxis" autocapitalize="off"></label>
      <label class="field"><span>${t('One line about your shop')} <i>(${t('optional')})</i></span><input id="r-desc" data-rbind="desc" value="${esc(r.desc)}"></label>
      <label class="field"><span>${t('Choose a 4-digit PIN')}</span><input id="r-pin" type="password" inputmode="numeric" maxlength="4" data-rbind="pin" value="${esc(r.pin)}" style="letter-spacing:.4em;font-family:var(--mono)"></label>
      ${V.regErr ? `<p class="error" role="alert">${esc(V.regErr)}</p>` : ''}
      <button class="btn btn-go wide" type="submit">${t('Create my shop')}</button>
    </form>
  </main>`;
}
function orderCard(o, s) {
  const d = o.mode === 'delivery';
  const next = {pending:['confirmed', '✓ ' + t('Accept order')], confirmed:['ready', d ? '🛵 ' + t('Send out for delivery') : '📦 ' + t('Mark ready for pickup')], ready:['completed', d ? '✓ ' + t('Mark delivered') : '✓ ' + t('Mark picked up')]}[o.status];
  const sched = o.when && o.when !== 'now';
  return `<li class="order ${o.status === 'pending' ? 'new' : ''} ${V.flash === o.id ? 'flash' : ''}">
    <div class="o-top"><span class="o-id">${esc(o.id)}</span><span class="row-m">${ago(tAt(o))}</span>${statusPill(o)}<span class="o-total">${rs(o.total)}</span></div>
    <p><b>${esc(o.buyer)}</b> · ${d ? '🛵 ' + t('Deliver to {addr}', {addr:esc(o.address)}) : '🏪 ' + t('Pickup')}</p>
    <div class="meta">${sched ? `<span class="badge b-sched">🗓 ${esc(whenText(o))}</span>` : `<span class="badge b-plain">⚡ ${t('As soon as possible')}</span>`}
      ${o.paid === 'confirmed' ? `<span class="badge b-ok">✓ ${t('Paid')}</span>` : o.paid === 'claimed' ? `<span class="badge b-low">${t('Customer says paid by UPI')}</span>` : `<span class="badge b-plain">${t('Pay on pickup')}</span>`}
      ${o.discount ? `<span class="badge b-offer">🎁 −${rs(o.discount)}</span>` : ''}</div>
    <div class="o-items">${o.items.map(i => { const p = prodById(i.pid) || {name:i.name, category:s.category}; return `<div class="o-item">${thumb(p)}<span><b>${i.qty} ×</b> ${esc(i.name)}</span></div>`; }).join('')}</div>
    ${o.note ? `<p class="note">📝 ${esc(o.note)}</p>` : ''}
    <div class="o-act">
      ${next ? `<button class="btn ${o.status === 'pending' ? 'btn-go' : 'btn-forest'}" type="button" data-act="s-status" data-v="${esc(o.id)}|${next[0]}">${next[1]}</button>` : ''}
      ${o.status === 'pending' ? `<button class="btn btn-danger btn-sm ${V.arm === o.id ? 'armed' : ''}" type="button" data-act="s-decline" data-v="${esc(o.id)}">${V.arm === o.id ? t('Tap again to decline') : t('Decline')}</button>` : ''}
      ${o.paid !== 'confirmed' && o.status !== 'cancelled' ? `<button class="btn btn-ghost btn-sm" type="button" data-act="s-paid" data-v="${esc(o.id)}">₹ ${t('Mark paid')}</button>` : ''}
      ${o.phone ? `<a class="btn btn-link" href="${esc(waLink(o.phone, buyerMsg(o, s)))}" target="_blank" rel="noopener">💬 WhatsApp ${esc(o.buyer.split(' ')[0])}</a>` : ''}
    </div></li>`;
}
function sOrders(s, mine) {
  const groups = {new:mine.filter(o => o.status === 'pending'), active:mine.filter(o => ['confirmed','ready'].includes(o.status)), done:mine.filter(o => ['completed','cancelled'].includes(o.status))};
  const sortKey = o => (o.when && o.when !== 'now') ? new Date(o.when).getTime() : tAt(o);
  const list = groups[V.ordTab].sort((a, b) => V.ordTab === 'done' ? tAt(b) - tAt(a) : sortKey(a) - sortKey(b)).slice(0, 30);
  const empty = {new:['☕', t('All caught up'), t('New orders pop up here with a chime the moment someone orders.')], active:['📦', t('Nothing in progress'), t('Accepted orders wait here until they’re picked up or delivered.')], done:['✅', t('No finished orders yet'), t('Completed and declined orders show up here.')]}[V.ordTab];
  const today = liveOrders(s.id).filter(o => tAt(o) > Date.now() - DAY);
  const todaySum = today.reduce((a, o) => a + o.total - (o.fee || 0), 0);
  const canNotify = 'Notification' in window && Notification.permission === 'default' && !IN_CLAUDE;
  return `
  ${!isOpen(s) ? `<p class="note">${t('Your shop shows as Closed to customers. Tap the switch at the top to open.')}</p>` : ''}
  <div class="tiles">
    <div class="tile ${groups.new.length ? 'hot' : ''}"><span class="t-l">${t('Waiting')}</span><span class="t-v" data-count="${groups.new.length}">${groups.new.length}</span><span class="t-s">${t('to accept')}</span></div>
    <div class="tile"><span class="t-l">${t('Today')}</span><span class="t-v" data-count="${todaySum}" data-money="1">${rs(todaySum)}</span><span class="t-s">${t('{n} orders', {n:today.length})}</span></div>
  </div>
  ${canNotify ? `<button class="btn btn-ghost wide" type="button" data-act="s-notify">🔔 ${t('Get a notification for every new order')}</button>` : ''}
  ${V.newCount && V.ordTab === 'new' && groups.new.length ? `<div class="newbanner" role="status"><span class="bell" aria-hidden="true">🔔</span><span>${t('{n} new orders waiting for you', {n:groups.new.length})}</span></div>` : ''}
  <div class="seg" role="group" aria-label="${esc(t('Order status'))}">
    <button type="button" data-act="s-ordtab" data-v="new" aria-pressed="${V.ordTab === 'new'}">${t('New')}${groups.new.length ? `<span class="n">${groups.new.length}</span>` : ''}</button>
    <button type="button" data-act="s-ordtab" data-v="active" aria-pressed="${V.ordTab === 'active'}">${t('In progress')}${groups.active.length ? ` (${groups.active.length})` : ''}</button>
    <button type="button" data-act="s-ordtab" data-v="done" aria-pressed="${V.ordTab === 'done'}">${t('Done')}</button>
  </div>
  ${list.length ? `<ul class="sec" style="list-style:none;padding:0">${list.map(o => orderCard(o, s)).join('')}</ul>` : `<div class="empty"><span class="big">${empty[0]}</span><b>${empty[1]}</b><span>${empty[2]}</span></div>`}`;
}
function sProducts(s) {
  const ps = S.products.filter(p => p.shopId === s.id && (!V.pq || p.name.toLowerCase().includes(V.pq.toLowerCase())))
    .sort((a, b) => (b.at || 0) - (a.at || 0) || String(a.id).localeCompare(String(b.id)));
  const aiOn = !!SAMPLE || (S.backend === 'supabase' && !!CFG.smartFillFunction);
  return `
  <section class="card sec">
    <div class="sec-h"><h2 class="h2">${t('Add products')}</h2><span class="badge b-ai">✨ ${aiOn ? t('Smart fill · AI') : t('Smart fill')}</span></div>
    <p class="small muted">${t('Type them like you’d text a customer, one per line.')}${IMAGES_OK ? ' ' + t('Or snap a photo.') : ''}</p>
    <form id="s-ai" class="ai">
      <label class="sr" for="s-ai-text">${t('Products to add')}</label>
      <textarea id="s-ai-text" rows="3" placeholder="Blue notebook ₹40, 10 left&#10;Parker pen Rs 250 - 5 pcs">${esc(V.ai)}</textarea>
      ${V.photo ? `<span class="filechip"><span>📷 ${esc(V.photo.name || 'Photo')}</span><button type="button" data-act="s-photo-x" aria-label="${esc(t('Remove photo'))}">×</button></span>` : ''}
      <div class="ai-acts">
        <button class="btn btn-go" type="submit" ${V.aiBusy ? 'disabled' : ''}>${V.aiBusy ? '<span class="spinner"></span> ' + t('Reading…') : '✨ ' + t('Fill for me')}</button>
        ${IMAGES_OK ? `<label class="btn btn-ghost photo-btn">📷 ${t('Photo')}<input id="s-photo" type="file" accept="image/jpeg,image/png,image/webp" data-act="s-photo"></label>` : ''}
        <button class="btn btn-link" type="button" data-act="s-sample">${t('Try a sample')}</button>
      </div>
    </form>
    ${V.aiNote ? `<p class="small">${esc(V.aiNote)}</p>` : ''}
    ${V.draft.length ? `<div class="draft">
      <div class="dhead"><span></span><span>${t('Product')}</span><span>${t('Price')} ₹</span><span>${t('Stock')}</span><span></span></div>
      ${V.draft.map((r, i) => `<div class="drow ${r.bad ? 'bad' : ''}" style="animation-delay:${i * .07}s">
        ${thumb({name:r.name, category:r.category})}
        <input id="d${i}n" data-draft="${i}:name" value="${esc(r.name)}" aria-label="${esc(t('Product'))}">
        <input id="d${i}p" data-draft="${i}:price" inputmode="decimal" value="${esc(r.price)}" aria-label="${esc(t('Price'))}" class="${r.price === '' ? 'need' : ''}">
        <input id="d${i}s" data-draft="${i}:stock" inputmode="numeric" value="${esc(r.stock)}" aria-label="${esc(t('Stock'))}" class="${r.stock === '' ? 'need' : ''}">
        <button class="icon-btn" type="button" data-act="s-draft-x" data-v="${i}" aria-label="${esc(t('Remove'))}">×</button></div>`).join('')}
      <div class="ai-acts"><button class="btn btn-forest" type="button" data-act="s-draft-save">${t('Add {n} to my shop', {n:V.draft.length})}</button>
        <button class="btn btn-link" type="button" data-act="s-draft-blank">+ ${t('Row')}</button><button class="btn btn-link" type="button" data-act="s-draft-clear">${t('Discard')}</button></div>
    </div>` : `<button class="btn btn-link" type="button" data-act="s-draft-blank" style="justify-self:start">+ ${t('Add one by hand')}</button>`}
  </section>
  <section class="sec">
    <div class="sec-h"><h2 class="h2">${t('In my shop')}</h2><span class="small muted">${t('{a} live · {b} running low', {a:ps.filter(p => p.active !== false).length, b:ps.filter(p => p.stock <= 3 && p.active !== false).length})}</span></div>
    <label class="sr" for="s-pq">${t('Find a product')}</label><input id="s-pq" type="search" placeholder="🔍 ${esc(t('Find a product'))}" value="${esc(V.pq)}" data-sbind="pq">
    <ul class="plist">${ps.map(p => `<li class="${p.active === false ? 'off' : ''}">${thumb(p)}
      <div class="row-main"><span class="row-t">${esc(p.name)}</span>
        <label class="row-m" style="display:flex;align-items:center;gap:4px">₹<input class="pricein" id="pr-${esc(p.id)}" type="number" min="0" step="1" inputmode="decimal" value="${esc(p.price)}" data-act="s-price" data-v="${esc(p.id)}" aria-label="${esc(t('Price'))} ${esc(p.name)}">
          <button class="mini-sw" type="button" data-act="s-active" data-v="${esc(p.id)}" aria-pressed="${p.active !== false}" aria-label="${esc(t('Visible to customers'))}" title="${esc(t('Visible to customers'))}"></button></label></div>
      <div class="stockctl"><button class="icon-btn" type="button" data-act="s-stock" data-v="${esc(p.id)}|-1" ${p.stock > 0 ? '' : 'disabled'} aria-label="−1">−</button>
        <span class="q ${p.stock <= 0 ? 'out' : p.stock <= 3 ? 'low' : ''}" title="${esc(t('Stock'))}">${p.stock}</span>
        <button class="icon-btn" type="button" data-act="s-stock" data-v="${esc(p.id)}|1" aria-label="+1">+</button></div></li>`).join('')}</ul>
    <p class="small muted">${t('The switch hides a product from customers without deleting it.')}</p>
  </section>`;
}
function sInsights(s) {
  const all = liveOrders(s.id), wk = liveOrders(s.id, 7), today = all.filter(o => tAt(o) > Date.now() - DAY);
  const sold = new Map();
  for (const o of liveOrders(s.id, 30)) for (const it of o.items || []) sold.set(it.name, (sold.get(it.name) || 0) + it.qty);
  const top = [...sold.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const low = S.products.filter(p => p.shopId === s.id && p.active !== false && p.stock <= 3).sort((a, b) => a.stock - b.stock);
  const rd = radar(s.area), pending = all.filter(o => o.status === 'pending').length, rt = shopRating(s.id);
  const reviews = S.ratings.filter(r => r.shopId === s.id).sort((a, b) => tAt(b) - tAt(a)).slice(0, 4);
  const days = []; const start = new Date(); start.setHours(0, 0, 0, 0);
  for (let i = 6; i >= 0; i--) {
    const d0 = start.getTime() - i * DAY, d1 = d0 + DAY;
    const sum = all.filter(o => tAt(o) >= d0 && tAt(o) < d1).reduce((a, o) => a + o.total - (o.fee || 0), 0);
    days.push({label:i === 0 ? t('Today') : new Date(d0).toLocaleDateString(LANGS[LANG].code + '-IN', {weekday:'short'}), sum, today:i === 0});
  }
  const max = Math.max(1, ...days.map(d => d.sum));
  const kfmt = n => n >= 1000 ? '₹' + (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : (n ? '₹' + n : '');
  const weekSum = wk.reduce((a, o) => a + o.total - (o.fee || 0), 0);
  return `
  <div class="tiles">
    <div class="tile"><span class="t-l">${t('Today')}</span><span class="t-v" data-count="${today.length}">${today.length}</span><span class="t-s">${t('orders')}</span></div>
    <div class="tile ${pending ? 'hot' : ''}"><span class="t-l">${t('Waiting')}</span><span class="t-v" data-count="${pending}">${pending}</span><span class="t-s">${t('to accept')}</span></div>
    <div class="tile"><span class="t-l">${t('Sales, 7 days')}</span><span class="t-v" data-count="${weekSum}" data-money="1">${rs(weekSum)}</span><span class="t-s">${t('paid to you directly')}</span></div>
    <div class="tile"><span class="t-l">${t('Rating')}</span><span class="t-v">${rt.n ? '★ ' + rt.avg.toFixed(1) : '—'}</span><span class="t-s">${t('{n} ratings', {n:rt.n})}</span></div>
  </div>
  <section class="card sec"><div class="sec-h"><h2 class="h2">${t('Sales this week')}</h2><span class="small muted">${rs(weekSum)}</span></div>
    <div class="chart" role="img" aria-label="${esc(days.map(d => d.label + ' ' + rs(d.sum)).join(', '))}">
      ${days.map((d, i) => `<div class="col"><div class="bar ${d.today ? 'today' : ''}" style="height:${Math.max(4, Math.round(d.sum / max * 100))}%;animation-delay:${i * .06}s"><b>${kfmt(d.sum)}</b></div><span class="d">${esc(d.label)}</span></div>`).join('')}
    </div></section>
  <section class="radar">
    <div class="sec-h"><h2 class="h2">📡 ${t('Demand Radar')}</h2><span class="row-m">${esc(s.area)} · 7 ${t('days')}</span></div>
    <p class="sub">${t('People near you searched for these and no shop had them.')}</p>
    ${rd.length ? `<ol>${rd.map((r, i) => `<li class="${V.radarFlash === r.q ? 'flash' : ''}"><span class="q">${esc(cap(r.q))}</span><span class="n">${t('{n} searches', {n:r.n})}</span><span class="bar"><i style="--w:${Math.max(4, Math.round(r.n / rd[0].n * 100))}%;animation-delay:${i * .08}s"></i></span></li>`).join('')}</ol>
      <p class="sub small">💡 ${t('Stock the top one and those buyers will find you first.')}</p>` : `<p class="sub">${t('No missed searches this week.')}</p>`}
  </section>
  <section class="card sec"><div class="sec-h"><h2 class="h2">${t('Ratings')}</h2><span class="small muted">${rt.n ? stars(rt.avg, rt.n) : ''}</span></div>
    ${reviews.length ? reviews.map(r => `<div class="review">${stars(r.stars)} <span class="row-m">${ago(tAt(r))}</span>${r.text ? `<p>${esc(r.text)}</p>` : ''}</div>`).join('') : `<p class="small muted">${t('Ratings from customers will show here.')}</p>`}</section>
  <section class="card sec"><div class="sec-h"><h2 class="h2">${t('Running low')}</h2><span class="small muted">${t('3 or fewer')}</span></div>
    ${low.length ? `<ul class="plist">${low.map(p => `<li>${thumb(p)}<span class="row-main"><span class="row-t">${esc(p.name)}</span>${stockBadge(p.stock)}</span><button class="btn btn-ghost btn-sm" type="button" data-act="s-restock" data-v="${esc(p.id)}">+10</button></li>`).join('')}</ul>` : `<p class="small muted">${t('Everything is well stocked.')} 👍</p>`}</section>
  <section class="card sec"><div class="sec-h"><h2 class="h2">${t('Top sellers')}</h2><span class="small muted">30 ${t('days')}</span></div>
    ${top.length ? `<ul class="bars">${top.map(([n, q], i) => `<li><span>${esc(n)}</span><b class="price">${q}</b><span class="bar"><i style="--w:${Math.round(q / top[0][1] * 100)}%;animation-delay:${i * .08}s"></i></span></li>`).join('')}</ul>` : `<p class="small muted">${t('Your first sales will show here.')}</p>`}</section>`;
}
function sOffers(s) {
  const offs = S.offers.filter(o => o.shopId === s.id), f = V.offer;
  return `<section class="card sec">
    <div class="sec-h"><h2 class="h2">🎁 ${t('Offers')}</h2><span class="small muted">${t('You fund them, so keep them small')}</span></div>
    ${offs.length ? offs.map(o => `<div class="offrow"><span class="row-main"><b>${esc(offerTitle(o))}</b><span class="row-m">${t('Used {n} times', {n:S.orders.filter(x => x.offerId === o.id && x.status !== 'cancelled').length})}</span></span>
      <button class="mini-sw" type="button" data-act="s-offer-toggle" data-v="${esc(o.id)}" aria-pressed="${o.active !== false}" aria-label="${esc(t('Offer on'))}"></button></div>`).join('') : `<p class="small muted">${t('No offers yet. A small offer helps new customers try you.')}</p>`}
    <div class="seg" role="group" aria-label="${esc(t('Offer type'))}">
      <button type="button" data-act="s-offer-kind" data-v="pct" aria-pressed="${f.kind === 'pct'}">% ${t('Discount')}</button>
      <button type="button" data-act="s-offer-kind" data-v="freedel" aria-pressed="${f.kind === 'freedel'}">🛵 ${t('Free delivery')}</button>
    </div>
    ${f.kind === 'pct' ? `<div class="chips" role="group" aria-label="%">${[5, 10, 15].map(p => `<button class="chip" type="button" data-act="s-offer-pct" data-v="${p}" aria-pressed="${f.pct === p}">${p}%</button>`).join('')}</div>` : ''}
    <div style="display:grid;grid-template-columns:${f.kind === 'pct' ? '1fr 1fr' : '1fr'};gap:8px">
      <label class="field"><span>${t('Minimum order')} ₹</span><input id="of-min" type="number" min="0" step="50" value="${esc(f.minOrder)}" data-obind="minOrder"></label>
      ${f.kind === 'pct' ? `<label class="field"><span>${t('Max discount')} ₹ <i>(≤ ₹${OFFER_MAX_OFF})</i></span><input id="of-max" type="number" min="10" max="${OFFER_MAX_OFF}" step="10" value="${esc(f.maxOff)}" data-obind="maxOff"></label>` : ''}
    </div>
    ${V.offerErr ? `<p class="error" role="alert">${esc(V.offerErr)}</p>` : ''}
    <p class="note">${f.kind === 'pct' ? t('Worst case you give {amt} off an order of {min} or more.', {amt:rs(Math.min(OFFER_MAX_OFF, Number(f.maxOff) || 0)), min:rs(Number(f.minOrder) || 0)}) : t('You skip the delivery fee on orders of {min} or more.', {min:rs(Number(f.minOrder) || 0)})}</p>
    <button class="btn btn-forest" type="button" data-act="s-offer-add">${t('Start this offer')}</button>
  </section>`;
}
function sSettings(s) {
  const link = publicBase() + '?shop=' + encodeURIComponent(s.slug || slugify(s.name));
  return `
  <section class="card sec">
    <div class="sec-h"><h2 class="h2">${t('Your shop link')}</h2><button class="btn btn-go btn-sm" type="button" data-act="s-poster">${ICON.qr} ${t('QR poster')}</button></div>
    <p class="small muted">${t('Share it on WhatsApp status and Instagram. Customers open it and order.')}</p>
    <p class="linkbox">${esc(link)}</p>
    <button class="btn btn-ghost btn-sm" type="button" data-act="s-copy" data-v="${esc(link)}">${t('Copy link')}</button>
  </section>
  ${sOffers(s)}
  <section class="card sec">
    <h2 class="h2">${t('Orders, delivery and payment')}</h2>
    <label class="field"><span>${t('WhatsApp number')}</span><input id="st-wa" type="tel" inputmode="tel" value="${esc(prettyPhone(s.whatsapp))}" data-act="s-set-wa"></label>
    <label class="field"><span>${t('UPI ID')} <i>(${t('customers pay you here directly')})</i></span><input id="st-upi" value="${esc(s.upi || '')}" data-act="s-set-upi" autocapitalize="off" placeholder="yourname@okaxis">
      ${/@nukkad$/.test(s.upi || '') ? `<i>${t('This is a demo ID. Put your real UPI ID to receive money.')}</i>` : ''}</label>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <label class="field"><span>${t('Pickup ready in')} (${t('min')})</span><input id="st-ready" type="number" min="5" step="5" value="${esc(s.readyMins || 30)}" data-act="s-set-ready"></label>
      <label class="field"><span>${t('Delivery within')} (${t('min')})</span><input id="st-dmin" type="number" min="10" step="5" value="${esc(s.deliveryMins || 45)}" data-act="s-set-dmin" ${s.deliveryOn ? '' : 'disabled'}></label>
    </div>
    <label class="switch"><span>🛵 ${t('We deliver nearby')}</span><input id="st-del" type="checkbox" ${s.deliveryOn ? 'checked' : ''} data-act="s-set-del"></label>
    <label class="field"><span>${t('Delivery fee')} (₹)</span><input id="st-fee" type="number" min="0" step="5" value="${esc(s.deliveryFee || 0)}" data-act="s-set-fee" ${s.deliveryOn ? '' : 'disabled'}></label>
  </section>
  <p class="note">${S.conn === 'live' ? '🟢 ' + t('Live: orders from any phone arrive here instantly, with a chime.') : t('Demo copy: changes stay on this device. Open the customer app in another tab to see orders arrive here.')}</p>
  <a class="btn btn-ghost wide" href="${IN_CLAUDE ? '#' : '../'}">${t('Open the customer app')}</a>
  <button class="btn btn-danger wide" type="button" data-act="s-logout">${t('Log out')}</button>
  ${S.backend === 'local' ? `<button class="btn btn-link" type="button" data-act="s-reset" style="justify-self:center">${V.arm === 'reset' ? t('Tap again to reset the demo data') : t('Reset demo data on this device')}</button>` : ''}`;
}
function sPoster(s) {
  const link = publicBase() + '?shop=' + encodeURIComponent(s.slug || slugify(s.name));
  const svg = qrSvg(link, 8), off = offersFor(s.id)[0], rt = shopRating(s.id);
  return `<main class="gut poster-wrap">
    <div class="noprint" style="display:flex;justify-content:space-between;gap:8px;padding-top:12px"><button class="back" type="button" data-act="s-poster-x">‹ ${t('Back')}</button>
      ${IN_CLAUDE ? `<span class="small muted">${t('Screenshot this to print it.')}</span>` : `<button class="btn btn-go btn-sm" type="button" data-act="s-print">🖨 ${t('Print poster')}</button>`}</div>
    <div class="poster">
      <p class="p-brand">Nukkad</p>
      <h1>${esc(s.name)}</h1>
      <p class="p-sub">${t('Now taking orders on Nukkad')}</p>
      <div class="p-qr">${svg || `<p class="small">${t('QR code needs an internet connection the first time.')}</p>`}</div>
      <p class="p-cta">${t('Scan to order. Pick up in {n} min or get it delivered.', {n:Number(s.readyMins) || 30})}</p>
      <div class="p-row"><span>⭐ ${rt.n ? rt.avg.toFixed(1) : t('New')}</span><span>💳 UPI · ${t('Cash')}</span><span>₹0 ${t('extra charges')}</span></div>
      ${off ? `<p class="p-offer">🎁 ${esc(offerTitle(off))}</p>` : ''}
      <p class="p-link">${esc(link.replace(/^https?:\/\//, ''))}</p>
    </div>
  </main>`;
}

/* ---------- Seller actions ---------- */
async function sSetStatus(id, status) {
  const o = S.orders.find(x => x.id === id); if (!o) return;
  const prev = o.status;
  await patch('orders', id, {status, statusAt:Date.now()});
  buzz(20);
  if (status === 'cancelled' && prev !== 'cancelled') {
    for (const it of o.items) { const p = prodById(it.pid); if (p) await patch('products', p.id, {stock:p.stock + it.qty}); }
    toast(t('Declined {id}. Stock is back on the shelf.', {id}));
  } else {
    toast('✓ ' + statusText({...o, status}) + '. ' + t('{name} sees it now.', {name:o.buyer.split(' ')[0]}));
    if (status === 'confirmed') { V.ordTab = 'active'; V.newCount = 0; }
  }
  render();
}
async function aiExtract(text, s) {
  if (SAMPLE) {
    const opts = {modelTier:'quick'};
    if (V.photo && IMAGES_OK) opts.images = [V.photo];
    return SAMPLE.json(aiPrompt(text, !!opts.images, s.category), opts);
  }
  if (S.backend === 'supabase' && SB && CFG.smartFillFunction) {
    const r = await SB.functions.invoke(CFG.smartFillFunction, {body:{prompt:aiPrompt(text, false, s.category)}});
    if (r.error) throw r.error;
    return r.data && (r.data.products || r.data);
  }
  return null;
}
async function sAiFill() {
  const s = shopById(V.shopId), text = V.ai.trim();
  if (!text && !V.photo) { toast(t('Type a product first, like “Blue notebook ₹40, 10 left”.')); return; }
  V.aiBusy = true; V.aiNote = ''; render();
  let rows = null, used = 'reader';
  try {
    const out = await aiExtract(text, s);
    const arr = Array.isArray(out) ? out : (out && Array.isArray(out.products) ? out.products : null);
    if (arr) {
      rows = arr.map(r => ({
        name:cap(String(r.name || '').trim()),
        price:r.price == null || isNaN(Number(r.price)) ? '' : String(Number(r.price)),
        stock:r.stock == null || isNaN(parseInt(r.stock, 10)) ? '' : String(parseInt(r.stock, 10)),
        category:CATS.includes(r.category) ? r.category : guessCat(r.name, s.category),
      })).filter(r => r.name);
      used = 'ai';
    }
  } catch (e) {
    if (e && ['not_granted','sampling_disabled','not_declared','capability_disabled','capability_removed'].includes(e.code)) SAMPLE = null;
  }
  if (!rows && text) rows = text.split(/\n+/).map(parseLine).filter(Boolean).map(r => ({...r, category:guessCat(r.name, s.category)}));
  V.aiBusy = false;
  if (!rows || !rows.length) { V.aiNote = t('Couldn’t find a product in that. Try “Notebook ₹40, 10 left”.'); render(); return; }
  V.draft = rows;
  const miss = rows.filter(r => r.price === '' || r.stock === '').length;
  V.aiNote = (used === 'ai' ? '✨ ' + (rows.length === 1 ? t('AI read 1 product.') : t('AI read {n} products.', {n:rows.length})) : (rows.length === 1 ? t('Read 1 product.') : t('Read {n} products.', {n:rows.length}))) + ' ' + (miss ? t('Fill the yellow boxes, then add.') : t('Check them, then add.'));
  render();
  document.getElementById('d0n')?.focus();
}
async function sSaveDraft() {
  const s = shopById(V.shopId), keep = [];
  let added = 0;
  for (const r of V.draft) {
    const name = String(r.name || '').trim(), price = parseFloat(r.price), stock = parseInt(r.stock, 10);
    if (name && !isNaN(price) && price >= 0 && !isNaN(stock) && stock >= 0) {
      const ok = await put('products', {id:'p' + Date.now().toString(36) + rid(3), shopId:s.id, name, category:r.category || s.category, price, stock, desc:'', active:true, at:Date.now()});
      if (ok) added++;
    } else { r.bad = true; keep.push(r); }
  }
  V.draft = keep;
  if (added) { if (!keep.length) { V.ai = ''; V.photo = null; V.aiNote = ''; } buzz(30); toast('🎉 ' + t('Added {n} products. Customers can find them now.', {n:added})); }
  else toast(t('Each row needs a name, a price and a stock count.'));
  render();
}
async function sRegisterSubmit() {
  const r = V.reg, wa = cleanPhone(r.whatsapp);
  const fail = m => { V.regErr = m; FX.enter = false; render(); };
  if (!r.name.trim()) return fail(t('Add your shop’s name.'));
  if (!r.area.trim()) return fail(t('Add your area, like Jayanagar.'));
  if (wa.length < 12) return fail(t('Add a 10-digit WhatsApp number.'));
  if (r.upi.trim() && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(r.upi.trim())) return fail(t('Check the UPI ID. It looks like name@bank.'));
  if (!/^\d{4}$/.test(r.pin)) return fail(t('Choose a PIN of exactly 4 digits.'));
  const id = 's' + Date.now().toString(36) + rid(3);
  const shop = {id, name:r.name.trim(), slug:slugify(r.name) + '-' + rid(3), category:r.category, area:cap(r.area.trim()), address:r.address.trim(), whatsapp:wa, upi:r.upi.trim(),
    desc:r.desc.trim(), deliveryOn:false, deliveryFee:30, readyMins:30, deliveryMins:45, open:true, at:Date.now()};
  if (!(await createShop(shop, r.pin))) return fail(t('Couldn’t create the shop. Check your connection and try again.'));
  V.reg = null; V.regErr = ''; V.shopId = id; V.seen = null; V.tab = 'products'; ls('seller-shop', id);
  afterData(); toast('🎉 ' + t('Welcome to Nukkad, {shop}! Add your first products.', {shop:shop.name})); FX.enter = true; render(); scrollTop();
}
async function sTryPin() {
  const s = shopById(V.pick); if (!s) return;
  if (await checkPin(s, V.pin)) {
    V.shopId = s.id; V.pin = ''; V.pinErr = false; V.seen = null; V.tab = 'orders'; V.pick = null; ls('seller-shop', s.id);
    afterData(); buzz(30); FX.enter = true; FX.count = true; render(); scrollTop(); toast(t('Welcome back, {shop}', {shop:s.name}) + ' 👋');
  } else { V.pinErr = true; V.pin = ''; buzz([40, 40, 40]); render(); }
}
Object.assign(ACT, {
  's-pick': v => { V.pick = v || null; V.pin = ''; V.pinErr = false; FX.enter = true; render(); },
  's-key': v => {
    if (v === 'back') V.pin = V.pin.slice(0, -1);
    else if (V.pin.length < 4) { V.pin += v; V.pinErr = false; buzz(8); }
    render();
    if (V.pin.length === 4) setTimeout(sTryPin, 120);
  },
  's-reg': () => { V.reg = {name:'', category:'Stationery', area:C.area !== 'All' ? C.area : '', address:'', whatsapp:'', upi:'', desc:'', pin:''}; V.regErr = ''; FX.enter = true; render(); scrollTop(); },
  's-regcat': v => { V.reg.category = v; render(); },
  's-reg-cancel': () => { V.reg = null; FX.enter = true; render(); },
  's-tab': v => { V.tab = v; V.arm = null; FX.enter = true; FX.count = true; render(); scrollTop(); },
  's-ordtab': v => { V.ordTab = v; V.arm = null; FX.enter = true; render(); },
  's-status': v => { const [id, st] = v.split('|'); sSetStatus(id, st); },
  's-decline': v => {
    if (V.arm === v) { V.arm = null; sSetStatus(v, 'cancelled'); }
    else { V.arm = v; render(); setTimeout(() => { if (V.arm === v) { V.arm = null; render(); } }, 4000); }
  },
  's-paid': v => { patch('orders', v, {paid:'confirmed'}); buzz(15); toast('✓ ' + t('Marked as paid')); },
  's-open': () => { const s = shopById(V.shopId); const next = !isOpen(s); patch('shops', s.id, {open:next}); buzz(20); toast(next ? '🟢 ' + t('You’re open. Customers can order now.') : '🔴 ' + t('Closed. Customers can browse but not order.')); },
  's-stock': v => { const [pid, d] = v.split('|'), p = prodById(pid); if (p) patch('products', pid, {stock:Math.max(0, p.stock + Number(d))}); },
  's-restock': v => { const p = prodById(v); if (p) { patch('products', v, {stock:p.stock + 10}); toast('+10 ' + p.name); } },
  's-active': v => { const p = prodById(v); if (p) { const next = p.active === false; patch('products', v, {active:next}); toast(next ? t('{name} is visible again', {name:p.name}) : t('{name} hidden from customers', {name:p.name})); } },
  's-sample': () => {
    const s = shopById(V.shopId);
    const SAMPLES = {Stationery:'Blue notebook ₹40, 10 left\nParker pen Rs 250 - 5 pcs\nA4 drawing sheets 5/- stock 100', Grocery:'Toor dal 1kg ₹165, 20 left\nGhee 500ml Rs 340 - 6 pcs', Clothing:'Cotton kurta ₹650, 8 left\nSilk saree Rs 2400 - 2 pcs', Electronics:'USB-C cable ₹199, 30 left\nPower bank 10000mAh Rs 1099 - 4 pcs', Handicrafts:'Wooden elephant ₹350, 6 left\nBrass bell Rs 280 - 10 pcs'};
    V.ai = SAMPLES[s.category] || SAMPLES.Stationery; render();
  },
  's-photo-x': () => { V.photo = null; render(); },
  's-draft-blank': () => { V.draft.push({name:'', price:'', stock:'', category:shopById(V.shopId).category}); render(); document.getElementById(`d${V.draft.length - 1}n`)?.focus(); },
  's-draft-x': v => { V.draft.splice(Number(v), 1); if (!V.draft.length) V.aiNote = ''; render(); },
  's-draft-clear': () => { V.draft = []; V.aiNote = ''; render(); },
  's-draft-save': () => sSaveDraft(),
  's-logout': () => { V.shopId = null; V.pick = null; V.pin = ''; V.seen = null; V.newCount = 0; ls('seller-shop', null); FX.enter = true; render(); scrollTop(); },
  's-reset': () => {
    if (V.arm === 'reset') { V.arm = null; L = seed2(); saveLocal(); useLocal(); seenStatus = null; V.seen = null; afterData(); toast(t('Demo data reset on this device.')); render(); }
    else { V.arm = 'reset'; render(); setTimeout(() => { if (V.arm === 'reset') { V.arm = null; render(); } }, 4000); }
  },
  's-notify': async () => { try { const p = await Notification.requestPermission(); toast(p === 'granted' ? '🔔 ' + t('You’ll get a notification for new orders.') : t('Notifications are off. You’ll still hear the chime.')); } catch (e) { /* ignore */ } render(); },
  's-poster': () => { V.poster = true; FX.enter = true; render(); scrollTop(); },
  's-poster-x': () => { V.poster = false; FX.enter = true; render(); },
  's-print': () => window.print(),
  's-copy': async v => { try { await navigator.clipboard.writeText(v); toast(t('Link copied')); } catch (e) { toast(t('Press and hold the link to copy it.')); } },
  's-offer-kind': v => { V.offer.kind = v; if (v === 'freedel') V.offer.minOrder = 499; V.offerErr = ''; render(); },
  's-offer-pct': v => { V.offer.pct = Number(v); render(); },
  's-offer-toggle': v => { const o = S.offers.find(x => x.id === v); if (o) { patch('offers', v, {active:o.active === false}); toast(o.active === false ? t('Offer is live') : t('Offer paused')); } },
  's-offer-add': async () => {
    const s = shopById(V.shopId), f = V.offer, min = Math.round(Number(f.minOrder) || 0), max = Math.round(Number(f.maxOff) || 0);
    if (min < 100) { V.offerErr = t('Set a minimum order of at least ₹100.'); render(); return; }
    if (f.kind === 'pct' && (max < 10 || max > OFFER_MAX_OFF)) { V.offerErr = t('Max discount must be between ₹10 and ₹{max}.', {max:OFFER_MAX_OFF}); render(); return; }
    if (f.kind === 'pct' && ![5, 10, 15].includes(f.pct)) { V.offerErr = t('Pick 5%, 10% or 15%.'); render(); return; }
    const o = f.kind === 'pct' ? {id:'of' + Date.now().toString(36), shopId:s.id, kind:'pct', pct:f.pct, minOrder:min, maxOff:max, active:true, at:Date.now()} : {id:'of' + Date.now().toString(36), shopId:s.id, kind:'freedel', minOrder:min, active:true, at:Date.now()};
    V.offerErr = '';
    if (await put('offers', o)) { buzz(20); toast('🎁 ' + t('Offer is live: {o}', {o:offerTitle(o)})); }
    render();
  },
});
Object.assign(CHANGE, {
  's-photo': el => { V.photo = el.files && el.files[0] ? el.files[0] : null; render(); },
  's-price': el => { const n = Math.max(0, Number(el.value)); if (!isNaN(n)) patch('products', el.dataset.v, {price:n}).then(() => toast(t('Price updated'))); },
  's-set-wa': el => { const s = shopById(V.shopId), d = cleanPhone(el.value); if (d.length < 12) { toast(t('Enter a 10-digit mobile number.')); render(); return; } patch('shops', s.id, {whatsapp:d}).then(() => toast(t('Orders will go to {n}', {n:prettyPhone(d)}))); },
  's-set-upi': el => { const s = shopById(V.shopId), v = el.value.trim(); if (v && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(v)) { toast(t('Check the UPI ID. It looks like name@bank.')); render(); return; } patch('shops', s.id, {upi:v}).then(() => toast(t('UPI ID saved'))); },
  's-set-ready': el => patch('shops', V.shopId, {readyMins:Math.max(5, Math.round(Number(el.value) || 30))}),
  's-set-dmin': el => patch('shops', V.shopId, {deliveryMins:Math.max(10, Math.round(Number(el.value) || 45))}),
  's-set-del': el => patch('shops', V.shopId, {deliveryOn:el.checked}),
  's-set-fee': el => patch('shops', V.shopId, {deliveryFee:Math.max(0, Math.round(Number(el.value) || 0))}),
});
SUBMIT['s-ai'] = () => sAiFill();
SUBMIT['s-register'] = () => sRegisterSubmit();
document.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.rbind && V.reg) V.reg[el.dataset.rbind] = el.dataset.rbind === 'pin' ? el.value.replace(/\D/g, '').slice(0, 4) : el.value;
  if (el.dataset.sbind === 'pq') { V.pq = el.value; render(); }
  if (el.dataset.obind) { V.offer[el.dataset.obind] = el.value; V.offerErr = ''; }
  if (el.dataset.draft) { const [i, f] = el.dataset.draft.split(':'); const r = V.draft[Number(i)]; if (r) { r[f] = el.value; r.bad = false; } }
  if (el.id === 's-ai-text') V.ai = el.value;
});
document.addEventListener('keydown', e => {
  if (APP() !== 'seller' || !V.pick || V.shopId || /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName || '')) return;
  if (/^[0-9]$/.test(e.key) && V.pin.length < 4) { V.pin += e.key; V.pinErr = false; render(); if (V.pin.length === 4) setTimeout(sTryPin, 120); }
  if (e.key === 'Backspace') { V.pin = V.pin.slice(0, -1); render(); }
});
