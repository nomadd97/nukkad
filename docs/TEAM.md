# Team Nukkad: who owns what

Four people, four areas. "Owns" means: knows it well enough to explain it, test it, and fix small things in it.
The git history shows who wrote which commits; this page shows who stands behind which part.

| Member | USN | Area | Layer |
|---|---|---|---|
| Daniel C Acharya | 01FE25BCA281 | Database, server functions, WhatsApp bot, deployment | Backend + integration |
| Vinuta Yalagi | 01FE25BCA284 | Buyer app: search, languages, voice, cart, UPI | Frontend |
| A S Sanika | 01FE24BCA082 | Shop app: orders, stock, offers, QR poster, ratings | Frontend |
| Tulsi | 01FE25BCA278 | Demo data, testing, docs, live demo | Quality + product |

## Where the layers meet (full-stack features)

| Feature | Frontend part (file) | Backend part (file) | Explained by |
|---|---|---|---|
| Place an order, no overselling | cart and checkout (`src/70-customer.js`) | `nk_place_order` (`supabase/schema.sql`) | Vinuta (screen) + Daniel (database step) |
| Order appears on the shop phone | order list (`src/80-seller.js`) | Supabase Realtime | Sanika + Daniel |
| Update stock by WhatsApp | chat tab (`src/85-whatsapp.js`) | `commands.js`, `whatsapp-bot` function | Sanika (chat) + Daniel (bot) |
| Hindi / Kannada | `t()` and `tools/i18n.tsv` (`src/05-i18n.js`) | none (all in the app) | Vinuta |
| Shop-funded offers | offer screen (`src/80-seller.js`) | offers table, applied at checkout | Sanika |
| Seed data near KLE Tech | n/a | `src/22-seed-hubli.js`, `supabase/seed.sql` | Tulsi |

## Small jobs for this morning (real, checkable)

- **Vinuta:** open the buyer app in Kannada and Hindi, go through search, cart and UPI screens, and note any wrong or odd translation. Fix any she finds in `tools/i18n.tsv`.
- **Sanika:** log in to the shop app (Vidya Stationers, PIN 1234), accept an order, change a price, make an offer, print the QR poster. Note anything confusing.
- **Tulsi:** run the full demo script on her own phone, install the app to the home screen, and write down every bug or slow step. Check the shop names and products near KLE Tech look realistic.
- **Daniel:** WhatsApp number setup with Meta, final deploy, and answering backend questions.

## Rule for the judges

Say what is true. If a judge asks "who built this part?", answer with the owner and what they actually did. Everyone should be able to tell the one-order story in the Team Guide.
