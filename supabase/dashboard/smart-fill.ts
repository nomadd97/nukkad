// Supabase Edge Function: smart-fill
// The seller app sends the shopkeeper's text ("Blue notebook ₹40, 10 left"), this asks Gemini
// to turn it into clean product rows, and returns {products:[...]}.
// The AI key stays here on the server. It is never shipped inside the app.
//
// Deploy:  supabase functions deploy smart-fill --no-verify-jwt
// Key:     supabase secrets set GEMINI_API_KEY=your_key   (free key: https://aistudio.google.com/apikey)

const MODEL = Deno.env.get('GEMINI_MODEL') ?? 'gemini-flash-latest';
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {status, headers: {...cors, 'Content-Type': 'application/json'}});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', {headers: cors});
  if (req.method !== 'POST') return json({error: 'POST only'}, 405);
  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) return json({error: 'GEMINI_API_KEY is not set'}, 500);

  let prompt = '';
  try { prompt = String((await req.json()).prompt ?? '').slice(0, 6000); } catch { /* bad body */ }
  if (!prompt) return json({error: 'Send {"prompt": "..."}'}, 400);

  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      contents: [{role: 'user', parts: [{text: prompt}]}],
      generationConfig: {temperature: 0.1, responseMimeType: 'application/json'},
    }),
  });
  if (!r.ok) return json({error: 'AI request failed', status: r.status}, 502);
  const data = await r.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]';
  let products: unknown = [];
  try {
    const parsed = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, ''));
    products = Array.isArray(parsed) ? parsed : (parsed?.products ?? []);
  } catch { products = []; }
  return json({products});
});
