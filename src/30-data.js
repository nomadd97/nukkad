
/* ---------- Data layer ----------
   Three backends behind one API:
   - supabase: the real deployed apps (shared by every phone, live)
   - claude:   the preview inside Claude (shared store of the artifact)
   - local:    a demo copy kept on this device (always works, no setup) */
const COLLS = ['shops','products','orders','searches','ratings','offers'];
// Optional collections: the app still starts if their table isn't there yet (the feature just hides)
const OPT = ['asks'];
const ALL = [...COLLS, ...OPT];
const S = {conn:'connecting', backend:'local', shops:[], products:[], orders:[], searches:[], ratings:[], offers:[], asks:[], asksLive:false};
let L = loadLocal();
let DB = null, SB = null;
function loadLocal() {
  try { const r = JSON.parse(localStorage.getItem(LKEY) || 'null'); if (r && r.v === 3 && Array.isArray(r.shops)) return r; } catch (e) { /* ignore */ }
  return seed2();
}
function saveLocal() { try { localStorage.setItem(LKEY, JSON.stringify(L)); } catch (e) { /* ignore */ } }
function useLocal() { ALL.forEach(c => { S[c] = L[c] || (L[c] = []); }); }
useLocal();

let renderQueued = false;
function scheduleRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => { renderQueued = false; afterData(); render(); });
}
function applyLocally(coll, id, body, merge) {
  const arr = S[coll], i = arr.findIndex(x => x.id === id);
  if (merge) { if (i >= 0) arr[i] = {...arr[i], ...body}; }
  else if (i >= 0) arr[i] = {...body, id}; else arr.push({...body, id});
}
function goLocal(reason) {
  if (S.backend !== 'local') {
    L = {v:3}; ALL.forEach(c => { L[c] = (S[c] || []).map(x => JSON.parse(JSON.stringify(x))); }); saveLocal();
  }
  S.backend = 'local'; S.conn = 'local'; DB = null; SB = null; useLocal();
  if (reason) toast(reason);
  render();
}
async function write(coll, id, body, merge) {
  if (S.backend === 'supabase' && SB) {
    applyLocally(coll, id, body, merge); scheduleRender();
    const r = merge ? await SB.rpc('nk_patch', {t:coll, doc_id:id, patch:body}) : await SB.from('nk_' + coll).upsert({id, data:body});
    if (r.error) { toast(t('Couldn’t save that. Check your connection and try again.')); refetch(coll); return false; }
    return true;
  }
  if (S.backend === 'claude' && DB) {
    try {
      const ref = DB.doc(coll + '/' + id);
      if (merge) await ref.update(body); else await ref.set(body);
      return true;
    } catch (e) {
      if (e && e.code === 'invalid_argument') { goLocal(t('Live sync isn’t open to your account, so you’re using a demo copy on this device.')); return write(coll, id, body, merge); }
      toast(t('Couldn’t save that. Check your connection and try again.'));
      return false;
    }
  }
  const arr = L[coll] || (L[coll] = []), i = arr.findIndex(x => x.id === id);
  if (merge) { if (i >= 0) arr[i] = {...arr[i], ...body}; }
  else if (i >= 0) arr[i] = {...body, id}; else arr.push({...body, id});
  saveLocal(); useLocal(); afterData(); render();
  return true;
}
const put = (coll, obj) => { const {id, ...body} = obj; return write(coll, id, body, false); };
const patch = (coll, id, body) => write(coll, id, body, true);

/* Placing an order: the real backend checks and reduces stock in one locked step, so two buyers can’t take the last piece */
async function placeOrderBackend(o) {
  if (S.backend === 'supabase' && SB) {
    const {id, ...body} = o;
    const r = await SB.rpc('nk_place_order', {doc_id:id, body});
    if (r.error) return t('Couldn’t place the order. Check your connection and try again.');
    if (r.data) return String(r.data);
    applyLocally('orders', id, body, false);
    o.items.forEach(it => { const p = prodById(it.pid); if (p) p.stock = Math.max(0, p.stock - it.qty); });
    scheduleRender();
    return null;
  }
  for (const it of o.items) { const p = prodById(it.pid); if (!p || p.stock < it.qty) return t('Only {n} left of {name}. Lower the quantity.', {n:p ? p.stock : 0, name:it.name}); }
  const after = o.items.map(it => [it.pid, prodById(it.pid).stock - it.qty]);
  if (!(await put('orders', o))) return t('Couldn’t place the order. Check your connection and try again.');
  for (const [pid, stock] of after) await patch('products', pid, {stock:Math.max(0, stock)});
  return null;
}
async function checkPin(shop, pin) {
  if (S.backend === 'supabase' && SB) { const r = await SB.rpc('nk_login', {shop_id:shop.id, pin}); return !r.error && r.data === true; }
  return String(shop.pin || '') === pin;
}
async function createShop(shop, pin) {
  if (S.backend === 'supabase' && SB) {
    if (!(await put('shops', shop))) return false;
    const r = await SB.rpc('nk_set_pin', {shop_id:shop.id, pin});
    return !r.error;
  }
  return put('shops', {...shop, pin});
}
async function refetch(coll) {
  if (!SB) return;
  const r = await SB.from('nk_' + coll).select('id,data').limit(5000);
  if (!r.error) { S[coll] = r.data.map(x => ({...x.data, id:x.id})); scheduleRender(); }
}
function loadScript(src) {
  return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
}
async function connectSupabase() {
  if (!window.supabase) await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js');
  const sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey);
  const res = await Promise.all(COLLS.map(c => sb.from('nk_' + c).select('id,data').limit(5000)));
  const bad = res.find(r => r.error);
  if (bad) throw new Error(bad.error.message);
  COLLS.forEach((c, i) => { S[c] = res[i].data.map(r => ({...r.data, id:r.id})); });
  // Nukkad se Poocho: only switch it on if its table exists
  const ra = await sb.from('nk_asks').select('id,data').limit(2000);
  S.asksLive = !ra.error; S.asks = ra.error ? [] : ra.data.map(r => ({...r.data, id:r.id}));
  SB = sb; S.backend = 'supabase'; S.conn = 'live';
  sb.channel('nk-live').on('postgres_changes', {event:'*', schema:'public'}, p => {
    const c = String(p.table || '').replace(/^nk_/, '');
    if (!ALL.includes(c)) return;
    if (p.eventType === 'DELETE') S[c] = S[c].filter(x => x.id !== (p.old && p.old.id));
    else if (p.new) { const row = {...p.new.data, id:p.new.id}; const i = S[c].findIndex(x => x.id === row.id); if (i >= 0) S[c][i] = row; else S[c].push(row); }
    scheduleRender();
  }).subscribe();
  afterData(); render();
}
async function connectClaude() {
  const [db, user] = await Promise.all([claude.use('db'), claude.use('user')]);
  if (!db) { S.conn = 'local'; render(); return; }
  let canWrite = null;
  try { canWrite = user && typeof user.can === 'function' ? await user.can('data.write') : null; } catch (e) { canWrite = null; }
  if (canWrite === false) { S.conn = 'local'; render(); return; }
  const tmp = {}, got = {};
  COLLS.forEach(c => {
    db.collection(c).onSnapshot(snap => {
      tmp[c] = snap.docs.map(d => ({...d.data(), id:d.id}));
      got[c] = true;
      if (!COLLS.every(k => got[k])) return;
      if (S.backend !== 'claude') {
        if (!tmp.shops.length) { if (S.conn === 'connecting') { S.conn = 'local'; render(); } return; }
        S.backend = 'claude'; S.conn = 'live'; DB = db;
      }
      COLLS.forEach(k => { S[k] = tmp[k]; });
      scheduleRender();
    }, () => { if (S.backend === 'claude') goLocal(t('Live sync dropped. You’re on a demo copy on this device now.')); });
  });
  OPT.forEach(c => db.collection(c).onSnapshot(snap => { if (S.backend === 'claude') { S[c] = snap.docs.map(d => ({...d.data(), id:d.id})); scheduleRender(); } }, () => {}));
  setTimeout(() => { if (S.conn === 'connecting') { S.conn = 'local'; render(); } }, 9000);
}
async function connect() {
  try {
    if (CFG.supabaseUrl && CFG.supabaseKey) return await connectSupabase();
    if (IN_CLAUDE) return await connectClaude();
  } catch (e) {
    console.warn('Nukkad: live data unavailable, using demo copy.', e);
    toast(t('Couldn’t reach the live database. Showing a demo copy.'));
  }
  S.conn = 'local'; S.backend = 'local'; render();
}
