/* ---------- Smart fill: Claude when available, built-in reader otherwise ---------- */
let SAMPLE = null, IMAGES_OK = false;
(async () => {
  if (!window.claude || typeof window.claude.use !== 'function') return;
  SAMPLE = await claude.use('sample');
  if (SAMPLE && typeof SAMPLE.limits === 'function') {
    try { IMAGES_OK = !!(await SAMPLE.limits()).images; } catch (e) { IMAGES_OK = false; }
  }
  render();
})();
const CATWORDS = {
  Stationery:['notebook','pen','pencil','paper','geometry','eraser','sketch','marker','file','stapler','glue','fevicol','diary','sheet','ink','crayon'],
  Grocery:['dal','rice','oil','atta','flour','sugar','coffee','tea','jaggery','masala','salt','honey','ghee','biscuit','milk','soap'],
  Clothing:['saree','kurta','shirt','dupatta','fabric','dress','jeans','shawl'],
  Electronics:['cable','charger','bulb','battery','batteries','earphone','headphone','adapter','extension','led','usb','power bank','speaker'],
  Handicrafts:['toy','spinning top','train','doll','diya','plate','lamp','vase','bell','elephant','tote'],
  Bakery:['bread','cake','bun','rusk','cookie'],
  Pharmacy:['tablet','syrup','bandage','sanitizer','mask'],
};
function guessCat(name, fallback) {
  const n = String(name).toLowerCase();
  for (const [c, ws] of Object.entries(CATWORDS)) if (ws.some(w => n.includes(w))) return c;
  return fallback;
}
function parseLine(line) {
  let t = ' ' + line.replace(/^\s*[•*\-–—]\s*/, '').trim() + ' ';
  if (!t.trim()) return null;
  let price = null, stock = null;
  const pm = t.match(/(?:₹|\brs\.?|\binr)\s*(\d+(?:\.\d+)?)/i) || t.match(/(\d+(?:\.\d+)?)\s*(?:\/-|rs\.?\b|rupees|₹)/i);
  if (pm) { price = +pm[1]; t = t.replace(pm[0], ' '); }
  const sm = t.match(/(\d+)\s*(?:left|pcs?\b|pieces|nos?\b|units?\b|in stock|available|qty\b)/i) || t.match(/(?:stock|qty|quantity)\s*[:=-]?\s*(\d+)/i);
  if (sm) { stock = +sm[1]; t = t.replace(sm[0], ' '); }
  if (price === null || stock === null) {
    const ms = [...t.matchAll(/(?:^|[\s,;|])(\d+(?:\.\d+)?)(?=$|[\s,;|])/g)];
    const take = () => {
      const m = ms.pop(); if (!m) return null;
      const idx = m.index + m[0].lastIndexOf(m[1]);
      t = t.slice(0, idx) + ' ' + t.slice(idx + m[1].length);
      return +m[1];
    };
    if (price === null && stock === null) { if (ms.length >= 2) { stock = take(); price = take(); } else if (ms.length === 1) price = take(); }
    else if (price === null) price = take(); else stock = take();
  }
  let name = t.replace(/[,;|:]+/g, ' ').replace(/\s[-–—]+(?=\s|$)/g, ' ').replace(/\b(price|at|for|only|each)\s*$/i, '').replace(/\s+/g, ' ').trim();
  name = name.replace(/^[-–—\s]+|[-–—\s]+$/g, '');
  if (!name) return null;
  return {name:cap(name), price:price === null ? '' : String(price), stock:stock === null ? '' : String(stock)};
}
function aiPrompt(text, withPhoto, shopCat) {
  return `You help a small Indian shopkeeper list products in a shop app. Turn their input into product listings.
${withPhoto ? 'They also attached a photo of the product(s). Read product names, sizes and any printed MRP from it.\n' : ''}Their message (may be empty, may mix English with Hindi or Kannada words, may use "rs", "/-", "₹", "pcs", "nos", "left"):
"""${text.slice(0, 3000)}"""

Reply with only a JSON array. Each item: {"name": string, "price": number or null, "stock": integer or null, "category": string}.
- name: clean product name in Title Case, keep size or pack info (e.g. "Toor Dal 1 kg").
- price: rupees per item. null if not given (for a photo, use a clearly printed MRP, else null).
- stock: how many they have. null if not given.
- category: one of ${JSON.stringify(CATS)}. If unsure use "${shopCat}".
No other text.`;
}


