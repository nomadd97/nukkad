
/* ---------- Start ---------- */
// A shop's QR poster opens  …/?shop=<slug>  and lands straight on that shop
let DEEP = new URLSearchParams(location.search).get('shop');
function tryDeep() {
  if (!DEEP || APP() !== 'customer') return;
  const s = S.shops.find(x => x.slug === DEEP || slugify(x.name) === DEEP || x.id === DEEP);
  if (!s) return;
  DEEP = null;
  C.shopId = s.id; C.shopCat = 'All'; C.screen = 'shop'; C.tab = 'home'; FX.enter = true;
  try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { /* ignore */ }
}
const baseAfterData = afterData;
afterData = function () { baseAfterData(); tryDeep(); };

if ('serviceWorker' in navigator && !IN_CLAUDE && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    const root = document.body.dataset.app === 'seller' ? '../' : './';
    navigator.serviceWorker.register(root + 'sw.js', {scope:root}).catch(() => { /* offline cache is optional */ });
  });
}
afterData();
render();
connect();
window.__nk = {S, C, V, t, setLang, seed2, CFG};
