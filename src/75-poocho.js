/* =========================================================
   NUKKAD SE POOCHO ("ask the nukkad")
   Search only finds what a shop has typed into the app. Most of a small shop's
   shelf is never listed. So a buyer can ask every open shop in their area,
   and any shop that has it replies in one tap with a price.

   Data (one table, nk_asks, two kinds of document):
     ask   {kind:'ask', q, qty, when, area, deviceId, buyer, at, status:'open'|'held'|'done', heldShop, heldPrice}
     reply {kind:'reply', askId, shopId, price, at}     id = askId + '_' + shopId (one reply per shop)
   ========================================================= */
const ASK_TTL = 3 * H;                              // an ask stays open for 3 hours
const askOn = () => S.backend !== 'supabase' || S.asksLive;
const asksAll = () => S.asks.filter(a => a.kind === 'ask');
const isLiveAsk = a => a.status !== 'done' && tAt(a) > Date.now() - ASK_TTL;
const repliesFor = id => S.asks.filter(r => r.kind === 'reply' && r.askId === id).sort((a, b) => a.price - b.price || tAt(a) - tAt(b));
const myAsks = () => asksAll().filter(a => a.deviceId === DEVICE).sort((a, b) => tAt(b) - tAt(a));
const askCode = a => String(a.id).slice(-4).toUpperCase();
const askWhen = w => w === 'today' ? t('Today') : w === 'tomorrow' ? t('Tomorrow') : t('Now');
// Shops that receive an ask: open shops in the buyer's area (all areas if the buyer picked "All")
const askShops = area => S.shops.filter(s => inArea(s, area) && isOpen(s));
// A shop sees asks from its own area
const asksForShop = s => asksAll().filter(a => isLiveAsk(a) && (a.area === 'All' || a.area === s.area) && (a.status === 'open' || a.heldShop === s.id))
  .sort((a, b) => (b.heldShop === s.id) - (a.heldShop === s.id) || tAt(b) - tAt(a));
const myReply = (a, s) => S.asks.find(r => r.kind === 'reply' && r.askId === a.id && r.shopId === s.id);
// Does the shop already list something like this? Used to pre-fill the price.
function listedMatch(a, s) {
  const tk = toks(a.q); if (!tk.length) return null;
  return S.products.find(p => p.shopId === s.id && p.active !== false && tk.every(w => (p.name + ' ' + (p.desc || '')).toLowerCase().includes(w))) || null;
}
ICON.ask = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.7A8.4 8.4 0 1 1 21 11.5z"/><path d="M10 9.2a2.2 2.2 0 1 1 3 2c-.6.3-1 .8-1 1.4v.4"/><path d="M12 16h.01"/></svg>';

/* ---------- Buyer side ---------- */
const AQ = {q:'', qty:1, when:'now', open:null, err:''};
function askCta(q) {
  if (!askOn()) return '';
  const n = askShops(C.area).length;
  return `<button class="askcta" type="button" data-act="c-ask" data-v="${esc(q || '')}">
    <span class="askcta-i">${ICON.ask}</span>
    <span class="row-main"><b>${q ? t('Not what you need? Ask the street for “{q}”', {q:esc(q)}) : t('Nukkad se Poocho')}</b>
    <span class="row-m">${q ? t('{n} open shops nearby get your ask. They reply with a price.', {n}) : t('Can’t find it in the app? Ask every shop on your street. Most of their shelf isn’t listed.')}</span></span>
    <span class="arrow" aria-hidden="true">→</span></button>`;
}
function cAsk() {
  if (!askOn()) return `<button class="back" type="button" data-act="c-home">‹ ${t('Home')}</button><div class="empty"><b>${t('Nukkad se Poocho is not switched on yet')}</b></div>`;
  const open = AQ.open && asksAll().find(a => a.id === AQ.open);
  if (open) return cAskDetail(open);
  const mine = myAsks().slice(0, 5);
  const n = askShops(C.area).length;
  return `<button class="back" type="button" data-act="c-home">‹ ${t('Home')}</button>
  <div class="sec"><p class="eyebrow">🙋 ${t('Nukkad se Poocho')}</p><h1 class="h1" style="font-size:25px">${t('Ask the shops on your street')}</h1>
    <p class="sub">${t('Search only finds what shops have listed. Most of their shelf isn’t in the app. Ask, and any shop that has it replies with a price.')}</p></div>
  <form class="card sec askform" id="c-askform" autocomplete="off">
    <label class="field"><span>${t('What do you need?')}</span><input id="ask-q" type="text" maxlength="80" required placeholder="${esc(t('e.g. geometry box, A4 sheets, Parle-G'))}" value="${esc(AQ.q)}" data-act="ask-q"></label>
    <div style="display:grid;gap:12px">
      <label class="field"><span>${t('How many?')}</span><span class="qty"><button type="button" data-act="ask-qty" data-v="-1" aria-label="−">−</button><b>${AQ.qty}</b><button type="button" data-act="ask-qty" data-v="1" aria-label="+">+</button></span></label>
      <div class="field"><span>${t('When?')}</span><div class="chips" role="group">${['now', 'today', 'tomorrow'].map(w => `<button class="chip" type="button" data-act="ask-when" data-v="${w}" aria-pressed="${AQ.when === w}">${askWhen(w)}</button>`).join('')}</div></div>
    </div>
    <p class="note">📍 ${C.area === 'All' ? t('Goes to {n} open shops in all areas.', {n}) : t('Goes to {n} open shops in {area}.', {n, area:esc(C.area)})} ${t('No phone number is shared.')}</p>
    ${AQ.err ? `<p class="error" role="alert">${esc(AQ.err)}</p>` : ''}
    <button class="btn btn-go" type="submit">🙋 ${t('Ask the street')}</button>
  </form>
  ${mine.length ? `<section class="sec"><h2 class="h2">${t('Your asks')}</h2>${mine.map(a => {
    const r = repliesFor(a.id), held = a.heldShop && shopById(a.heldShop);
    return `<button class="row askrow" type="button" data-act="ask-open" data-v="${esc(a.id)}"><span class="row-main"><span class="row-t">“${esc(a.q)}” × ${a.qty}</span>
      <span class="row-m">${ago(tAt(a))} · ${held ? '✅ ' + t('Held at {shop}', {shop:esc(held.name)}) : !isLiveAsk(a) ? t('Closed') : r.length ? (r.length === 1 ? t('1 shop has it') : t('{n} shops have it', {n:r.length})) : t('Waiting for shops…')}</span></span>
      ${r.length && !held && isLiveAsk(a) ? `<span class="badge b-best">${r.length}</span>` : ''}<span class="arrow" aria-hidden="true">›</span></button>`;
  }).join('')}</section>` : ''}`;
}
function cAskDetail(a) {
  const rs_ = repliesFor(a.id), held = a.heldShop && shopById(a.heldShop), live = isLiveAsk(a);
  const sent = askShops(a.area).length;
  let body;
  if (held) {
    body = `<div class="card sec askheld">
      <p class="eyebrow">✅ ${t('Held for you')}</p>
      <h2 class="h2">${esc(held.name)}</h2>
      <p class="sub">${t('{shop} is keeping “{q}” aside for you. Show this code at the counter.', {shop:esc(held.name), q:esc(a.q)})}</p>
      <div class="askcode">${askCode(a)}</div>
      <p><b>${rs(a.heldPrice * a.qty)}</b> <span class="small muted">(${rs(a.heldPrice)} × ${a.qty})</span> · ${esc(held.area)}${held.address ? ' · ' + esc(held.address) : ''}</p>
      ${held.upi ? `<a class="btn btn-go" href="${esc(upiLink({total:a.heldPrice * a.qty, id:'ASK-' + askCode(a)}, held))}">${t('Pay {amt} by UPI', {amt:rs(a.heldPrice * a.qty)})}</a>` : ''}
      <button class="btn btn-ghost" type="button" data-act="c-shop" data-v="${esc(held.id)}">${t('Open shop')}</button>
      <button class="btn btn-link" type="button" data-act="ask-done" data-v="${esc(a.id)}">${t('I picked it up')}</button>
    </div>`;
  } else if (!live) {
    body = `<div class="empty"><span class="big">🕰️</span><b>${t('This ask is closed')}</b><button class="btn btn-ghost btn-sm" type="button" data-act="ask-again" data-v="${esc(a.id)}">${t('Ask again')}</button></div>`;
  } else if (!rs_.length) {
    body = `<div class="card sec askwait"><span class="askdots" aria-hidden="true"><i></i><i></i><i></i></span>
      <b>${t('Asking {n} shops…', {n:sent})}</b><span class="small muted">${t('Shops reply in a few minutes. This page updates by itself.')}</span></div>`;
  } else {
    body = `<section class="sec"><h2 class="h2">${rs_.length === 1 ? t('1 shop has it') : t('{n} shops have it', {n:rs_.length})}</h2>${rs_.map((r, i) => {
      const s = shopById(r.shopId); if (!s) return '';
      return `<div class="card askreply ${tAt(r) > Date.now() - 8000 ? 'flash' : ''}">
        <span class="row-main"><span class="row-t">${esc(s.name)} ${i === 0 && rs_.length > 1 ? `<span class="badge b-best">${t('Best price')}</span>` : ''}</span>
        <span class="row-m">${ratingChip(s)} · ${esc(s.area)} · ${ago(tAt(r))}</span></span>
        <span class="r-right"><span class="price">${rs(r.price)}</span><button class="btn btn-go btn-sm" type="button" data-act="ask-hold" data-v="${esc(r.id)}">${t('Hold it for me')}</button></span>
      </div>`;
    }).join('')}<p class="small muted">${t('More shops may still reply.')}</p></section>`;
  }
  return `<button class="back" type="button" data-act="ask-list">‹ ${t('Your asks')}</button>
  <div class="sec"><p class="eyebrow">🙋 ${t('Nukkad se Poocho')}</p><h1 class="h1" style="font-size:25px">“${esc(a.q)}” × ${a.qty}</h1>
    <p class="sub">${askWhen(a.when)} · ${a.area === 'All' ? t('All areas') : esc(a.area)} · ${t('asked {t}', {t:ago(tAt(a))})}</p></div>
  ${body}`;
}
async function cAskSubmit() {
  const q = String(($('#ask-q') || {}).value || AQ.q).trim();
  if (q.length < 2) { AQ.err = t('Type what you need.'); render(); return; }
  AQ.err = '';
  const id = 'ask' + Date.now().toString(36) + rid(3);
  const a = {id, kind:'ask', q, qty:AQ.qty, when:AQ.when, area:C.area, deviceId:DEVICE, buyer:(C.form.name || '').split(' ')[0] || t('Someone nearby'), at:Date.now(), status:'open'};
  if (!(await put('asks', a))) return;
  AQ.open = id; AQ.q = ''; AQ.qty = 1; AQ.when = 'now';
  buzz(30); toast('🙋 ' + t('Asked {n} shops near you', {n:askShops(a.area).length}));
  FX.enter = true; render(); scrollTop();
}
Object.assign(ACT, {
  'c-ask': v => { AQ.q = v || AQ.q; AQ.open = null; AQ.err = ''; C.screen = 'ask'; FX.enter = true; render(); scrollTop(); setTimeout(() => { const i = $('#ask-q'); if (i && !i.value) i.focus(); }, 60); },
  'ask-qty': v => { AQ.q = ($('#ask-q') || {}).value ?? AQ.q; AQ.qty = Math.max(1, Math.min(50, AQ.qty + Number(v))); render(); },
  'ask-when': v => { AQ.q = ($('#ask-q') || {}).value ?? AQ.q; AQ.when = v; render(); },
  'ask-open': v => { AQ.open = v; C.screen = 'ask'; FX.enter = true; render(); scrollTop(); },
  'ask-list': () => { AQ.open = null; FX.enter = true; render(); scrollTop(); },
  'ask-again': v => { const a = asksAll().find(x => x.id === v); AQ.q = a ? a.q : ''; AQ.open = null; render(); },
  'ask-hold': async v => {
    const r = S.asks.find(x => x.id === v), a = r && asksAll().find(x => x.id === r.askId); if (!r || !a) return;
    const {id, ...rest} = a;
    if (await put('asks', {id, ...rest, status:'held', heldShop:r.shopId, heldPrice:r.price, heldAt:Date.now()})) {
      buzz([30, 30, 60]); toast('✅ ' + t('{shop} is holding it for you', {shop:(shopById(r.shopId) || {}).name || ''})); render(); scrollTop();
    }
  },
  'ask-done': async v => {
    const a = asksAll().find(x => x.id === v); if (!a) return;
    const {id, ...rest} = a;
    await put('asks', {id, ...rest, status:'done', doneAt:Date.now()}); AQ.open = null; render();
  },
});
CHANGE['ask-q'] = el => { AQ.q = el.value; };
// keep what people type, so a live update re-drawing the screen never wipes it
document.addEventListener('input', e => { const el = e.target; if (el.id === 'ask-q') AQ.q = el.value; else if (el.dataset && el.dataset.act === 'ask-price') SA.price[el.dataset.v] = el.value; });
SUBMIT['c-askform'] = () => cAskSubmit();

/* ---------- Shop side ---------- */
const SA = {hide:new Set(readJSON('ask-hide', [])), price:{}, flash:null};
function sAsks(s) {
  if (!askOn()) return `<div class="empty"><b>${t('Nukkad se Poocho is not switched on yet')}</b></div>`;
  const list = asksForShop(s).filter(a => !SA.hide.has(a.id) || a.heldShop === s.id);
  return `<div class="sec"><p class="eyebrow">🙋 ${t('Nukkad se Poocho')}</p><h1 class="h1" style="font-size:25px">${t('People near you are asking')}</h1>
    <p class="sub">${t('Have it on your shelf, even if it isn’t in the app? Reply with a price in one tap. They come to you.')}</p></div>
  ${list.length ? list.map(a => {
    const mine = myReply(a, s), heldHere = a.heldShop === s.id, match = listedMatch(a, s);
    const price = SA.price[a.id] ?? (mine ? mine.price : match ? match.price : '');
    return `<div class="card sec askcard ${SA.flash === a.id ? 'flash' : ''} ${heldHere ? 'held' : ''}">
      <div class="row-main"><span class="row-t">“${esc(a.q)}” × ${a.qty}</span>
        <span class="row-m">${esc(a.buyer || t('Someone nearby'))} · ${askWhen(a.when)} · ${ago(tAt(a))}</span></div>
      ${heldHere ? `<p class="note">🎉 ${t('{name} chose you at {price}. Keep it aside. Their code is {code}.', {name:esc(a.buyer || t('The buyer')), price:rs(a.heldPrice), code:`<b>${askCode(a)}</b>`})}</p>`
      : mine ? `<p class="small"><span class="badge b-ok">${t('You replied {price}', {price:rs(mine.price)})}</span> ${t('Waiting for the buyer to choose.')}</p>`
      : `${match ? `<p class="small muted">${t('In your list: {name} at {price}', {name:esc(match.name), price:rs(match.price)})}</p>` : ''}
        <div class="askact"><label class="field"><span>${t('Your price')} ₹</span><input id="ap-${esc(a.id)}" type="number" min="0" step="1" inputmode="numeric" value="${esc(price)}" data-act="ask-price" data-v="${esc(a.id)}"></label>
        <button class="btn btn-forest" type="button" data-act="s-ask-yes" data-v="${esc(a.id)}">✅ ${t('I have it')}</button>
        <button class="btn btn-ghost btn-sm" type="button" data-act="s-ask-no" data-v="${esc(a.id)}">${t('Don’t have')}</button></div>`}
    </div>`;
  }).join('') : `<div class="empty"><span class="big">🙋</span><b>${t('No asks right now')}</b><span>${t('When someone in {area} asks for something, it rings here like an order.', {area:esc(s.area)})}</span></div>`}`;
}
let askSeen = null;
function askNotify() {
  // Shop: ring for new asks in my area. Buyer: tell me when a shop replies.
  const s = APP() === 'seller' && V.shopId ? shopById(V.shopId) : null;
  const ids = new Set(S.asks.map(x => x.id));
  if (!askSeen) { askSeen = ids; return; }
  const fresh = S.asks.filter(x => !askSeen.has(x.id) && tAt(x) > Date.now() - 10 * 60e3);
  askSeen = ids;
  if (s) {
    const mineNew = fresh.filter(a => a.kind === 'ask' && a.deviceId !== DEVICE && (a.area === 'All' || a.area === s.area));
    if (mineNew.length) { SA.flash = mineNew[0].id; chime(); buzz([60, 40, 60]); toast('🙋 ' + t('Someone nearby needs “{q}”', {q:mineNew[0].q})); setTimeout(() => { SA.flash = null; }, 3200); }
  } else if (APP() === 'customer') {
    const replies = fresh.filter(r => r.kind === 'reply' && myAsks().some(a => a.id === r.askId));
    if (replies.length) { const sh = shopById(replies[0].shopId); chime(); buzz([40, 30, 40]); toast('🙋 ' + t('{shop} has it: {price}', {shop:sh ? sh.name : '', price:rs(replies[0].price)})); }
  }
}
const baseAfterDataAsk = afterData;
afterData = function () { baseAfterDataAsk(); askNotify(); };
Object.assign(ACT, {
  's-ask-yes': async v => {
    const s = shopById(V.shopId), a = asksAll().find(x => x.id === v); if (!s || !a) return;
    const el = document.getElementById('ap-' + v), price = Math.round(Number(el ? el.value : SA.price[v]));
    if (!(price > 0)) { toast(t('Type your price first.')); el && el.focus(); return; }
    if (await put('asks', {id:a.id + '_' + s.id, kind:'reply', askId:a.id, shopId:s.id, price, at:Date.now()})) {
      delete SA.price[v]; buzz(30); toast('✅ ' + t('Sent. {name} sees your price now.', {name:a.buyer || t('The buyer')})); render();
    }
  },
  's-ask-no': v => { SA.hide.add(v); ls('ask-hide', JSON.stringify([...SA.hide].slice(-200))); render(); },
});
CHANGE['ask-price'] = el => { SA.price[el.dataset.v] = el.value; };
