
/* ---------- Derived data ---------- */
const shopById = id => S.shops.find(s => s.id === id);
const prodById = id => S.products.find(p => p.id === id);
const isOpen = s => s && s.open !== false;
const areas = () => [...new Set(S.shops.map(s => s.area).filter(Boolean))].sort();
const liveOrders = (shopId, days) => S.orders.filter(o => o.shopId === shopId && o.status !== 'cancelled' && (!days || tAt(o) > Date.now() - days * DAY));
const inArea = (s, a) => s && (a === 'All' || s.area === a);
const norm = q => String(q || '').toLowerCase().replace(/\s+/g, ' ').trim();
const toks = q => norm(synify(q)).split(' ').filter(Boolean).map(t => t.length > 3 && t.endsWith('s') ? t.slice(0, -1) : t);
function search(q, area) {
  const tk = toks(q);
  if (!tk.length) return [];
  const res = [];
  for (const p of S.products) {
    if (p.active === false) continue;
    const s = shopById(p.shopId);
    if (!inArea(s, area)) continue;
    const hay = (p.name + ' ' + p.category + ' ' + s.category + ' ' + (p.desc || '')).toLowerCase();
    if (tk.every(t => hay.includes(t))) res.push({p, s, orders:liveOrders(s.id, 30).length});
  }
  res.sort((a, b) => (isOpen(b.s) && b.p.stock > 0) - (isOpen(a.s) && a.p.stock > 0) || a.orders - b.orders || a.p.price - b.p.price);
  return res;
}
function suggestions(q, area) {
  const tk = toks(q); if (!tk.length) return [];
  const seen = new Set(), out = [];
  for (const {p, s} of search(q, area)) {
    const k = p.name.toLowerCase(); if (seen.has(k)) continue; seen.add(k);
    out.push({kind:'p', p, s}); if (out.length >= 4) break;
  }
  for (const s of S.shops) {
    if (!inArea(s, area)) continue;
    const hay = (s.name + ' ' + s.category).toLowerCase();
    if (tk.every(t => hay.includes(t))) out.push({kind:'s', s});
    if (out.length >= 6) break;
  }
  return out;
}
function radar(area) {
  const since = Date.now() - 7 * DAY, m = new Map();
  for (const s of S.searches) {
    if (s.results > 0 || s.area !== area || tAt(s) < since) continue;
    const e = m.get(s.q) || {q:s.q, n:0, last:0};
    e.n++; e.last = Math.max(e.last, tAt(s)); m.set(s.q, e);
  }
  return [...m.values()].sort((a, b) => b.n - a.n || b.last - a.last).slice(0, 6);
}
function popular(area) {
  const since = Date.now() - 30 * DAY, m = new Map();
  for (const o of S.orders) {
    if (o.status === 'cancelled' || tAt(o) < since) continue;
    const s = shopById(o.shopId);
    if (!inArea(s, area)) continue;
    for (const it of o.items || []) {
      const p = prodById(it.pid);
      if (!p || p.active === false || p.stock <= 0) continue;
      const e = m.get(p.id) || {p, s, sold:0};
      e.sold += it.qty; m.set(p.id, e);
    }
  }
  return [...m.values()].sort((a, b) => b.sold - a.sold).slice(0, 8);
}
function gems(area) {
  return S.shops.filter(s => inArea(s, area) && isOpen(s) && S.products.some(p => p.shopId === s.id && p.active !== false && p.stock > 0))
    .map(s => ({s, n:liveOrders(s.id, 30).length})).filter(x => x.n < 3).sort((a, b) => a.n - b.n).slice(0, 6);
}
function stockBadge(n) {
  if (n <= 0) return `<span class="badge b-out">${t('Out of stock')}</span>`;
  if (n <= 3) return `<span class="badge b-low">${t('Only {n} left', {n})}</span>`;
  return `<span class="badge b-ok">${t('In stock')}</span>`;
}

/* Order status, worded for each side */
function stepsFor(o) {
  const d = o.mode === 'delivery';
  return [
    {k:'pending', t:t('Order placed'), s:t('Sent to the shop')},
    {k:'confirmed', t:t('Accepted by shop'), s:t('They’re packing it now')},
    {k:'ready', t:d ? t('Out for delivery') : t('Ready for pickup'), s:d ? t('On its way to you') : t('Collect it from the shop')},
    {k:'completed', t:d ? t('Delivered') : t('Picked up'), s:t('Thank you for shopping local')},
  ];
}
function statusText(o) {
  if (o.status === 'cancelled') return t('Cancelled');
  return stepsFor(o).find(x => x.k === o.status)?.t || o.status;
}
const statusPill = o => `<span class="st st-${esc(o.status)}">${esc(statusText(o))}</span>`;
function orderMsg(o, s) {
  return [
    '🛍️ *New order on Nukkad*',
    `Order ${o.id} · ${s.name}`, '',
    ...o.items.map(i => `• ${i.qty} × ${i.name} — ${rs(i.price * i.qty)}`),
    ...(o.fee ? [`• Delivery — ${rs(o.fee)}`] : []), '',
    `*Total: ${rs(o.total)}*`,
    `Name: ${o.buyer}`,
    o.phone ? `Phone: ${prettyPhone(o.phone)}` : null,
    o.mode === 'delivery' ? `Deliver to: ${o.address}` : 'Pickup from shop',
    o.note ? `Note: ${o.note}` : null,
    'Payment: UPI or cash to the shop', '',
    '_Ordered via Nukkad_',
  ].filter(x => x !== null).join('\n');
}
function buyerMsg(o, s) {
  const st = {
    confirmed:`Hi ${o.buyer}, ${s.name} here. We’ve got your Nukkad order ${o.id} and we’re packing it now.`,
    ready:o.mode === 'delivery' ? `Hi ${o.buyer}, your Nukkad order ${o.id} from ${s.name} is out for delivery.` : `Hi ${o.buyer}, your Nukkad order ${o.id} is ready for pickup at ${s.name}. See you soon!`,
    completed:`Thank you for shopping at ${s.name}, ${o.buyer}! 🙏`,
    cancelled:`Hi ${o.buyer}, sorry, ${s.name} can’t fulfil order ${o.id} right now.`,
  };
  return st[o.status] || `Hi ${o.buyer}, this is ${s.name} about your Nukkad order ${o.id}.`;
}
const fmtWa = m => esc(m).replace(/\*([^*\n]+)\*/g, '<b>$1</b>').replace(/(^|\s)_([^_\n]+)_/g, '$1<i>$2</i>');


/* ---------- Ratings, offers, recommendations, delivery slots ---------- */
function shopRating(id) {
  const rs_ = S.ratings.filter(r => r.shopId === id && r.stars);
  if (!rs_.length) return {avg:0, n:0};
  return {avg:rs_.reduce((a, r) => a + Number(r.stars), 0) / rs_.length, n:rs_.length};
}
function ratingChip(s) {
  const {avg, n} = shopRating(s.id);
  return n ? `<span class="rchip">${ICON.star}${avg.toFixed(1)} <small>(${n})</small></span>` : `<span class="rchip new">${t('New')}</span>`;
}
const OFFER_MAX_PCT = 15, OFFER_MAX_OFF = 100;
const offersFor = shopId => S.offers.filter(o => o.shopId === shopId && o.active !== false);
function offerTitle(o) {
  if (o.kind === 'freedel') return t('Free delivery above {min}', {min:rs(o.minOrder)});
  return t('{pct}% off above {min}', {pct:o.pct, min:rs(o.minOrder)}) + ' · ' + t('up to {max}', {max:rs(o.maxOff)});
}
function bestOffer(shopId, sub, fee) {
  let best = null;
  for (const o of offersFor(shopId)) {
    if (sub < Number(o.minOrder || 0)) continue;
    const save = o.kind === 'freedel' ? fee : Math.min(Math.round(sub * Math.min(OFFER_MAX_PCT, Number(o.pct) || 0) / 100), Math.min(OFFER_MAX_OFF, Number(o.maxOff) || 0));
    if (save > 0 && (!best || save > best.save)) best = {o, save};
  }
  return best;
}
function nextOffer(shopId, sub) {
  const ups = offersFor(shopId).filter(o => sub < Number(o.minOrder || 0)).sort((a, b) => a.minOrder - b.minOrder);
  return ups[0] ? {o:ups[0], need:ups[0].minOrder - sub} : null;
}
function recommended(area) {
  const mine = S.orders.filter(o => o.deviceId === DEVICE && o.status !== 'cancelled');
  const shopW = {}, catW = {}, bought = new Set();
  for (const o of mine) {
    shopW[o.shopId] = (shopW[o.shopId] || 0) + 1;
    for (const it of o.items || []) { bought.add(it.pid); const p = prodById(it.pid); if (p) catW[p.category] = (catW[p.category] || 0) + 1; }
  }
  C.favs.forEach(id => { shopW[id] = (shopW[id] || 0) + 1; });
  const pop = new Map(popular(area).map(x => [x.p.id, x.sold]));
  const scored = [];
  for (const p of S.products) {
    const s = shopById(p.shopId);
    if (!s || p.active === false || p.stock <= 0 || !isOpen(s) || !inArea(s, area) || bought.has(p.id)) continue;
    const score = (shopW[s.id] || 0) * 3 + (catW[p.category] || 0) * 2 + (pop.get(p.id) || 0) * .5 + (liveOrders(s.id, 30).length < 3 ? .8 : 0);
    if (score > 0) scored.push({p, s, score, why:shopW[s.id] ? t('From {shop}, a shop you like', {shop:s.name}) : catW[p.category] ? t('Because you buy {cat}', {cat:t(p.category)}) : t('Popular near you')});
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, 8);
}
function together(lines) {
  if (!lines.length) return [];
  const inBag = new Set(lines.map(l => l.p.id)), shopId = lines[0].p.shopId, co = new Map();
  for (const o of S.orders) {
    if (o.shopId !== shopId) continue;
    const ids = (o.items || []).map(i => i.pid);
    if (!ids.some(id => inBag.has(id))) continue;
    ids.forEach(id => { if (!inBag.has(id)) co.set(id, (co.get(id) || 0) + 1); });
  }
  const cats = new Set(lines.map(l => l.p.category));
  const pool = S.products.filter(p => p.shopId === shopId && !inBag.has(p.id) && p.active !== false && p.stock > 0);
  return pool.map(p => ({p, score:(co.get(p.id) || 0) * 2 + (cats.has(p.category) ? 1 : 0)})).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map(x => x.p);
}
const deliveryRange = s => { const m = Number(s.deliveryMins) || (Number(s.readyMins) || 30) + 15; return `${Math.max(10, m - 10)}–${m}`; };
function slotsFor() {
  const out = [], now = new Date(), open = 9, close = 21;
  for (let d = 0; d < 2 && out.length < 6; d++) {
    for (let h = open; h < close && out.length < 6; h += 2) {
      const st = new Date(now); st.setDate(now.getDate() + d); st.setHours(h, 0, 0, 0);
      if (st.getTime() < Date.now() + 45 * 60e3) continue;
      const fmt = x => x.toLocaleTimeString('en-IN', {hour:'numeric', hour12:true}).replace(' ', '').toLowerCase();
      const end = new Date(st); end.setHours(h + 2);
      out.push({key:st.toISOString(), day:d === 0 ? t('Today') : t('Tomorrow'), label:`${fmt(st)}–${fmt(end)}`});
    }
  }
  return out;
}
function whenText(o) {
  if (!o.when || o.when === 'now') return t('As soon as possible');
  const st = new Date(o.when), end = new Date(st); end.setHours(st.getHours() + 2);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dd = Math.round((new Date(st).setHours(0, 0, 0, 0) - today.getTime()) / DAY);
  const day = dd === 0 ? t('Today') : dd === 1 ? t('Tomorrow') : st.toLocaleDateString('en-IN', {day:'numeric', month:'short'});
  const fmt = x => x.toLocaleTimeString('en-IN', {hour:'numeric', hour12:true}).replace(' ', '').toLowerCase();
  return `${day} ${fmt(st)}–${fmt(end)}`;
}
