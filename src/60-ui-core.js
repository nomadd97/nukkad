
/* ---------- App state ---------- */
const readJSON = (k, d) => { try { return JSON.parse(ls(k) || 'null') ?? d; } catch (e) { return d; } };
const C = {
  tab:'home', screen:'home', q:'', qDraft:'', sort:'best', area:ls('area') || 'Vidyanagar', cat:null, shopId:null, shopCat:'All',
  cart:{}, cartShop:null, sheet:null, pendingAdd:null, err:'', orderId:null, slide:0, bump:false, when:'now', listening:false,
  form:{name:ls('name') || '', phone:ls('phone') || '', mode:'pickup', address:ls('addr') || '', note:''},
  favs:new Set(readJSON('favs', [])), recent:readJSON('recent', []), rateDraft:{}, paidClaim:new Set(readJSON('paid', [])),
};
const V = {
  shopId:ls('seller-shop'), pick:null, pin:'', pinErr:false, tab:'orders', ordTab:'new', reg:null, regErr:'',
  ai:'', aiBusy:false, aiNote:'', draft:[], photo:null, pq:'', arm:null, flash:null, radarFlash:null, seen:null, newCount:0,
  offer:{kind:'pct', pct:5, minOrder:300, maxOff:30}, offerErr:'', poster:false,
};
const FX = {enter:true, count:true, sheet:true};
const ACT = {}, CHANGE = {}, SUBMIT = {};

/* ---------- Sound + notifications ---------- */
let AC = null;
function unlockAudio() { try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { AC = null; } }
function chime() {
  if (!AC) return;
  try {
    [880, 1320].forEach((f, i) => {
      const o = AC.createOscillator(), g = AC.createGain(), tt = AC.currentTime + i * .16;
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, tt); g.gain.exponentialRampToValueAtTime(.18, tt + .02); g.gain.exponentialRampToValueAtTime(.0001, tt + .38);
      o.connect(g).connect(AC.destination); o.start(tt); o.stop(tt + .4);
    });
  } catch (e) { /* audio unavailable */ }
}
let seenStatus = null;
function afterData() {
  if (V.shopId) {
    const mine = S.orders.filter(o => o.shopId === V.shopId);
    if (!V.seen) V.seen = new Set(mine.map(o => o.id));
    else {
      const fresh = mine.filter(o => !V.seen.has(o.id));
      fresh.forEach(o => V.seen.add(o.id));
      const incoming = fresh.filter(o => o.status === 'pending' && tAt(o) > Date.now() - 10 * 60e3);
      if (incoming.length && APP() === 'seller') {
        V.flash = incoming[0].id; V.ordTab = 'new'; V.newCount += incoming.length;
        chime(); buzz([60, 40, 60]);
        toast('🔔 ' + t('New order from {name}', {name:incoming[0].buyer}) + ' · ' + rs(incoming[0].total));
        clearFlash();
        try { if (document.hidden && 'Notification' in window && Notification.permission === 'granted') new Notification('Nukkad', {body:t('New order from {name}', {name:incoming[0].buyer}) + ' · ' + rs(incoming[0].total)}); } catch (e) { /* not allowed */ }
      }
    }
  }
  const my = S.orders.filter(o => o.deviceId === DEVICE);
  if (!seenStatus) { seenStatus = {}; my.forEach(o => { seenStatus[o.id] = o.status; }); return; }
  for (const o of my) {
    if (seenStatus[o.id] && seenStatus[o.id] !== o.status && APP() === 'customer') {
      const s = shopById(o.shopId);
      toast(o.status === 'cancelled' ? t('{shop} couldn’t take order {id}.', {shop:s ? s.name : t('The shop'), id:o.id}) : `${o.status === 'completed' ? '🎉' : '📦'} ${statusText(o)} · ${o.id}`);
      buzz(40);
    }
    seenStatus[o.id] = o.status;
  }
}
function clearFlash() {
  setTimeout(() => { V.flash = null; V.radarFlash = null; document.querySelectorAll('.flash').forEach(e => e.classList.remove('flash')); }, 3200);
}
let toastT;
function toast(m) {
  const el = $('#toast'); if (!el) return;
  el.textContent = m; el.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 3400);
}
function connChip() {
  if (S.conn === 'live') return `<span class="conn live" title="${esc(t('Orders sync across devices'))}"><i></i>${t('Live')}</span>`;
  if (S.conn === 'connecting') return `<span class="conn"><i></i>${t('Syncing')}</span>`;
  return `<span class="conn" title="${esc(t('Changes stay on this device'))}"><i></i>${t('Demo')}</span>`;
}
function langBtn() {
  return `<button class="langbtn" type="button" data-act="lang" aria-label="${esc(t('Change language'))}">${ICON.globe}<span>${LANGS[LANG].short}</span></button>`;
}
function langSheet() {
  return `<div class="scrim" data-act="lang-close"></div>
  <div class="sheet ${FX.sheet ? '' : 'still'}" role="dialog" aria-modal="true" aria-label="${esc(t('Choose language'))}">
    <span class="grab" aria-hidden="true"></span>
    <h2 class="h2">${t('Choose language')}</h2>
    <div class="langs">${Object.entries(LANGS).map(([k, l]) => `<button type="button" class="langopt" data-act="lang-set" data-v="${k}" aria-pressed="${k === LANG}"><b>${l.name}</b><span>${l.sample}</span></button>`).join('')}</div>
    <p class="small muted">${t('Shop and product names stay as the shop wrote them.')}</p>
  </div>`;
}
function nav(items, current, act) {
  return `<nav class="nav" aria-label="${esc(t('Main'))}">${items.map(([k, label, icon, count]) =>
    `<button type="button" data-act="${act}" data-v="${k}" ${k === current ? 'aria-current="page"' : ''}>${ICON[icon]}${label}${count ? `<span class="dotc">${count}</span>` : ''}</button>`).join('')}</nav>`;
}
function qrSvg(text, px = 4) {
  if (!window.qrcode) return '';
  try { const q = window.qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({cellSize:px, margin:2, scalable:true}); } catch (e) { return ''; }
}
const publicBase = () => (CFG.publicUrl || (location.origin + location.pathname.replace(/seller\/?(index\.html)?$/, '').replace(/index\.html$/, ''))).replace(/\/?$/, '/');

/* ---------- Install as an app ---------- */
let installEvt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; render(); });
window.addEventListener('appinstalled', () => { installEvt = null; toast(t('Installed! Find Nukkad on your home screen.')); render(); });
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
function installCard(appName) {
  if (IN_CLAUDE || isStandalone() || ls('install-hide')) return '';
  if (!installEvt && !isIOS()) return '';
  return `<div class="install">${ICON.download}<span class="row-main"><b>${t('Install {app} on your phone', {app:appName})}</b><span class="row-m">${installEvt ? t('Opens full screen, like any app.') : t('Tap Share, then “Add to Home Screen”.')}</span></span>
    ${installEvt ? `<button class="btn btn-go btn-sm" type="button" data-act="install">${t('Install')}</button>` : ''}<button class="icon-btn" type="button" data-act="install-hide" aria-label="${esc(t('Hide'))}">×</button></div>`;
}
ACT['install'] = async () => { if (!installEvt) return; installEvt.prompt(); try { await installEvt.userChoice; } catch (e) { /* ignore */ } installEvt = null; render(); };
ACT['install-hide'] = () => { ls('install-hide', '1'); render(); };
ACT['lang'] = () => { UI.sheet = 'lang'; FX.sheet = true; render(); };
ACT['lang-close'] = () => { UI.sheet = null; render(); };
ACT['lang-set'] = v => { setLang(v); UI.sheet = null; FX.enter = true; render(); toast(LANGS[v].hello); };
const UI = {sheet:null};

/* ---------- Render + effects ---------- */
function scrollTop() { window.scrollTo({top:0}); }
function countUps() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('[data-count]').forEach(el => {
    const to = Number(el.dataset.count) || 0, money = el.dataset.money, t0 = performance.now();
    if (!to) return;
    const step = tt => { const k = Math.min(1, (tt - t0) / 700), v = Math.round(to * (1 - Math.pow(1 - k, 3))); el.textContent = money ? rs(v) : v; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}
let heroWired = null, heroTouched = 0;
function wireHero() {
  const h = $('#hero'); if (!h || h === heroWired) return;
  heroWired = h;
  h.scrollLeft = C.slide * h.clientWidth;
  let tm;
  h.addEventListener('scroll', () => { clearTimeout(tm); tm = setTimeout(() => {
    const i = Math.round(h.scrollLeft / Math.max(1, h.clientWidth)); C.slide = i;
    document.querySelectorAll('.dots i').forEach((d, j) => d.classList.toggle('on', j === i));
  }, 80); }, {passive:true});
  h.addEventListener('pointerdown', () => { heroTouched = Date.now(); }, {passive:true});
}
setInterval(() => {
  const h = $('#hero'); if (!h || document.hidden || Date.now() - heroTouched < 7000 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const n = h.children.length || 3;
  C.slide = (C.slide + 1) % n; h.scrollTo({left:C.slide * h.clientWidth, behavior:'smooth'});
}, 4500);
function render() {
  const root = $('#app'); if (!root) return;
  const a = document.activeElement, id = a && a.id;
  let ss = null, se = null;
  try { ss = a.selectionStart; se = a.selectionEnd; } catch (e) { /* not text */ }
  document.documentElement.lang = LANGS[LANG].code;
  root.innerHTML = (APP() === 'seller' ? renderSeller() : renderCustomer()) + (UI.sheet === 'lang' ? langSheet() : '');
  document.title = APP() === 'seller' ? 'Nukkad for Shops' : 'Nukkad';
  if (id) {
    const n = document.getElementById(id);
    if (n && n !== document.body) { n.focus({preventScroll:true}); try { if (ss !== null) n.setSelectionRange(ss, se); } catch (e) { /* ignore */ } }
  }
  wireHero();
  if (FX.count) countUps();
  FX.enter = false; FX.count = false; FX.sheet = false;
}

/* ---------- Event wiring ---------- */
document.addEventListener('pointerdown', unlockAudio, {passive:true});
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) return;
  const fn = ACT[el.dataset.act];
  if (fn) fn(el.dataset.v || '', el, e);
});
document.addEventListener('change', e => {
  const el = e.target, fn = CHANGE[el.dataset.act];
  if (fn) fn(el, e);
});
document.addEventListener('submit', e => {
  e.preventDefault();
  const fn = SUBMIT[e.target.id];
  if (fn) fn(e.target, e);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (UI.sheet) UI.sheet = null; if (C.sheet) C.sheet = null; V.poster = false; render(); const b = $('#sugg'); if (b) b.hidden = true; }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role="button"][data-act]')) { e.preventDefault(); e.target.click(); }
});
window.addEventListener('hashchange', () => { FX.enter = true; FX.count = true; render(); scrollTop(); });
window.addEventListener('storage', e => { if (e.key === LKEY && S.backend === 'local') { L = loadLocal(); useLocal(); afterData(); render(); } });
setInterval(() => { const a = document.activeElement; if (!C.sheet && !UI.sheet && (!a || !/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) render(); }, 30000);
