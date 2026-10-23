/* ---------- Helpers ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rs = n => '₹' + Number(n || 0).toLocaleString('en-IN', {maximumFractionDigits:2});
const cap = s => String(s).charAt(0).toUpperCase() + String(s).slice(1);
const rid = (n = 6) => Math.random().toString(36).slice(2, 2 + n);
const ls = (k, v) => {
  try {
    if (v === undefined) return localStorage.getItem('nk-' + k);
    if (v === null) localStorage.removeItem('nk-' + k); else localStorage.setItem('nk-' + k, v);
  } catch (e) { /* storage blocked */ }
  return null;
};
const tAt = x => x.agoH != null ? Date.now() - x.agoH * H : (x.at || 0);
function ago(ts) {
  const m = Math.round((Date.now() - ts) / 6e4);
  if (m < 1) return t('just now');
  if (m < 60) return t('{n} min ago', {n:m});
  const h = Math.round(m / 60);
  if (h < 24) return t('{n} h ago', {n:h});
  const d = Math.round(h / 24);
  return d === 1 ? t('yesterday') : t('{n} days ago', {n:d});
}
function cleanPhone(v) {
  let d = String(v || '').replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  if (d.length === 10) d = '91' + d;
  return d;
}
const prettyPhone = d => /^91\d{10}$/.test(d || '') ? '+91 ' + d.slice(2, 7) + ' ' + d.slice(7) : (d ? '+' + d : '');
const waLink = (phone, text) => 'https://wa.me/' + String(phone || '').replace(/\D/g, '') + '?text=' + encodeURIComponent(text);
const slugify = s => String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40) || 'shop';
let DEVICE = ls('device'); if (!DEVICE) { DEVICE = 'd' + rid(10); ls('device', DEVICE); }
const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { /* not allowed */ } };

/* Product pictures: a friendly emoji tile per product, tinted by category */
const EMO = [['sketchbook','📒'],['drawing','🎨'],['notebook','📓'],['dictionary','📕'],['geometry','📐'],['sticky','🗒️'],['colour','🎨'],['paper','📄'],['pen','🖊️'],['pencil','✏️'],['fevicol','🧴'],['glue','🧴'],['book','📘'],
  ['saree','🥻'],['dupatta','🧣'],['kurta','👘'],['fabric','🧵'],['towel','🧺'],['shirt','👕'],
  ['dal','🫘'],['rice','🍚'],['coffee','☕'],['tea','🍵'],['ghee','🧈'],['oil','🫙'],['idli','🥣'],['muesli','🥣'],['jaggery','🍯'],['honey','🍯'],['agarbatti','🪔'],['ragi','🌾'],['flour','🌾'],['atta','🌾'],['milk','🥛'],['bread','🍞'],['cake','🎂'],['biscuit','🍪'],
  ['spinning top','🪀'],['train','🚂'],['diya','🪔'],['plate','🍽️'],['tote','👜'],['bag','👜'],['elephant','🐘'],['bell','🔔'],
  ['power bank','🔋'],['charger','🔌'],['cable','🔌'],['bulb','💡'],['extension','🔌'],['earphone','🎧'],['speaker','🔊'],['batter','🔋']];
const CATEMO = {Stationery:'✏️', Grocery:'🛒', Clothing:'👗', Electronics:'🔌', Handicrafts:'🏺', Pharmacy:'💊', Bakery:'🥐', Books:'📚', Home:'🏠', Other:'🛍️'};
const CATTINT = {Stationery:'--t1', Grocery:'--t2', Clothing:'--t3', Electronics:'--t4', Handicrafts:'--t5', Books:'--t4', Home:'--t2', Bakery:'--t1', Pharmacy:'--t6', Other:'--t6'};
function emo(p) { const n = String(p.name || '').toLowerCase(); for (const [k, e] of EMO) if (n.includes(k)) return e; return CATEMO[p.category] || '🛍️'; }
const tint = c => `var(${CATTINT[c] || '--t6'})`;
const thumb = (p, cls = '') => `<span class="th ${cls}" style="background:${tint(p.category)}" aria-hidden="true">${emo(p)}</span>`;

const ICON = {
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  box:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  shop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9 5 4h14l2 5"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v8h14v-8"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  truck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5 10 17l9-10"/></svg>',
};

