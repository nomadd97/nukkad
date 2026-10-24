// Supabase Edge Function: whatsapp-bot
// A shopkeeper sends a WhatsApp message to Nukkad's number ("blue pen out of stock").
// Meta forwards it here. We find the shop by the sender's phone number, read the message
// with our command reader (commands.js), ask Gemini only if the reader can't understand it,
// update the database, and reply on WhatsApp. Buyers' apps update live through Realtime.
//
// Deploy:   supabase functions deploy whatsapp-bot --no-verify-jwt
// Secrets:  supabase secrets set WHATSAPP_TOKEN=... WHATSAPP_PHONE_ID=... WHATSAPP_VERIFY_TOKEN=any-words-you-pick
//           (optional) WHATSAPP_APP_SECRET=...  -> checks that each message really came from Meta
//           (optional) GEMINI_API_KEY=...       -> understands messages the reader can't
// Twilio:   Messaging > WhatsApp sandbox > "When a message comes in" = the same URL (HTTP POST).
//           (optional) TWILIO_AUTH_TOKEN=... and TWILIO_WEBHOOK_URL=<that exact URL> -> checks each message came from Twilio
// Telegram: setWebhook to the same URL (see telegram() below). Optional TELEGRAM_SECRET=... checks each update.
// Meta app: WhatsApp > Configuration > Webhook URL = https://<project>.supabase.co/functions/v1/whatsapp-bot
//           Verify token = WHATSAPP_VERIFY_TOKEN, subscribe to "messages".

import { createClient } from 'npm:@supabase/supabase-js@2';
import { parseMessage, replyFor, HELP_TEXT } from '../_shared/commands.js';

const env = (k: string, d = '') => Deno.env.get(k) ?? d;
const GRAPH = `https://graph.facebook.com/${env('GRAPH_VERSION', 'v23.0')}`;
const db = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));

type Product = { id: string; name: string; stock?: number; price?: number; shopId?: string };
type Action = Record<string, any>;

async function send(to: string, body: string) {
  const r = await fetch(`${GRAPH}/${env('WHATSAPP_PHONE_ID')}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env('WHATSAPP_TOKEN')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: body.slice(0, 4000) } }),
  });
  if (!r.ok) console.error('WhatsApp send failed', r.status, await r.text());
}

// Only accept messages signed by Meta (when the app secret is set)
async function signedByMeta(req: Request, raw: string) {
  const secret = env('WHATSAPP_APP_SECRET');
  if (!secret) return true;
  const sig = req.headers.get('x-hub-signature-256') ?? '';
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(raw)));
  const hex = 'sha256=' + [...mac].map(b => b.toString(16).padStart(2, '0')).join('');
  if (hex.length !== sig.length) return false;
  let diff = 0;                                    // constant-time compare
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

// Gemini as a fallback for messages our reader didn't understand
async function askGemini(text: string, products: Product[]): Promise<Action[]> {
  const key = env('GEMINI_API_KEY');
  if (!key) return [];
  const prompt = `A small Indian shopkeeper sent this WhatsApp message to update their online shop. It may mix English, Hindi and Kannada.
Message: """${text.slice(0, 1000)}"""
Their products (id: name): ${products.map(p => `${p.id}: ${p.name}`).join('; ').slice(0, 6000)}
Reply with only a JSON array of actions, using only these shapes:
{"type":"stock","pid":"<id>","stock":<int>}  (out of stock = 0)
{"type":"restock","pid":"<id>","by":<int>}
{"type":"price","pid":"<id>","price":<number>}
{"type":"add","name":"<Title Case name>","price":<number>,"stock":<int>}
{"type":"open"} {"type":"close"} {"type":"orders"} {"type":"help"}
If you are not sure, return [].`;
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${env('GEMINI_MODEL', 'gemini-flash-latest')}:generateContent?key=${key}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0, responseMimeType: 'application/json' } }),
    });
    const j = await r.json();
    const out = JSON.parse(j?.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]');
    const ids = new Map(products.map(p => [p.id, p]));
    // Never trust the model blindly: keep only known shapes and real product ids
    return (Array.isArray(out) ? out : []).filter((a: Action) =>
      ['open', 'close', 'orders', 'help'].includes(a.type) ||
      (a.type === 'add' && typeof a.name === 'string' && Number(a.price) >= 0) ||
      (['stock', 'restock', 'price'].includes(a.type) && ids.has(a.pid))
    ).map((a: Action) => (a.pid ? { ...a, name: ids.get(a.pid)!.name } : a)).slice(0, 15);
  } catch (e) { console.error('Gemini failed', e); return []; }
}

const patch = (t: string, id: string, p: Record<string, unknown>) => db.rpc('nk_patch', { t, doc_id: id, patch: p });

async function apply(a: Action, shop: Record<string, any>, products: Product[]) {
  const now = Date.now();
  const p = products.find(x => x.id === a.pid);
  switch (a.type) {
    case 'stock': await patch('products', a.pid, { stock: Math.max(0, a.stock | 0), via: 'whatsapp', viaAt: now }); break;
    case 'restock': a.after = Math.max(0, Number(p?.stock ?? 0) + (a.by | 0)); await patch('products', a.pid, { stock: a.after, via: 'whatsapp', viaAt: now }); break;
    case 'price': await patch('products', a.pid, { price: Math.max(0, Number(a.price)), via: 'whatsapp', viaAt: now }); break;
    case 'add': {
      const id = 'p' + now.toString(36) + Math.random().toString(36).slice(2, 5);
      await db.from('nk_products').insert({ id, data: { shopId: shop.id, name: a.name, category: shop.category, price: Number(a.price), stock: a.stock | 0, desc: '', active: true, at: now, via: 'whatsapp', viaAt: now } });
      break;
    }
    case 'open': case 'close': await patch('shops', shop.id, { open: a.type === 'open' }); break;
  }
}

async function todayStats(shopId: string) {
  const { data } = await db.from('nk_orders').select('data').eq('data->>shopId', shopId).limit(1000);
  const IST = 5.5 * 36e5, d = new Date(Date.now() + IST); d.setUTCHours(0, 0, 0, 0);
  const since = d.getTime() - IST;                  // midnight in India
  const rows = (data ?? []).map((r: any) => r.data).filter((o: any) => o.status !== 'cancelled' && (o.at ?? Date.now() - (o.agoH ?? 999) * 36e5) >= since);
  return { orders: rows.length, sales: rows.reduce((s: number, o: any) => s + (o.total || 0) - (o.fee || 0), 0), pending: rows.filter((o: any) => o.status === 'pending').length };
}

// Works out the reply for one message. Returns the text; the caller decides how to send it
// (Meta: we call the Graph API; Twilio: we answer the webhook with TwiML; Telegram: we answer with JSON).
async function handle(from: string, text: string): Promise<string> {
  const { data: shops } = await db.from('nk_shops').select('id,data').eq('data->>whatsapp', from).limit(1);
  if (!shops?.length) {
    return 'Namaste! This WhatsApp number is not linked to a Nukkad shop yet. Open Nukkad for Shops, register your shop with this number, then message me again.';
  }
  return handleShop({ ...shops[0].data, id: shops[0].id }, text);
}
async function handleShop(shop: Record<string, any>, text: string): Promise<string> {
  const { data: rows } = await db.from('nk_products').select('id,data').eq('data->>shopId', shop.id).limit(2000);
  const products: Product[] = (rows ?? []).map((r: any) => ({ ...r.data, id: r.id }));

  let actions = parseMessage(text, products) as Action[];
  if (actions.length && actions.every(a => a.type === 'unknown')) {
    const ai = await askGemini(text, products);
    if (ai.length) actions = ai;
  }
  const replies: string[] = [];
  for (const a of actions) {
    if (!['unknown', 'which', 'help', 'orders'].includes(a.type)) await apply(a, shop, products);
    replies.push(replyFor(a, a.type === 'orders' ? { stats: await todayStats(shop.id) } : {}));
  }
  return replies.join('\n\n') || replyFor({ type: 'help' });
}

// ---------- Telegram (same brain, free, no business verification) ----------
// Set once:  https://api.telegram.org/bot<TOKEN>/setWebhook?url=<this function URL>&secret_token=<TELEGRAM_SECRET>
// A chat is linked to a shop when the shopkeeper taps "Share my number" and it matches the shop's saved number.
const phoneDigits = (v: string) => { let d = String(v || '').replace(/\D/g, ''); if (d.length === 10) d = '91' + d; return d; };
async function telegram(req: Request, body: any) {
  const secret = env('TELEGRAM_SECRET');
  if (secret && req.headers.get('x-telegram-bot-api-secret-token') !== secret) return new Response('Forbidden', { status: 403 });
  const m = body.message ?? body.edited_message;
  if (!m?.chat?.id) return new Response('ok');
  const chat = String(m.chat.id);
  const say = (text: string, extra: Record<string, unknown> = {}) =>
    Response.json({ method: 'sendMessage', chat_id: m.chat.id, text: text.slice(0, 4000), ...extra });
  const askForNumber = { reply_markup: { keyboard: [[{ text: '📱 Share my number', request_contact: true }]], resize_keyboard: true, one_time_keyboard: true } };
  try {
    if (m.contact) {
      if (m.contact.user_id !== m.from?.id) return say('Please share your own number with the button below.', askForNumber);
      const phone = phoneDigits(m.contact.phone_number);
      const { data: shops } = await db.from('nk_shops').select('id,data').eq('data->>whatsapp', phone).limit(1);
      if (!shops?.length) return say('This number is not linked to a Nukkad shop. Register your shop in Nukkad for Shops with this number, then try again.', { reply_markup: { remove_keyboard: true } });
      await db.rpc('nk_patch', { t: 'shops', doc_id: shops[0].id, patch: { telegram: chat } });
      return say(`✅ Linked to ${shops[0].data.name}.\n\n` + HELP_TEXT, { reply_markup: { remove_keyboard: true } });
    }
    const { data: shops } = await db.from('nk_shops').select('id,data').eq('data->>telegram', chat).limit(1);
    if (!shops?.length) return say('Namaste! I update your Nukkad shop when you message me. First, tap the button below to share your phone number. If it matches your shop, this chat gets linked.', askForNumber);
    const text = String(m.text ?? '').replace(/^\/(start|help)\b.*/i, 'help');
    return say(await handleShop({ ...shops[0].data, id: shops[0].id }, text || 'help'));
  } catch (e) {
    console.error('telegram failed', e);
    return say('Sorry, something went wrong. Please try again.');
  }
}

// ---------- Twilio WhatsApp (sandbox or approved sender) ----------
// Twilio posts a form: From=whatsapp:+919876543210, Body=<text>. We answer with TwiML.
const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
async function signedByTwilio(req: Request, params: URLSearchParams) {
  const token = env('TWILIO_AUTH_TOKEN');
  if (!token) return true;                                  // optional, like the Meta check
  const url = env('TWILIO_WEBHOOK_URL', req.url);           // must be the exact URL set in Twilio
  const data = url + [...params.keys()].sort().map(k => k + params.get(k)).join('');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(token), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data)));
  return btoa(String.fromCharCode(...mac)) === (req.headers.get('x-twilio-signature') ?? '');
}
async function twilio(req: Request, raw: string) {
  const params = new URLSearchParams(raw);
  if (!(await signedByTwilio(req, params))) return new Response('Bad signature', { status: 401 });
  const from = (params.get('From') ?? '').replace(/^whatsapp:/, '').replace(/\D/g, '');   // -> 919876543210
  const text = params.get('Body') ?? '';
  let reply = '';
  try { reply = from && text ? await handle(from, text) : replyFor({ type: 'help' }); }
  catch (e) { console.error('twilio handle failed', e); reply = 'Sorry, something went wrong. Please try again.'; }
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${xml(reply.slice(0, 1500))}</Message></Response>`,
    { headers: { 'Content-Type': 'text/xml' } });
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  if (req.method === 'GET') {                       // Meta checks the webhook once when you connect it
    const ok = url.searchParams.get('hub.mode') === 'subscribe' && url.searchParams.get('hub.verify_token') === env('WHATSAPP_VERIFY_TOKEN');
    return ok ? new Response(url.searchParams.get('hub.challenge') ?? '') : new Response('Forbidden', { status: 403 });
  }
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const raw = await req.text();
  if ((req.headers.get('content-type') ?? '').includes('application/x-www-form-urlencoded')) return twilio(req, raw);
  let body: any = {};
  try { body = JSON.parse(raw); } catch { return new Response('ok'); }
  if (body && typeof body.update_id === 'number') return telegram(req, body);
  if (!(await signedByMeta(req, raw))) return new Response('Bad signature', { status: 401 });
  const msgs = (body.entry ?? []).flatMap((e: any) => (e.changes ?? []).flatMap((c: any) => c.value?.messages ?? []));
  const work = msgs.filter((m: any) => m.type === 'text' && m.from && m.text?.body).map((m: any) => handle(m.from, m.text.body).then(r => send(m.from, r)).catch(e => console.error('handle failed', e)));
  await Promise.all(work);
  return new Response('ok');                        // always 200, or Meta keeps retrying
});
