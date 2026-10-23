// node tools/make-seed.js  ->  supabase/seed.sql  (the demo shops, products, orders, offers, ratings)
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const files = ['00-head.js', '05-i18n.js', '10-helpers.js', '15-extra.js', '20-seed.js', '22-seed-hubli.js', '25-seed2.js'];
const store = {};
const ctx = {
  window: {}, document: {body: {dataset: {}}}, location: {hash: '', search: ''}, navigator: {},
  localStorage: {getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; }},
  console, crypto: require('crypto').webcrypto, Date, Math, JSON,
};
vm.createContext(ctx);
const code = files.map(f => fs.readFileSync(path.join(root, 'src', f), 'utf8')).join('\n') + '\n;globalThis.__seed = seed2();';
vm.runInContext(code, ctx);
const d = ctx.__seed;
const q = s => "'" + String(s).replace(/'/g, "''") + "'";
let sql = '-- Nukkad demo data. Run after schema.sql. Safe to run again (it resets the demo shops).\n-- Demo shop PIN for every seeded shop: 1234\n\n';
for (const c of ['shops', 'products', 'orders', 'searches', 'ratings', 'offers']) {
  const rows = d[c] || [];
  if (!rows.length) continue;
  sql += `insert into public.nk_${c} (id, data) values\n` + rows.map(r => {
    const {id, pin, ...data} = r;
    return `  (${q(id)}, ${q(JSON.stringify(data))}::jsonb)`;
  }).join(',\n') + `\non conflict (id) do update set data = excluded.data, updated_at = now();\n\n`;
}
sql += 'insert into public.nk_pins (shop_id, pin_hash) values\n' + d.shops.map(s => `  (${q(s.id)}, extensions.crypt('1234', extensions.gen_salt('bf')))`).join(',\n') + '\non conflict (shop_id) do nothing;\n';
fs.writeFileSync(path.join(root, 'supabase', 'seed.sql'), sql);
console.log(`  wrote supabase/seed.sql: ${d.shops.length} shops, ${d.products.length} products, ${d.orders.length} orders, ${d.offers.length} offers, ${d.ratings.length} ratings`);
