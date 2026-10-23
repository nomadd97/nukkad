
/* =========================================================
   WHATSAPP UPDATES (shop app)
   The same command reader the real WhatsApp bot uses (CMD, from
   supabase/functions/_shared/commands.js), as a chat inside the shop app.
   Messages here change the shop for real, exactly like the bot.
   ========================================================= */
const chatKey = () => 'chat-' + V.shopId;
function chatLoad() {
  try { const c = JSON.parse(ls(chatKey()) || 'null'); if (Array.isArray(c)) return c; } catch (e) { /* ignore */ }
  return [{from:'bot', text:CMD.HELP_TEXT, at:Date.now()}];
}
function chatSave() { try { ls(chatKey(), JSON.stringify(V.chat.slice(-40))); } catch (e) { /* ignore */ } }
const hhmm = ts => new Date(ts).toLocaleTimeString('en-IN', {hour:'numeric', minute:'2-digit', hour12:true}).toLowerCase();
const fresh = p => p.via === 'whatsapp' && p.viaAt && Date.now() - p.viaAt < DAY ? `<span class="badge b-fresh">● ${t('Updated {ago}', {ago:ago(p.viaAt)})}</span>` : '';

function sChat(s) {
  if (!V.chat || V.chatShop !== s.id) { V.chat = chatLoad(); V.chatShop = s.id; }
  const bot = (CFG.botNumber || '').replace(/\D/g, '');
  return `
  <section class="card sec wa-intro">
    <div class="sec-h"><h2 class="h2">${ICON.chat} ${t('Update your shop by WhatsApp')}</h2></div>
    <p class="small muted">${t('Send a message like you text a friend. Stock, prices and new products change in seconds, and buyers see it live.')}</p>
    ${bot ? `<a class="btn btn-wa" href="${esc(waLink(bot, 'help'))}" target="_blank" rel="noopener">${t('Message Nukkad on WhatsApp')}</a>
      <p class="small muted">${t('Send from {n}, the number your shop is registered with.', {n:esc(prettyPhone(s.whatsapp))})}</p>` : ''}
  </section>
  <section class="wa" aria-label="${esc(t('Chat with the Nukkad bot'))}">
    <div class="wa-top"><span class="wa-av">${ICON.logo}</span><span class="row-main"><b>Nukkad Bot</b><span>${V.chatBusy ? t('typing…') : t('online')}</span></span></div>
    <div class="wa-body" id="wa-body">
      ${V.chat.map(m => `<div class="wa-msg ${m.from === 'me' ? 'me' : 'bot'}"><p>${esc(m.text).replace(/\n/g, '<br>')}</p><span>${hhmm(m.at)}${m.from === 'me' ? ' <i aria-hidden="true">✓✓</i>' : ''}</span></div>`).join('')}
      ${V.chatBusy ? '<div class="wa-msg bot typing" aria-label="typing"><p><i></i><i></i><i></i></p></div>' : ''}
    </div>
    <div class="wa-chips" role="group" aria-label="${esc(t('Try these'))}">${['blue pen out of stock', 'notebook stock 20', 'pen khatam', 'add lab coat ₹350, 8 left', 'orders', 'shop closed'].map(x => `<button type="button" class="chip" data-act="s-chip" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div>
    <form id="s-chat" class="wa-input" autocomplete="off">
      <label class="sr" for="s-chat-text">${t('Type a message')}</label>
      <input id="s-chat-text" placeholder="${esc(t('Type a message'))}" value="${esc(V.chatDraft || '')}" data-sbind2="chatDraft">
      <button class="wa-send" type="submit" aria-label="${esc(t('Send'))}">${ICON.send}</button>
    </form>
  </section>
  <p class="small muted" style="text-align:center">${t('Messages here change your shop for real, the same way the WhatsApp bot does.')} <button class="btn btn-link" type="button" data-act="s-chat-clear">${t('Clear chat')}</button></p>`;
}

async function claudeActions(text, products) {
  if (!SAMPLE) return [];
  try {
    const out = await SAMPLE.json(`A small Indian shopkeeper sent this message to update their online shop. It may mix English, Hindi and Kannada.
Message: """${text.slice(0, 600)}"""
Their products (id: name): ${products.map(p => p.id + ': ' + p.name).join('; ').slice(0, 5000)}
Reply with only a JSON array using these shapes: {"type":"stock","pid":"<id>","stock":<int>} (out of stock = 0), {"type":"restock","pid":"<id>","by":<int>}, {"type":"price","pid":"<id>","price":<number>}, {"type":"add","name":"<Title Case>","price":<number>,"stock":<int>}, {"type":"open"}, {"type":"close"}, {"type":"orders"}. If unsure, return [].`, {modelTier:'quick'});
    const ids = new Map(products.map(p => [p.id, p]));
    return (Array.isArray(out) ? out : []).filter(a => ['open', 'close', 'orders'].includes(a.type) || (a.type === 'add' && a.name && Number(a.price) >= 0) || (['stock', 'restock', 'price'].includes(a.type) && ids.has(a.pid)))
      .map(a => a.pid ? {...a, name:ids.get(a.pid).name} : a).slice(0, 10);
  } catch (e) { return []; }
}

async function chatApply(a, s) {
  const now = Date.now(), p = a.pid ? prodById(a.pid) : null;
  if (a.type === 'stock' && p) await patch('products', p.id, {stock:Math.max(0, a.stock | 0), via:'whatsapp', viaAt:now});
  else if (a.type === 'restock' && p) { a.after = Math.max(0, (p.stock || 0) + (a.by | 0)); await patch('products', p.id, {stock:a.after, via:'whatsapp', viaAt:now}); }
  else if (a.type === 'price' && p) await patch('products', p.id, {price:Math.max(0, Number(a.price)), via:'whatsapp', viaAt:now});
  else if (a.type === 'add') await put('products', {id:'p' + now.toString(36) + rid(3), shopId:s.id, name:a.name, category:guessCat(a.name, s.category), price:Number(a.price), stock:a.stock | 0, desc:'', active:true, at:now, via:'whatsapp', viaAt:now});
  else if (a.type === 'open' || a.type === 'close') await patch('shops', s.id, {open:a.type === 'open'});
}
function chatStats(s) {
  const d0 = new Date(); d0.setHours(0, 0, 0, 0);
  const today = liveOrders(s.id).filter(o => tAt(o) >= d0.getTime());
  return {orders:today.length, sales:today.reduce((x, o) => x + o.total - (o.fee || 0), 0), pending:today.filter(o => o.status === 'pending').length};
}
function chatScroll() { const b = document.getElementById('wa-body'); if (b) b.scrollTop = b.scrollHeight; }

async function sChatSend(text) {
  const s = shopById(V.shopId); text = String(text || '').trim();
  if (!s || !text || V.chatBusy) return;
  V.chat.push({from:'me', text, at:Date.now()}); V.chatDraft = ''; V.chatBusy = true; chatSave(); render(); chatScroll();
  const products = S.products.filter(p => p.shopId === s.id);
  let actions = CMD.parseMessage(text, products);
  if (actions.length && actions.every(a => a.type === 'unknown')) { const ai = await claudeActions(text, products); if (ai.length) actions = ai; }
  const replies = [];
  for (const a of actions) {
    if (!['unknown', 'which', 'help', 'orders'].includes(a.type)) await chatApply(a, s);
    replies.push(CMD.replyFor(a, a.type === 'orders' ? {stats:chatStats(s)} : {}));
  }
  await new Promise(r => setTimeout(r, 650));
  V.chatBusy = false;
  V.chat.push({from:'bot', text:replies.join('\n\n') || CMD.HELP_TEXT, at:Date.now()});
  chatSave(); buzz(15); render(); chatScroll();
}
SUBMIT['s-chat'] = () => sChatSend(V.chatDraft || document.getElementById('s-chat-text')?.value);
Object.assign(ACT, {
  's-chip': v => sChatSend(v),
  's-chat-clear': () => { V.chat = [{from:'bot', text:CMD.HELP_TEXT, at:Date.now()}]; chatSave(); render(); },
});
document.addEventListener('input', e => { if (e.target.dataset && e.target.dataset.sbind2 === 'chatDraft') V.chatDraft = e.target.value; });
