# Team Nukkad: who owns what

Four people, two layers, with pairs where the layers meet.
"Owns" means: knows it well enough to explain it, test it, and fix small things in it.
The git history shows who wrote which commits; this page shows who stands behind which part.

| Member | USN | Layer | Owns |
|---|---|---|---|
| Vinuta Yalagi | 01FE25BCA284 | Frontend | **Buyer app**: search, Hindi/Kannada, voice, cart, UPI (`src/70-customer.js`, `src/05-i18n.js`, `tools/i18n.tsv`) |
| Tulsi | 01FE25BCA278 | Frontend | **Shop app screens**: orders, stock, offers, QR poster, ratings, install/PWA, logo (`src/80-seller.js`, `assets/`, `icons/`) |
| Daniel C Acharya | 01FE25BCA281 | Team lead, backend + integration | **Whole-system story and demo**, plus WhatsApp bot and chat tab, Smart Fill (AI), message reader, deployment (Vercel, Supabase, Meta) (`supabase/functions/`, `src/30-data.js`, `src/85-whatsapp.js`) |
| A S Sanika | 01FE24BCA082 | Backend | **Database**: tables, locked checkout, PIN security, realtime, seed data (`supabase/schema.sql`, `supabase/seed.sql`, `src/22-seed-hubli.js`) |

## Where frontend meets backend (the full-stack features)

Each feature is explained by a pair: one person for the screen, one for what runs behind it.

| Feature | Screen (frontend) | Behind it (backend) | Explained by |
|---|---|---|---|
| Place an order, no overselling | cart and checkout | `nk_place_order` locks stock | Vinuta + Sanika |
| Order appears on the shop phone | shop order list | Supabase Realtime | Tulsi + Sanika |
| Update stock by WhatsApp (chat tab + bot) | chat tab in the shop app | `whatsapp-bot` and `commands.js` | Daniel |
| Hindi / Kannada | `t()` translations, voice search | Hindi/Kannada words in `commands.js` | Vinuta + Daniel |
| Shop login with a PIN | PIN screen | `nk_login`, hashed PINs | Tulsi + Sanika |
| Smart Fill (AI adds product details) | add-product form | `smart-fill` function (Gemini) | Daniel |

## Small jobs for this morning (real and checkable)

- **Vinuta:** open the buyer app in Kannada and Hindi, go through search, cart and UPI, note any odd translation, and fix it in `tools/i18n.tsv`.
- **Tulsi:** log in to the shop app (Vidya Stationers, PIN 1234), accept an order, change a price, make an offer, print the QR poster, install the app to the home screen. Write down every bug. Practise showing the shop side of the demo.
- **Sanika:** in the Supabase SQL editor, run two orders for the last item and watch the second one get refused. Try a wrong PIN. Check the 6 demo shops near KLE Tech look right in `seed.sql`.
- **Daniel:** leads the demo and the Q&A, knows the whole system end to end, WhatsApp number setup with Meta, final deploy.

## Rule for the judges

Say what is true. If a judge asks "who built this part?", answer with what you actually did and what you tested, and say who wrote the first version if it was someone else. Everyone should be able to tell the one-order story in the Team Guide.
