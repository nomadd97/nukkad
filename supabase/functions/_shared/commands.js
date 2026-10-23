/* Nukkad message commands: the "brain" behind the WhatsApp bot.
   Turns a shopkeeper's message into actions on their shop, and writes the reply.
   Pure JavaScript, no internet, no AI: runs the same in the app and on the server.
   The server asks Gemini only when this reader can't understand a message.

     "blue pen out of stock"        -> stock of Blue Ball Pen = 0
     "notebook stock 20" / "20 left" -> stock = 20
     "pen +10"                       -> stock goes up by 10
     "geometry box price 130"        -> price = 130
     "add lab coat ₹350, 8 left"     -> a new product
     "shop closed" / "shop open"     -> Open/Closed switch
     "orders" / "today"              -> today's orders and sales
   Works with Hinglish ("pen khatam", "dukaan band") and Kannada ("ಪೆನ್ ಇಲ್ಲ"). */

export const WORDS = {
  // Hindi
  'पेन':'pen', 'कलम':'pen', 'पेंसिल':'pencil', 'नोटबुक':'notebook', 'कॉपी':'notebook', 'दाल':'dal', 'तूर':'toor', 'चावल':'rice', 'तेल':'oil', 'दूध':'milk',
  'चार्जर':'charger', 'केबल':'cable', 'साड़ी':'saree', 'पेड़ा':'peda', 'किताब':'book',
  'खत्म':'khatam', 'ख़त्म':'khatam', 'नहीं':'nahi', 'है':'hai', 'बंद':'band', 'खुला':'open', 'दाम':'price', 'स्टॉक':'stock', 'बचे':'left',
  // Kannada
  'ಪೆನ್':'pen', 'ಪೆನ್ನು':'pen', 'ಪೆನ್ಸಿಲ್':'pencil', 'ನೋಟ್‌ಬುಕ್':'notebook', 'ನೋಟ್ಬುಕ್':'notebook', 'ಪುಸ್ತಕ':'book', 'ಬೇಳೆ':'dal', 'ತೊಗರಿ':'toor', 'ಅಕ್ಕಿ':'rice', 'ಎಣ್ಣೆ':'oil', 'ಹಾಲು':'milk',
  'ಚಾರ್ಜರ್':'charger', 'ಕೇಬಲ್':'cable', 'ಸೀರೆ':'saree', 'ಪೇಡ':'peda',
  'ಇಲ್ಲ':'illa', 'ಖಾಲಿ':'khali', 'ಮುಗಿದಿದೆ':'khatam', 'ಮುಚ್ಚಿದೆ':'band', 'ತೆರೆದಿದೆ':'open', 'ಬೆಲೆ':'price', 'ಸ್ಟಾಕ್':'stock', 'ಇದೆ':'left',
};
const OUT = /\b(out of stock|outofstock|out|sold out|soldout|finished|finish|over|khatam|khatm|khtm|khallas|khali|illa|nahi hai|nahin hai|nahi|not available|no stock|stock out|nil|zero)\b/;
const CLOSE = /\b(shop|store|dukan|dukaan|today|aaj)?\s*(closed?|band|bandh|shut)\b/;
const OPEN = /\b(shop|store|dukan|dukaan)\s*(is\s*)?(open(ed)?|khula|khul gaya)\b|^\s*(open|khula)\s*$/;
const HELP = /^\s*(hi+|hello|hey|help|menu|namaste|namaskara|start|\?)\s*[!.]*\s*$/;
const ORDERS = /\b(orders?|sales?|today|aaj|kitne|how many)\b/;
const FILLER = new Set(['the','a','an','is','are','of','for','to','in','my','our','set','make','mark','now','please','pls','plz','bhai','sir','ji','hai','ho','gaya','gayi','gaye','abhi','ab','ka','ki','ke','ko','me','mein','change','update','new','add','stock','price','rate','rs','rupees','left','pcs','pc','pieces','piece','nos','no','qty','quantity','units','unit','available','only','just','and','it','its','item','items','also','more','extra','daam','bache','khatam','illa','khali','nahi','band','open','out','sold','over','finished','zero','nil']);

export const norm = s => String(s || '').toLowerCase()
  .split(/\s+/).map(w => WORDS[w] || w).join(' ')
  .replace(/₹\s*/g, ' rs ').replace(/\brs\.?\s*/g, ' rs ').replace(/\/-/g, ' rs ')
  .replace(/[^\p{L}\p{N}+\s.]/gu, ' ').replace(/\s+/g, ' ').trim();

const toks = s => norm(s).split(' ').filter(w => w && !/^\+?\d/.test(w) && !FILLER.has(w));

/* Find the product a message talks about. Returns {p} | {many:[...]} | {} */
export function findProduct(text, products) {
  const q = toks(text);
  if (!q.length) return {};
  let best = [], top = 0;
  for (const p of products) {
    const name = norm(p.name).split(' ');
    let s = 0;
    for (const w of q) {
      if (name.includes(w)) s += 2;
      else if (w.length >= 3 && name.some(n => n.startsWith(w) || (n.length >= 4 && w.startsWith(n)))) s += 1;
    }
    if (!s) continue;
    s -= name.length * 0.01;                 // prefer the shorter, closer name on a tie
    if (s > top + 0.5) { top = s; best = [p]; } else if (Math.abs(s - top) <= 0.5) best.push(p);
  }
  if (!best.length || top < 1) return {};
  return best.length === 1 ? {p:best[0]} : {many:best.slice(0, 4)};
}

/* One line of a message -> one action */
export function parseLine(line, products) {
  const t = norm(line);
  if (!t) return null;
  if (HELP.test(t)) return {type:'help'};
  const hasNum = /\d/.test(t);
  const found = findProduct(t, products);
  if (!found.p && !found.many) {
    if (!hasNum && CLOSE.test(t) && !OUT.test(t.replace(CLOSE, ''))) return {type:'close'};
    if (!hasNum && OPEN.test(t)) return {type:'open'};
    if (!hasNum && ORDERS.test(t)) return {type:'orders'};
  }
  // a new product: "add lab coat rs 350, 8 left"
  const price = (t.match(/\brs\s*(\d+(?:\.\d+)?)/) || t.match(/\b(?:price|rate)\s*(?:is\s*)?(\d+(?:\.\d+)?)/) || [])[1];
  const stock = (t.match(/\b(\d+)\s*(?:left|pcs?|pieces?|nos?|units?|in stock|available|qty)\b/) || t.match(/\b(?:stock|qty|quantity)\s*(?:is\s*)?(\d+)\b/) || [])[1];
  if (/^\s*(add|new)\b/.test(t) || (!found.p && !found.many && price != null)) {
    const name = String(line).replace(/^\s*(add|new)\b\s*(product|item)?\s*[:\-]?/i, '')
      .replace(/(?:₹|\brs\.?)\s*\d+(?:\.\d+)?|\d+(?:\.\d+)?\s*(?:\/-|rs\b)/ig, ' ')
      .replace(/\b(?:price|rate)\s*(?:is\s*)?\d+(?:\.\d+)?/ig, ' ')
      .replace(/\b\d+\s*(?:left|pcs?|pieces?|nos?|units?|in stock|available|qty)\b/ig, ' ')
      .replace(/\b(?:stock|qty|quantity)\s*(?:is\s*)?\d+\b/ig, ' ')
      .replace(/[,;:|]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (name && price != null) return {type:'add', name:name.replace(/\b\w/g, c => c.toUpperCase()), price:+price, stock:stock != null ? +stock : 0};
    if (name && found.many == null && !found.p) return {type:'unknown', text:line};
  }
  if (found.many) return {type:'which', options:found.many.map(p => p.name), text:line};
  if (!found.p) return {type:'unknown', text:line};
  const p = found.p;
  const plus = t.match(/(?:^|\s)\+\s*(\d+)\b/) || t.match(/\b(?:add|added|came|aaya|aaye|bande)\s*(\d+)\b/);
  if (plus) return {type:'restock', pid:p.id, name:p.name, by:+plus[1]};
  if (stock != null) return {type:'stock', pid:p.id, name:p.name, stock:+stock};
  if (price != null) return {type:'price', pid:p.id, name:p.name, price:+price};
  if (OUT.test(t)) return {type:'stock', pid:p.id, name:p.name, stock:0};
  const bare = t.match(/(?:^|\s)(\d+)\s*$/);           // "notebook 20" = stock 20
  if (bare) return {type:'stock', pid:p.id, name:p.name, stock:+bare[1]};
  return {type:'unknown', text:line, pid:p.id, name:p.name};
}

/* A whole message (several lines) -> actions */
export function parseMessage(text, products) {
  return String(text || '').split(/\n|;|\s+and\s+|\s+aur\s+/i).map(l => l.trim()).filter(Boolean).slice(0, 15).map(l => parseLine(l, products)).filter(Boolean);
}

const rs = n => '₹' + Number(n || 0).toLocaleString('en-IN');
export const HELP_TEXT = 'Namaste! Send me updates like:\n• blue pen out of stock\n• notebook stock 20\n• pen +10\n• geometry box price 130\n• add lab coat ₹350, 8 left\n• shop closed / shop open\n• orders\nHindi and Kannada words work too.';

/* The reply line for one action, after it was applied. ctx = {shop, stats:{orders, sales, pending}} */
export function replyFor(a, ctx = {}) {
  switch (a.type) {
    case 'help': return HELP_TEXT;
    case 'stock': return a.stock === 0 ? `✅ ${a.name} marked out of stock. Buyers see "Sold out" now.` : `✅ ${a.name}: stock set to ${a.stock}.`;
    case 'restock': return `✅ ${a.name}: +${a.by}, now ${a.after} in stock.`;
    case 'price': return `✅ ${a.name}: price changed to ${rs(a.price)}.`;
    case 'add': return `🆕 Added ${a.name} at ${rs(a.price)}, ${a.stock} in stock. Buyers can find it now.`;
    case 'close': return '🔴 Shop marked Closed. Buyers can browse but not order. Send "shop open" to reopen.';
    case 'open': return '🟢 Shop is Open. Orders will come here.';
    case 'orders': { const s = ctx.stats || {}; return `📦 Today: ${s.orders || 0} order${s.orders === 1 ? "" : "s"}, ${rs(s.sales)} in sales.${s.pending ? ` ${s.pending} waiting for you to accept.` : ''}`; }
    case 'which': return `Which one do you mean?\n${a.options.map((o, i) => `${i + 1}. ${o}`).join('\n')}\nSend the full name, e.g. "${a.options[0]} out of stock".`;
    default: return `🤔 Sorry, I didn't get "${a.text}". Try "pen out of stock" or send "help".`;
  }
}
