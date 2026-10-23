/* Nukkad 3.0.0 · built from src/ by tools/build.py */
(() => {
'use strict';

const H = 3600e3, DAY = 24 * H;
const LKEY = 'nukkad-apps-v3';
const CATS = ['Stationery','Grocery','Clothing','Electronics','Handicrafts','Pharmacy','Bakery','Books','Home','Other'];
const CFG = Object.assign({supabaseUrl:'', supabaseKey:'', publicUrl:'', smartFillFunction:'smart-fill'}, window.NK_CONFIG || {});
const IN_CLAUDE = !!(window.claude && typeof window.claude.use === 'function');
const APP = () => {
  const fixed = document.body && document.body.dataset.app;
  if (fixed) return fixed;
  return location.hash.replace('#', '') === 'seller' ? 'seller' : 'customer';
};


/* ---------- Languages ----------
   Keys are the English text. The build fills I18N from tools/i18n.tsv.
   Missing words fall back to English, so nothing ever shows blank. */
const LANGS = {
  en:{name:'English', short:'EN', code:'en', voice:'en-IN', sample:'Order from your street', hello:'Language: English'},
  hi:{name:'हिंदी', short:'हि', code:'hi', voice:'hi-IN', sample:'अपनी गली से ऑर्डर करें', hello:'भाषा: हिंदी'},
  kn:{name:'ಕನ್ನಡ', short:'ಕ', code:'kn', voice:'kn-IN', sample:'ನಿಮ್ಮ ಬೀದಿಯಿಂದ ಆರ್ಡರ್ ಮಾಡಿ', hello:'ಭಾಷೆ: ಕನ್ನಡ'},
};
const I18N = {"hi":{"Couldn’t save that. Check your connection and try again.":"सेव नहीं हुआ। इंटरनेट देखकर फिर से कोशिश करें।","Live sync isn’t open to your account, so you’re using a demo copy on this device.":"आपके अकाउंट पर लाइव सिंक चालू नहीं है, इसलिए इस फ़ोन पर डेमो कॉपी चल रही है।","Couldn’t place the order. Check your connection and try again.":"ऑर्डर नहीं हो पाया। इंटरनेट देखकर फिर से कोशिश करें।","Only {n} left of {name}. Lower the quantity.":"{name} के सिर्फ़ {n} बचे हैं। संख्या कम करें।","Live sync dropped. You’re on a demo copy on this device now.":"लाइव सिंक टूट गया। अब इस फ़ोन पर डेमो कॉपी चल रही है।","Couldn’t reach the live database. Showing a demo copy.":"लाइव डेटाबेस से जुड़ नहीं पाए। डेमो कॉपी दिखा रहे हैं।","Out of stock":"स्टॉक ख़त्म","Only {n} left":"सिर्फ़ {n} बचे","In stock":"स्टॉक में है","Order placed":"ऑर्डर हो गया","Sent to the shop":"दुकान को भेजा गया","Accepted by shop":"दुकान ने मान लिया","They’re packing it now":"अभी पैक हो रहा है","Out for delivery":"डिलीवरी के लिए निकला","Ready for pickup":"लेने के लिए तैयार","On its way to you":"आपके पास आ रहा है","Collect it from the shop":"दुकान से ले लीजिए","Delivered":"पहुँच गया","Picked up":"ले लिया","Thank you for shopping local":"अपनी गली से ख़रीदने के लिए धन्यवाद","Cancelled":"रद्द","New":"नया","Free delivery above {min}":"{min} से ऊपर फ़्री डिलीवरी","{pct}% off above {min}":"{min} से ऊपर {pct}% छूट","up to {max}":"{max} तक","From {shop}, a shop you like":"{shop} से, जो आपको पसंद है","Because you buy {cat}":"क्योंकि आप {cat} ख़रीदते हैं","Popular near you":"आपके पास लोकप्रिय","Today":"आज","Tomorrow":"कल","As soon as possible":"जितनी जल्दी हो सके","New order from {name}":"{name} का नया ऑर्डर","{shop} couldn’t take order {id}.":"{shop} ऑर्डर {id} नहीं ले पाई।","The shop":"दुकान","Orders sync across devices":"ऑर्डर हर फ़ोन पर सिंक होते हैं","Live":"लाइव","Syncing":"सिंक हो रहा है","Changes stay on this device":"बदलाव इसी फ़ोन पर रहेंगे","Demo":"डेमो","Change language":"भाषा बदलें","Choose language":"भाषा चुनें","Shop and product names stay as the shop wrote them.":"दुकान और सामान के नाम वैसे ही रहेंगे जैसे दुकान ने लिखे हैं।","Main":"मुख्य","Installed! Find Nukkad on your home screen.":"इंस्टॉल हो गया! होम स्क्रीन पर Nukkad देखें।","Install {app} on your phone":"{app} को अपने फ़ोन में इंस्टॉल करें","Opens full screen, like any app.":"बाक़ी ऐप की तरह पूरी स्क्रीन पर खुलता है।","Tap Share, then “Add to Home Screen”.":"Share दबाएँ, फिर “Add to Home Screen”।","Install":"इंस्टॉल","Hide":"छुपाएँ","Closed":"बंद","Sold out":"बिक गया","Add":"जोड़ें","ADD":"जोड़ें","One less":"एक कम","One more":"एक और","min":"मिनट","Closed now":"अभी बंद","Local Gem":"लोकल जेम","Remove from favourites":"पसंद से हटाएँ","Save to favourites":"पसंद में रखें","Your area":"आपका इलाक़ा","All areas":"सारे इलाक़े","Search notebook, saree, toor dal…":"नोटबुक, साड़ी, तूर दाल खोजें…","Search products near you":"अपने पास सामान खोजें","Search by voice":"बोलकर खोजें","Search":"खोजें","{n} items":"{n} सामान","View bag":"थैला देखें","Home":"होम","Saved":"सेव किए","Orders":"ऑर्डर","Namaste":"नमस्ते","What do you need from your street today?":"आज अपनी गली से क्या चाहिए?","Highlights":"ख़ास","Ready in about 20 minutes":"लगभग 20 मिनट में तैयार","Order from shops on your street. Pick it up on your way home.":"अपनी गली की दुकानों से ऑर्डर करें। घर जाते हुए ले लें।","Explore shops":"दुकानें देखें","Discover Local Gems":"लोकल जेम खोजें","{shop} and other small shops near you.":"{shop} और आपके पास की दूसरी छोटी दुकानें।","Small shops near you that deserve a visit.":"पास की छोटी दुकानें जो देखने लायक़ हैं।","Visit {shop}":"{shop} देखें","Your money stays on your street":"आपका पैसा आपकी गली में रहता है","Zero commission. Pay the shop directly by UPI or cash.":"ज़ीरो कमीशन। दुकान को सीधे UPI या कैश से पैसे दें।","Start shopping":"ख़रीदारी शुरू करें","Offers from shops":"दुकानों के ऑफ़र","Paid by the shop, not hidden in prices":"दुकान देती है, दाम में छुपा नहीं","Recommended for you":"आपके लिए सुझाव","Picked for you":"आपके लिए चुना","Based on what you like":"आपकी पसंद के हिसाब से","Your favourites":"आपकी पसंद","See all":"सब देखें","Local Gems":"लोकल जेम","Small shops worth a visit":"देखने लायक़ छोटी दुकानें","Hidden gem":"छुपा हीरा","Ordered this month":"इस महीने ऑर्डर हुए","{n} sold":"{n} बिके","Now or pick a time":"अभी या समय चुनें","Pickup or shop delivery":"ख़ुद लें या दुकान डिलीवरी","Pay the shop by UPI":"दुकान को UPI से पैसे दें","All shops":"सारी दुकानें","Shops in {area}":"{area} की दुकानें","{n} shops":"{n} दुकानें","No shops here yet":"यहाँ अभी कोई दुकान नहीं","Pick another area at the top.":"ऊपर दूसरा इलाक़ा चुनें।","Own a shop?":"आपकी दुकान है?","Open Nukkad for Shops. Free, no commission.":"Nukkad for Shops खोलें। मुफ़्त, कोई कमीशन नहीं।","Find it on your street":"अपनी गली में ढूँढें","Type or tap the mic. English, हिंदी or ಕನ್ನಡ all work.":"लिखें या माइक दबाएँ। English, हिंदी या ಕನ್ನಡ सब चलेगा।","Recent":"हाल के","Clear":"हटाएँ","Try these":"ये आज़माएँ","New search":"नई खोज","{n} results":"{n} नतीजे","Sort":"क्रम","Best match":"सबसे सही","Lowest price":"सबसे कम दाम","Top rated":"सबसे अच्छी रेटिंग","In stock now":"अभी स्टॉक में","No shop here has this yet":"यहाँ किसी दुकान में अभी यह नहीं है","We’ve told shops nearby that people want “{q}”. Try another area, or check back soon.":"हमने पास की दुकानों को बता दिया है कि लोगों को “{q}” चाहिए। दूसरा इलाक़ा देखें या थोड़ी देर बाद आएँ।","Search all areas":"सारे इलाक़ों में खोजें","Compare {n} shops":"{n} दुकानों की तुलना","Best price":"सबसे अच्छा दाम","Nothing here yet":"यहाँ अभी कुछ नहीं","Try “All areas” at the top.":"ऊपर “सारे इलाक़े” चुनें।","This shop isn’t listed any more":"यह दुकान अब लिस्ट में नहीं है","Back to results":"नतीजों पर वापस","{n} ratings":"{n} रेटिंग","no ratings yet":"अभी कोई रेटिंग नहीं","pickup ready":"में तैयार","Pickup":"ख़ुद लें","min delivery":"मिनट में डिलीवरी","only":"सिर्फ़","This shop is closed right now. You can look around and order once they open.":"यह दुकान अभी बंद है। आप देख सकते हैं, खुलने पर ऑर्डर करें।","Pay by UPI or cash":"UPI या कैश से दें","Filter":"फ़िल्टर","All items":"सारा सामान","No products listed yet":"अभी कोई सामान नहीं डाला","What customers say":"ग्राहक क्या कहते हैं","Your bag":"आपका थैला","Close":"बंद करें","each":"हर एक","Often bought together":"अक्सर साथ में ख़रीदे जाते हैं","{offer} applied. You save {amt}.":"{offer} लग गया। आपकी {amt} की बचत।","Add {amt} more to get: {offer}":"{amt} का और सामान जोड़ें और पाएँ: {offer}","How do you want it?":"कैसे चाहिए?","Pick up":"ख़ुद लें","Free":"मुफ़्त","Delivery":"डिलीवरी","Not offered":"उपलब्ध नहीं","When?":"कब?","Now":"अभी","Your name":"आपका नाम","Phone":"फ़ोन","so the shop can reach you":"ताकि दुकान आपसे बात कर सके","Delivery address":"डिलीवरी का पता","Note for the shop":"दुकान के लिए नोट","optional":"ज़रूरी नहीं","e.g. Please pack separately":"जैसे: अलग से पैक करें","Items":"सामान","Shop offer":"दुकान का ऑफ़र","Nukkad fee":"Nukkad फ़ीस","To pay the shop":"दुकान को देना है","Place order":"ऑर्डर करें","Pay {shop} by UPI after ordering, or cash at pickup.":"ऑर्डर के बाद {shop} को UPI से दें, या लेते समय कैश दें।","Start a new bag?":"नया थैला शुरू करें?","Your bag has items from {a}. Each order goes to one shop, so we’ll clear it and add this from {b}.":"आपके थैले में {a} का सामान है। हर ऑर्डर एक दुकान को जाता है, इसलिए उसे हटाकर {b} का यह सामान जोड़ देंगे।","Keep my bag":"मेरा थैला रखें","Start new bag":"नया थैला शुरू करें","All done":"हो गया","On the way":"रास्ते में","Go pick it up":"जाकर ले लें","Scheduled for {when}":"{when} के लिए तय","Waiting for the shop to accept":"दुकान के मानने का इंतज़ार","Packing your order":"आपका ऑर्डर पैक हो रहा है","Delivery in about {r} min":"लगभग {r} मिनट में डिलीवरी","Usually ready in about {n} min":"आमतौर पर लगभग {n} मिनट में तैयार","Updated {ago}":"{ago} अपडेट हुआ","Payment received by the shop":"दुकान को पैसे मिल गए","Pay {amt} by cash when you collect it.":"लेते समय {amt} कैश में दें।","You marked this as paid. The shop will confirm.":"आपने 'पैसे दिए' बताया है। दुकान पक्का करेगी।","Pay with GPay / PhonePe / Paytm":"GPay / PhonePe / Paytm से दें","Paying from another phone? Show QR":"दूसरे फ़ोन से दे रहे हैं? QR दिखाएँ","Money goes straight to {upi}. Nukkad never touches it.":"पैसा सीधे {upi} को जाता है। Nukkad उसे छूता भी नहीं।","(Demo UPI ID. It won’t accept money.)":"(डेमो UPI ID है। इसमें पैसे नहीं जाएँगे।)","I’ve paid":"मैंने पैसे दे दिए","Thanks for rating!":"रेटिंग के लिए धन्यवाद!","How was {shop}?":"{shop} कैसी लगी?","Rating":"रेटिंग","stars":"स्टार","Say something nice (optional)":"कुछ अच्छा लिखें (ज़रूरी नहीं)","Send rating":"रेटिंग भेजें","Tap a star. It helps small shops get found.":"एक स्टार दबाएँ। इससे छोटी दुकानें लोगों तक पहुँचती हैं।","My orders":"मेरे ऑर्डर","Order not found":"ऑर्डर नहीं मिला","the shop":"दुकान","Nothing was charged. Your items went back on the shelf.":"कोई पैसा नहीं कटा। सामान वापस रख दिया गया।","This page updates by itself.":"यह पेज अपने आप अपडेट होता है।","Delivery to {addr}":"{addr} पर डिलीवरी","Pickup from {place}":"{place} से लें","Send a copy on WhatsApp":"WhatsApp पर कॉपी भेजें","Preview the message":"मैसेज देखें","Order again":"फिर से ऑर्डर करें","Keep shopping":"और ख़रीदें","Shop":"दुकान","Track order":"ऑर्डर देखें","Rate":"रेटिंग दें","No orders yet":"अभी कोई ऑर्डर नहीं","Find something on your street and track it live here.":"अपनी गली से कुछ ढूँढें और यहाँ लाइव देखें।","Past orders":"पुराने ऑर्डर","Saved shops":"सेव की गई दुकानें","No saved shops yet":"अभी कोई दुकान सेव नहीं","Tap the heart on a shop to keep it here.":"दुकान पर दिल दबाएँ, वह यहाँ आ जाएगी।","Browse shops":"दुकानें देखें","Order placed!":"ऑर्डर हो गया!","{shop} has it":"{shop} के पास है","Your bag is empty.":"आपका थैला ख़ाली है।","{shop} is closed right now. Try again once they open.":"{shop} अभी बंद है। खुलने पर फिर कोशिश करें।","Add your name so the shop knows who it’s for.":"अपना नाम डालें ताकि दुकान को पता चले किसका है।","Check the phone number. It needs 10 digits.":"फ़ोन नंबर देखें। 10 अंक चाहिए।","Add a delivery address.":"डिलीवरी का पता डालें।","Those items are out of stock right now.":"ये सामान अभी स्टॉक में नहीं हैं।","{n} out-of-stock items were left out.":"स्टॉक में न होने से {n} सामान छोड़ दिए गए।","Allow the microphone to search by voice.":"बोलकर खोजने के लिए माइक की अनुमति दें।","Listening… say a product":"सुन रहे हैं… सामान का नाम बोलें","Voice search isn’t available here. Try typing.":"यहाँ बोलकर खोजना नहीं चलता। लिखकर खोजें।","Removed from favourites":"पसंद से हटा दिया","Saved to favourites":"पसंद में रख लिया","Started a new bag":"नया थैला शुरू किया","Thanks! The shop will confirm your payment.":"धन्यवाद! दुकान आपका पेमेंट पक्का करेगी।","Thanks! Your rating helps small shops get found.":"धन्यवाद! आपकी रेटिंग से छोटी दुकानें आगे आती हैं।","for shops":"दुकानों के लिए","Open":"खुला","Products":"सामान","Insights":"जानकारी","Shop login":"दुकान लॉगिन","Your shop, organised.":"आपकी दुकान, सब व्यवस्थित।","Orders, stock and what your street is searching for, in one place. No commission.":"ऑर्डर, स्टॉक और आपकी गली क्या खोज रही है, सब एक जगह। कोई कमीशन नहीं।","Enter your 4-digit PIN":"अपना 4 अंकों का PIN डालें","demo PIN 1234":"डेमो PIN 1234","That PIN doesn’t match. Try again.":"PIN ग़लत है। फिर से डालें।","Delete":"मिटाएँ","Change shop":"दुकान बदलें","Pick your shop":"अपनी दुकान चुनें","Register a new shop":"नई दुकान जोड़ें","Open the customer app":"ग्राहक ऐप खोलें","Back to login":"लॉगिन पर वापस","Put your shop online":"अपनी दुकान ऑनलाइन लाएँ","Takes two minutes. Free, and you keep every rupee you sell.":"दो मिनट लगते हैं। मुफ़्त, और हर रुपया आपका।","Shop name":"दुकान का नाम","e.g. Lakshmi Stores":"जैसे Lakshmi Stores","What do you sell?":"आप क्या बेचते हैं?","Area":"इलाक़ा","Address":"पता","WhatsApp number":"WhatsApp नंबर","UPI ID":"UPI ID","optional, for online payments":"ज़रूरी नहीं, ऑनलाइन पेमेंट के लिए","One line about your shop":"अपनी दुकान के बारे में एक लाइन","Choose a 4-digit PIN":"4 अंकों का PIN चुनें","Create my shop":"मेरी दुकान बनाएँ","Accept order":"ऑर्डर मानें","Send out for delivery":"डिलीवरी के लिए भेजें","Mark ready for pickup":"लेने के लिए तैयार करें","Mark delivered":"पहुँच गया करें","Mark picked up":"ले लिया करें","Deliver to {addr}":"{addr} पर पहुँचाएँ","Paid":"पैसे मिले","Customer says paid by UPI":"ग्राहक ने कहा UPI से दिया","Pay on pickup":"लेते समय पैसे","Tap again to decline":"मना करने के लिए फिर दबाएँ","Decline":"मना करें","Mark paid":"पैसे मिले करें","All caught up":"सब हो गया","New orders pop up here with a chime the moment someone orders.":"कोई ऑर्डर करते ही नया ऑर्डर घंटी के साथ यहाँ आता है।","Nothing in progress":"अभी कुछ चल नहीं रहा","Accepted orders wait here until they’re picked up or delivered.":"माने हुए ऑर्डर यहाँ रहते हैं जब तक लिए या पहुँचाए न जाएँ।","No finished orders yet":"अभी कोई पूरा ऑर्डर नहीं","Completed and declined orders show up here.":"पूरे और मना किए ऑर्डर यहाँ दिखते हैं।","Your shop shows as Closed to customers. Tap the switch at the top to open.":"ग्राहकों को आपकी दुकान बंद दिख रही है। खोलने के लिए ऊपर स्विच दबाएँ।","Waiting":"इंतज़ार में","to accept":"मानने हैं","{n} orders":"{n} ऑर्डर","Get a notification for every new order":"हर नए ऑर्डर पर नोटिफ़िकेशन पाएँ","{n} new orders waiting for you":"{n} नए ऑर्डर आपका इंतज़ार कर रहे हैं","Order status":"ऑर्डर की स्थिति","In progress":"चल रहे","Done":"पूरे","Add products":"सामान जोड़ें","Smart fill · AI":"स्मार्ट फ़िल · AI","Smart fill":"स्मार्ट फ़िल","Type them like you’d text a customer, one per line.":"जैसे ग्राहक को मैसेज करते हैं वैसे लिखें, एक लाइन में एक।","Or snap a photo.":"या फ़ोटो खींचें।","Products to add":"जोड़ने वाला सामान","Remove photo":"फ़ोटो हटाएँ","Reading…":"पढ़ रहे हैं…","Fill for me":"मेरे लिए भरें","Photo":"फ़ोटो","Try a sample":"नमूना आज़माएँ","Product":"सामान","Price":"दाम","Stock":"स्टॉक","Remove":"हटाएँ","Add {n} to my shop":"{n} सामान दुकान में जोड़ें","Row":"लाइन","Discard":"छोड़ें","Add one by hand":"ख़ुद एक जोड़ें","In my shop":"मेरी दुकान में","{a} live · {b} running low":"{a} चालू · {b} कम बचे","Find a product":"सामान ढूँढें","Visible to customers":"ग्राहकों को दिखता है","The switch hides a product from customers without deleting it.":"स्विच सामान को बिना मिटाए ग्राहकों से छुपा देता है।","orders":"ऑर्डर","Sales, 7 days":"बिक्री, 7 दिन","paid to you directly":"सीधे आपको मिले","Sales this week":"इस हफ़्ते की बिक्री","Demand Radar":"डिमांड रडार","days":"दिन","People near you searched for these and no shop had them.":"आपके पास लोगों ने ये खोजा और किसी दुकान में नहीं मिला।","{n} searches":"{n} बार खोजा","Stock the top one and those buyers will find you first.":"सबसे ऊपर वाला रखें, वो ग्राहक सबसे पहले आपको पाएँगे।","No missed searches this week.":"इस हफ़्ते कोई खोज ख़ाली नहीं गई।","Ratings":"रेटिंग","Ratings from customers will show here.":"ग्राहकों की रेटिंग यहाँ दिखेगी।","Running low":"कम बचे","3 or fewer":"3 या कम","Everything is well stocked.":"सब कुछ भरपूर है।","Top sellers":"सबसे ज़्यादा बिके","Your first sales will show here.":"आपकी पहली बिक्री यहाँ दिखेगी।","Offers":"ऑफ़र","You fund them, so keep them small":"पैसा आपका है, इसलिए छोटे रखें","Used {n} times":"{n} बार इस्तेमाल हुआ","Offer on":"ऑफ़र चालू","No offers yet. A small offer helps new customers try you.":"अभी कोई ऑफ़र नहीं। छोटा ऑफ़र नए ग्राहक लाता है।","Offer type":"ऑफ़र का प्रकार","Discount":"छूट","Free delivery":"फ़्री डिलीवरी","Minimum order":"कम से कम ऑर्डर","Max discount":"ज़्यादा से ज़्यादा छूट","Worst case you give {amt} off an order of {min} or more.":"ज़्यादा से ज़्यादा आप {min} या उससे बड़े ऑर्डर पर {amt} छूट देंगे।","You skip the delivery fee on orders of {min} or more.":"{min} या उससे बड़े ऑर्डर पर डिलीवरी फ़ीस नहीं लेंगे।","Start this offer":"यह ऑफ़र शुरू करें","Your shop link":"आपकी दुकान का लिंक","QR poster":"QR पोस्टर","Share it on WhatsApp status and Instagram. Customers open it and order.":"WhatsApp स्टेटस और Instagram पर डालें। ग्राहक खोलकर ऑर्डर करेंगे।","Copy link":"लिंक कॉपी करें","Orders, delivery and payment":"ऑर्डर, डिलीवरी और पेमेंट","customers pay you here directly":"ग्राहक यहीं सीधे पैसे देंगे","This is a demo ID. Put your real UPI ID to receive money.":"यह डेमो ID है। पैसे पाने के लिए अपनी असली UPI ID डालें।","Pickup ready in":"लेने के लिए तैयार","Delivery within":"डिलीवरी इतने में","We deliver nearby":"हम पास में डिलीवरी करते हैं","Delivery fee":"डिलीवरी फ़ीस","Live: orders from any phone arrive here instantly, with a chime.":"लाइव: किसी भी फ़ोन से ऑर्डर तुरंत घंटी के साथ यहाँ आते हैं।","Demo copy: changes stay on this device. Open the customer app in another tab to see orders arrive here.":"डेमो कॉपी: बदलाव इसी फ़ोन पर रहते हैं। ऑर्डर आते देखने के लिए दूसरे टैब में ग्राहक ऐप खोलें।","Log out":"लॉग आउट","Tap again to reset the demo data":"डेमो डेटा रीसेट करने के लिए फिर दबाएँ","Reset demo data on this device":"इस फ़ोन पर डेमो डेटा रीसेट करें","Back":"वापस","Screenshot this to print it.":"प्रिंट के लिए इसका स्क्रीनशॉट लें।","Print poster":"पोस्टर प्रिंट करें","Now taking orders on Nukkad":"अब Nukkad पर ऑर्डर लेते हैं","QR code needs an internet connection the first time.":"QR कोड के लिए पहली बार इंटरनेट चाहिए।","Scan to order. Pick up in {n} min or get it delivered.":"स्कैन करके ऑर्डर करें। {n} मिनट में लें या डिलीवरी पाएँ।","Cash":"कैश","extra charges":"कोई अतिरिक्त चार्ज","Declined {id}. Stock is back on the shelf.":"{id} मना किया। स्टॉक वापस आ गया।","{name} sees it now.":"{name} को अभी दिख रहा है।","Type a product first, like “Blue notebook ₹40, 10 left”.":"पहले सामान लिखें, जैसे “Blue notebook ₹40, 10 left”।","Couldn’t find a product in that. Try “Notebook ₹40, 10 left”.":"इसमें कोई सामान नहीं मिला। “Notebook ₹40, 10 left” लिखकर देखें।","AI read {n} products.":"AI ने {n} सामान पढ़े।","Read {n} products.":"{n} सामान पढ़े।","Fill the yellow boxes, then add.":"पीले ख़ाने भरें, फिर जोड़ें।","Check them, then add.":"एक बार देख लें, फिर जोड़ें।","Added {n} products. Customers can find them now.":"{n} सामान जुड़ गए। ग्राहक अब इन्हें देख सकते हैं।","Each row needs a name, a price and a stock count.":"हर लाइन में नाम, दाम और स्टॉक चाहिए।","Add your shop’s name.":"दुकान का नाम डालें।","Add your area, like Jayanagar.":"अपना इलाक़ा डालें, जैसे Jayanagar।","Add a 10-digit WhatsApp number.":"10 अंकों का WhatsApp नंबर डालें।","Check the UPI ID. It looks like name@bank.":"UPI ID देखें। वह name@bank जैसी होती है।","Choose a PIN of exactly 4 digits.":"ठीक 4 अंकों का PIN चुनें।","Couldn’t create the shop. Check your connection and try again.":"दुकान नहीं बन पाई। इंटरनेट देखकर फिर कोशिश करें।","Welcome to Nukkad, {shop}! Add your first products.":"Nukkad में स्वागत है, {shop}! अपना पहला सामान जोड़ें।","Welcome back, {shop}":"फिर से स्वागत है, {shop}","Marked as paid":"पैसे मिले मार्क किया","You’re open. Customers can order now.":"दुकान खुली है। ग्राहक अब ऑर्डर कर सकते हैं।","Closed. Customers can browse but not order.":"बंद। ग्राहक देख सकते हैं पर ऑर्डर नहीं कर सकते।","{name} is visible again":"{name} फिर से दिख रहा है","{name} hidden from customers":"{name} ग्राहकों से छुपाया","Demo data reset on this device.":"इस फ़ोन पर डेमो डेटा रीसेट हो गया।","You’ll get a notification for new orders.":"नए ऑर्डर पर नोटिफ़िकेशन मिलेगा।","Notifications are off. You’ll still hear the chime.":"नोटिफ़िकेशन बंद हैं। घंटी फिर भी बजेगी।","Link copied":"लिंक कॉपी हो गया","Press and hold the link to copy it.":"कॉपी करने के लिए लिंक को दबाकर रखें।","Offer is live":"ऑफ़र चालू है","Offer paused":"ऑफ़र रुका","Set a minimum order of at least ₹100.":"कम से कम ₹100 का न्यूनतम ऑर्डर रखें।","Max discount must be between ₹10 and ₹{max}.":"ज़्यादा से ज़्यादा छूट ₹10 से ₹{max} के बीच हो।","Pick 5%, 10% or 15%.":"5%, 10% या 15% चुनें।","Offer is live: {o}":"ऑफ़र चालू: {o}","Price updated":"दाम बदल गया","Enter a 10-digit mobile number.":"10 अंकों का मोबाइल नंबर डालें।","Orders will go to {n}":"ऑर्डर {n} पर जाएँगे","UPI ID saved":"UPI ID सेव हो गई","just now":"अभी","{n} min ago":"{n} मिनट पहले","{n} h ago":"{n} घंटे पहले","yesterday":"कल","{n} days ago":"{n} दिन पहले","All":"सब","Stationery":"स्टेशनरी","Grocery":"किराना","Clothing":"कपड़े","Electronics":"इलेक्ट्रॉनिक्स","Handicrafts":"हस्तशिल्प","Pharmacy":"दवा","Bakery":"बेकरी","Books":"किताबें","Other":"अन्य","Crafts":"हस्तशिल्प","AI read 1 product.":"AI ने 1 सामान पढ़ा।","Read 1 product.":"1 सामान पढ़ा।"},"kn":{"Couldn’t save that. Check your connection and try again.":"ಉಳಿಸಲು ಆಗಲಿಲ್ಲ. ಇಂಟರ್ನೆಟ್ ನೋಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.","Live sync isn’t open to your account, so you’re using a demo copy on this device.":"ನಿಮ್ಮ ಖಾತೆಗೆ ಲೈವ್ ಸಿಂಕ್ ಇಲ್ಲ, ಅದಕ್ಕೆ ಈ ಫೋನ್‌ನಲ್ಲಿ ಡೆಮೊ ಕಾಪಿ ನಡೆಯುತ್ತಿದೆ.","Couldn’t place the order. Check your connection and try again.":"ಆರ್ಡರ್ ಆಗಲಿಲ್ಲ. ಇಂಟರ್ನೆಟ್ ನೋಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.","Only {n} left of {name}. Lower the quantity.":"{name} ಕೇವಲ {n} ಉಳಿದಿವೆ. ಪ್ರಮಾಣ ಕಡಿಮೆ ಮಾಡಿ.","Live sync dropped. You’re on a demo copy on this device now.":"ಲೈವ್ ಸಿಂಕ್ ನಿಂತಿದೆ. ಈಗ ಈ ಫೋನ್‌ನಲ್ಲಿ ಡೆಮೊ ಕಾಪಿ ನಡೆಯುತ್ತಿದೆ.","Couldn’t reach the live database. Showing a demo copy.":"ಲೈವ್ ಡೇಟಾಬೇಸ್ ಸಿಗಲಿಲ್ಲ. ಡೆಮೊ ಕಾಪಿ ತೋರಿಸುತ್ತಿದ್ದೇವೆ.","Out of stock":"ಸ್ಟಾಕ್ ಇಲ್ಲ","Only {n} left":"ಕೇವಲ {n} ಉಳಿದಿವೆ","In stock":"ಸ್ಟಾಕ್ ಇದೆ","Order placed":"ಆರ್ಡರ್ ಆಯಿತು","Sent to the shop":"ಅಂಗಡಿಗೆ ಕಳಿಸಲಾಗಿದೆ","Accepted by shop":"ಅಂಗಡಿ ಒಪ್ಪಿಕೊಂಡಿದೆ","They’re packing it now":"ಈಗ ಪ್ಯಾಕ್ ಮಾಡುತ್ತಿದ್ದಾರೆ","Out for delivery":"ಡೆಲಿವರಿಗೆ ಹೊರಟಿದೆ","Ready for pickup":"ತೆಗೆದುಕೊಳ್ಳಲು ಸಿದ್ಧ","On its way to you":"ನಿಮ್ಮ ಕಡೆ ಬರುತ್ತಿದೆ","Collect it from the shop":"ಅಂಗಡಿಯಿಂದ ತೆಗೆದುಕೊಳ್ಳಿ","Delivered":"ತಲುಪಿದೆ","Picked up":"ತೆಗೆದುಕೊಂಡಿದ್ದೀರಿ","Thank you for shopping local":"ನಮ್ಮ ಬೀದಿಯಲ್ಲೇ ಖರೀದಿಸಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದ","Cancelled":"ರದ್ದು","New":"ಹೊಸದು","Free delivery above {min}":"{min} ಮೇಲೆ ಉಚಿತ ಡೆಲಿವರಿ","{pct}% off above {min}":"{min} ಮೇಲೆ {pct}% ರಿಯಾಯಿತಿ","up to {max}":"{max} ವರೆಗೆ","From {shop}, a shop you like":"ನಿಮಗೆ ಇಷ್ಟವಾದ {shop} ಇಂದ","Because you buy {cat}":"ನೀವು {cat} ಖರೀದಿಸುವುದರಿಂದ","Popular near you":"ನಿಮ್ಮ ಹತ್ತಿರ ಜನಪ್ರಿಯ","Today":"ಇಂದು","Tomorrow":"ನಾಳೆ","As soon as possible":"ಆದಷ್ಟು ಬೇಗ","New order from {name}":"{name} ಅವರಿಂದ ಹೊಸ ಆರ್ಡರ್","{shop} couldn’t take order {id}.":"{shop} ಆರ್ಡರ್ {id} ತೆಗೆದುಕೊಳ್ಳಲಾಗಲಿಲ್ಲ.","The shop":"ಅಂಗಡಿ","Orders sync across devices":"ಆರ್ಡರ್‌ಗಳು ಎಲ್ಲಾ ಫೋನ್‌ಗಳಲ್ಲಿ ಸಿಂಕ್ ಆಗುತ್ತವೆ","Live":"ಲೈವ್","Syncing":"ಸಿಂಕ್ ಆಗುತ್ತಿದೆ","Changes stay on this device":"ಬದಲಾವಣೆಗಳು ಈ ಫೋನ್‌ನಲ್ಲೇ ಇರುತ್ತವೆ","Demo":"ಡೆಮೊ","Change language":"ಭಾಷೆ ಬದಲಿಸಿ","Choose language":"ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ","Shop and product names stay as the shop wrote them.":"ಅಂಗಡಿ ಮತ್ತು ವಸ್ತುಗಳ ಹೆಸರು ಅಂಗಡಿಯವರು ಬರೆದಂತೆಯೇ ಇರುತ್ತದೆ.","Main":"ಮುಖ್ಯ","Installed! Find Nukkad on your home screen.":"ಇನ್‌ಸ್ಟಾಲ್ ಆಯಿತು! ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ನಲ್ಲಿ Nukkad ನೋಡಿ.","Install {app} on your phone":"{app} ಅನ್ನು ನಿಮ್ಮ ಫೋನ್‌ಗೆ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ","Opens full screen, like any app.":"ಬೇರೆ ಆ್ಯಪ್‌ಗಳಂತೆ ಪೂರ್ಣ ಪರದೆಯಲ್ಲಿ ತೆರೆಯುತ್ತದೆ.","Tap Share, then “Add to Home Screen”.":"Share ಒತ್ತಿ, ನಂತರ “Add to Home Screen”.","Install":"ಇನ್‌ಸ್ಟಾಲ್","Hide":"ಮರೆಮಾಡಿ","Closed":"ಮುಚ್ಚಿದೆ","Sold out":"ಮಾರಾಟವಾಗಿದೆ","Add":"ಸೇರಿಸಿ","ADD":"ಸೇರಿಸಿ","One less":"ಒಂದು ಕಡಿಮೆ","One more":"ಇನ್ನೊಂದು","min":"ನಿಮಿಷ","Closed now":"ಈಗ ಮುಚ್ಚಿದೆ","Local Gem":"ಲೋಕಲ್ ಜೆಮ್","Remove from favourites":"ಇಷ್ಟದಿಂದ ತೆಗೆಯಿರಿ","Save to favourites":"ಇಷ್ಟಕ್ಕೆ ಸೇರಿಸಿ","Your area":"ನಿಮ್ಮ ಏರಿಯಾ","All areas":"ಎಲ್ಲಾ ಏರಿಯಾಗಳು","Search notebook, saree, toor dal…":"ನೋಟ್‌ಬುಕ್, ಸೀರೆ, ತೊಗರಿ ಬೇಳೆ ಹುಡುಕಿ…","Search products near you":"ಹತ್ತಿರದ ವಸ್ತುಗಳನ್ನು ಹುಡುಕಿ","Search by voice":"ಮಾತಿನಿಂದ ಹುಡುಕಿ","Search":"ಹುಡುಕಿ","{n} items":"{n} ವಸ್ತುಗಳು","View bag":"ಬ್ಯಾಗ್ ನೋಡಿ","Home":"ಹೋಮ್","Saved":"ಉಳಿಸಿದವು","Orders":"ಆರ್ಡರ್‌ಗಳು","Namaste":"ನಮಸ್ಕಾರ","What do you need from your street today?":"ಇವತ್ತು ನಿಮ್ಮ ಬೀದಿಯಿಂದ ಏನು ಬೇಕು?","Highlights":"ವಿಶೇಷ","Ready in about 20 minutes":"ಸುಮಾರು 20 ನಿಮಿಷದಲ್ಲಿ ಸಿದ್ಧ","Order from shops on your street. Pick it up on your way home.":"ನಿಮ್ಮ ಬೀದಿಯ ಅಂಗಡಿಗಳಿಂದ ಆರ್ಡರ್ ಮಾಡಿ. ಮನೆಗೆ ಹೋಗುವಾಗ ತೆಗೆದುಕೊಳ್ಳಿ.","Explore shops":"ಅಂಗಡಿಗಳನ್ನು ನೋಡಿ","Discover Local Gems":"ಲೋಕಲ್ ಜೆಮ್‌ಗಳನ್ನು ಹುಡುಕಿ","{shop} and other small shops near you.":"{shop} ಮತ್ತು ನಿಮ್ಮ ಹತ್ತಿರದ ಇತರ ಸಣ್ಣ ಅಂಗಡಿಗಳು.","Small shops near you that deserve a visit.":"ಭೇಟಿ ಕೊಡಲೇಬೇಕಾದ ಹತ್ತಿರದ ಸಣ್ಣ ಅಂಗಡಿಗಳು.","Visit {shop}":"{shop} ನೋಡಿ","Your money stays on your street":"ನಿಮ್ಮ ಹಣ ನಿಮ್ಮ ಬೀದಿಯಲ್ಲೇ ಉಳಿಯುತ್ತದೆ","Zero commission. Pay the shop directly by UPI or cash.":"ಶೂನ್ಯ ಕಮಿಷನ್. ಅಂಗಡಿಗೆ ನೇರವಾಗಿ UPI ಅಥವಾ ನಗದು ಕೊಡಿ.","Start shopping":"ಖರೀದಿ ಶುರು ಮಾಡಿ","Offers from shops":"ಅಂಗಡಿಗಳ ಆಫರ್‌ಗಳು","Paid by the shop, not hidden in prices":"ಅಂಗಡಿಯೇ ಕೊಡುತ್ತದೆ, ಬೆಲೆಯಲ್ಲಿ ಮುಚ್ಚಿಟ್ಟಿಲ್ಲ","Recommended for you":"ನಿಮಗಾಗಿ ಶಿಫಾರಸು","Picked for you":"ನಿಮಗಾಗಿ ಆರಿಸಿದ್ದು","Based on what you like":"ನಿಮ್ಮ ಇಷ್ಟದ ಆಧಾರದ ಮೇಲೆ","Your favourites":"ನಿಮ್ಮ ಇಷ್ಟಗಳು","See all":"ಎಲ್ಲಾ ನೋಡಿ","Local Gems":"ಲೋಕಲ್ ಜೆಮ್‌ಗಳು","Small shops worth a visit":"ಭೇಟಿ ಕೊಡಬೇಕಾದ ಸಣ್ಣ ಅಂಗಡಿಗಳು","Hidden gem":"ಮುಚ್ಚಿದ ರತ್ನ","Ordered this month":"ಈ ತಿಂಗಳು ಆರ್ಡರ್ ಆದವು","{n} sold":"{n} ಮಾರಾಟ","Now or pick a time":"ಈಗಲೇ ಅಥವಾ ಸಮಯ ಆರಿಸಿ","Pickup or shop delivery":"ನೀವೇ ತೆಗೆದುಕೊಳ್ಳಿ ಅಥವಾ ಅಂಗಡಿ ಡೆಲಿವರಿ","Pay the shop by UPI":"ಅಂಗಡಿಗೆ UPI ಮೂಲಕ ಪಾವತಿಸಿ","All shops":"ಎಲ್ಲಾ ಅಂಗಡಿಗಳು","Shops in {area}":"{area} ಅಂಗಡಿಗಳು","{n} shops":"{n} ಅಂಗಡಿಗಳು","No shops here yet":"ಇಲ್ಲಿ ಇನ್ನೂ ಅಂಗಡಿಗಳಿಲ್ಲ","Pick another area at the top.":"ಮೇಲೆ ಬೇರೆ ಏರಿಯಾ ಆರಿಸಿ.","Own a shop?":"ನಿಮ್ಮದು ಅಂಗಡಿ ಇದೆಯಾ?","Open Nukkad for Shops. Free, no commission.":"Nukkad for Shops ತೆರೆಯಿರಿ. ಉಚಿತ, ಕಮಿಷನ್ ಇಲ್ಲ.","Find it on your street":"ನಿಮ್ಮ ಬೀದಿಯಲ್ಲೇ ಹುಡುಕಿ","Type or tap the mic. English, हिंदी or ಕನ್ನಡ all work.":"ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ. English, हिंदी ಅಥವಾ ಕನ್ನಡ ಎಲ್ಲಾ ಆಗುತ್ತದೆ.","Recent":"ಇತ್ತೀಚಿನವು","Clear":"ಅಳಿಸಿ","Try these":"ಇವನ್ನು ಪ್ರಯತ್ನಿಸಿ","New search":"ಹೊಸ ಹುಡುಕಾಟ","{n} results":"{n} ಫಲಿತಾಂಶಗಳು","Sort":"ವಿಂಗಡಿಸಿ","Best match":"ಸರಿಯಾದ ಹೊಂದಾಣಿಕೆ","Lowest price":"ಕಡಿಮೆ ಬೆಲೆ","Top rated":"ಉತ್ತಮ ರೇಟಿಂಗ್","In stock now":"ಈಗ ಸ್ಟಾಕ್ ಇದೆ","No shop here has this yet":"ಇಲ್ಲಿನ ಯಾವ ಅಂಗಡಿಯಲ್ಲೂ ಇದು ಇನ್ನೂ ಇಲ್ಲ","We’ve told shops nearby that people want “{q}”. Try another area, or check back soon.":"“{q}” ಬೇಕು ಎಂದು ಹತ್ತಿರದ ಅಂಗಡಿಗಳಿಗೆ ತಿಳಿಸಿದ್ದೇವೆ. ಬೇರೆ ಏರಿಯಾ ನೋಡಿ ಅಥವಾ ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಬನ್ನಿ.","Search all areas":"ಎಲ್ಲಾ ಏರಿಯಾಗಳಲ್ಲಿ ಹುಡುಕಿ","Compare {n} shops":"{n} ಅಂಗಡಿಗಳನ್ನು ಹೋಲಿಸಿ","Best price":"ಉತ್ತಮ ಬೆಲೆ","Nothing here yet":"ಇಲ್ಲಿ ಇನ್ನೂ ಏನೂ ಇಲ್ಲ","Try “All areas” at the top.":"ಮೇಲೆ “ಎಲ್ಲಾ ಏರಿಯಾಗಳು” ಆರಿಸಿ.","This shop isn’t listed any more":"ಈ ಅಂಗಡಿ ಈಗ ಪಟ್ಟಿಯಲ್ಲಿಲ್ಲ","Back to results":"ಫಲಿತಾಂಶಗಳಿಗೆ ಹಿಂದೆ","{n} ratings":"{n} ರೇಟಿಂಗ್‌ಗಳು","no ratings yet":"ಇನ್ನೂ ರೇಟಿಂಗ್ ಇಲ್ಲ","pickup ready":"ಒಳಗೆ ಸಿದ್ಧ","Pickup":"ಪಿಕಪ್","min delivery":"ನಿಮಿಷದಲ್ಲಿ ಡೆಲಿವರಿ","only":"ಮಾತ್ರ","This shop is closed right now. You can look around and order once they open.":"ಈ ಅಂಗಡಿ ಈಗ ಮುಚ್ಚಿದೆ. ನೋಡಬಹುದು, ತೆರೆದ ಮೇಲೆ ಆರ್ಡರ್ ಮಾಡಿ.","Pay by UPI or cash":"UPI ಅಥವಾ ನಗದು ಕೊಡಿ","Filter":"ಫಿಲ್ಟರ್","All items":"ಎಲ್ಲಾ ವಸ್ತುಗಳು","No products listed yet":"ಇನ್ನೂ ಯಾವ ವಸ್ತುವೂ ಸೇರಿಸಿಲ್ಲ","What customers say":"ಗ್ರಾಹಕರು ಏನು ಹೇಳುತ್ತಾರೆ","Your bag":"ನಿಮ್ಮ ಬ್ಯಾಗ್","Close":"ಮುಚ್ಚಿ","each":"ಒಂದಕ್ಕೆ","Often bought together":"ಹೆಚ್ಚಾಗಿ ಜೊತೆಗೆ ಖರೀದಿಸುವವು","{offer} applied. You save {amt}.":"{offer} ಅನ್ವಯವಾಯಿತು. ನಿಮಗೆ {amt} ಉಳಿತಾಯ.","Add {amt} more to get: {offer}":"ಇನ್ನೂ {amt} ಸೇರಿಸಿ, ಸಿಗುತ್ತದೆ: {offer}","How do you want it?":"ಹೇಗೆ ಬೇಕು?","Pick up":"ನೀವೇ ತೆಗೆದುಕೊಳ್ಳಿ","Free":"ಉಚಿತ","Delivery":"ಡೆಲಿವರಿ","Not offered":"ಲಭ್ಯವಿಲ್ಲ","When?":"ಯಾವಾಗ?","Now":"ಈಗಲೇ","Your name":"ನಿಮ್ಮ ಹೆಸರು","Phone":"ಫೋನ್","so the shop can reach you":"ಅಂಗಡಿಯವರು ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಲು","Delivery address":"ಡೆಲಿವರಿ ವಿಳಾಸ","Note for the shop":"ಅಂಗಡಿಗೆ ಸೂಚನೆ","optional":"ಐಚ್ಛಿಕ","e.g. Please pack separately":"ಉದಾ: ಬೇರೆ ಬೇರೆ ಪ್ಯಾಕ್ ಮಾಡಿ","Items":"ವಸ್ತುಗಳು","Shop offer":"ಅಂಗಡಿ ಆಫರ್","Nukkad fee":"Nukkad ಶುಲ್ಕ","To pay the shop":"ಅಂಗಡಿಗೆ ಕೊಡಬೇಕಾದದ್ದು","Place order":"ಆರ್ಡರ್ ಮಾಡಿ","Pay {shop} by UPI after ordering, or cash at pickup.":"ಆರ್ಡರ್ ನಂತರ {shop}ಗೆ UPI ಮೂಲಕ ಕೊಡಿ, ಅಥವಾ ತೆಗೆದುಕೊಳ್ಳುವಾಗ ನಗದು ಕೊಡಿ.","Start a new bag?":"ಹೊಸ ಬ್ಯಾಗ್ ಶುರು ಮಾಡುವುದೇ?","Your bag has items from {a}. Each order goes to one shop, so we’ll clear it and add this from {b}.":"ನಿಮ್ಮ ಬ್ಯಾಗ್‌ನಲ್ಲಿ {a} ವಸ್ತುಗಳಿವೆ. ಪ್ರತಿ ಆರ್ಡರ್ ಒಂದೇ ಅಂಗಡಿಗೆ ಹೋಗುತ್ತದೆ, ಅದಕ್ಕೆ ಅದನ್ನು ತೆಗೆದು {b} ಇದನ್ನು ಸೇರಿಸುತ್ತೇವೆ.","Keep my bag":"ನನ್ನ ಬ್ಯಾಗ್ ಇರಲಿ","Start new bag":"ಹೊಸ ಬ್ಯಾಗ್ ಶುರು ಮಾಡಿ","All done":"ಮುಗಿಯಿತು","On the way":"ದಾರಿಯಲ್ಲಿದೆ","Go pick it up":"ಹೋಗಿ ತೆಗೆದುಕೊಳ್ಳಿ","Scheduled for {when}":"{when} ಗೆ ನಿಗದಿ","Waiting for the shop to accept":"ಅಂಗಡಿ ಒಪ್ಪುವವರೆಗೆ ಕಾಯುತ್ತಿದೆ","Packing your order":"ನಿಮ್ಮ ಆರ್ಡರ್ ಪ್ಯಾಕ್ ಆಗುತ್ತಿದೆ","Delivery in about {r} min":"ಸುಮಾರು {r} ನಿಮಿಷದಲ್ಲಿ ಡೆಲಿವರಿ","Usually ready in about {n} min":"ಸಾಮಾನ್ಯವಾಗಿ ಸುಮಾರು {n} ನಿಮಿಷದಲ್ಲಿ ಸಿದ್ಧ","Updated {ago}":"{ago} ಅಪ್‌ಡೇಟ್ ಆಯಿತು","Payment received by the shop":"ಅಂಗಡಿಗೆ ಹಣ ತಲುಪಿದೆ","Pay {amt} by cash when you collect it.":"ತೆಗೆದುಕೊಳ್ಳುವಾಗ {amt} ನಗದು ಕೊಡಿ.","You marked this as paid. The shop will confirm.":"ನೀವು 'ಪಾವತಿಸಿದೆ' ಎಂದು ಗುರುತಿಸಿದ್ದೀರಿ. ಅಂಗಡಿ ಖಚಿತಪಡಿಸುತ್ತದೆ.","Pay with GPay / PhonePe / Paytm":"GPay / PhonePe / Paytm ಮೂಲಕ ಕೊಡಿ","Paying from another phone? Show QR":"ಬೇರೆ ಫೋನ್‌ನಿಂದ ಕೊಡುತ್ತೀರಾ? QR ತೋರಿಸಿ","Money goes straight to {upi}. Nukkad never touches it.":"ಹಣ ನೇರವಾಗಿ {upi}ಗೆ ಹೋಗುತ್ತದೆ. Nukkad ಅದನ್ನು ಮುಟ್ಟುವುದಿಲ್ಲ.","(Demo UPI ID. It won’t accept money.)":"(ಡೆಮೊ UPI ID. ಇದಕ್ಕೆ ಹಣ ಹೋಗುವುದಿಲ್ಲ.)","I’ve paid":"ನಾನು ಪಾವತಿಸಿದ್ದೇನೆ","Thanks for rating!":"ರೇಟಿಂಗ್ ಕೊಟ್ಟಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದ!","How was {shop}?":"{shop} ಹೇಗಿತ್ತು?","Rating":"ರೇಟಿಂಗ್","stars":"ಸ್ಟಾರ್","Say something nice (optional)":"ಏನಾದರೂ ಒಳ್ಳೆಯದು ಬರೆಯಿರಿ (ಐಚ್ಛಿಕ)","Send rating":"ರೇಟಿಂಗ್ ಕಳಿಸಿ","Tap a star. It helps small shops get found.":"ಒಂದು ಸ್ಟಾರ್ ಒತ್ತಿ. ಸಣ್ಣ ಅಂಗಡಿಗಳು ಜನರಿಗೆ ಸಿಗಲು ಇದು ಸಹಾಯ.","My orders":"ನನ್ನ ಆರ್ಡರ್‌ಗಳು","Order not found":"ಆರ್ಡರ್ ಸಿಗಲಿಲ್ಲ","the shop":"ಅಂಗಡಿ","Nothing was charged. Your items went back on the shelf.":"ಯಾವ ಹಣವೂ ಕಡಿತವಾಗಿಲ್ಲ. ವಸ್ತುಗಳು ಮತ್ತೆ ಶೆಲ್ಫ್‌ಗೆ ಹೋದವು.","This page updates by itself.":"ಈ ಪುಟ ತಾನಾಗಿಯೇ ಅಪ್‌ಡೇಟ್ ಆಗುತ್ತದೆ.","Delivery to {addr}":"{addr}ಗೆ ಡೆಲಿವರಿ","Pickup from {place}":"{place} ಇಂದ ತೆಗೆದುಕೊಳ್ಳಿ","Send a copy on WhatsApp":"WhatsApp ನಲ್ಲಿ ಕಾಪಿ ಕಳಿಸಿ","Preview the message":"ಸಂದೇಶ ನೋಡಿ","Order again":"ಮತ್ತೆ ಆರ್ಡರ್ ಮಾಡಿ","Keep shopping":"ಇನ್ನೂ ಖರೀದಿಸಿ","Shop":"ಅಂಗಡಿ","Track order":"ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ","Rate":"ರೇಟ್ ಮಾಡಿ","No orders yet":"ಇನ್ನೂ ಆರ್ಡರ್ ಇಲ್ಲ","Find something on your street and track it live here.":"ನಿಮ್ಮ ಬೀದಿಯಲ್ಲಿ ಏನಾದರೂ ಹುಡುಕಿ, ಇಲ್ಲಿ ಲೈವ್ ಆಗಿ ನೋಡಿ.","Past orders":"ಹಳೆಯ ಆರ್ಡರ್‌ಗಳು","Saved shops":"ಉಳಿಸಿದ ಅಂಗಡಿಗಳು","No saved shops yet":"ಇನ್ನೂ ಯಾವ ಅಂಗಡಿಯೂ ಉಳಿಸಿಲ್ಲ","Tap the heart on a shop to keep it here.":"ಅಂಗಡಿಯ ಮೇಲೆ ಹೃದಯ ಒತ್ತಿ, ಅದು ಇಲ್ಲಿ ಇರುತ್ತದೆ.","Browse shops":"ಅಂಗಡಿಗಳನ್ನು ನೋಡಿ","Order placed!":"ಆರ್ಡರ್ ಆಯಿತು!","{shop} has it":"{shop} ಬಳಿ ಇದೆ","Your bag is empty.":"ನಿಮ್ಮ ಬ್ಯಾಗ್ ಖಾಲಿಯಿದೆ.","{shop} is closed right now. Try again once they open.":"{shop} ಈಗ ಮುಚ್ಚಿದೆ. ತೆರೆದ ಮೇಲೆ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.","Add your name so the shop knows who it’s for.":"ಯಾರಿಗೆ ಎಂದು ಅಂಗಡಿಗೆ ತಿಳಿಯಲು ನಿಮ್ಮ ಹೆಸರು ಹಾಕಿ.","Check the phone number. It needs 10 digits.":"ಫೋನ್ ನಂಬರ್ ನೋಡಿ. 10 ಅಂಕಿ ಬೇಕು.","Add a delivery address.":"ಡೆಲಿವರಿ ವಿಳಾಸ ಹಾಕಿ.","Those items are out of stock right now.":"ಆ ವಸ್ತುಗಳು ಈಗ ಸ್ಟಾಕ್‌ನಲ್ಲಿಲ್ಲ.","{n} out-of-stock items were left out.":"ಸ್ಟಾಕ್ ಇಲ್ಲದ {n} ವಸ್ತುಗಳನ್ನು ಬಿಡಲಾಗಿದೆ.","Allow the microphone to search by voice.":"ಮಾತಿನಿಂದ ಹುಡುಕಲು ಮೈಕ್‌ಗೆ ಅನುಮತಿ ಕೊಡಿ.","Listening… say a product":"ಕೇಳುತ್ತಿದ್ದೇವೆ… ವಸ್ತುವಿನ ಹೆಸರು ಹೇಳಿ","Voice search isn’t available here. Try typing.":"ಇಲ್ಲಿ ಮಾತಿನ ಹುಡುಕಾಟ ಇಲ್ಲ. ಟೈಪ್ ಮಾಡಿ.","Removed from favourites":"ಇಷ್ಟದಿಂದ ತೆಗೆಯಲಾಗಿದೆ","Saved to favourites":"ಇಷ್ಟಕ್ಕೆ ಸೇರಿಸಲಾಗಿದೆ","Started a new bag":"ಹೊಸ ಬ್ಯಾಗ್ ಶುರುವಾಯಿತು","Thanks! The shop will confirm your payment.":"ಧನ್ಯವಾದ! ಅಂಗಡಿ ನಿಮ್ಮ ಪಾವತಿಯನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.","Thanks! Your rating helps small shops get found.":"ಧನ್ಯವಾದ! ನಿಮ್ಮ ರೇಟಿಂಗ್ ಸಣ್ಣ ಅಂಗಡಿಗಳಿಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.","for shops":"ಅಂಗಡಿಗಳಿಗಾಗಿ","Open":"ತೆರೆದಿದೆ","Products":"ವಸ್ತುಗಳು","Insights":"ಒಳನೋಟ","Shop login":"ಅಂಗಡಿ ಲಾಗಿನ್","Your shop, organised.":"ನಿಮ್ಮ ಅಂಗಡಿ, ಎಲ್ಲಾ ಕ್ರಮದಲ್ಲಿ.","Orders, stock and what your street is searching for, in one place. No commission.":"ಆರ್ಡರ್, ಸ್ಟಾಕ್ ಮತ್ತು ನಿಮ್ಮ ಬೀದಿ ಏನು ಹುಡುಕುತ್ತಿದೆ, ಎಲ್ಲಾ ಒಂದೇ ಕಡೆ. ಕಮಿಷನ್ ಇಲ್ಲ.","Enter your 4-digit PIN":"ನಿಮ್ಮ 4 ಅಂಕಿಯ PIN ಹಾಕಿ","demo PIN 1234":"ಡೆಮೊ PIN 1234","That PIN doesn’t match. Try again.":"PIN ಸರಿಯಿಲ್ಲ. ಮತ್ತೆ ಹಾಕಿ.","Delete":"ಅಳಿಸಿ","Change shop":"ಅಂಗಡಿ ಬದಲಿಸಿ","Pick your shop":"ನಿಮ್ಮ ಅಂಗಡಿ ಆರಿಸಿ","Register a new shop":"ಹೊಸ ಅಂಗಡಿ ಸೇರಿಸಿ","Open the customer app":"ಗ್ರಾಹಕ ಆ್ಯಪ್ ತೆರೆಯಿರಿ","Back to login":"ಲಾಗಿನ್‌ಗೆ ಹಿಂದೆ","Put your shop online":"ನಿಮ್ಮ ಅಂಗಡಿಯನ್ನು ಆನ್‌ಲೈನ್‌ಗೆ ತನ್ನಿ","Takes two minutes. Free, and you keep every rupee you sell.":"ಎರಡು ನಿಮಿಷ ಸಾಕು. ಉಚಿತ, ಮತ್ತು ಪ್ರತಿ ರೂಪಾಯಿ ನಿಮ್ಮದೇ.","Shop name":"ಅಂಗಡಿ ಹೆಸರು","e.g. Lakshmi Stores":"ಉದಾ: Lakshmi Stores","What do you sell?":"ನೀವು ಏನು ಮಾರುತ್ತೀರಿ?","Area":"ಏರಿಯಾ","Address":"ವಿಳಾಸ","WhatsApp number":"WhatsApp ನಂಬರ್","UPI ID":"UPI ID","optional, for online payments":"ಐಚ್ಛಿಕ, ಆನ್‌ಲೈನ್ ಪಾವತಿಗೆ","One line about your shop":"ನಿಮ್ಮ ಅಂಗಡಿ ಬಗ್ಗೆ ಒಂದು ಸಾಲು","Choose a 4-digit PIN":"4 ಅಂಕಿಯ PIN ಆರಿಸಿ","Create my shop":"ನನ್ನ ಅಂಗಡಿ ರಚಿಸಿ","Accept order":"ಆರ್ಡರ್ ಒಪ್ಪಿಕೊಳ್ಳಿ","Send out for delivery":"ಡೆಲಿವರಿಗೆ ಕಳಿಸಿ","Mark ready for pickup":"ತೆಗೆದುಕೊಳ್ಳಲು ಸಿದ್ಧ ಎಂದು ಗುರುತಿಸಿ","Mark delivered":"ತಲುಪಿದೆ ಎಂದು ಗುರುತಿಸಿ","Mark picked up":"ತೆಗೆದುಕೊಂಡರು ಎಂದು ಗುರುತಿಸಿ","Deliver to {addr}":"{addr}ಗೆ ತಲುಪಿಸಿ","Paid":"ಪಾವತಿಯಾಗಿದೆ","Customer says paid by UPI":"UPI ಮೂಲಕ ಕೊಟ್ಟೆ ಎನ್ನುತ್ತಾರೆ ಗ್ರಾಹಕರು","Pay on pickup":"ತೆಗೆದುಕೊಳ್ಳುವಾಗ ಪಾವತಿ","Tap again to decline":"ನಿರಾಕರಿಸಲು ಮತ್ತೆ ಒತ್ತಿ","Decline":"ನಿರಾಕರಿಸಿ","Mark paid":"ಪಾವತಿಯಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ","All caught up":"ಎಲ್ಲಾ ಮುಗಿದಿದೆ","New orders pop up here with a chime the moment someone orders.":"ಯಾರಾದರೂ ಆರ್ಡರ್ ಮಾಡಿದ ತಕ್ಷಣ ಗಂಟೆಯ ಸದ್ದಿನೊಂದಿಗೆ ಇಲ್ಲಿ ಬರುತ್ತದೆ.","Nothing in progress":"ಈಗ ಏನೂ ನಡೆಯುತ್ತಿಲ್ಲ","Accepted orders wait here until they’re picked up or delivered.":"ಒಪ್ಪಿದ ಆರ್ಡರ್‌ಗಳು ತೆಗೆದುಕೊಳ್ಳುವವರೆಗೆ ಅಥವಾ ತಲುಪುವವರೆಗೆ ಇಲ್ಲಿರುತ್ತವೆ.","No finished orders yet":"ಇನ್ನೂ ಮುಗಿದ ಆರ್ಡರ್ ಇಲ್ಲ","Completed and declined orders show up here.":"ಮುಗಿದ ಮತ್ತು ನಿರಾಕರಿಸಿದ ಆರ್ಡರ್‌ಗಳು ಇಲ್ಲಿ ಕಾಣುತ್ತವೆ.","Your shop shows as Closed to customers. Tap the switch at the top to open.":"ಗ್ರಾಹಕರಿಗೆ ನಿಮ್ಮ ಅಂಗಡಿ ಮುಚ್ಚಿದೆ ಎಂದು ಕಾಣುತ್ತದೆ. ತೆರೆಯಲು ಮೇಲಿನ ಸ್ವಿಚ್ ಒತ್ತಿ.","Waiting":"ಕಾಯುತ್ತಿವೆ","to accept":"ಒಪ್ಪಬೇಕಿದೆ","{n} orders":"{n} ಆರ್ಡರ್‌ಗಳು","Get a notification for every new order":"ಪ್ರತಿ ಹೊಸ ಆರ್ಡರ್‌ಗೆ ನೋಟಿಫಿಕೇಶನ್ ಪಡೆಯಿರಿ","{n} new orders waiting for you":"{n} ಹೊಸ ಆರ್ಡರ್‌ಗಳು ಕಾಯುತ್ತಿವೆ","Order status":"ಆರ್ಡರ್ ಸ್ಥಿತಿ","In progress":"ನಡೆಯುತ್ತಿವೆ","Done":"ಮುಗಿದವು","Add products":"ವಸ್ತುಗಳನ್ನು ಸೇರಿಸಿ","Smart fill · AI":"ಸ್ಮಾರ್ಟ್ ಫಿಲ್ · AI","Smart fill":"ಸ್ಮಾರ್ಟ್ ಫಿಲ್","Type them like you’d text a customer, one per line.":"ಗ್ರಾಹಕರಿಗೆ ಮೆಸೇಜ್ ಮಾಡುವಂತೆ ಬರೆಯಿರಿ, ಒಂದು ಸಾಲಿಗೆ ಒಂದು.","Or snap a photo.":"ಅಥವಾ ಫೋಟೋ ತೆಗೆಯಿರಿ.","Products to add":"ಸೇರಿಸಬೇಕಾದ ವಸ್ತುಗಳು","Remove photo":"ಫೋಟೋ ತೆಗೆಯಿರಿ","Reading…":"ಓದುತ್ತಿದೆ…","Fill for me":"ನನಗಾಗಿ ತುಂಬಿಸಿ","Photo":"ಫೋಟೋ","Try a sample":"ಮಾದರಿ ಪ್ರಯತ್ನಿಸಿ","Product":"ವಸ್ತು","Price":"ಬೆಲೆ","Stock":"ಸ್ಟಾಕ್","Remove":"ತೆಗೆಯಿರಿ","Add {n} to my shop":"{n} ವಸ್ತುಗಳನ್ನು ಅಂಗಡಿಗೆ ಸೇರಿಸಿ","Row":"ಸಾಲು","Discard":"ಬಿಟ್ಟುಬಿಡಿ","Add one by hand":"ಕೈಯಾರೆ ಒಂದು ಸೇರಿಸಿ","In my shop":"ನನ್ನ ಅಂಗಡಿಯಲ್ಲಿ","{a} live · {b} running low":"{a} ಲೈವ್ · {b} ಕಡಿಮೆ ಇವೆ","Find a product":"ವಸ್ತು ಹುಡುಕಿ","Visible to customers":"ಗ್ರಾಹಕರಿಗೆ ಕಾಣುತ್ತದೆ","The switch hides a product from customers without deleting it.":"ಸ್ವಿಚ್ ವಸ್ತುವನ್ನು ಅಳಿಸದೆ ಗ್ರಾಹಕರಿಂದ ಮರೆಮಾಡುತ್ತದೆ.","orders":"ಆರ್ಡರ್‌ಗಳು","Sales, 7 days":"ಮಾರಾಟ, 7 ದಿನ","paid to you directly":"ನೇರವಾಗಿ ನಿಮಗೆ ಬಂದಿದೆ","Sales this week":"ಈ ವಾರದ ಮಾರಾಟ","Demand Radar":"ಡಿಮ್ಯಾಂಡ್ ರಡಾರ್","days":"ದಿನ","People near you searched for these and no shop had them.":"ನಿಮ್ಮ ಹತ್ತಿರದ ಜನ ಇವನ್ನು ಹುಡುಕಿದರು, ಯಾವ ಅಂಗಡಿಯಲ್ಲೂ ಸಿಗಲಿಲ್ಲ.","{n} searches":"{n} ಹುಡುಕಾಟ","Stock the top one and those buyers will find you first.":"ಮೇಲಿನದನ್ನು ಇಡಿ, ಆ ಗ್ರಾಹಕರು ಮೊದಲು ನಿಮ್ಮನ್ನೇ ಹುಡುಕುತ್ತಾರೆ.","No missed searches this week.":"ಈ ವಾರ ಯಾವ ಹುಡುಕಾಟವೂ ತಪ್ಪಿಲ್ಲ.","Ratings":"ರೇಟಿಂಗ್‌ಗಳು","Ratings from customers will show here.":"ಗ್ರಾಹಕರ ರೇಟಿಂಗ್ ಇಲ್ಲಿ ಕಾಣುತ್ತದೆ.","Running low":"ಕಡಿಮೆ ಇವೆ","3 or fewer":"3 ಅಥವಾ ಕಡಿಮೆ","Everything is well stocked.":"ಎಲ್ಲಾ ಸಾಕಷ್ಟು ಇದೆ.","Top sellers":"ಹೆಚ್ಚು ಮಾರಾಟವಾದವು","Your first sales will show here.":"ನಿಮ್ಮ ಮೊದಲ ಮಾರಾಟ ಇಲ್ಲಿ ಕಾಣುತ್ತದೆ.","Offers":"ಆಫರ್‌ಗಳು","You fund them, so keep them small":"ಹಣ ನಿಮ್ಮದು, ಅದಕ್ಕೆ ಸಣ್ಣದಾಗಿ ಇಡಿ","Used {n} times":"{n} ಬಾರಿ ಬಳಸಲಾಗಿದೆ","Offer on":"ಆಫರ್ ಚಾಲೂ","No offers yet. A small offer helps new customers try you.":"ಇನ್ನೂ ಆಫರ್ ಇಲ್ಲ. ಸಣ್ಣ ಆಫರ್ ಹೊಸ ಗ್ರಾಹಕರನ್ನು ತರುತ್ತದೆ.","Offer type":"ಆಫರ್ ಬಗೆ","Discount":"ರಿಯಾಯಿತಿ","Free delivery":"ಉಚಿತ ಡೆಲಿವರಿ","Minimum order":"ಕನಿಷ್ಠ ಆರ್ಡರ್","Max discount":"ಗರಿಷ್ಠ ರಿಯಾಯಿತಿ","Worst case you give {amt} off an order of {min} or more.":"ಹೆಚ್ಚೆಂದರೆ {min} ಅಥವಾ ಹೆಚ್ಚಿನ ಆರ್ಡರ್‌ಗೆ {amt} ರಿಯಾಯಿತಿ ಕೊಡುತ್ತೀರಿ.","You skip the delivery fee on orders of {min} or more.":"{min} ಅಥವಾ ಹೆಚ್ಚಿನ ಆರ್ಡರ್‌ಗೆ ಡೆಲಿವರಿ ಶುಲ್ಕ ಇಲ್ಲ.","Start this offer":"ಈ ಆಫರ್ ಶುರು ಮಾಡಿ","Your shop link":"ನಿಮ್ಮ ಅಂಗಡಿ ಲಿಂಕ್","QR poster":"QR ಪೋಸ್ಟರ್","Share it on WhatsApp status and Instagram. Customers open it and order.":"WhatsApp ಸ್ಟೇಟಸ್ ಮತ್ತು Instagram ನಲ್ಲಿ ಹಾಕಿ. ಗ್ರಾಹಕರು ತೆರೆದು ಆರ್ಡರ್ ಮಾಡುತ್ತಾರೆ.","Copy link":"ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಿ","Orders, delivery and payment":"ಆರ್ಡರ್, ಡೆಲಿವರಿ ಮತ್ತು ಪಾವತಿ","customers pay you here directly":"ಗ್ರಾಹಕರು ಇಲ್ಲಿಗೆ ನೇರವಾಗಿ ಕೊಡುತ್ತಾರೆ","This is a demo ID. Put your real UPI ID to receive money.":"ಇದು ಡೆಮೊ ID. ಹಣ ಪಡೆಯಲು ನಿಮ್ಮ ನಿಜವಾದ UPI ID ಹಾಕಿ.","Pickup ready in":"ತೆಗೆದುಕೊಳ್ಳಲು ಸಿದ್ಧ","Delivery within":"ಡೆಲಿವರಿ ಇಷ್ಟರಲ್ಲಿ","We deliver nearby":"ನಾವು ಹತ್ತಿರ ಡೆಲಿವರಿ ಮಾಡುತ್ತೇವೆ","Delivery fee":"ಡೆಲಿವರಿ ಶುಲ್ಕ","Live: orders from any phone arrive here instantly, with a chime.":"ಲೈವ್: ಯಾವ ಫೋನ್‌ನಿಂದಲೂ ಆರ್ಡರ್ ತಕ್ಷಣ ಗಂಟೆಯೊಂದಿಗೆ ಇಲ್ಲಿ ಬರುತ್ತದೆ.","Demo copy: changes stay on this device. Open the customer app in another tab to see orders arrive here.":"ಡೆಮೊ ಕಾಪಿ: ಬದಲಾವಣೆಗಳು ಈ ಫೋನ್‌ನಲ್ಲೇ. ಆರ್ಡರ್ ಬರುವುದನ್ನು ನೋಡಲು ಬೇರೆ ಟ್ಯಾಬ್‌ನಲ್ಲಿ ಗ್ರಾಹಕ ಆ್ಯಪ್ ತೆರೆಯಿರಿ.","Log out":"ಲಾಗ್ ಔಟ್","Tap again to reset the demo data":"ಡೆಮೊ ಡೇಟಾ ರೀಸೆಟ್ ಮಾಡಲು ಮತ್ತೆ ಒತ್ತಿ","Reset demo data on this device":"ಈ ಫೋನ್‌ನಲ್ಲಿ ಡೆಮೊ ಡೇಟಾ ರೀಸೆಟ್ ಮಾಡಿ","Back":"ಹಿಂದೆ","Screenshot this to print it.":"ಮುದ್ರಿಸಲು ಇದರ ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ತೆಗೆಯಿರಿ.","Print poster":"ಪೋಸ್ಟರ್ ಮುದ್ರಿಸಿ","Now taking orders on Nukkad":"ಈಗ Nukkad ನಲ್ಲಿ ಆರ್ಡರ್ ತೆಗೆದುಕೊಳ್ಳುತ್ತೇವೆ","QR code needs an internet connection the first time.":"QR ಕೋಡ್‌ಗೆ ಮೊದಲ ಬಾರಿ ಇಂಟರ್ನೆಟ್ ಬೇಕು.","Scan to order. Pick up in {n} min or get it delivered.":"ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಆರ್ಡರ್ ಮಾಡಿ. {n} ನಿಮಿಷದಲ್ಲಿ ತೆಗೆದುಕೊಳ್ಳಿ ಅಥವಾ ಡೆಲಿವರಿ ಪಡೆಯಿರಿ.","Cash":"ನಗದು","extra charges":"ಹೆಚ್ಚುವರಿ ಶುಲ್ಕ","Declined {id}. Stock is back on the shelf.":"{id} ನಿರಾಕರಿಸಲಾಗಿದೆ. ಸ್ಟಾಕ್ ವಾಪಸ್ ಬಂದಿದೆ.","{name} sees it now.":"{name} ಅವರಿಗೆ ಈಗ ಕಾಣುತ್ತಿದೆ.","Type a product first, like “Blue notebook ₹40, 10 left”.":"ಮೊದಲು ವಸ್ತು ಬರೆಯಿರಿ, ಉದಾ “Blue notebook ₹40, 10 left”.","Couldn’t find a product in that. Try “Notebook ₹40, 10 left”.":"ಇದರಲ್ಲಿ ವಸ್ತು ಸಿಗಲಿಲ್ಲ. “Notebook ₹40, 10 left” ಎಂದು ಪ್ರಯತ್ನಿಸಿ.","AI read {n} products.":"AI {n} ವಸ್ತುಗಳನ್ನು ಓದಿತು.","Read {n} products.":"{n} ವಸ್ತುಗಳನ್ನು ಓದಲಾಯಿತು.","Fill the yellow boxes, then add.":"ಹಳದಿ ಬಾಕ್ಸ್ ತುಂಬಿಸಿ, ನಂತರ ಸೇರಿಸಿ.","Check them, then add.":"ಒಮ್ಮೆ ನೋಡಿ, ನಂತರ ಸೇರಿಸಿ.","Added {n} products. Customers can find them now.":"{n} ವಸ್ತುಗಳು ಸೇರಿದವು. ಗ್ರಾಹಕರಿಗೆ ಈಗ ಕಾಣುತ್ತವೆ.","Each row needs a name, a price and a stock count.":"ಪ್ರತಿ ಸಾಲಿಗೆ ಹೆಸರು, ಬೆಲೆ ಮತ್ತು ಸ್ಟಾಕ್ ಬೇಕು.","Add your shop’s name.":"ಅಂಗಡಿಯ ಹೆಸರು ಹಾಕಿ.","Add your area, like Jayanagar.":"ನಿಮ್ಮ ಏರಿಯಾ ಹಾಕಿ, ಉದಾ Jayanagar.","Add a 10-digit WhatsApp number.":"10 ಅಂಕಿಯ WhatsApp ನಂಬರ್ ಹಾಕಿ.","Check the UPI ID. It looks like name@bank.":"UPI ID ನೋಡಿ. ಅದು name@bank ತರಹ ಇರುತ್ತದೆ.","Choose a PIN of exactly 4 digits.":"ಸರಿಯಾಗಿ 4 ಅಂಕಿಯ PIN ಆರಿಸಿ.","Couldn’t create the shop. Check your connection and try again.":"ಅಂಗಡಿ ರಚಿಸಲಾಗಲಿಲ್ಲ. ಇಂಟರ್ನೆಟ್ ನೋಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.","Welcome to Nukkad, {shop}! Add your first products.":"Nukkad ಗೆ ಸ್ವಾಗತ, {shop}! ಮೊದಲ ವಸ್ತುಗಳನ್ನು ಸೇರಿಸಿ.","Welcome back, {shop}":"ಮತ್ತೆ ಸ್ವಾಗತ, {shop}","Marked as paid":"ಪಾವತಿಯಾಗಿದೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ","You’re open. Customers can order now.":"ಅಂಗಡಿ ತೆರೆದಿದೆ. ಗ್ರಾಹಕರು ಈಗ ಆರ್ಡರ್ ಮಾಡಬಹುದು.","Closed. Customers can browse but not order.":"ಮುಚ್ಚಿದೆ. ಗ್ರಾಹಕರು ನೋಡಬಹುದು, ಆರ್ಡರ್ ಮಾಡಲಾಗದು.","{name} is visible again":"{name} ಮತ್ತೆ ಕಾಣುತ್ತಿದೆ","{name} hidden from customers":"{name} ಗ್ರಾಹಕರಿಂದ ಮರೆಮಾಡಲಾಗಿದೆ","Demo data reset on this device.":"ಈ ಫೋನ್‌ನಲ್ಲಿ ಡೆಮೊ ಡೇಟಾ ರೀಸೆಟ್ ಆಯಿತು.","You’ll get a notification for new orders.":"ಹೊಸ ಆರ್ಡರ್‌ಗೆ ನೋಟಿಫಿಕೇಶನ್ ಬರುತ್ತದೆ.","Notifications are off. You’ll still hear the chime.":"ನೋಟಿಫಿಕೇಶನ್ ಆಫ್ ಆಗಿದೆ. ಗಂಟೆ ಸದ್ದು ಆದರೂ ಕೇಳುತ್ತದೆ.","Link copied":"ಲಿಂಕ್ ಕಾಪಿ ಆಯಿತು","Press and hold the link to copy it.":"ಕಾಪಿ ಮಾಡಲು ಲಿಂಕ್ ಒತ್ತಿ ಹಿಡಿಯಿರಿ.","Offer is live":"ಆಫರ್ ಚಾಲೂ ಆಗಿದೆ","Offer paused":"ಆಫರ್ ನಿಲ್ಲಿಸಲಾಗಿದೆ","Set a minimum order of at least ₹100.":"ಕನಿಷ್ಠ ₹100 ಆರ್ಡರ್ ಇಡಿ.","Max discount must be between ₹10 and ₹{max}.":"ಗರಿಷ್ಠ ರಿಯಾಯಿತಿ ₹10 ಮತ್ತು ₹{max} ನಡುವೆ ಇರಬೇಕು.","Pick 5%, 10% or 15%.":"5%, 10% ಅಥವಾ 15% ಆರಿಸಿ.","Offer is live: {o}":"ಆಫರ್ ಚಾಲೂ: {o}","Price updated":"ಬೆಲೆ ಬದಲಾಯಿತು","Enter a 10-digit mobile number.":"10 ಅಂಕಿಯ ಮೊಬೈಲ್ ನಂಬರ್ ಹಾಕಿ.","Orders will go to {n}":"ಆರ್ಡರ್‌ಗಳು {n}ಗೆ ಹೋಗುತ್ತವೆ","UPI ID saved":"UPI ID ಉಳಿಸಲಾಗಿದೆ","just now":"ಈಗಷ್ಟೇ","{n} min ago":"{n} ನಿಮಿಷದ ಹಿಂದೆ","{n} h ago":"{n} ಗಂಟೆ ಹಿಂದೆ","yesterday":"ನಿನ್ನೆ","{n} days ago":"{n} ದಿನದ ಹಿಂದೆ","All":"ಎಲ್ಲಾ","Stationery":"ಸ್ಟೇಷನರಿ","Grocery":"ದಿನಸಿ","Clothing":"ಬಟ್ಟೆ","Electronics":"ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್","Handicrafts":"ಕರಕುಶಲ","Pharmacy":"ಔಷಧಿ","Bakery":"ಬೇಕರಿ","Books":"ಪುಸ್ತಕಗಳು","Other":"ಇತರೆ","Crafts":"ಕರಕುಶಲ","AI read 1 product.":"AI 1 ವಸ್ತುವನ್ನು ಓದಿತು.","Read 1 product.":"1 ವಸ್ತುವನ್ನು ಓದಲಾಯಿತು."}};
let LANG = (() => { try { const v = localStorage.getItem('nk-lang'); return LANGS[v] ? v : 'en'; } catch (e) { return 'en'; } })();
function setLang(v) {
  if (!LANGS[v]) return;
  LANG = v;
  try { localStorage.setItem('nk-lang', v); } catch (e) { /* storage blocked */ }
}
function t(str, vars) {
  let s = (LANG !== 'en' && I18N[LANG] && I18N[LANG][str]) || str;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
  return s;
}

/* ---------- Helpers ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rs = n => '₹' + Number(n || 0).toLocaleString('en-IN', {maximumFractionDigits:2});
const cap = s => String(s).charAt(0).toUpperCase() + String(s).slice(1);
const rid = (n = 6) => Math.random().toString(36).slice(2, 2 + n);
const ls = (k, v) => {
  try {
    if (v === undefined) return localStorage.getItem('nk-' + k);
    if (v === null) localStorage.removeItem('nk-' + k); else localStorage.setItem('nk-' + k, v);
  } catch (e) { /* storage blocked */ }
  return null;
};
const tAt = x => x.agoH != null ? Date.now() - x.agoH * H : (x.at || 0);
function ago(ts) {
  const m = Math.round((Date.now() - ts) / 6e4);
  if (m < 1) return t('just now');
  if (m < 60) return t('{n} min ago', {n:m});
  const h = Math.round(m / 60);
  if (h < 24) return t('{n} h ago', {n:h});
  const d = Math.round(h / 24);
  return d === 1 ? t('yesterday') : t('{n} days ago', {n:d});
}
function cleanPhone(v) {
  let d = String(v || '').replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  if (d.length === 10) d = '91' + d;
  return d;
}
const prettyPhone = d => /^91\d{10}$/.test(d || '') ? '+91 ' + d.slice(2, 7) + ' ' + d.slice(7) : (d ? '+' + d : '');
const waLink = (phone, text) => 'https://wa.me/' + String(phone || '').replace(/\D/g, '') + '?text=' + encodeURIComponent(text);
const slugify = s => String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40) || 'shop';
let DEVICE = ls('device'); if (!DEVICE) { DEVICE = 'd' + rid(10); ls('device', DEVICE); }
const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { /* not allowed */ } };

/* Product pictures: a friendly emoji tile per product, tinted by category */
const EMO = [['sketchbook','📒'],['drawing','🎨'],['notebook','📓'],['dictionary','📕'],['geometry','📐'],['sticky','🗒️'],['colour','🎨'],['paper','📄'],['pen','🖊️'],['pencil','✏️'],['fevicol','🧴'],['glue','🧴'],['book','📘'],
  ['saree','🥻'],['dupatta','🧣'],['kurta','👘'],['fabric','🧵'],['towel','🧺'],['shirt','👕'],
  ['dal','🫘'],['rice','🍚'],['coffee','☕'],['tea','🍵'],['ghee','🧈'],['oil','🫙'],['idli','🥣'],['muesli','🥣'],['jaggery','🍯'],['honey','🍯'],['agarbatti','🪔'],['ragi','🌾'],['flour','🌾'],['atta','🌾'],['milk','🥛'],['bread','🍞'],['cake','🎂'],['biscuit','🍪'],
  ['spinning top','🪀'],['train','🚂'],['diya','🪔'],['plate','🍽️'],['tote','👜'],['bag','👜'],['elephant','🐘'],['bell','🔔'],
  ['power bank','🔋'],['charger','🔌'],['cable','🔌'],['bulb','💡'],['extension','🔌'],['earphone','🎧'],['speaker','🔊'],['batter','🔋']];
const CATEMO = {Stationery:'✏️', Grocery:'🛒', Clothing:'👗', Electronics:'🔌', Handicrafts:'🏺', Pharmacy:'💊', Bakery:'🥐', Books:'📚', Home:'🏠', Other:'🛍️'};
const CATTINT = {Stationery:'--t1', Grocery:'--t2', Clothing:'--t3', Electronics:'--t4', Handicrafts:'--t5', Books:'--t4', Home:'--t2', Bakery:'--t1', Pharmacy:'--t6', Other:'--t6'};
function emo(p) { const n = String(p.name || '').toLowerCase(); for (const [k, e] of EMO) if (n.includes(k)) return e; return CATEMO[p.category] || '🛍️'; }
const tint = c => `var(${CATTINT[c] || '--t6'})`;
const thumb = (p, cls = '') => `<span class="th ${cls}" style="background:${tint(p.category)}" aria-hidden="true">${emo(p)}</span>`;

const ICON = {
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  box:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  shop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9 5 4h14l2 5"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v8h14v-8"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  truck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5 10 17l9-10"/></svg>',
};



Object.assign(ICON, {
  mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  star:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>',
  globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>',
  gift:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13"/><path d="M12 7c-1.5-3-5-3-5-1s3 1 5 1zm0 0c1.5-3 5-3 5-1s-3 1-5 1z"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  qr:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 17h3v4"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></svg>',
});
const stars = (v, n) => {
  const full = Math.round(v || 0);
  return `<span class="stars" aria-label="${(v || 0).toFixed(1)} out of 5">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= full ? 'on' : ''}">${ICON.star}</i>`).join('')}</span>${n != null ? `<span class="rate-n">${(v || 0).toFixed(1)} (${n})</span>` : ''}`;
};
/* Typed or spoken Hindi/Kannada words mapped to the English product words shops use */
const SYN = {
  'दाल':'dal','तूर':'toor','अरहर':'toor','चावल':'rice','कॉफी':'coffee','कॉफ़ी':'coffee','तेल':'oil','गुड़':'jaggery','शहद':'honey','अगरबत्ती':'agarbatti','आटा':'flour','रागी':'ragi',
  'नोटबुक':'notebook','कॉपी':'notebook','पेन':'pen','कलम':'pen','पेंसिल':'pencil','कागज':'paper','कागज़':'paper','साड़ी':'saree','दुपट्टा':'dupatta','कुर्ता':'kurta','तौलिया':'towel','शर्ट':'shirt',
  'चार्जर':'charger','केबल':'cable','बल्ब':'bulb','बैटरी':'batter','इयरफोन':'earphone','दीया':'diya','दिया':'diya','खिलौना':'toy','बैग':'bag','शब्दकोश':'dictionary','स्याही':'ink','प्रिंटर':'printer',
  'ಬೇಳೆ':'dal','ತೊಗರಿ':'toor','ಅಕ್ಕಿ':'rice','ಕಾಫಿ':'coffee','ಎಣ್ಣೆ':'oil','ಬೆಲ್ಲ':'jaggery','ಜೇನು':'honey','ಊದುಬತ್ತಿ':'agarbatti','ರಾಗಿ':'ragi','ಹಿಟ್ಟು':'flour',
  'ಪುಸ್ತಕ':'notebook','ನೋಟ್‌ಬುಕ್':'notebook','ನೋಟ್ಬುಕ್':'notebook','ಪೆನ್':'pen','ಪೆನ್ನು':'pen','ಪೆನ್ಸಿಲ್':'pencil','ಕಾಗದ':'paper','ಸೀರೆ':'saree','ಕುರ್ತಾ':'kurta','ಟವೆಲ್':'towel','ಶರ್ಟ್':'shirt',
  'ಚಾರ್ಜರ್':'charger','ಕೇಬಲ್':'cable','ಬಲ್ಬ್':'bulb','ಬ್ಯಾಟರಿ':'batter','ದೀಪ':'diya','ಹಣತೆ':'diya','ಆಟಿಕೆ':'toy','ಚೀಲ':'bag','ನಿಘಂಟು':'dictionary','ಶಾಯಿ':'ink','ಪ್ರಿಂಟರ್':'printer',
};
const synify = q => String(q || '').split(/\s+/).map(w => SYN[w] || w).join(' ');
/* Brand mark: the road N (customer = forest tile, shop = marigold tile) */
ICON.logo = '<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="22" fill="#1E4D3A"/><path d="M30 76V30L70 70V34" fill="none" stroke="#F7F1E5" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 36L67 70" fill="none" stroke="#1E4D3A" stroke-width="2" stroke-dasharray="5 5"/><circle cx="70" cy="22" r="8" fill="#EE9A2E"/></svg>';
ICON.logoShop = '<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="22" fill="#EE9A2E"/><path d="M30 76V30L70 70V34" fill="none" stroke="#1E4D3A" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 36L67 70" fill="none" stroke="#EE9A2E" stroke-width="2" stroke-dasharray="5 5"/><circle cx="70" cy="22" r="8" fill="#F7F1E5" stroke="#1E4D3A" stroke-width="2.5"/></svg>';

/* ---------- Demo data (used for the on-device demo copy) ---------- */
function seed() {
  const shops = [
    {id:'s1',name:'Mehta Stationery',slug:'mehta-stationery',category:'Stationery',area:'Jayanagar',address:'4th Block, Jayanagar',whatsapp:'919900000001',desc:'Notebooks, art supplies and exam essentials since 1998.',deliveryOn:true,deliveryFee:30,readyMins:20,pin:'1234'},
    {id:'s2',name:'Sri Ganesh Book House',slug:'sri-ganesh-book-house',category:'Stationery',area:'Jayanagar',address:'11th Main, 4th Block, Jayanagar',whatsapp:'919900000007',desc:'Books, school supplies and stationery at honest prices.',deliveryOn:false,deliveryFee:20,readyMins:30,pin:'1234'},
    {id:'s3',name:'Kavya Handlooms',slug:'kavya-handlooms',category:'Clothing',area:'Jayanagar',address:'9th Block, Jayanagar',whatsapp:'919900000002',desc:'Handwoven cotton sarees and dupattas from Karnataka weavers.',deliveryOn:true,deliveryFee:50,readyMins:45,pin:'1234'},
    {id:'s4',name:'Annapoorna Provisions',slug:'annapoorna-provisions',category:'Grocery',area:'Malleshwaram',address:'8th Cross, Malleshwaram',whatsapp:'919900000003',desc:'Your neighbourhood kirana. Fresh stock every morning.',deliveryOn:true,deliveryFee:20,readyMins:15,pin:'1234'},
    {id:'s5',name:'Green Basket Organics',slug:'green-basket-organics',category:'Grocery',area:'Koramangala',address:'5th Block, Koramangala',whatsapp:'919900000004',desc:'Organic staples and cold-pressed oils.',deliveryOn:true,deliveryFee:40,readyMins:30,pin:'1234'},
    {id:'s6',name:'Rangoli Crafts',slug:'rangoli-crafts',category:'Handicrafts',area:'Indiranagar',address:'100 Feet Road, Indiranagar',whatsapp:'919900000005',desc:'Channapatna toys and handmade decor.',deliveryOn:false,deliveryFee:40,readyMins:30,pin:'1234'},
    {id:'s7',name:'Sri Sai Electricals',slug:'sri-sai-electricals',category:'Electronics',area:'Koramangala',address:'1st Block, Koramangala',whatsapp:'919900000006',desc:'Chargers, cables, bulbs and quick repairs.',deliveryOn:true,deliveryFee:30,readyMins:20,pin:'1234'},
  ];
  const P = [
    ['s1','Classmate Notebook 172 pages','Stationery',60,40,'Single line, A4'],['s1','Blue Ball Pen (pack of 5)','Stationery',50,25,''],
    ['s1','Geometry Box','Stationery',120,2,'Compass, divider, scales'],['s1','A4 Printing Paper (500)','Stationery',320,8,'75 GSM'],
    ['s1','Water Colour Set 24 shades','Stationery',180,6,''],['s1','Sticky Notes','Stationery',45,1,'3×3 inch, neon'],['s1','Spiral Sketchbook A4','Stationery',150,10,''],
    ['s2','Classmate Notebook 172 pages','Stationery',58,15,'Single line, A4'],['s2','Blue Ball Pen (pack of 5)','Stationery',45,30,''],
    ['s2','Drawing Book A4','Stationery',70,12,''],['s2','Oxford English Dictionary','Books',395,3,''],['s2','Fevicol 50g','Stationery',30,20,''],
    ['s3','Ilkal Cotton Saree','Clothing',1850,4,'Handwoven, red and green'],['s3','Mysore Silk Dupatta','Clothing',950,3,''],
    ['s3','Cotton Kurta Fabric (2.5 m)','Clothing',420,12,''],['s3','Handloom Cotton Towel','Home',220,15,''],['s3','Khadi Shirt','Clothing',780,0,'Restocking soon'],
    ['s4','Toor Dal 1 kg','Grocery',165,30,''],['s4','Sona Masoori Rice 5 kg','Grocery',390,18,''],['s4','Filter Coffee Powder 500 g','Grocery',260,9,'Chicory blend 80:20'],
    ['s4','Groundnut Oil 1 L','Grocery',210,20,''],['s4','MTR Rava Idli Mix','Grocery',95,2,''],['s4','Jaggery 1 kg','Grocery',90,14,''],['s4','Agarbatti Pack','Grocery',40,25,''],
    ['s5','Organic Toor Dal 1 kg','Grocery',210,12,''],['s5','Cold-Pressed Coconut Oil 1 L','Grocery',420,7,''],['s5','Ragi Flour 1 kg','Grocery',85,20,''],
    ['s5','Organic Honey 500 g','Grocery',350,3,''],['s5','Millet Muesli 400 g','Grocery',290,9,''],
    ['s6','Channapatna Spinning Top','Handicrafts',180,15,'Lacquered wood, safe colours'],['s6','Channapatna Train Set','Handicrafts',650,5,''],
    ['s6','Brass Diya (set of 2)','Handicrafts',340,10,''],['s6','Hand-painted Wall Plate','Handicrafts',560,2,''],['s6','Jute Tote Bag','Handicrafts',250,18,''],
    ['s7','USB-C Fast Charging Cable','Electronics',199,30,'1.5 m braided'],['s7','20W USB-C Charger','Electronics',549,10,''],['s7','LED Bulb 9W','Electronics',99,50,''],
    ['s7','Extension Board 4 socket','Electronics',399,6,''],['s7','Wired Earphones','Electronics',299,3,''],['s7','AA Batteries (pack of 4)','Electronics',120,1,''],
  ];
  const products = P.map(([shopId, name, category, price, stock, desc], i) => ({id:'p' + String(i + 1).padStart(2, '0'), shopId, name, category, price, stock, desc, active:true}));
  const pid = (s, n) => products.find(p => p.shopId === s && p.name === n);
  const O = [
    ['o01','s1','Meera','A4 Printing Paper (500)',1,122,'completed'],['o02','s1','Arjun','Blue Ball Pen (pack of 5)',3,75,'completed'],
    ['o03','s1','Sneha','Classmate Notebook 172 pages',2,50,'completed'],['o04','s1','Rahul','Classmate Notebook 172 pages',4,26,'completed'],
    ['o05','s1','Kiran','Spiral Sketchbook A4',1,3,'ready'],['o06','s2','Harsha','Drawing Book A4',1,96,'completed'],
    ['o07','s4','Ravi','Toor Dal 1 kg',1,146,'completed'],['o08','s4','Anu','Filter Coffee Powder 500 g',2,98,'completed'],
    ['o09','s4','Vikram','Sona Masoori Rice 5 kg',1,52,'completed'],['o10','s4','Divya','Toor Dal 1 kg',2,30,'completed'],
    ['o11','s5','Pooja','Cold-Pressed Coconut Oil 1 L',1,75,'completed'],['o12','s7','Tarun','20W USB-C Charger',1,121,'completed'],
    ['o13','s7','Sana','LED Bulb 9W',4,49,'completed'],['o14','s7','Nikhil','USB-C Fast Charging Cable',2,28,'completed'],
  ];
  const orders = O.map(([id, shopId, buyer, pname, qty, agoH, status]) => {
    const p = pid(shopId, pname);
    return {id:'NK-' + id.toUpperCase().replace('O', '10'), shopId, buyer, phone:'', deviceId:'seed', items:[{pid:p.id, name:p.name, price:p.price, qty}],
      fee:0, total:p.price * qty, status, mode:'pickup', address:'', note:'', agoH};
  });
  const searches = [];
  [['printer ink','Jayanagar',14],['phone tripod','Jayanagar',6],['kannada novels','Jayanagar',5],['exam pad','Jayanagar',4],
   ['almond milk','Koramangala',9],['bluetooth speaker','Koramangala',7],['banana chips','Malleshwaram',8],['kolam stencils','Indiranagar',5]]
    .forEach(([q, area, n], qi) => { for (let i = 0; i < n; i++) searches.push({id:'q' + qi + '-' + i, q, area, results:0, agoH:((i * 29 + qi * 7) % 140) + 1}); });
  [['notebook','Jayanagar',24],['saree','Jayanagar',40],['toor dal','Malleshwaram',20],['charger','Koramangala',3]]
    .forEach(([q, area, h], i) => searches.push({id:'qs-' + i, q, area, results:1, agoH:h}));
  return {v:1, shops, products, orders, searches};
}



/* Demo shops around KLE Tech, Hubballi–Dharwad. All shop names are made up for the demo. */
function addHubli(d) {
  const W = n => '9199000000' + String(n).padStart(2, '0');
  d.shops.push(
    {id:'s8', name:'Vidya Stationers', slug:'vidya-stationers', category:'Stationery', area:'Vidyanagar', address:'Opp. KLE Tech gate, Vidyanagar, Hubballi', whatsapp:W(8), desc:'Record books, drafters and calculators for engineering students.', deliveryOn:true, deliveryFee:20, readyMins:15, pin:'1234'},
    {id:'s9', name:'Basava Kirana Stores', slug:'basava-kirana-stores', category:'Grocery', area:'Vidyanagar', address:'Shirur Park Road, Vidyanagar, Hubballi', whatsapp:W(9), desc:'Daily groceries for hostels and homes. Open 7 am to 10 pm.', deliveryOn:true, deliveryFee:20, readyMins:15, pin:'1234'},
    {id:'s10', name:'Gokul Mobile Point', slug:'gokul-mobile-point', category:'Electronics', area:'Gokul Road', address:'Gokul Road, Hubballi', whatsapp:W(10), desc:'Chargers, earphones, covers and same-day screen guard fitting.', deliveryOn:true, deliveryFee:30, readyMins:20, pin:'1234'},
    {id:'s11', name:'Navalgund Weaves', slug:'navalgund-weaves', category:'Handicrafts', area:'Keshwapur', address:'Keshwapur Main Road, Hubballi', whatsapp:W(11), desc:'Navalgund durries and Kasuti embroidery from Dharwad district weavers.', deliveryOn:false, deliveryFee:40, readyMins:30, pin:'1234'},
    {id:'s12', name:'Shree Peda Bhandar', slug:'shree-peda-bhandar', category:'Bakery', area:'Deshpande Nagar', address:'Deshpande Nagar, Hubballi', whatsapp:W(12), desc:'Fresh Dharwad peda and kunda made every morning.', deliveryOn:true, deliveryFee:25, readyMins:10, pin:'1234'},
    {id:'s13', name:'Saptapur Book Centre', slug:'saptapur-book-centre', category:'Books', area:'Dharwad', address:'Saptapur, Dharwad', whatsapp:W(13), desc:'Kannada literature, competitive exam guides and second-hand textbooks.', deliveryOn:false, deliveryFee:30, readyMins:30, pin:'1234'},
  );
  const P = [
    ['s8','Long Notebook 200 pages','Stationery',70,45,'Single line'],['s8','Engineering Record Book','Stationery',95,30,'Practical record, hard bound'],
    ['s8','Mini Drafter','Stationery',340,6,'For engineering graphics'],['s8','Scientific Calculator fx-991','Electronics',1150,4,'Allowed in exams'],
    ['s8','Blue Ball Pen (pack of 5)','Stationery',50,40,''],['s8','A4 Sheets (100)','Stationery',75,25,''],['s8','Spiral Binding','Stationery',30,99,'Ready in 10 minutes'],
    ['s9','Toor Dal 1 kg','Grocery',160,25,''],['s9','Jowar Flour 1 kg','Grocery',70,20,'For jolada rotti'],['s9','Groundnut Oil 1 L','Grocery',205,15,''],
    ['s9','Maggi Noodles (pack of 4)','Grocery',56,40,''],['s9','Parle-G Biscuits','Grocery',10,80,''],['s9','Milk 500 ml','Grocery',27,30,'Morning delivery'],
    ['s10','USB-C Fast Charging Cable','Electronics',179,25,''],['s10','20W USB-C Charger','Electronics',499,8,''],['s10','Wired Earphones','Electronics',249,12,''],
    ['s10','Power Bank 10000mAh','Electronics',999,5,''],['s10','Tempered Glass (fitting included)','Electronics',149,40,''],
    ['s11','Navalgund Durrie 3×5 ft','Handicrafts',1450,4,'Handwoven cotton, GI-tagged craft'],['s11','Kasuti Embroidered Dupatta','Clothing',890,6,'Traditional Dharwad embroidery'],
    ['s11','Ilkal Saree','Clothing',1650,3,''],['s11','Cotton Table Runner','Home',380,9,''],
    ['s12','Dharwad Peda 500 g','Bakery',260,30,'Made fresh today'],['s12','Dharwad Peda 250 g','Bakery',135,40,''],['s12','Kunda 250 g','Bakery',150,15,''],
    ['s12','Besan Laddoo 250 g','Bakery',120,12,''],['s12','Girmit Masala Mix','Grocery',60,20,''],
    ['s13','KPSC Exam Guide','Books',450,6,''],['s13','Kannada Novel Collection','Books',299,8,'Set of 3 paperbacks'],['s13','Second-hand Engineering Maths','Books',180,5,''],
  ];
  const base = d.products.length;
  P.forEach(([shopId, name, category, price, stock, desc], i) => d.products.push({id:'p' + String(base + i + 1).padStart(2, '0'), shopId, name, category, price, stock, desc, active:true}));
  const pid = (s, n) => d.products.find(p => p.shopId === s && p.name === n);
  [
    ['1015','s8','Akash','Engineering Record Book',2,140,'completed'],['1016','s8','Shreya','Mini Drafter',1,96,'completed'],
    ['1017','s8','Rohan','Long Notebook 200 pages',4,50,'completed'],['1018','s8','Pallavi','Spiral Binding',2,22,'completed'],
    ['1019','s9','Manju','Toor Dal 1 kg',1,120,'completed'],['1020','s9','Kavya','Maggi Noodles (pack of 4)',2,30,'completed'],
    ['1021','s12','Prakash','Dharwad Peda 500 g',2,100,'completed'],['1022','s12','Nandini','Dharwad Peda 250 g',3,44,'completed'],
    ['1023','s10','Sagar','Tempered Glass (fitting included)',1,70,'completed'],['1024','s11','Lakshmi','Kasuti Embroidered Dupatta',1,160,'completed'],
  ].forEach(([n, shopId, buyer, pname, qty, agoH, status]) => {
    const p = pid(shopId, pname);
    d.orders.push({id:'NK-' + n, shopId, buyer, phone:'', deviceId:'seed', items:[{pid:p.id, name:p.name, price:p.price, qty}], fee:0, total:p.price * qty, status, mode:'pickup', address:'', note:'', agoH});
  });
  [['lab coat','Vidyanagar',11],['arduino uno','Vidyanagar',9],['graph book','Vidyanagar',6],['printer cartridge','Vidyanagar',4],
   ['phone tripod','Gokul Road',5],['ragi malt','Vidyanagar',3]]
    .forEach(([q, area, n], qi) => { for (let i = 0; i < n; i++) d.searches.push({id:'qh' + qi + '-' + i, q, area, results:0, agoH:((i * 23 + qi * 11) % 140) + 1}); });
  [['peda','Deshpande Nagar',12],['calculator','Vidyanagar',30],['record book','Vidyanagar',8]]
    .forEach(([q, area, h], i) => d.searches.push({id:'qhs-' + i, q, area, results:1, agoH:h}));
  return d;
}


/* Demo data v2: adds delivery times, demo UPI IDs (not real accounts), light shop-funded offers and star ratings */
function seed2() {
  const d = addHubli(seed());
  const extra = {
    s1:{deliveryMins:30, upi:'mehta.demo@nukkad'}, s2:{deliveryMins:40, upi:'ganesh.demo@nukkad'}, s3:{deliveryMins:60, upi:'kavya.demo@nukkad'},
    s4:{deliveryMins:25, upi:'annapoorna.demo@nukkad'}, s5:{deliveryMins:45, upi:'greenbasket.demo@nukkad'}, s6:{deliveryMins:45, upi:'rangoli.demo@nukkad'}, s7:{deliveryMins:35, upi:'sai.demo@nukkad'},
    s8:{deliveryMins:20, upi:'vidya.demo@nukkad'}, s9:{deliveryMins:25, upi:'basava.demo@nukkad'}, s10:{deliveryMins:30, upi:'gokul.demo@nukkad'},
    s11:{deliveryMins:60, upi:'navalgund.demo@nukkad'}, s12:{deliveryMins:20, upi:'peda.demo@nukkad'}, s13:{deliveryMins:45, upi:'saptapur.demo@nukkad'},
  };
  d.shops.forEach(s => Object.assign(s, {open:true}, extra[s.id] || {}));
  d.offers = [
    {id:'of1', shopId:'s1', kind:'pct', pct:5, minOrder:300, maxOff:30, active:true},
    {id:'of2', shopId:'s4', kind:'freedel', minOrder:499, active:true},
    {id:'of3', shopId:'s7', kind:'pct', pct:10, minOrder:500, maxOff:50, active:true},
    {id:'of4', shopId:'s3', kind:'freedel', minOrder:999, active:true},
    {id:'of5', shopId:'s8', kind:'pct', pct:5, minOrder:200, maxOff:20, active:true},
    {id:'of6', shopId:'s12', kind:'freedel', minOrder:399, active:true},
  ];
  const starsFor = [5, 4, 5, 5, 4, 5, 4, 5, 4, 5, 5, 4, 5, 4];
  d.ratings = d.orders.filter(o => o.status === 'completed').map((o, i) => ({id:'r-' + o.id, orderId:o.id, shopId:o.shopId, stars:starsFor[i % starsFor.length], text:'', deviceId:'seed', agoH:Math.max(1, o.agoH - 2)}));
  const said = {'NK-1015':'Had every record book my branch needed. Picked up between classes.', 'NK-1016':'Got the drafter 15 minutes before my EG lab. Lifesaver.',
    'NK-1021':'Peda was still warm. Best in Hubballi.', 'NK-1003':'Quick pickup, packed neatly.', 'NK-1009':'Rice was fresh, uncle even helped carry it.'};
  d.ratings.forEach(r => { if (said[r.orderId]) { r.text = said[r.orderId]; r.stars = 5; } });
  d.v = 3;
  return d;
}


/* ---------- Data layer ----------
   Three backends behind one API:
   - supabase: the real deployed apps (shared by every phone, live)
   - claude:   the preview inside Claude (shared store of the artifact)
   - local:    a demo copy kept on this device (always works, no setup) */
const COLLS = ['shops','products','orders','searches','ratings','offers'];
const S = {conn:'connecting', backend:'local', shops:[], products:[], orders:[], searches:[], ratings:[], offers:[]};
let L = loadLocal();
let DB = null, SB = null;
function loadLocal() {
  try { const r = JSON.parse(localStorage.getItem(LKEY) || 'null'); if (r && r.v === 3 && Array.isArray(r.shops)) return r; } catch (e) { /* ignore */ }
  return seed2();
}
function saveLocal() { try { localStorage.setItem(LKEY, JSON.stringify(L)); } catch (e) { /* ignore */ } }
function useLocal() { COLLS.forEach(c => { S[c] = L[c] || (L[c] = []); }); }
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
    L = {v:3}; COLLS.forEach(c => { L[c] = S[c].map(x => JSON.parse(JSON.stringify(x))); }); saveLocal();
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
  SB = sb; S.backend = 'supabase'; S.conn = 'live';
  sb.channel('nk-live').on('postgres_changes', {event:'*', schema:'public'}, p => {
    const c = String(p.table || '').replace(/^nk_/, '');
    if (!COLLS.includes(c)) return;
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


/* ---------- Derived data ---------- */
const shopById = id => S.shops.find(s => s.id === id);
const prodById = id => S.products.find(p => p.id === id);
const isOpen = s => s && s.open !== false;
const areas = () => [...new Set(S.shops.map(s => s.area).filter(Boolean))].sort();
const liveOrders = (shopId, days) => S.orders.filter(o => o.shopId === shopId && o.status !== 'cancelled' && (!days || tAt(o) > Date.now() - days * DAY));
const inArea = (s, a) => s && (a === 'All' || s.area === a);
const norm = q => String(q || '').toLowerCase().replace(/\s+/g, ' ').trim();
const toks = q => norm(synify(q)).split(' ').filter(Boolean).map(t => t.length > 3 && t.endsWith('s') ? t.slice(0, -1) : t);
function search(q, area) {
  const tk = toks(q);
  if (!tk.length) return [];
  const res = [];
  for (const p of S.products) {
    if (p.active === false) continue;
    const s = shopById(p.shopId);
    if (!inArea(s, area)) continue;
    const hay = (p.name + ' ' + p.category + ' ' + s.category + ' ' + (p.desc || '')).toLowerCase();
    if (tk.every(t => hay.includes(t))) res.push({p, s, orders:liveOrders(s.id, 30).length});
  }
  res.sort((a, b) => (isOpen(b.s) && b.p.stock > 0) - (isOpen(a.s) && a.p.stock > 0) || a.orders - b.orders || a.p.price - b.p.price);
  return res;
}
function suggestions(q, area) {
  const tk = toks(q); if (!tk.length) return [];
  const seen = new Set(), out = [];
  for (const {p, s} of search(q, area)) {
    const k = p.name.toLowerCase(); if (seen.has(k)) continue; seen.add(k);
    out.push({kind:'p', p, s}); if (out.length >= 4) break;
  }
  for (const s of S.shops) {
    if (!inArea(s, area)) continue;
    const hay = (s.name + ' ' + s.category).toLowerCase();
    if (tk.every(t => hay.includes(t))) out.push({kind:'s', s});
    if (out.length >= 6) break;
  }
  return out;
}
function radar(area) {
  const since = Date.now() - 7 * DAY, m = new Map();
  for (const s of S.searches) {
    if (s.results > 0 || s.area !== area || tAt(s) < since) continue;
    const e = m.get(s.q) || {q:s.q, n:0, last:0};
    e.n++; e.last = Math.max(e.last, tAt(s)); m.set(s.q, e);
  }
  return [...m.values()].sort((a, b) => b.n - a.n || b.last - a.last).slice(0, 6);
}
function popular(area) {
  const since = Date.now() - 30 * DAY, m = new Map();
  for (const o of S.orders) {
    if (o.status === 'cancelled' || tAt(o) < since) continue;
    const s = shopById(o.shopId);
    if (!inArea(s, area)) continue;
    for (const it of o.items || []) {
      const p = prodById(it.pid);
      if (!p || p.active === false || p.stock <= 0) continue;
      const e = m.get(p.id) || {p, s, sold:0};
      e.sold += it.qty; m.set(p.id, e);
    }
  }
  return [...m.values()].sort((a, b) => b.sold - a.sold).slice(0, 8);
}
function gems(area) {
  return S.shops.filter(s => inArea(s, area) && isOpen(s) && S.products.some(p => p.shopId === s.id && p.active !== false && p.stock > 0))
    .map(s => ({s, n:liveOrders(s.id, 30).length})).filter(x => x.n < 3).sort((a, b) => a.n - b.n).slice(0, 6);
}
function stockBadge(n) {
  if (n <= 0) return `<span class="badge b-out">${t('Out of stock')}</span>`;
  if (n <= 3) return `<span class="badge b-low">${t('Only {n} left', {n})}</span>`;
  return `<span class="badge b-ok">${t('In stock')}</span>`;
}

/* Order status, worded for each side */
function stepsFor(o) {
  const d = o.mode === 'delivery';
  return [
    {k:'pending', t:t('Order placed'), s:t('Sent to the shop')},
    {k:'confirmed', t:t('Accepted by shop'), s:t('They’re packing it now')},
    {k:'ready', t:d ? t('Out for delivery') : t('Ready for pickup'), s:d ? t('On its way to you') : t('Collect it from the shop')},
    {k:'completed', t:d ? t('Delivered') : t('Picked up'), s:t('Thank you for shopping local')},
  ];
}
function statusText(o) {
  if (o.status === 'cancelled') return t('Cancelled');
  return stepsFor(o).find(x => x.k === o.status)?.t || o.status;
}
const statusPill = o => `<span class="st st-${esc(o.status)}">${esc(statusText(o))}</span>`;
function orderMsg(o, s) {
  return [
    '🛍️ *New order on Nukkad*',
    `Order ${o.id} · ${s.name}`, '',
    ...o.items.map(i => `• ${i.qty} × ${i.name} — ${rs(i.price * i.qty)}`),
    ...(o.fee ? [`• Delivery — ${rs(o.fee)}`] : []), '',
    `*Total: ${rs(o.total)}*`,
    `Name: ${o.buyer}`,
    o.phone ? `Phone: ${prettyPhone(o.phone)}` : null,
    o.mode === 'delivery' ? `Deliver to: ${o.address}` : 'Pickup from shop',
    o.note ? `Note: ${o.note}` : null,
    'Payment: UPI or cash to the shop', '',
    '_Ordered via Nukkad_',
  ].filter(x => x !== null).join('\n');
}
function buyerMsg(o, s) {
  const st = {
    confirmed:`Hi ${o.buyer}, ${s.name} here. We’ve got your Nukkad order ${o.id} and we’re packing it now.`,
    ready:o.mode === 'delivery' ? `Hi ${o.buyer}, your Nukkad order ${o.id} from ${s.name} is out for delivery.` : `Hi ${o.buyer}, your Nukkad order ${o.id} is ready for pickup at ${s.name}. See you soon!`,
    completed:`Thank you for shopping at ${s.name}, ${o.buyer}! 🙏`,
    cancelled:`Hi ${o.buyer}, sorry, ${s.name} can’t fulfil order ${o.id} right now.`,
  };
  return st[o.status] || `Hi ${o.buyer}, this is ${s.name} about your Nukkad order ${o.id}.`;
}
const fmtWa = m => esc(m).replace(/\*([^*\n]+)\*/g, '<b>$1</b>').replace(/(^|\s)_([^_\n]+)_/g, '$1<i>$2</i>');


/* ---------- Ratings, offers, recommendations, delivery slots ---------- */
function shopRating(id) {
  const rs_ = S.ratings.filter(r => r.shopId === id && r.stars);
  if (!rs_.length) return {avg:0, n:0};
  return {avg:rs_.reduce((a, r) => a + Number(r.stars), 0) / rs_.length, n:rs_.length};
}
function ratingChip(s) {
  const {avg, n} = shopRating(s.id);
  return n ? `<span class="rchip">${ICON.star}${avg.toFixed(1)} <small>(${n})</small></span>` : `<span class="rchip new">${t('New')}</span>`;
}
const OFFER_MAX_PCT = 15, OFFER_MAX_OFF = 100;
const offersFor = shopId => S.offers.filter(o => o.shopId === shopId && o.active !== false);
function offerTitle(o) {
  if (o.kind === 'freedel') return t('Free delivery above {min}', {min:rs(o.minOrder)});
  return t('{pct}% off above {min}', {pct:o.pct, min:rs(o.minOrder)}) + ' · ' + t('up to {max}', {max:rs(o.maxOff)});
}
function bestOffer(shopId, sub, fee) {
  let best = null;
  for (const o of offersFor(shopId)) {
    if (sub < Number(o.minOrder || 0)) continue;
    const save = o.kind === 'freedel' ? fee : Math.min(Math.round(sub * Math.min(OFFER_MAX_PCT, Number(o.pct) || 0) / 100), Math.min(OFFER_MAX_OFF, Number(o.maxOff) || 0));
    if (save > 0 && (!best || save > best.save)) best = {o, save};
  }
  return best;
}
function nextOffer(shopId, sub) {
  const ups = offersFor(shopId).filter(o => sub < Number(o.minOrder || 0)).sort((a, b) => a.minOrder - b.minOrder);
  return ups[0] ? {o:ups[0], need:ups[0].minOrder - sub} : null;
}
function recommended(area) {
  const mine = S.orders.filter(o => o.deviceId === DEVICE && o.status !== 'cancelled');
  const shopW = {}, catW = {}, bought = new Set();
  for (const o of mine) {
    shopW[o.shopId] = (shopW[o.shopId] || 0) + 1;
    for (const it of o.items || []) { bought.add(it.pid); const p = prodById(it.pid); if (p) catW[p.category] = (catW[p.category] || 0) + 1; }
  }
  C.favs.forEach(id => { shopW[id] = (shopW[id] || 0) + 1; });
  const pop = new Map(popular(area).map(x => [x.p.id, x.sold]));
  const scored = [];
  for (const p of S.products) {
    const s = shopById(p.shopId);
    if (!s || p.active === false || p.stock <= 0 || !isOpen(s) || !inArea(s, area) || bought.has(p.id)) continue;
    const score = (shopW[s.id] || 0) * 3 + (catW[p.category] || 0) * 2 + (pop.get(p.id) || 0) * .5 + (liveOrders(s.id, 30).length < 3 ? .8 : 0);
    if (score > 0) scored.push({p, s, score, why:shopW[s.id] ? t('From {shop}, a shop you like', {shop:s.name}) : catW[p.category] ? t('Because you buy {cat}', {cat:t(p.category)}) : t('Popular near you')});
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, 8);
}
function together(lines) {
  if (!lines.length) return [];
  const inBag = new Set(lines.map(l => l.p.id)), shopId = lines[0].p.shopId, co = new Map();
  for (const o of S.orders) {
    if (o.shopId !== shopId) continue;
    const ids = (o.items || []).map(i => i.pid);
    if (!ids.some(id => inBag.has(id))) continue;
    ids.forEach(id => { if (!inBag.has(id)) co.set(id, (co.get(id) || 0) + 1); });
  }
  const cats = new Set(lines.map(l => l.p.category));
  const pool = S.products.filter(p => p.shopId === shopId && !inBag.has(p.id) && p.active !== false && p.stock > 0);
  return pool.map(p => ({p, score:(co.get(p.id) || 0) * 2 + (cats.has(p.category) ? 1 : 0)})).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map(x => x.p);
}
const deliveryRange = s => { const m = Number(s.deliveryMins) || (Number(s.readyMins) || 30) + 15; return `${Math.max(10, m - 10)}–${m}`; };
function slotsFor() {
  const out = [], now = new Date(), open = 9, close = 21;
  for (let d = 0; d < 2 && out.length < 6; d++) {
    for (let h = open; h < close && out.length < 6; h += 2) {
      const st = new Date(now); st.setDate(now.getDate() + d); st.setHours(h, 0, 0, 0);
      if (st.getTime() < Date.now() + 45 * 60e3) continue;
      const fmt = x => x.toLocaleTimeString('en-IN', {hour:'numeric', hour12:true}).replace(' ', '').toLowerCase();
      const end = new Date(st); end.setHours(h + 2);
      out.push({key:st.toISOString(), day:d === 0 ? t('Today') : t('Tomorrow'), label:`${fmt(st)}–${fmt(end)}`});
    }
  }
  return out;
}
function whenText(o) {
  if (!o.when || o.when === 'now') return t('As soon as possible');
  const st = new Date(o.when), end = new Date(st); end.setHours(st.getHours() + 2);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dd = Math.round((new Date(st).setHours(0, 0, 0, 0) - today.getTime()) / DAY);
  const day = dd === 0 ? t('Today') : dd === 1 ? t('Tomorrow') : st.toLocaleDateString('en-IN', {day:'numeric', month:'short'});
  const fmt = x => x.toLocaleTimeString('en-IN', {hour:'numeric', hour12:true}).replace(' ', '').toLowerCase();
  return `${day} ${fmt(st)}–${fmt(end)}`;
}

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




/* ---------- App state ---------- */
const readJSON = (k, d) => { try { return JSON.parse(ls(k) || 'null') ?? d; } catch (e) { return d; } };
const C = {
  tab:'home', screen:'home', q:'', qDraft:'', sort:'best', area:ls('area') || 'Vidyanagar', cat:null, shopId:null, shopCat:'All',
  cart:{}, cartShop:null, sheet:null, pendingAdd:null, err:'', orderId:null, slide:0, bump:false, when:'now', listening:false,
  form:{name:ls('name') || '', phone:ls('phone') || '', mode:'pickup', address:ls('addr') || '', note:''},
  favs:new Set(readJSON('favs', [])), recent:readJSON('recent', []), rateDraft:{}, paidClaim:new Set(readJSON('paid', [])),
};
const V = {
  shopId:ls('seller-shop'), pick:null, pin:'', pinErr:false, tab:'orders', ordTab:'new', reg:null, regErr:'',
  ai:'', aiBusy:false, aiNote:'', draft:[], photo:null, pq:'', arm:null, flash:null, radarFlash:null, seen:null, newCount:0,
  offer:{kind:'pct', pct:5, minOrder:300, maxOff:30}, offerErr:'', poster:false,
};
const FX = {enter:true, count:true, sheet:true};
const ACT = {}, CHANGE = {}, SUBMIT = {};

/* ---------- Sound + notifications ---------- */
let AC = null;
function unlockAudio() { try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { AC = null; } }
function chime() {
  if (!AC) return;
  try {
    [880, 1320].forEach((f, i) => {
      const o = AC.createOscillator(), g = AC.createGain(), tt = AC.currentTime + i * .16;
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, tt); g.gain.exponentialRampToValueAtTime(.18, tt + .02); g.gain.exponentialRampToValueAtTime(.0001, tt + .38);
      o.connect(g).connect(AC.destination); o.start(tt); o.stop(tt + .4);
    });
  } catch (e) { /* audio unavailable */ }
}
let seenStatus = null;
function afterData() {
  if (V.shopId) {
    const mine = S.orders.filter(o => o.shopId === V.shopId);
    if (!V.seen) V.seen = new Set(mine.map(o => o.id));
    else {
      const fresh = mine.filter(o => !V.seen.has(o.id));
      fresh.forEach(o => V.seen.add(o.id));
      const incoming = fresh.filter(o => o.status === 'pending' && tAt(o) > Date.now() - 10 * 60e3);
      if (incoming.length && APP() === 'seller') {
        V.flash = incoming[0].id; V.ordTab = 'new'; V.newCount += incoming.length;
        chime(); buzz([60, 40, 60]);
        toast('🔔 ' + t('New order from {name}', {name:incoming[0].buyer}) + ' · ' + rs(incoming[0].total));
        clearFlash();
        try { if (document.hidden && 'Notification' in window && Notification.permission === 'granted') new Notification('Nukkad', {body:t('New order from {name}', {name:incoming[0].buyer}) + ' · ' + rs(incoming[0].total)}); } catch (e) { /* not allowed */ }
      }
    }
  }
  const my = S.orders.filter(o => o.deviceId === DEVICE);
  if (!seenStatus) { seenStatus = {}; my.forEach(o => { seenStatus[o.id] = o.status; }); return; }
  for (const o of my) {
    if (seenStatus[o.id] && seenStatus[o.id] !== o.status && APP() === 'customer') {
      const s = shopById(o.shopId);
      toast(o.status === 'cancelled' ? t('{shop} couldn’t take order {id}.', {shop:s ? s.name : t('The shop'), id:o.id}) : `${o.status === 'completed' ? '🎉' : '📦'} ${statusText(o)} · ${o.id}`);
      buzz(40);
    }
    seenStatus[o.id] = o.status;
  }
}
function clearFlash() {
  setTimeout(() => { V.flash = null; V.radarFlash = null; document.querySelectorAll('.flash').forEach(e => e.classList.remove('flash')); }, 3200);
}
let toastT;
function toast(m) {
  const el = $('#toast'); if (!el) return;
  el.textContent = m; el.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 3400);
}
function connChip() {
  if (S.conn === 'live') return `<span class="conn live" title="${esc(t('Orders sync across devices'))}"><i></i>${t('Live')}</span>`;
  if (S.conn === 'connecting') return `<span class="conn"><i></i>${t('Syncing')}</span>`;
  return `<span class="conn" title="${esc(t('Changes stay on this device'))}"><i></i>${t('Demo')}</span>`;
}
function langBtn() {
  return `<button class="langbtn" type="button" data-act="lang" aria-label="${esc(t('Change language'))}">${ICON.globe}<span>${LANGS[LANG].short}</span></button>`;
}
function langSheet() {
  return `<div class="scrim" data-act="lang-close"></div>
  <div class="sheet ${FX.sheet ? '' : 'still'}" role="dialog" aria-modal="true" aria-label="${esc(t('Choose language'))}">
    <span class="grab" aria-hidden="true"></span>
    <h2 class="h2">${t('Choose language')}</h2>
    <div class="langs">${Object.entries(LANGS).map(([k, l]) => `<button type="button" class="langopt" data-act="lang-set" data-v="${k}" aria-pressed="${k === LANG}"><b>${l.name}</b><span>${l.sample}</span></button>`).join('')}</div>
    <p class="small muted">${t('Shop and product names stay as the shop wrote them.')}</p>
  </div>`;
}
function nav(items, current, act) {
  return `<nav class="nav" aria-label="${esc(t('Main'))}">${items.map(([k, label, icon, count]) =>
    `<button type="button" data-act="${act}" data-v="${k}" ${k === current ? 'aria-current="page"' : ''}>${ICON[icon]}${label}${count ? `<span class="dotc">${count}</span>` : ''}</button>`).join('')}</nav>`;
}
function qrSvg(text, px = 4) {
  if (!window.qrcode) return '';
  try { const q = window.qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({cellSize:px, margin:2, scalable:true}); } catch (e) { return ''; }
}
const publicBase = () => (CFG.publicUrl || (location.origin + location.pathname.replace(/seller\/?(index\.html)?$/, '').replace(/index\.html$/, ''))).replace(/\/?$/, '/');

/* ---------- Install as an app ---------- */
let installEvt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; render(); });
window.addEventListener('appinstalled', () => { installEvt = null; toast(t('Installed! Find Nukkad on your home screen.')); render(); });
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
function installCard(appName) {
  if (IN_CLAUDE || isStandalone() || ls('install-hide')) return '';
  if (!installEvt && !isIOS()) return '';
  return `<div class="install">${ICON.download}<span class="row-main"><b>${t('Install {app} on your phone', {app:appName})}</b><span class="row-m">${installEvt ? t('Opens full screen, like any app.') : t('Tap Share, then “Add to Home Screen”.')}</span></span>
    ${installEvt ? `<button class="btn btn-go btn-sm" type="button" data-act="install">${t('Install')}</button>` : ''}<button class="icon-btn" type="button" data-act="install-hide" aria-label="${esc(t('Hide'))}">×</button></div>`;
}
ACT['install'] = async () => { if (!installEvt) return; installEvt.prompt(); try { await installEvt.userChoice; } catch (e) { /* ignore */ } installEvt = null; render(); };
ACT['install-hide'] = () => { ls('install-hide', '1'); render(); };
ACT['lang'] = () => { UI.sheet = 'lang'; FX.sheet = true; render(); };
ACT['lang-close'] = () => { UI.sheet = null; render(); };
ACT['lang-set'] = v => { setLang(v); UI.sheet = null; FX.enter = true; render(); toast(LANGS[v].hello); };
const UI = {sheet:null};

/* ---------- Render + effects ---------- */
function scrollTop() { window.scrollTo({top:0}); }
function countUps() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('[data-count]').forEach(el => {
    const to = Number(el.dataset.count) || 0, money = el.dataset.money, t0 = performance.now();
    if (!to) return;
    const step = tt => { const k = Math.min(1, (tt - t0) / 700), v = Math.round(to * (1 - Math.pow(1 - k, 3))); el.textContent = money ? rs(v) : v; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}
let heroWired = null, heroTouched = 0;
function wireHero() {
  const h = $('#hero'); if (!h || h === heroWired) return;
  heroWired = h;
  h.scrollLeft = C.slide * h.clientWidth;
  let tm;
  h.addEventListener('scroll', () => { clearTimeout(tm); tm = setTimeout(() => {
    const i = Math.round(h.scrollLeft / Math.max(1, h.clientWidth)); C.slide = i;
    document.querySelectorAll('.dots i').forEach((d, j) => d.classList.toggle('on', j === i));
  }, 80); }, {passive:true});
  h.addEventListener('pointerdown', () => { heroTouched = Date.now(); }, {passive:true});
}
setInterval(() => {
  const h = $('#hero'); if (!h || document.hidden || Date.now() - heroTouched < 7000 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const n = h.children.length || 3;
  C.slide = (C.slide + 1) % n; h.scrollTo({left:C.slide * h.clientWidth, behavior:'smooth'});
}, 4500);
function render() {
  const root = $('#app'); if (!root) return;
  const a = document.activeElement, id = a && a.id;
  let ss = null, se = null;
  try { ss = a.selectionStart; se = a.selectionEnd; } catch (e) { /* not text */ }
  document.documentElement.lang = LANGS[LANG].code;
  root.innerHTML = (APP() === 'seller' ? renderSeller() : renderCustomer()) + (UI.sheet === 'lang' ? langSheet() : '');
  document.title = APP() === 'seller' ? 'Nukkad for Shops' : 'Nukkad';
  if (id) {
    const n = document.getElementById(id);
    if (n && n !== document.body) { n.focus({preventScroll:true}); try { if (ss !== null) n.setSelectionRange(ss, se); } catch (e) { /* ignore */ } }
  }
  wireHero();
  if (FX.count) countUps();
  FX.enter = false; FX.count = false; FX.sheet = false;
}

/* ---------- Event wiring ---------- */
document.addEventListener('pointerdown', unlockAudio, {passive:true});
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) return;
  const fn = ACT[el.dataset.act];
  if (fn) fn(el.dataset.v || '', el, e);
});
document.addEventListener('change', e => {
  const el = e.target, fn = CHANGE[el.dataset.act];
  if (fn) fn(el, e);
});
document.addEventListener('submit', e => {
  e.preventDefault();
  const fn = SUBMIT[e.target.id];
  if (fn) fn(e.target, e);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (UI.sheet) UI.sheet = null; if (C.sheet) C.sheet = null; V.poster = false; render(); const b = $('#sugg'); if (b) b.hidden = true; }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role="button"][data-act]')) { e.preventDefault(); e.target.click(); }
});
window.addEventListener('hashchange', () => { FX.enter = true; FX.count = true; render(); scrollTop(); });
window.addEventListener('storage', e => { if (e.key === LKEY && S.backend === 'local') { L = loadLocal(); useLocal(); afterData(); render(); } });
setInterval(() => { const a = document.activeElement; if (!C.sheet && !UI.sheet && (!a || !/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) render(); }, 30000);


/* =========================================================
   CUSTOMER APP
   ========================================================= */
const qtyIn = pid => C.cart[pid] || 0;
function cartLines() { return Object.entries(C.cart).filter(([, q]) => q > 0).map(([pid, q]) => ({p:prodById(pid), q})).filter(x => x.p); }
const catName = c => t(c === 'Handicrafts' ? 'Crafts' : c);
function addCtl(p, s) {
  if (!isOpen(s)) return `<button class="add" type="button" disabled>${t('Closed')}</button>`;
  if (p.stock <= 0) return `<button class="add" type="button" disabled>${t('Sold out')}</button>`;
  const q = qtyIn(p.id);
  if (!q) return `<button class="add" type="button" data-act="c-add" data-v="${esc(p.id)}" aria-label="${esc(t('Add'))} ${esc(p.name)}">${t('ADD')} +</button>`;
  return `<div class="step" role="group" aria-label="${esc(p.name)}"><button type="button" data-act="c-qty" data-v="${esc(p.id)}|-1" aria-label="${esc(t('One less'))}">−</button><span>${q}</span><button type="button" data-act="c-qty" data-v="${esc(p.id)}|1" ${q >= p.stock ? 'disabled' : ''} aria-label="${esc(t('One more'))}">+</button></div>`;
}
function pcard(p, s, extra = '') {
  return `<div class="pcard">
    <button type="button" class="r-shop" data-act="c-shop" data-v="${esc(s.id)}" style="display:grid;gap:8px" aria-label="${esc(p.name)} · ${esc(s.name)}">${thumb(p, 'lg')}<span class="nm">${esc(p.name)}</span></button>
    <span class="sh">${extra || esc(s.name)}</span>
    <div class="ft"><span class="price">${rs(p.price)}</span>${addCtl(p, s)}</div>
  </div>`;
}
function shopCard(s) {
  const n = liveOrders(s.id, 30).length, fav = C.favs.has(s.id), off = offersFor(s.id)[0];
  return `<div class="shopcard" role="button" tabindex="0" data-act="c-shop" data-v="${esc(s.id)}">
    <span class="mono">${esc(s.name[0])}</span>
    <span class="row-main"><span class="row-t">${esc(s.name)}</span>
      <span class="row-m">${ratingChip(s)} · ${t(s.category)} · ${esc(s.area)}</span>
      <span class="meta">${isOpen(s) ? `<span class="badge b-plain">⏱ ${Number(s.readyMins) || 30} ${t('min')}</span>` : `<span class="badge b-closed">${t('Closed now')}</span>`}${s.deliveryOn ? `<span class="badge b-plain">🛵 ${deliveryRange(s)} ${t('min')}</span>` : ''}${off ? `<span class="badge b-offer">🎁 ${esc(offerTitle(off).split(' · ')[0])}</span>` : ''}${n < 3 ? `<span class="badge b-gem">${t('Local Gem')}</span>` : ''}</span></span>
    <button class="heart" type="button" data-act="c-fav" data-v="${esc(s.id)}" aria-pressed="${fav}" aria-label="${esc(fav ? t('Remove from favourites') : t('Save to favourites'))}">${ICON.heart}</button>
  </div>`;
}
const VOICE = window.SpeechRecognition || window.webkitSpeechRecognition;
function renderCustomer() {
  const myActive = S.orders.filter(o => o.deviceId === DEVICE && !['completed','cancelled'].includes(o.status)).length;
  let body;
  switch (C.screen) {
    case 'search': body = cSearch(); break;
    case 'cat': body = cCat(); break;
    case 'shop': body = cShop(); break;
    case 'track': body = cTrack(); break;
    case 'orders': body = cOrders(); break;
    case 'saved': body = cSaved(); break;
    default: body = cHome();
  }
  const lines = cartLines(), count = lines.reduce((a, l) => a + l.q, 0), sub = lines.reduce((a, l) => a + l.p.price * l.q, 0);
  const bagShop = shopById(C.cartShop);
  const showSearch = C.screen !== 'track';
  return `
  <header class="top"><div class="gut">
    <div class="top-in">
      <button class="brand" type="button" data-act="c-home" aria-label="Nukkad home">${ICON.logo}<b>nukkad</b></button>
      <div class="top-r">${connChip()}${langBtn()}
        <label class="loc">${ICON.pin}<span class="sr">${t('Your area')}</span><select id="c-area" data-act="c-area">${['All', ...areas()].map(a => `<option value="${esc(a)}" ${a === C.area ? 'selected' : ''}>${a === 'All' ? t('All areas') : esc(a)}</option>`).join('')}</select></label>
      </div>
    </div>
    ${showSearch ? `<div class="searchwrap">
      <form class="search" id="c-search" role="search" autocomplete="off">${ICON.search}
        <input id="c-q" type="search" placeholder="${esc(t('Search notebook, saree, toor dal…'))}" value="${esc(C.qDraft)}" aria-label="${esc(t('Search products near you'))}" aria-controls="sugg" aria-autocomplete="list">
        ${VOICE ? `<button class="mic ${C.listening ? 'on' : ''}" type="button" data-act="c-voice" aria-label="${esc(t('Search by voice'))}">${ICON.mic}</button>` : ''}
        <button class="btn btn-go btn-sm" type="submit">${t('Search')}</button>
      </form>
      <div id="sugg" class="sugg" hidden></div>
    </div>` : ''}
  </div></header>
  <main class="gut ${FX.enter ? 'enter' : ''}">${body}</main>
  ${count && !C.sheet && C.screen !== 'track' ? `<div class="bagbar ${C.bump ? 'bump' : ''}"><button type="button" data-act="c-bag">
    <span class="bi">${ICON.bag}</span><span style="min-width:0"><b>${t('{n} items', {n:count})} · ${rs(sub)}</b><small>${esc(bagShop ? bagShop.name : '')}</small></span><span class="go">${t('View bag')} →</span></button></div>` : ''}
  ${nav([['home', t('Home'), 'home'], ['search', t('Search'), 'search'], ['saved', t('Saved'), 'heart'], ['orders', t('Orders'), 'bag', myActive]], C.tab, 'c-tab')}
  ${C.sheet === 'bag' ? cBagSheet() : ''}${C.sheet === 'switch' ? cSwitchSheet() : ''}`;
}
function cHome() {
  const a = C.area, g = gems(a), pop = popular(a), rec = recommended(a), shops = S.shops.filter(s => inArea(s, a)).sort((x, y) => isOpen(y) - isOpen(x) || shopRating(y.id).avg - shopRating(x.id).avg);
  const name = C.form.name ? ', ' + esc(C.form.name.split(' ')[0]) : '';
  const gem = g[0] && g[0].s;
  const favShops = S.shops.filter(s => C.favs.has(s.id));
  const offers = S.offers.filter(o => o.active !== false && inArea(shopById(o.shopId), a) && isOpen(shopById(o.shopId))).slice(0, 6);
  const hadOrders = S.orders.some(o => o.deviceId === DEVICE);
  if (S.conn === 'connecting' && !S.shops.length) return `<div class="skel" style="height:150px"></div><div class="skel" style="height:80px"></div><div class="skel" style="height:220px"></div>`;
  return `
  ${installCard('Nukkad')}
  <div class="sec"><p class="eyebrow">${t('Namaste')}${name} 👋</p><h1 class="h1">${t('What do you need from your street today?')}</h1></div>
  <div class="sec">
    <div class="hero" id="hero" aria-label="${esc(t('Highlights'))}">
      <div class="slide"><div><h3>${t('Ready in about 20 minutes')}</h3><p>${t('Order from shops on your street. Pick it up on your way home.')}</p><button class="btn" type="button" data-act="c-jump" data-v="shops">${t('Explore shops')}</button></div><span class="big" aria-hidden="true">🛍️</span></div>
      <div class="slide s2"><div><h3>${t('Discover Local Gems')}</h3><p>${gem ? t('{shop} and other small shops near you.', {shop:esc(gem.name)}) : t('Small shops near you that deserve a visit.')}</p>${gem ? `<button class="btn" type="button" data-act="c-shop" data-v="${esc(gem.id)}">${t('Visit {shop}', {shop:esc(gem.name.split(' ')[0])})}</button>` : ''}</div><span class="big" aria-hidden="true">🪔</span></div>
      <div class="slide s3"><div><h3>${t('Your money stays on your street')}</h3><p>${t('Zero commission. Pay the shop directly by UPI or cash.')}</p><button class="btn" type="button" data-act="c-focus-search">${t('Start shopping')}</button></div><span class="big" aria-hidden="true">🤝</span></div>
    </div>
    <div class="dots" aria-hidden="true">${[0, 1, 2].map(i => `<i class="${i === C.slide ? 'on' : ''}"></i>`).join('')}</div>
  </div>
  <div class="cats">${['Stationery','Grocery','Clothing','Electronics','Handicrafts'].map(c => `<button class="cat" type="button" data-act="c-cat" data-v="${c}"><span class="th" style="background:${tint(c)}">${CATEMO[c]}</span>${catName(c)}</button>`).join('')}</div>
  ${offers.length ? `<section class="sec"><div class="sec-h"><h2 class="h2">${t('Offers from shops')} 🎁</h2><span class="small muted">${t('Paid by the shop, not hidden in prices')}</span></div>
    <div class="hscroll offers">${offers.map(o => { const s = shopById(o.shopId); return `<button class="offer" type="button" data-act="c-shop" data-v="${esc(s.id)}"><span class="o-k">${o.kind === 'freedel' ? '🛵' : o.pct + '%'}</span><b>${esc(offerTitle(o))}</b><span class="row-m">${esc(s.name)}</span></button>`; }).join('')}</div></section>` : ''}
  ${rec.length ? `<section class="sec"><div class="sec-h"><h2 class="h2">${hadOrders || C.favs.size ? t('Recommended for you') : t('Picked for you')} ✨</h2><span class="small muted">${t('Based on what you like')}</span></div>
    <div class="hscroll">${rec.map(({p, s, why}) => pcard(p, s, `<span title="${esc(why)}">${esc(s.name)}</span>`)).join('')}</div></section>` : ''}
  ${favShops.length ? `<section class="sec"><div class="sec-h"><h2 class="h2">${t('Your favourites')}</h2><button class="link" type="button" data-act="c-tab" data-v="saved">${t('See all')}</button></div>
    <div class="hscroll">${favShops.map(s => `<button class="gem" type="button" data-act="c-shop" data-v="${esc(s.id)}"><span class="mono">${esc(s.name[0])}</span><b>${esc(s.name)}</b><span class="row-m">${ratingChip(s)}</span></button>`).join('')}</div></section>` : ''}
  ${g.length ? `<section class="sec"><div class="sec-h"><h2 class="h2">${t('Local Gems')} 💎</h2><span class="small muted">${t('Small shops worth a visit')}</span></div>
    <div class="hscroll">${g.map(({s}) => `<button class="gem" type="button" data-act="c-shop" data-v="${esc(s.id)}"><span class="mono">${esc(s.name[0])}</span><b>${esc(s.name)}</b><span class="row-m">${t(s.category)} · ${esc(s.area)}</span><span class="tag">${t('Hidden gem')}</span></button>`).join('')}</div></section>` : ''}
  ${pop.length ? `<section class="sec"><div class="sec-h"><h2 class="h2">${t('Popular near you')} 🔥</h2><span class="small muted">${t('Ordered this month')}</span></div>
    <div class="hscroll">${pop.map(({p, s, sold}) => pcard(p, s, esc(s.name) + ' · ' + t('{n} sold', {n:sold}))).join('')}</div></section>` : ''}
  <div class="assure">
    <div>${ICON.clock}<b>${t('Now or pick a time')}</b></div>
    <div>${ICON.truck}<b>${t('Pickup or shop delivery')}</b></div>
    <div>${ICON.shield}<b>${t('Pay the shop by UPI')}</b></div>
  </div>
  <section class="sec" id="shops"><div class="sec-h"><h2 class="h2">${a === 'All' ? t('All shops') : t('Shops in {area}', {area:esc(a)})}</h2><span class="small muted">${t('{n} shops', {n:shops.length})}</span></div>
    ${shops.length ? `<div class="shopcards">${shops.map(shopCard).join('')}</div>` : `<div class="empty"><span class="big">🏘️</span><b>${t('No shops here yet')}</b><span>${t('Pick another area at the top.')}</span></div>`}
  </section>
  <a class="foot-link" href="${IN_CLAUDE ? '#seller' : 'seller/'}"><span><b>${t('Own a shop?')}</b><br><span class="small muted">${t('Open Nukkad for Shops. Free, no commission.')}</span></span><span class="arrow" aria-hidden="true">→</span></a>`;
}
function cSearch() {
  if (!C.q) {
    const pop = popular(C.area).slice(0, 4);
    return `<div class="sec"><h1 class="h1" style="font-size:25px">${t('Find it on your street')}</h1><p class="sub">${t('Type or tap the mic. English, हिंदी or ಕನ್ನಡ all work.')}</p></div>
    ${C.recent.length ? `<section class="sec"><div class="sec-h"><h2 class="h2">${t('Recent')}</h2><button class="link" type="button" data-act="c-clear-recent">${t('Clear')}</button></div>
      <div class="chips">${C.recent.map(q => `<button class="chip" type="button" data-act="c-chip" data-v="${esc(q)}">🕘 ${esc(q)}</button>`).join('')}</div></section>` : ''}
    <section class="sec"><h2 class="h2">${t('Try these')}</h2><div class="chips">${['notebook','saree','toor dal','charger','pen','printer ink','honey','चावल','ಸೀರೆ'].map(q => `<button class="chip" type="button" data-act="c-chip" data-v="${q}">${q}</button>`).join('')}</div></section>
    ${pop.length ? `<section class="sec"><h2 class="h2">${t('Popular near you')}</h2><div class="pgrid">${pop.map(({p, s}) => pcard(p, s)).join('')}</div></section>` : ''}`;
  }
  let res = search(C.q, C.area);
  if (C.sort === 'price') res = [...res].sort((a, b) => a.p.price - b.p.price);
  if (C.sort === 'rating') res = [...res].sort((a, b) => shopRating(b.s.id).avg - shopRating(a.s.id).avg);
  if (C.sort === 'stock') res = res.filter(r => r.p.stock > 0 && isOpen(r.s));
  const where = C.area === 'All' ? '' : ' · ' + C.area;
  let h = `<button class="back" type="button" data-act="c-search-reset">‹ ${t('New search')}</button>
    <div class="sec"><h1 class="h1" style="font-size:25px">“${esc(C.q)}”</h1><p class="sub">${t('{n} results', {n:res.length})}${esc(where)}</p></div>
    <div class="chips" role="group" aria-label="${esc(t('Sort'))}">${[['best', t('Best match')], ['price', t('Lowest price')], ['rating', t('Top rated')], ['stock', t('In stock now')]].map(([k, l]) => `<button class="chip" type="button" data-act="c-sort" data-v="${k}" aria-pressed="${C.sort === k}">${l}</button>`).join('')}</div>`;
  if (!res.length) return h + `<div class="empty"><span class="big">📡</span><b>${t('No shop here has this yet')}</b>
    <span>${t('We’ve told shops nearby that people want “{q}”. Try another area, or check back soon.', {q:esc(C.q)})}</span>
    ${C.area !== 'All' ? `<button class="btn btn-ghost btn-sm" type="button" data-act="c-all-areas">${t('Search all areas')}</button>` : ''}</div>`;
  const groups = new Map();
  for (const r of res) { const k = r.p.name.toLowerCase(); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); }
  for (const rows of groups.values()) {
    let best = -1;
    if (rows.length > 1) rows.forEach((r, i) => { if (r.p.stock > 0 && isOpen(r.s) && (best < 0 || r.p.price < rows[best].p.price)) best = i; });
    h += `<div class="card result"><div class="r-name">${thumb(rows[0].p)}<span class="row-main"><span>${esc(rows[0].p.name)}</span>${rows.length > 1 ? `<span class="r-cmp">${t('Compare {n} shops', {n:rows.length})}</span>` : `<span class="row-m">${esc(rows[0].p.desc || t(rows[0].p.category))}</span>`}</span></div>
      <ul class="r-rows">${rows.map((r, i) => `<li>
        <button type="button" class="r-shop" data-act="c-shop" data-v="${esc(r.s.id)}"><span class="row-main"><span class="row-t">${esc(r.s.name)}</span>
          <span class="row-m">${ratingChip(r.s)} · ${isOpen(r.s) ? '⏱ ' + (Number(r.s.readyMins) || 30) + ' ' + t('min') : t('Closed now')}</span>
          <span class="meta">${i === best ? `<span class="badge b-best">${t('Best price')}</span>` : ''}${r.orders < 3 ? `<span class="badge b-gem">${t('Local Gem')}</span>` : ''}${stockBadge(r.p.stock)}</span></span></button>
        <span class="r-right"><span class="price">${rs(r.p.price)}</span>${addCtl(r.p, r.s)}</span></li>`).join('')}</ul></div>`;
  }
  return h;
}
function cCat() {
  const c = C.cat;
  const items = S.products.filter(p => p.active !== false && (p.category === c || (shopById(p.shopId) || {}).category === c)).map(p => ({p, s:shopById(p.shopId)})).filter(x => inArea(x.s, C.area))
    .sort((a, b) => (isOpen(b.s) && b.p.stock > 0) - (isOpen(a.s) && a.p.stock > 0) || a.p.price - b.p.price);
  return `<button class="back" type="button" data-act="c-home">‹ ${t('Home')}</button>
  <div class="sec" style="grid-template-columns:auto 1fr;align-items:center;gap:12px"><span class="th" style="background:${tint(c)}">${CATEMO[c] || '🛍️'}</span><div><h1 class="h1" style="font-size:25px">${catName(c)}</h1><p class="sub">${t('{n} items', {n:items.length})}</p></div></div>
  ${items.length ? `<div class="pgrid">${items.map(({p, s}) => pcard(p, s)).join('')}</div>` : `<div class="empty"><span class="big">${CATEMO[c] || '🛍️'}</span><b>${t('Nothing here yet')}</b><span>${t('Try “All areas” at the top.')}</span></div>`}`;
}
function cShop() {
  const s = shopById(C.shopId);
  if (!s) return `<button class="back" type="button" data-act="c-home">‹ ${t('Home')}</button><div class="empty"><b>${t('This shop isn’t listed any more')}</b></div>`;
  const all = S.products.filter(p => p.shopId === s.id && p.active !== false);
  const cats = [...new Set(all.map(p => p.category))];
  const ps = C.shopCat === 'All' ? all : all.filter(p => p.category === C.shopCat);
  const fav = C.favs.has(s.id), rt = shopRating(s.id), offs = offersFor(s.id);
  const reviews = S.ratings.filter(r => r.shopId === s.id && r.text).sort((a, b) => tAt(b) - tAt(a)).slice(0, 3);
  return `
  <button class="back" type="button" data-act="${C.q ? 'c-back-search' : 'c-home'}">‹ ${C.q ? t('Back to results') : t('Home')}</button>
  <div class="shophero">
    <button class="heart" type="button" data-act="c-fav" data-v="${esc(s.id)}" aria-pressed="${fav}" aria-label="${esc(fav ? t('Remove from favourites') : t('Save to favourites'))}">${ICON.heart}</button>
    <div style="display:flex;gap:12px;align-items:center;position:relative;z-index:1"><span class="mono">${esc(s.name[0])}</span>
      <div style="min-width:0"><p class="eyebrow" style="color:var(--marigold-2)">${t(s.category)} · ${esc(s.area)}</p><h1 class="h1">${esc(s.name)}</h1></div></div>
    ${s.desc ? `<p class="sub" style="position:relative;z-index:1">${esc(s.desc)}</p>` : ''}
    <div class="stats3">
      <div><b>${rt.n ? '★ ' + rt.avg.toFixed(1) : t('New')}</b><span>${rt.n ? t('{n} ratings', {n:rt.n}) : t('no ratings yet')}</span></div>
      <div><b>${isOpen(s) ? '⏱ ' + (Number(s.readyMins) || 30) + ' ' + t('min') : t('Closed')}</b><span>${t('pickup ready')}</span></div>
      <div><b>${s.deliveryOn ? '🛵 ' + deliveryRange(s) : t('Pickup')}</b><span>${s.deliveryOn ? t('min delivery') + ' · ' + rs(s.deliveryFee) : t('only')}</span></div>
    </div>
  </div>
  ${!isOpen(s) ? `<p class="note">${t('This shop is closed right now. You can look around and order once they open.')}</p>` : ''}
  ${offs.length ? `<div class="offerline">${offs.map(o => `<span>🎁 ${esc(offerTitle(o))}</span>`).join('')}</div>` : ''}
  <p class="row-m">📍 ${esc(s.address || s.area)} · ${t('Pay by UPI or cash')}</p>
  ${cats.length > 1 ? `<div class="chips" role="group" aria-label="${esc(t('Filter'))}">${['All', ...cats].map(c => `<button class="chip" type="button" data-act="c-shopcat" data-v="${esc(c)}" aria-pressed="${C.shopCat === c}">${c === 'All' ? t('All items') : t(c)}</button>`).join('')}</div>` : ''}
  <ul class="prods">${ps.length ? ps.map(p => `<li class="prod ${p.stock <= 0 || !isOpen(s) ? 'off' : ''}">${thumb(p)}
    <div class="row-main"><span class="row-t">${esc(p.name)}</span>${p.desc ? `<span class="row-m">${esc(p.desc)}</span>` : ''}<span class="meta"><span class="price">${rs(p.price)}</span>${stockBadge(p.stock)}</span></div>
    ${addCtl(p, s)}</li>`).join('') : `<li class="empty"><span class="big">📦</span><b>${t('No products listed yet')}</b></li>`}</ul>
  ${reviews.length ? `<section class="sec"><h2 class="h2">${t('What customers say')}</h2>${reviews.map(r => `<div class="card review">${stars(r.stars)}<p>${esc(r.text)}</p><span class="row-m">${ago(tAt(r))}</span></div>`).join('')}</section>` : ''}`;
}
function cBagSheet() {
  const s = shopById(C.cartShop), lines = cartLines(), f = C.form;
  if (!s || !lines.length) { C.sheet = null; return ''; }
  const deliv = f.mode === 'delivery' && s.deliveryOn, fee0 = deliv ? Number(s.deliveryFee) || 0 : 0;
  const sub = lines.reduce((a, l) => a + l.p.price * l.q, 0);
  const off = bestOffer(s.id, sub, fee0), nxt = nextOffer(s.id, sub);
  const disc = off && off.o.kind === 'pct' ? off.save : 0, fee = off && off.o.kind === 'freedel' ? 0 : fee0;
  const total = sub - disc + fee;
  const slots = slotsFor(), tog = together(lines);
  return `<div class="scrim" data-act="c-sheet-close"></div>
  <div class="sheet ${FX.sheet ? '' : 'still'}" role="dialog" aria-modal="true" aria-label="${esc(t('Your bag'))}">
    <span class="grab" aria-hidden="true"></span>
    <div class="sheet-h"><div><h2 class="h2">${t('Your bag')}</h2><p class="row-m">${esc(s.name)} · ${ratingChip(s)}</p></div>
      <button class="icon-btn" type="button" data-act="c-sheet-close" aria-label="${esc(t('Close'))}">×</button></div>
    <ul class="lines">${lines.map(({p, q}) => `<li>${thumb(p)}<span class="row-main"><span class="row-t">${esc(p.name)}</span><span class="row-m">${rs(p.price)} ${t('each')}</span></span>
      <span class="r-right"><span class="price">${rs(p.price * q)}</span>${addCtl(p, s)}</span></li>`).join('')}</ul>
    ${tog.length ? `<div class="sec"><h3 class="small" style="font-weight:800">${t('Often bought together')}</h3><div class="hscroll mini">${tog.map(p => `<div class="pcard">${thumb(p, 'lg')}<span class="nm">${esc(p.name)}</span><div class="ft"><span class="price">${rs(p.price)}</span>${addCtl(p, s)}</div></div>`).join('')}</div></div>` : ''}
    ${off ? `<p class="okbox">🎁 ${t('{offer} applied. You save {amt}.', {offer:esc(offerTitle(off.o).split(' · ')[0]), amt:rs(off.save)})}</p>` : nxt ? `<p class="note">🎁 ${t('Add {amt} more to get: {offer}', {amt:rs(nxt.need), offer:esc(offerTitle(nxt.o).split(' · ')[0])})}</p>` : ''}
    <form id="c-checkout" class="sec" novalidate>
      <fieldset><legend>${t('How do you want it?')}</legend>
        <label class="opt"><input type="radio" name="mode" value="pickup" data-act="c-mode" ${deliv ? '' : 'checked'}><b>🏪 ${t('Pick up')}</b><span>${t('Free')} · ~${Number(s.readyMins) || 30} ${t('min')}</span></label>
        <label class="opt ${s.deliveryOn ? '' : 'disabled'}"><input type="radio" name="mode" value="delivery" data-act="c-mode" ${deliv ? 'checked' : ''} ${s.deliveryOn ? '' : 'disabled'}><b>🛵 ${t('Delivery')}</b><span>${s.deliveryOn ? deliveryRange(s) + ' ' + t('min') + ' · ' + rs(s.deliveryFee) : t('Not offered')}</span></label>
      </fieldset>
      <div class="sec"><span class="field"><span>${t('When?')}</span></span>
        <div class="chips slots" role="group" aria-label="${esc(t('When?'))}">
          <button class="chip" type="button" data-act="c-when" data-v="now" aria-pressed="${C.when === 'now'}">⚡ ${t('Now')} · ${deliv ? deliveryRange(s) : (Number(s.readyMins) || 30)} ${t('min')}</button>
          ${slots.map(sl => `<button class="chip" type="button" data-act="c-when" data-v="${esc(sl.key)}" aria-pressed="${C.when === sl.key}">${ICON.cal}${esc(sl.day)} ${esc(sl.label)}</button>`).join('')}
        </div></div>
      <label class="field"><span>${t('Your name')}</span><input id="c-name" data-bind="name" value="${esc(f.name)}" autocomplete="name"></label>
      <label class="field"><span>${t('Phone')} <i>(${t('so the shop can reach you')})</i></span><input id="c-phone" type="tel" inputmode="tel" data-bind="phone" value="${esc(f.phone)}" autocomplete="tel"></label>
      ${deliv ? `<label class="field"><span>${t('Delivery address')}</span><input id="c-addr" data-bind="address" value="${esc(f.address)}" autocomplete="street-address"></label>` : ''}
      <label class="field"><span>${t('Note for the shop')} <i>(${t('optional')})</i></span><input id="c-note" data-bind="note" value="${esc(f.note)}" placeholder="${esc(t('e.g. Please pack separately'))}"></label>
      <div class="totals"><div><span>${t('Items')}</span><span>${rs(sub)}</span></div>
        ${disc ? `<div class="save"><span>${t('Shop offer')}</span><span>− ${rs(disc)}</span></div>` : ''}
        <div><span>${deliv ? t('Delivery') : t('Pickup')}</span><span>${deliv ? (fee ? rs(fee) : `<s>${rs(fee0)}</s> ${t('Free')}`) : t('Free')}</span></div>
        <div><span>${t('Nukkad fee')}</span><span>₹0</span></div>
        <div class="grand"><span>${t('To pay the shop')}</span><span>${rs(total)}</span></div></div>
      ${C.err ? `<p class="error" role="alert">${esc(C.err)}</p>` : ''}
      <button class="btn btn-go wide" type="submit" style="padding:15px">${t('Place order')} · ${rs(total)}</button>
      <p class="small muted" style="text-align:center">${t('Pay {shop} by UPI after ordering, or cash at pickup.', {shop:esc(s.name)})}</p>
    </form>
  </div>`;
}
function cSwitchSheet() {
  const cur = shopById(C.cartShop), next = C.pendingAdd ? shopById((prodById(C.pendingAdd) || {}).shopId) : null;
  return `<div class="scrim" data-act="c-sheet-close"></div>
  <div class="sheet ${FX.sheet ? '' : 'still'}" role="dialog" aria-modal="true" aria-label="${esc(t('Start a new bag?'))}">
    <span class="grab" aria-hidden="true"></span>
    <h2 class="h2">${t('Start a new bag?')}</h2>
    <p class="sub">${t('Your bag has items from {a}. Each order goes to one shop, so we’ll clear it and add this from {b}.', {a:esc(cur ? cur.name : ''), b:esc(next ? next.name : '')})}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button class="btn btn-ghost" type="button" data-act="c-sheet-close">${t('Keep my bag')}</button><button class="btn btn-go" type="button" data-act="c-switch-yes">${t('Start new bag')}</button></div>
  </div>`;
}
function ringFor(o, s) {
  const mins = o.mode === 'delivery' ? Number(s.deliveryMins) || 45 : Number(s.readyMins) || 30;
  const base = o.when && o.when !== 'now' ? new Date(o.when).getTime() - mins * 60e3 : tAt(o);
  const elapsed = (Date.now() - base) / 6e4;
  let pct, label, sub;
  if (o.status === 'ready' || o.status === 'completed') { pct = 1; label = o.status === 'completed' ? '✓' : (o.mode === 'delivery' ? '🛵' : '✓'); sub = o.status === 'completed' ? t('All done') : (o.mode === 'delivery' ? t('On the way') : t('Go pick it up')); }
  else if (o.status === 'cancelled') { pct = 0; label = '—'; sub = t('Cancelled'); }
  else if (o.when && o.when !== 'now' && elapsed < 0) { pct = .05; label = ICON.cal; sub = t('Scheduled for {when}', {when:whenText(o)}); }
  else { pct = Math.min(.95, Math.max(.05, elapsed / mins)); const left = Math.max(1, Math.round(mins - elapsed)); label = left + 'm'; sub = o.status === 'pending' ? t('Waiting for the shop to accept') : t('Packing your order'); }
  const r = 30, c = 2 * Math.PI * r;
  return `<div class="ring"><div class="ring-wrap"><svg viewBox="0 0 72 72" aria-hidden="true"><circle class="bgc" cx="36" cy="36" r="${r}" fill="none" stroke-width="7"/><circle class="fgc" cx="36" cy="36" r="${r}" fill="none" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - pct)).toFixed(1)}"/></svg><b>${label}</b></div>
    <div><b style="font-size:16px">${esc(sub)}</b><p class="row-m">${o.status === 'pending' || o.status === 'confirmed' ? (o.mode === 'delivery' ? t('Delivery in about {r} min', {r:deliveryRange(s)}) : t('Usually ready in about {n} min', {n:Number(s.readyMins) || 30})) : t('Updated {ago}', {ago:ago(o.statusAt || tAt(o))})}</p></div></div>`;
}
function upiLink(o, s) {
  return `upi://pay?pa=${encodeURIComponent(s.upi || '')}&pn=${encodeURIComponent(s.name)}&am=${encodeURIComponent(Number(o.total).toFixed(2))}&cu=INR&tn=${encodeURIComponent('Nukkad ' + o.id)}`;
}
function payCard(o, s) {
  if (o.status === 'cancelled') return '';
  if (o.paid === 'confirmed') return `<p class="okbox">✓ ${t('Payment received by the shop')}</p>`;
  if (!s.upi) return `<p class="note">💵 ${t('Pay {amt} by cash when you collect it.', {amt:rs(o.total)})}</p>`;
  const claimed = o.paid === 'claimed' || C.paidClaim.has(o.id), link = upiLink(o, s), svg = qrSvg(link, 3);
  return `<div class="card sec paycard">
    <div class="sec-h"><h2 class="h2">${t('Pay the shop by UPI')}</h2><span class="price">${rs(o.total)}</span></div>
    ${claimed ? `<p class="okbox">✓ ${t('You marked this as paid. The shop will confirm.')}</p>` : `
    <a class="btn btn-go wide" href="${esc(link)}">${t('Pay with GPay / PhonePe / Paytm')}</a>
    ${svg ? `<details><summary class="small" style="cursor:pointer;font-weight:800">${t('Paying from another phone? Show QR')}</summary><div class="qrbox">${svg}</div></details>` : ''}
    <p class="small muted">${t('Money goes straight to {upi}. Nukkad never touches it.', {upi:esc(s.upi)})}${/@nukkad$/.test(s.upi) ? ' ' + t('(Demo UPI ID. It won’t accept money.)') : ''}</p>
    <button class="btn btn-ghost btn-sm" type="button" data-act="c-paid" data-v="${esc(o.id)}">${t('I’ve paid')}</button>`}
  </div>`;
}
function rateCard(o, s) {
  if (o.status !== 'completed') return '';
  const mine = S.ratings.find(r => r.orderId === o.id);
  if (mine) return `<div class="card sec"><h2 class="h2">${t('Thanks for rating!')}</h2>${stars(mine.stars)}${mine.text ? `<p>${esc(mine.text)}</p>` : ''}</div>`;
  const d = C.rateDraft[o.id] || {stars:0, text:''};
  return `<div class="card sec ratecard">
    <h2 class="h2">${t('How was {shop}?', {shop:esc(s.name)})}</h2>
    <div class="rate" role="radiogroup" aria-label="${esc(t('Rating'))}">${[1, 2, 3, 4, 5].map(i => `<button type="button" role="radio" aria-checked="${d.stars === i}" class="${i <= d.stars ? 'on' : ''}" data-act="c-rate" data-v="${esc(o.id)}|${i}" aria-label="${i} ${esc(t('stars'))}">${ICON.star}</button>`).join('')}</div>
    ${d.stars ? `<textarea id="rv-${esc(o.id)}" data-rate="${esc(o.id)}" rows="2" placeholder="${esc(t('Say something nice (optional)'))}">${esc(d.text)}</textarea>
    <button class="btn btn-forest" type="button" data-act="c-rate-send" data-v="${esc(o.id)}">${t('Send rating')}</button>` : `<p class="small muted">${t('Tap a star. It helps small shops get found.')}</p>`}
  </div>`;
}
function cTrack() {
  const o = S.orders.find(x => x.id === C.orderId);
  if (!o) return `<button class="back" type="button" data-act="c-tab" data-v="orders">‹ ${t('My orders')}</button><div class="empty"><b>${t('Order not found')}</b></div>`;
  const s = shopById(o.shopId) || {name:t('the shop'), whatsapp:'', readyMins:30};
  const msg = orderMsg(o, s), steps = stepsFor(o), idx = steps.findIndex(x => x.k === o.status);
  return `
  <button class="back" type="button" data-act="c-tab" data-v="orders">‹ ${t('My orders')}</button>
  <div class="sec"><p class="eyebrow">${esc(o.id)} · ${esc(s.name)}</p><h1 class="h1" style="font-size:26px">${esc(statusText(o))}</h1>
    <p class="sub">${o.status === 'cancelled' ? t('Nothing was charged. Your items went back on the shelf.') : t('This page updates by itself.') + ' ' + connChip()}</p></div>
  <div class="card">${ringFor(o, s)}</div>
  ${rateCard(o, s)}
  ${o.status !== 'cancelled' ? `<div class="card"><ol class="track">${steps.map((st, i) => `<li class="${i < idx || o.status === 'completed' ? 'done' : i === idx ? 'now' : ''}">
    <span class="dot">${i < idx || o.status === 'completed' ? '✓' : i + 1}</span><div><b>${esc(st.t)}</b><span>${esc(st.s)}</span></div></li>`).join('')}</ol></div>` : ''}
  ${payCard(o, s)}
  <div class="card sec">
    <ul class="lines">${o.items.map(i => { const p = prodById(i.pid) || {name:i.name, category:''}; return `<li>${thumb(p)}<span class="row-main"><span class="row-t">${esc(i.name)}</span><span class="row-m">${i.qty} × ${rs(i.price)}</span></span><span class="price">${rs(i.price * i.qty)}</span></li>`; }).join('')}</ul>
    <div class="totals">${o.discount ? `<div class="save"><span>${t('Shop offer')}</span><span>− ${rs(o.discount)}</span></div>` : ''}${o.fee ? `<div><span>${t('Delivery')}</span><span>${rs(o.fee)}</span></div>` : ''}<div class="grand"><span>${t('To pay the shop')}</span><span>${rs(o.total)}</span></div></div>
    <p class="small muted">${o.mode === 'delivery' ? '🛵 ' + t('Delivery to {addr}', {addr:esc(o.address)}) : '🏪 ' + t('Pickup from {place}', {place:esc(s.address || s.name)})} · ${ICON.cal ? '' : ''}🗓 ${esc(whenText(o))}</p>
  </div>
  ${o.status !== 'cancelled' && o.status !== 'completed' ? `<div class="sec">
    <a class="btn btn-wa wide" href="${esc(waLink(s.whatsapp, msg))}" target="_blank" rel="noopener">${t('Send a copy on WhatsApp')}</a>
    <details><summary class="small" style="cursor:pointer;font-weight:800">${t('Preview the message')}</summary><div class="bubble" style="margin-top:8px">${fmtWa(msg)}</div></details>
  </div>` : `<button class="btn btn-go wide" type="button" data-act="c-reorder" data-v="${esc(o.id)}">↻ ${t('Order again')}</button>`}
  <button class="btn btn-ghost wide" type="button" data-act="c-home">${t('Keep shopping')}</button>`;
}
function cOrders() {
  const my = S.orders.filter(o => o.deviceId === DEVICE).sort((a, b) => tAt(b) - tAt(a));
  const active = my.filter(o => !['completed','cancelled'].includes(o.status)), past = my.filter(o => ['completed','cancelled'].includes(o.status));
  const card = o => { const s = shopById(o.shopId); const live = !['completed','cancelled'].includes(o.status); const rated = S.ratings.some(r => r.orderId === o.id); return `<div class="ocard">
    <button class="ocard-h" type="button" data-act="c-track" data-v="${esc(o.id)}"><span class="mono">${esc((s ? s.name : 'S')[0])}</span>
      <span class="row-main"><span class="row-t">${esc(s ? s.name : t('Shop'))}</span><span class="row-m">${esc(o.id)} · ${ago(tAt(o))} · ${rs(o.total)}</span></span>${statusPill(o)}</button>
    <p class="row-m">${o.items.map(i => `${i.qty} × ${esc(i.name)}`).join(', ')}${o.when && o.when !== 'now' ? ' · 🗓 ' + esc(whenText(o)) : ''}</p>
    <div class="o-act">${live ? `<button class="btn btn-forest btn-sm" type="button" data-act="c-track" data-v="${esc(o.id)}">${t('Track order')}</button>` : `<button class="btn btn-ghost btn-sm" type="button" data-act="c-reorder" data-v="${esc(o.id)}">↻ ${t('Order again')}</button>${o.status === 'completed' && !rated ? `<button class="btn btn-link" type="button" data-act="c-track" data-v="${esc(o.id)}">★ ${t('Rate')}</button>` : ''}`}</div></div>`; };
  if (!my.length) return `<h1 class="h1" style="font-size:26px">${t('My orders')}</h1><div class="empty"><span class="big">🛍️</span><b>${t('No orders yet')}</b><span>${t('Find something on your street and track it live here.')}</span><button class="btn btn-go btn-sm" type="button" data-act="c-home">${t('Start shopping')}</button></div>`;
  return `<h1 class="h1" style="font-size:26px">${t('My orders')}</h1>
  ${active.length ? `<section class="sec"><h2 class="h2">${t('On the way')}</h2>${active.map(card).join('')}</section>` : ''}
  ${past.length ? `<section class="sec"><h2 class="h2">${t('Past orders')}</h2>${past.map(card).join('')}</section>` : ''}`;
}
function cSaved() {
  const favs = S.shops.filter(s => C.favs.has(s.id));
  return `<h1 class="h1" style="font-size:26px">${t('Saved shops')}</h1>
  ${favs.length ? `<div class="shopcards">${favs.map(shopCard).join('')}</div>` : `<div class="empty"><span class="big">💚</span><b>${t('No saved shops yet')}</b><span>${t('Tap the heart on a shop to keep it here.')}</span><button class="btn btn-go btn-sm" type="button" data-act="c-home">${t('Browse shops')}</button></div>`}`;
}

/* ---------- Customer actions ---------- */
function cGo(screen, tab) { C.screen = screen; if (tab) C.tab = tab; C.err = ''; FX.enter = true; render(); scrollTop(); }
function addOne(pid) {
  const p = prodById(pid); if (!p) return;
  if (C.cartShop && C.cartShop !== p.shopId && cartLines().length) { C.pendingAdd = pid; C.sheet = 'switch'; FX.sheet = true; render(); return; }
  C.cartShop = p.shopId; C.cart[pid] = Math.min(p.stock, (C.cart[pid] || 0) + 1);
  C.bump = true; buzz(15); render(); C.bump = false;
}
async function cRunSearch(q) {
  q = norm(q); if (!q) return;
  const res = search(q, C.area);
  C.q = q; C.qDraft = q; C.sort = 'best'; C.screen = 'search'; C.tab = 'search';
  C.recent = [q, ...C.recent.filter(x => x !== q)].slice(0, 6); ls('recent', JSON.stringify(C.recent));
  FX.enter = true; render(); scrollTop();
  if (C.area !== 'All') await put('searches', {id:'q' + Date.now().toString(36) + rid(3), q:norm(synify(q)), area:C.area, results:res.length, at:Date.now()});
}
function celebrate(o, s) {
  const fx = $('#fx'); if (!fx) return;
  const colors = ['#EE9A2E','#F5B04E','#8FD1AE','#F7F1E5','#E0475B','#5CC08A'];
  fx.innerHTML = `<div class="success" role="status"><div class="confetti" aria-hidden="true">${Array.from({length:36}, (_, i) => `<i style="left:${(i * 37) % 100}%;background:${colors[i % colors.length]};animation-delay:${(i % 9) * .08}s;transform:rotate(${i * 23}deg)"></i>`).join('')}</div>
    <div><div class="tick">${ICON.check}</div><h2>${t('Order placed!')}</h2><p>${t('{shop} has it', {shop:esc(s.name)})} · ${esc(o.id)}</p></div></div>`;
  buzz([30, 50, 30]);
  setTimeout(() => { fx.innerHTML = ''; }, 1900);
}
async function cPlaceOrder() {
  const s = shopById(C.cartShop), f = C.form, lines = cartLines();
  const err = m => { C.err = m; FX.sheet = false; render(); };
  if (!s || !lines.length) return err(t('Your bag is empty.'));
  if (!isOpen(s)) return err(t('{shop} is closed right now. Try again once they open.', {shop:s.name}));
  if (!f.name.trim()) return err(t('Add your name so the shop knows who it’s for.'));
  const phone = cleanPhone(f.phone);
  if (f.phone.trim() && phone.length < 12) return err(t('Check the phone number. It needs 10 digits.'));
  const deliv = f.mode === 'delivery' && s.deliveryOn;
  if (deliv && !f.address.trim()) return err(t('Add a delivery address.'));
  for (const {p, q} of lines) if (p.stock < q) return err(t('Only {n} left of {name}. Lower the quantity.', {n:p.stock, name:p.name}));
  const fee0 = deliv ? Number(s.deliveryFee) || 0 : 0, sub = lines.reduce((a, l) => a + l.p.price * l.q, 0);
  const off = bestOffer(s.id, sub, fee0), disc = off && off.o.kind === 'pct' ? off.save : 0, fee = off && off.o.kind === 'freedel' ? 0 : fee0;
  const o = {id:'NK-' + rid(4).toUpperCase(), shopId:s.id, buyer:f.name.trim(), phone, deviceId:DEVICE,
    items:lines.map(({p, q}) => ({pid:p.id, name:p.name, price:p.price, qty:q})), fee, discount:disc, offerId:off ? off.o.id : null, total:sub - disc + fee,
    status:'pending', mode:deliv ? 'delivery' : 'pickup', address:deliv ? f.address.trim() : '', note:f.note.trim(), when:C.when, paid:'', at:Date.now()};
  ls('name', o.buyer); ls('phone', f.phone.trim()); if (deliv) ls('addr', o.address);
  if (!seenStatus) seenStatus = {};
  seenStatus[o.id] = 'pending';
  const problem = await placeOrderBackend(o);
  if (problem) return err(problem);
  celebrate(o, s);
  C.cart = {}; C.cartShop = null; C.sheet = null; f.note = ''; C.when = 'now'; C.orderId = o.id; C.screen = 'track'; C.tab = 'orders'; C.err = '';
  FX.enter = true; render(); scrollTop();
}
function cReorder(id) {
  const o = S.orders.find(x => x.id === id); if (!o) return;
  const s = shopById(o.shopId);
  if (!s || !isOpen(s)) { toast(t('{shop} is closed right now. Try again once they open.', {shop:s ? s.name : ''})); return; }
  C.cart = {}; C.cartShop = s.id; let missing = 0;
  for (const it of o.items) { const p = prodById(it.pid); if (p && p.stock > 0 && p.active !== false) C.cart[p.id] = Math.min(p.stock, it.qty); else missing++; }
  if (!cartLines().length) { toast(t('Those items are out of stock right now.')); return; }
  if (missing) toast(t('{n} out-of-stock items were left out.', {n:missing}));
  C.sheet = 'bag'; FX.sheet = true; render();
}
let recog = null;
function startVoice() {
  if (!VOICE) return;
  if (C.listening && recog) { try { recog.stop(); } catch (e) { /* ignore */ } return; }
  try {
    recog = new VOICE(); recog.lang = LANGS[LANG].voice; recog.interimResults = true; recog.maxAlternatives = 1;
    recog.onresult = ev => { const txt = Array.from(ev.results).map(r => r[0].transcript).join(' ').trim(); C.qDraft = txt; const i = $('#c-q'); if (i) i.value = txt; if (ev.results[ev.results.length - 1].isFinal) { C.listening = false; cRunSearch(txt); } };
    recog.onerror = ev => { C.listening = false; render(); if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') toast(t('Allow the microphone to search by voice.')); };
    recog.onend = () => { if (C.listening) { C.listening = false; render(); } };
    C.listening = true; render(); recog.start(); toast('🎙 ' + t('Listening… say a product'));
  } catch (e) { C.listening = false; toast(t('Voice search isn’t available here. Try typing.')); render(); }
}
function showSugg() {
  const box = $('#sugg'); if (!box) return;
  const list = suggestions(C.qDraft, C.area);
  if (!C.qDraft.trim() || !list.length) { box.hidden = true; box.innerHTML = ''; return; }
  const hl = tx => { let h = esc(tx); toks(C.qDraft).forEach(k => { if (k.length > 1) h = h.replace(new RegExp('(' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); }); return h; };
  box.innerHTML = list.map(x => x.kind === 'p'
    ? `<button type="button" data-act="c-chip" data-v="${esc(x.p.name.toLowerCase())}">${thumb(x.p)}<span>${hl(x.p.name)}<small>${rs(x.p.price)} · ${esc(x.s.name)}</small></span></button>`
    : `<button type="button" data-act="c-shop" data-v="${esc(x.s.id)}"><span class="th" style="background:var(--sage)">🏪</span><span>${hl(x.s.name)}<small>${t('Shop')} · ${esc(x.s.area)}</small></span></button>`).join('');
  box.hidden = false;
}
Object.assign(ACT, {
  'c-home': () => { C.q = ''; C.qDraft = ''; cGo('home', 'home'); },
  'c-tab': v => {
    if (v === 'home') { C.q = ''; C.qDraft = ''; cGo('home', 'home'); }
    else if (v === 'search') { C.q = ''; cGo('search', 'search'); setTimeout(() => $('#c-q')?.focus(), 50); }
    else cGo(v, v);
  },
  'c-chip': v => { const b = $('#sugg'); if (b) b.hidden = true; cRunSearch(v); },
  'c-search-reset': () => { C.q = ''; C.qDraft = ''; cGo('search', 'search'); setTimeout(() => $('#c-q')?.focus(), 50); },
  'c-clear-recent': () => { C.recent = []; ls('recent', '[]'); render(); },
  'c-sort': v => { C.sort = v; render(); },
  'c-all-areas': () => { C.area = 'All'; ls('area', 'All'); render(); },
  'c-back-search': () => cGo('search'),
  'c-cat': v => { C.cat = v; cGo('cat'); },
  'c-shop': (v, el, e) => {
    if (e.target.closest('.heart')) return;
    const b = $('#sugg'); if (b) b.hidden = true;
    if (C.shopId !== v) C.shopCat = 'All';
    C.shopId = v; cGo('shop');
  },
  'c-shopcat': v => { C.shopCat = v; render(); },
  'c-fav': (v, el, e) => {
    e.stopPropagation();
    if (C.favs.has(v)) { C.favs.delete(v); toast(t('Removed from favourites')); } else { C.favs.add(v); buzz(15); toast('💚 ' + t('Saved to favourites')); }
    ls('favs', JSON.stringify([...C.favs])); render();
  },
  'c-add': v => addOne(v),
  'c-qty': v => {
    const [pid, d] = v.split('|'), p = prodById(pid); if (!p) return;
    C.cart[pid] = Math.max(0, Math.min(p.stock, (C.cart[pid] || 0) + Number(d)));
    if (!cartLines().length) { C.cartShop = null; if (C.sheet === 'bag') C.sheet = null; }
    if (Number(d) > 0) { if (!C.cartShop) C.cartShop = p.shopId; C.bump = true; buzz(10); }
    render(); C.bump = false;
  },
  'c-bag': () => { C.sheet = 'bag'; C.err = ''; FX.sheet = true; render(); },
  'c-sheet-close': () => { C.sheet = null; C.pendingAdd = null; render(); },
  'c-switch-yes': () => { const pid = C.pendingAdd; C.cart = {}; C.cartShop = null; C.sheet = null; C.pendingAdd = null; addOne(pid); toast(t('Started a new bag')); },
  'c-when': v => { C.when = v; render(); },
  'c-track': v => { C.orderId = v; cGo('track', 'orders'); },
  'c-reorder': v => cReorder(v),
  'c-jump': v => document.getElementById(v)?.scrollIntoView({behavior:'smooth', block:'start'}),
  'c-focus-search': () => $('#c-q')?.focus(),
  'c-voice': () => startVoice(),
  'c-paid': async v => { C.paidClaim.add(v); ls('paid', JSON.stringify([...C.paidClaim])); await patch('orders', v, {paid:'claimed'}); toast(t('Thanks! The shop will confirm your payment.')); render(); },
  'c-rate': v => { const [id, n] = v.split('|'); C.rateDraft[id] = {...(C.rateDraft[id] || {text:''}), stars:Number(n)}; buzz(10); render(); },
  'c-rate-send': async v => {
    const d = C.rateDraft[v], o = S.orders.find(x => x.id === v); if (!d || !d.stars || !o) return;
    await put('ratings', {id:'r-' + v, orderId:v, shopId:o.shopId, stars:d.stars, text:String(d.text || '').trim().slice(0, 280), deviceId:DEVICE, at:Date.now()});
    delete C.rateDraft[v]; toast('⭐ ' + t('Thanks! Your rating helps small shops get found.')); render();
  },
});
Object.assign(CHANGE, {
  'c-area': el => { C.area = el.value; ls('area', el.value); FX.enter = true; render(); },
  'c-mode': el => { C.form.mode = el.value; C.err = ''; render(); },
});
SUBMIT['c-search'] = () => { const b = $('#sugg'); if (b) b.hidden = true; cRunSearch(C.qDraft); };
SUBMIT['c-checkout'] = () => cPlaceOrder();
document.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.bind) C.form[el.dataset.bind] = el.value;
  if (el.dataset.rate) { const id = el.dataset.rate; C.rateDraft[id] = {...(C.rateDraft[id] || {stars:0}), text:el.value}; }
  if (el.id === 'c-q') { C.qDraft = el.value; showSugg(); }
});
document.addEventListener('focusin', e => { if (e.target.id === 'c-q') showSugg(); });
document.addEventListener('focusout', e => { if (e.target.id === 'c-q') setTimeout(() => { const b = $('#sugg'); if (b && !b.contains(document.activeElement)) b.hidden = true; }, 180); });


/* =========================================================
   SELLER APP
   ========================================================= */
function sHeader(s) {
  return `<header class="top"><div class="gut"><div class="top-in">
    <button class="brand" type="button" data-act="s-tab" data-v="orders">${ICON.logoShop}<b>nukkad</b><span>${t('for shops')}</span></button>
    <div class="top-r">${connChip()}${langBtn()}</div></div>
    ${s ? `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding-bottom:10px">
      <div class="row-main"><span class="row-t" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(s.name)}</span><span class="row-m">${esc(s.area)} · ${ratingChip(s)}</span></div>
      <button class="openpill" type="button" data-act="s-open" aria-pressed="${isOpen(s)}">${isOpen(s) ? t('Open') : t('Closed')}<span class="sw" aria-hidden="true"></span></button>
    </div>` : ''}
  </div></header>`;
}
function renderSeller() {
  const s = V.shopId ? shopById(V.shopId) : null;
  if (!s) {
    if (V.shopId && S.conn !== 'connecting') { V.shopId = null; ls('seller-shop', null); }
    return V.reg ? sRegister() : sLogin();
  }
  if (V.poster) return sPoster(s);
  const mine = S.orders.filter(o => o.shopId === s.id);
  const nNew = mine.filter(o => o.status === 'pending').length;
  let body;
  switch (V.tab) {
    case 'products': body = sProducts(s); break;
    case 'insights': body = sInsights(s); break;
    case 'shop': body = sSettings(s); break;
    default: body = sOrders(s, mine);
  }
  return `${sHeader(s)}
  <main class="gut ${FX.enter ? 'enter' : ''}">${body}</main>
  ${nav([['orders', t('Orders'), 'bag', nNew], ['products', t('Products'), 'box'], ['insights', t('Insights'), 'chart'], ['shop', t('Shop'), 'shop']], V.tab, 's-tab')}`;
}
function sLogin() {
  const pick = V.pick ? shopById(V.pick) : null;
  return `${sHeader(null)}
  <main class="gut ${FX.enter ? 'enter' : ''}">
    ${installCard('Nukkad for Shops')}
    <div class="sec"><p class="eyebrow">${t('Shop login')}</p><h1 class="h1">${t('Your shop, organised.')}</h1>
      <p class="sub">${t('Orders, stock and what your street is searching for, in one place. No commission.')}</p></div>
    ${pick ? `<div class="card sec" style="justify-items:center;text-align:center">
        <span class="mono">${esc(pick.name[0])}</span><b>${esc(pick.name)}</b><span class="row-m">${t('Enter your 4-digit PIN')}${S.backend !== 'supabase' || /^s\d+$/.test(pick.id) ? ' · ' + t('demo PIN 1234') : ''}</span>
        <div class="pinrow ${V.pinErr ? 'bad' : ''}" aria-label="${V.pin.length} / 4">${[0, 1, 2, 3].map(i => `<span class="${i < V.pin.length ? 'on' : ''}">${i < V.pin.length ? '•' : ''}</span>`).join('')}</div>
        ${V.pinErr ? `<p class="error" role="alert" style="justify-self:stretch">${t('That PIN doesn’t match. Try again.')}</p>` : ''}
        <div class="keypad" style="width:100%;max-width:300px">${['1','2','3','4','5','6','7','8','9','back','0','change'].map(k => k === 'back' ? `<button type="button" data-act="s-key" data-v="back" aria-label="${esc(t('Delete'))}">⌫</button>` : k === 'change' ? `<button type="button" data-act="s-pick" data-v="" style="font-size:13px">${t('Change shop')}</button>` : `<button type="button" data-act="s-key" data-v="${k}">${k}</button>`).join('')}</div>
      </div>` : `<div class="sec"><h2 class="h2">${t('Pick your shop')}</h2>
      ${S.conn === 'connecting' && !S.shops.length ? '<div class="skel" style="height:64px"></div><div class="skel" style="height:64px"></div>' : ''}
      <div class="login-shops">${S.shops.map(x => `<button class="login-shop" type="button" data-act="s-pick" data-v="${esc(x.id)}">
        <span class="mono">${esc(x.name[0])}</span><span class="row-main"><span class="row-t">${esc(x.name)}</span><span class="row-m">${t(x.category)} · ${esc(x.area)}</span></span><span aria-hidden="true" class="muted">›</span></button>`).join('')}</div></div>
      <button class="btn btn-go wide" type="button" data-act="s-reg">＋ ${t('Register a new shop')}</button>`}
    <a class="btn btn-link" href="${IN_CLAUDE ? '#' : '../'}" style="justify-self:center">${t('Open the customer app')}</a>
  </main>`;
}
function sRegister() {
  const r = V.reg;
  return `${sHeader(null)}
  <main class="gut ${FX.enter ? 'enter' : ''}">
    <button class="back" type="button" data-act="s-reg-cancel">‹ ${t('Back to login')}</button>
    <div class="sec"><h1 class="h1">${t('Put your shop online')}</h1><p class="sub">${t('Takes two minutes. Free, and you keep every rupee you sell.')}</p></div>
    <form id="s-register" class="card sec" novalidate>
      <label class="field"><span>${t('Shop name')}</span><input id="r-name" data-rbind="name" value="${esc(r.name)}" placeholder="${esc(t('e.g. Lakshmi Stores'))}"></label>
      <div class="sec"><span class="field"><span>${t('What do you sell?')}</span></span><div class="chips" style="flex-wrap:wrap;margin:0;padding:0">${CATS.map(c => `<button class="chip" type="button" data-act="s-regcat" data-v="${c}" aria-pressed="${c === r.category}">${CATEMO[c]} ${t(c)}</button>`).join('')}</div></div>
      <label class="field"><span>${t('Area')}</span><input id="r-area" data-rbind="area" value="${esc(r.area)}" list="area-list" placeholder="Jayanagar"><datalist id="area-list">${areas().map(a => `<option value="${esc(a)}">`).join('')}</datalist></label>
      <label class="field"><span>${t('Address')}</span><input id="r-addr" data-rbind="address" value="${esc(r.address)}"></label>
      <label class="field"><span>${t('WhatsApp number')}</span><input id="r-wa" type="tel" inputmode="tel" data-rbind="whatsapp" value="${esc(r.whatsapp)}"></label>
      <label class="field"><span>${t('UPI ID')} <i>(${t('optional, for online payments')})</i></span><input id="r-upi" data-rbind="upi" value="${esc(r.upi)}" placeholder="yourname@okaxis" autocapitalize="off"></label>
      <label class="field"><span>${t('One line about your shop')} <i>(${t('optional')})</i></span><input id="r-desc" data-rbind="desc" value="${esc(r.desc)}"></label>
      <label class="field"><span>${t('Choose a 4-digit PIN')}</span><input id="r-pin" type="password" inputmode="numeric" maxlength="4" data-rbind="pin" value="${esc(r.pin)}" style="letter-spacing:.4em;font-family:var(--mono)"></label>
      ${V.regErr ? `<p class="error" role="alert">${esc(V.regErr)}</p>` : ''}
      <button class="btn btn-go wide" type="submit">${t('Create my shop')}</button>
    </form>
  </main>`;
}
function orderCard(o, s) {
  const d = o.mode === 'delivery';
  const next = {pending:['confirmed', '✓ ' + t('Accept order')], confirmed:['ready', d ? '🛵 ' + t('Send out for delivery') : '📦 ' + t('Mark ready for pickup')], ready:['completed', d ? '✓ ' + t('Mark delivered') : '✓ ' + t('Mark picked up')]}[o.status];
  const sched = o.when && o.when !== 'now';
  return `<li class="order ${o.status === 'pending' ? 'new' : ''} ${V.flash === o.id ? 'flash' : ''}">
    <div class="o-top"><span class="o-id">${esc(o.id)}</span><span class="row-m">${ago(tAt(o))}</span>${statusPill(o)}<span class="o-total">${rs(o.total)}</span></div>
    <p><b>${esc(o.buyer)}</b> · ${d ? '🛵 ' + t('Deliver to {addr}', {addr:esc(o.address)}) : '🏪 ' + t('Pickup')}</p>
    <div class="meta">${sched ? `<span class="badge b-sched">🗓 ${esc(whenText(o))}</span>` : `<span class="badge b-plain">⚡ ${t('As soon as possible')}</span>`}
      ${o.paid === 'confirmed' ? `<span class="badge b-ok">✓ ${t('Paid')}</span>` : o.paid === 'claimed' ? `<span class="badge b-low">${t('Customer says paid by UPI')}</span>` : `<span class="badge b-plain">${t('Pay on pickup')}</span>`}
      ${o.discount ? `<span class="badge b-offer">🎁 −${rs(o.discount)}</span>` : ''}</div>
    <div class="o-items">${o.items.map(i => { const p = prodById(i.pid) || {name:i.name, category:s.category}; return `<div class="o-item">${thumb(p)}<span><b>${i.qty} ×</b> ${esc(i.name)}</span></div>`; }).join('')}</div>
    ${o.note ? `<p class="note">📝 ${esc(o.note)}</p>` : ''}
    <div class="o-act">
      ${next ? `<button class="btn ${o.status === 'pending' ? 'btn-go' : 'btn-forest'}" type="button" data-act="s-status" data-v="${esc(o.id)}|${next[0]}">${next[1]}</button>` : ''}
      ${o.status === 'pending' ? `<button class="btn btn-danger btn-sm ${V.arm === o.id ? 'armed' : ''}" type="button" data-act="s-decline" data-v="${esc(o.id)}">${V.arm === o.id ? t('Tap again to decline') : t('Decline')}</button>` : ''}
      ${o.paid !== 'confirmed' && o.status !== 'cancelled' ? `<button class="btn btn-ghost btn-sm" type="button" data-act="s-paid" data-v="${esc(o.id)}">₹ ${t('Mark paid')}</button>` : ''}
      ${o.phone ? `<a class="btn btn-link" href="${esc(waLink(o.phone, buyerMsg(o, s)))}" target="_blank" rel="noopener">💬 WhatsApp ${esc(o.buyer.split(' ')[0])}</a>` : ''}
    </div></li>`;
}
function sOrders(s, mine) {
  const groups = {new:mine.filter(o => o.status === 'pending'), active:mine.filter(o => ['confirmed','ready'].includes(o.status)), done:mine.filter(o => ['completed','cancelled'].includes(o.status))};
  const sortKey = o => (o.when && o.when !== 'now') ? new Date(o.when).getTime() : tAt(o);
  const list = groups[V.ordTab].sort((a, b) => V.ordTab === 'done' ? tAt(b) - tAt(a) : sortKey(a) - sortKey(b)).slice(0, 30);
  const empty = {new:['☕', t('All caught up'), t('New orders pop up here with a chime the moment someone orders.')], active:['📦', t('Nothing in progress'), t('Accepted orders wait here until they’re picked up or delivered.')], done:['✅', t('No finished orders yet'), t('Completed and declined orders show up here.')]}[V.ordTab];
  const today = liveOrders(s.id).filter(o => tAt(o) > Date.now() - DAY);
  const todaySum = today.reduce((a, o) => a + o.total - (o.fee || 0), 0);
  const canNotify = 'Notification' in window && Notification.permission === 'default' && !IN_CLAUDE;
  return `
  ${!isOpen(s) ? `<p class="note">${t('Your shop shows as Closed to customers. Tap the switch at the top to open.')}</p>` : ''}
  <div class="tiles">
    <div class="tile ${groups.new.length ? 'hot' : ''}"><span class="t-l">${t('Waiting')}</span><span class="t-v" data-count="${groups.new.length}">${groups.new.length}</span><span class="t-s">${t('to accept')}</span></div>
    <div class="tile"><span class="t-l">${t('Today')}</span><span class="t-v" data-count="${todaySum}" data-money="1">${rs(todaySum)}</span><span class="t-s">${t('{n} orders', {n:today.length})}</span></div>
  </div>
  ${canNotify ? `<button class="btn btn-ghost wide" type="button" data-act="s-notify">🔔 ${t('Get a notification for every new order')}</button>` : ''}
  ${V.newCount && V.ordTab === 'new' && groups.new.length ? `<div class="newbanner" role="status"><span class="bell" aria-hidden="true">🔔</span><span>${t('{n} new orders waiting for you', {n:groups.new.length})}</span></div>` : ''}
  <div class="seg" role="group" aria-label="${esc(t('Order status'))}">
    <button type="button" data-act="s-ordtab" data-v="new" aria-pressed="${V.ordTab === 'new'}">${t('New')}${groups.new.length ? `<span class="n">${groups.new.length}</span>` : ''}</button>
    <button type="button" data-act="s-ordtab" data-v="active" aria-pressed="${V.ordTab === 'active'}">${t('In progress')}${groups.active.length ? ` (${groups.active.length})` : ''}</button>
    <button type="button" data-act="s-ordtab" data-v="done" aria-pressed="${V.ordTab === 'done'}">${t('Done')}</button>
  </div>
  ${list.length ? `<ul class="sec" style="list-style:none;padding:0">${list.map(o => orderCard(o, s)).join('')}</ul>` : `<div class="empty"><span class="big">${empty[0]}</span><b>${empty[1]}</b><span>${empty[2]}</span></div>`}`;
}
function sProducts(s) {
  const ps = S.products.filter(p => p.shopId === s.id && (!V.pq || p.name.toLowerCase().includes(V.pq.toLowerCase())))
    .sort((a, b) => (b.at || 0) - (a.at || 0) || String(a.id).localeCompare(String(b.id)));
  const aiOn = !!SAMPLE || (S.backend === 'supabase' && !!CFG.smartFillFunction);
  return `
  <section class="card sec">
    <div class="sec-h"><h2 class="h2">${t('Add products')}</h2><span class="badge b-ai">✨ ${aiOn ? t('Smart fill · AI') : t('Smart fill')}</span></div>
    <p class="small muted">${t('Type them like you’d text a customer, one per line.')}${IMAGES_OK ? ' ' + t('Or snap a photo.') : ''}</p>
    <form id="s-ai" class="ai">
      <label class="sr" for="s-ai-text">${t('Products to add')}</label>
      <textarea id="s-ai-text" rows="3" placeholder="Blue notebook ₹40, 10 left&#10;Parker pen Rs 250 - 5 pcs">${esc(V.ai)}</textarea>
      ${V.photo ? `<span class="filechip"><span>📷 ${esc(V.photo.name || 'Photo')}</span><button type="button" data-act="s-photo-x" aria-label="${esc(t('Remove photo'))}">×</button></span>` : ''}
      <div class="ai-acts">
        <button class="btn btn-go" type="submit" ${V.aiBusy ? 'disabled' : ''}>${V.aiBusy ? '<span class="spinner"></span> ' + t('Reading…') : '✨ ' + t('Fill for me')}</button>
        ${IMAGES_OK ? `<label class="btn btn-ghost photo-btn">📷 ${t('Photo')}<input id="s-photo" type="file" accept="image/jpeg,image/png,image/webp" data-act="s-photo"></label>` : ''}
        <button class="btn btn-link" type="button" data-act="s-sample">${t('Try a sample')}</button>
      </div>
    </form>
    ${V.aiNote ? `<p class="small">${esc(V.aiNote)}</p>` : ''}
    ${V.draft.length ? `<div class="draft">
      <div class="dhead"><span></span><span>${t('Product')}</span><span>${t('Price')} ₹</span><span>${t('Stock')}</span><span></span></div>
      ${V.draft.map((r, i) => `<div class="drow ${r.bad ? 'bad' : ''}" style="animation-delay:${i * .07}s">
        ${thumb({name:r.name, category:r.category})}
        <input id="d${i}n" data-draft="${i}:name" value="${esc(r.name)}" aria-label="${esc(t('Product'))}">
        <input id="d${i}p" data-draft="${i}:price" inputmode="decimal" value="${esc(r.price)}" aria-label="${esc(t('Price'))}" class="${r.price === '' ? 'need' : ''}">
        <input id="d${i}s" data-draft="${i}:stock" inputmode="numeric" value="${esc(r.stock)}" aria-label="${esc(t('Stock'))}" class="${r.stock === '' ? 'need' : ''}">
        <button class="icon-btn" type="button" data-act="s-draft-x" data-v="${i}" aria-label="${esc(t('Remove'))}">×</button></div>`).join('')}
      <div class="ai-acts"><button class="btn btn-forest" type="button" data-act="s-draft-save">${t('Add {n} to my shop', {n:V.draft.length})}</button>
        <button class="btn btn-link" type="button" data-act="s-draft-blank">+ ${t('Row')}</button><button class="btn btn-link" type="button" data-act="s-draft-clear">${t('Discard')}</button></div>
    </div>` : `<button class="btn btn-link" type="button" data-act="s-draft-blank" style="justify-self:start">+ ${t('Add one by hand')}</button>`}
  </section>
  <section class="sec">
    <div class="sec-h"><h2 class="h2">${t('In my shop')}</h2><span class="small muted">${t('{a} live · {b} running low', {a:ps.filter(p => p.active !== false).length, b:ps.filter(p => p.stock <= 3 && p.active !== false).length})}</span></div>
    <label class="sr" for="s-pq">${t('Find a product')}</label><input id="s-pq" type="search" placeholder="🔍 ${esc(t('Find a product'))}" value="${esc(V.pq)}" data-sbind="pq">
    <ul class="plist">${ps.map(p => `<li class="${p.active === false ? 'off' : ''}">${thumb(p)}
      <div class="row-main"><span class="row-t">${esc(p.name)}</span>
        <label class="row-m" style="display:flex;align-items:center;gap:4px">₹<input class="pricein" id="pr-${esc(p.id)}" type="number" min="0" step="1" inputmode="decimal" value="${esc(p.price)}" data-act="s-price" data-v="${esc(p.id)}" aria-label="${esc(t('Price'))} ${esc(p.name)}">
          <button class="mini-sw" type="button" data-act="s-active" data-v="${esc(p.id)}" aria-pressed="${p.active !== false}" aria-label="${esc(t('Visible to customers'))}" title="${esc(t('Visible to customers'))}"></button></label></div>
      <div class="stockctl"><button class="icon-btn" type="button" data-act="s-stock" data-v="${esc(p.id)}|-1" ${p.stock > 0 ? '' : 'disabled'} aria-label="−1">−</button>
        <span class="q ${p.stock <= 0 ? 'out' : p.stock <= 3 ? 'low' : ''}" title="${esc(t('Stock'))}">${p.stock}</span>
        <button class="icon-btn" type="button" data-act="s-stock" data-v="${esc(p.id)}|1" aria-label="+1">+</button></div></li>`).join('')}</ul>
    <p class="small muted">${t('The switch hides a product from customers without deleting it.')}</p>
  </section>`;
}
function sInsights(s) {
  const all = liveOrders(s.id), wk = liveOrders(s.id, 7), today = all.filter(o => tAt(o) > Date.now() - DAY);
  const sold = new Map();
  for (const o of liveOrders(s.id, 30)) for (const it of o.items || []) sold.set(it.name, (sold.get(it.name) || 0) + it.qty);
  const top = [...sold.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const low = S.products.filter(p => p.shopId === s.id && p.active !== false && p.stock <= 3).sort((a, b) => a.stock - b.stock);
  const rd = radar(s.area), pending = all.filter(o => o.status === 'pending').length, rt = shopRating(s.id);
  const reviews = S.ratings.filter(r => r.shopId === s.id).sort((a, b) => tAt(b) - tAt(a)).slice(0, 4);
  const days = []; const start = new Date(); start.setHours(0, 0, 0, 0);
  for (let i = 6; i >= 0; i--) {
    const d0 = start.getTime() - i * DAY, d1 = d0 + DAY;
    const sum = all.filter(o => tAt(o) >= d0 && tAt(o) < d1).reduce((a, o) => a + o.total - (o.fee || 0), 0);
    days.push({label:i === 0 ? t('Today') : new Date(d0).toLocaleDateString(LANGS[LANG].code + '-IN', {weekday:'short'}), sum, today:i === 0});
  }
  const max = Math.max(1, ...days.map(d => d.sum));
  const kfmt = n => n >= 1000 ? '₹' + (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : (n ? '₹' + n : '');
  const weekSum = wk.reduce((a, o) => a + o.total - (o.fee || 0), 0);
  return `
  <div class="tiles">
    <div class="tile"><span class="t-l">${t('Today')}</span><span class="t-v" data-count="${today.length}">${today.length}</span><span class="t-s">${t('orders')}</span></div>
    <div class="tile ${pending ? 'hot' : ''}"><span class="t-l">${t('Waiting')}</span><span class="t-v" data-count="${pending}">${pending}</span><span class="t-s">${t('to accept')}</span></div>
    <div class="tile"><span class="t-l">${t('Sales, 7 days')}</span><span class="t-v" data-count="${weekSum}" data-money="1">${rs(weekSum)}</span><span class="t-s">${t('paid to you directly')}</span></div>
    <div class="tile"><span class="t-l">${t('Rating')}</span><span class="t-v">${rt.n ? '★ ' + rt.avg.toFixed(1) : '—'}</span><span class="t-s">${t('{n} ratings', {n:rt.n})}</span></div>
  </div>
  <section class="card sec"><div class="sec-h"><h2 class="h2">${t('Sales this week')}</h2><span class="small muted">${rs(weekSum)}</span></div>
    <div class="chart" role="img" aria-label="${esc(days.map(d => d.label + ' ' + rs(d.sum)).join(', '))}">
      ${days.map((d, i) => `<div class="col"><div class="bar ${d.today ? 'today' : ''}" style="height:${Math.max(4, Math.round(d.sum / max * 100))}%;animation-delay:${i * .06}s"><b>${kfmt(d.sum)}</b></div><span class="d">${esc(d.label)}</span></div>`).join('')}
    </div></section>
  <section class="radar">
    <div class="sec-h"><h2 class="h2">📡 ${t('Demand Radar')}</h2><span class="row-m">${esc(s.area)} · 7 ${t('days')}</span></div>
    <p class="sub">${t('People near you searched for these and no shop had them.')}</p>
    ${rd.length ? `<ol>${rd.map((r, i) => `<li class="${V.radarFlash === r.q ? 'flash' : ''}"><span class="q">${esc(cap(r.q))}</span><span class="n">${t('{n} searches', {n:r.n})}</span><span class="bar"><i style="--w:${Math.max(4, Math.round(r.n / rd[0].n * 100))}%;animation-delay:${i * .08}s"></i></span></li>`).join('')}</ol>
      <p class="sub small">💡 ${t('Stock the top one and those buyers will find you first.')}</p>` : `<p class="sub">${t('No missed searches this week.')}</p>`}
  </section>
  <section class="card sec"><div class="sec-h"><h2 class="h2">${t('Ratings')}</h2><span class="small muted">${rt.n ? stars(rt.avg, rt.n) : ''}</span></div>
    ${reviews.length ? reviews.map(r => `<div class="review">${stars(r.stars)} <span class="row-m">${ago(tAt(r))}</span>${r.text ? `<p>${esc(r.text)}</p>` : ''}</div>`).join('') : `<p class="small muted">${t('Ratings from customers will show here.')}</p>`}</section>
  <section class="card sec"><div class="sec-h"><h2 class="h2">${t('Running low')}</h2><span class="small muted">${t('3 or fewer')}</span></div>
    ${low.length ? `<ul class="plist">${low.map(p => `<li>${thumb(p)}<span class="row-main"><span class="row-t">${esc(p.name)}</span>${stockBadge(p.stock)}</span><button class="btn btn-ghost btn-sm" type="button" data-act="s-restock" data-v="${esc(p.id)}">+10</button></li>`).join('')}</ul>` : `<p class="small muted">${t('Everything is well stocked.')} 👍</p>`}</section>
  <section class="card sec"><div class="sec-h"><h2 class="h2">${t('Top sellers')}</h2><span class="small muted">30 ${t('days')}</span></div>
    ${top.length ? `<ul class="bars">${top.map(([n, q], i) => `<li><span>${esc(n)}</span><b class="price">${q}</b><span class="bar"><i style="--w:${Math.round(q / top[0][1] * 100)}%;animation-delay:${i * .08}s"></i></span></li>`).join('')}</ul>` : `<p class="small muted">${t('Your first sales will show here.')}</p>`}</section>`;
}
function sOffers(s) {
  const offs = S.offers.filter(o => o.shopId === s.id), f = V.offer;
  return `<section class="card sec">
    <div class="sec-h"><h2 class="h2">🎁 ${t('Offers')}</h2><span class="small muted">${t('You fund them, so keep them small')}</span></div>
    ${offs.length ? offs.map(o => `<div class="offrow"><span class="row-main"><b>${esc(offerTitle(o))}</b><span class="row-m">${t('Used {n} times', {n:S.orders.filter(x => x.offerId === o.id && x.status !== 'cancelled').length})}</span></span>
      <button class="mini-sw" type="button" data-act="s-offer-toggle" data-v="${esc(o.id)}" aria-pressed="${o.active !== false}" aria-label="${esc(t('Offer on'))}"></button></div>`).join('') : `<p class="small muted">${t('No offers yet. A small offer helps new customers try you.')}</p>`}
    <div class="seg" role="group" aria-label="${esc(t('Offer type'))}">
      <button type="button" data-act="s-offer-kind" data-v="pct" aria-pressed="${f.kind === 'pct'}">% ${t('Discount')}</button>
      <button type="button" data-act="s-offer-kind" data-v="freedel" aria-pressed="${f.kind === 'freedel'}">🛵 ${t('Free delivery')}</button>
    </div>
    ${f.kind === 'pct' ? `<div class="chips" role="group" aria-label="%">${[5, 10, 15].map(p => `<button class="chip" type="button" data-act="s-offer-pct" data-v="${p}" aria-pressed="${f.pct === p}">${p}%</button>`).join('')}</div>` : ''}
    <div style="display:grid;grid-template-columns:${f.kind === 'pct' ? '1fr 1fr' : '1fr'};gap:8px">
      <label class="field"><span>${t('Minimum order')} ₹</span><input id="of-min" type="number" min="0" step="50" value="${esc(f.minOrder)}" data-obind="minOrder"></label>
      ${f.kind === 'pct' ? `<label class="field"><span>${t('Max discount')} ₹ <i>(≤ ₹${OFFER_MAX_OFF})</i></span><input id="of-max" type="number" min="10" max="${OFFER_MAX_OFF}" step="10" value="${esc(f.maxOff)}" data-obind="maxOff"></label>` : ''}
    </div>
    ${V.offerErr ? `<p class="error" role="alert">${esc(V.offerErr)}</p>` : ''}
    <p class="note">${f.kind === 'pct' ? t('Worst case you give {amt} off an order of {min} or more.', {amt:rs(Math.min(OFFER_MAX_OFF, Number(f.maxOff) || 0)), min:rs(Number(f.minOrder) || 0)}) : t('You skip the delivery fee on orders of {min} or more.', {min:rs(Number(f.minOrder) || 0)})}</p>
    <button class="btn btn-forest" type="button" data-act="s-offer-add">${t('Start this offer')}</button>
  </section>`;
}
function sSettings(s) {
  const link = publicBase() + '?shop=' + encodeURIComponent(s.slug || slugify(s.name));
  return `
  <section class="card sec">
    <div class="sec-h"><h2 class="h2">${t('Your shop link')}</h2><button class="btn btn-go btn-sm" type="button" data-act="s-poster">${ICON.qr} ${t('QR poster')}</button></div>
    <p class="small muted">${t('Share it on WhatsApp status and Instagram. Customers open it and order.')}</p>
    <p class="linkbox">${esc(link)}</p>
    <button class="btn btn-ghost btn-sm" type="button" data-act="s-copy" data-v="${esc(link)}">${t('Copy link')}</button>
  </section>
  ${sOffers(s)}
  <section class="card sec">
    <h2 class="h2">${t('Orders, delivery and payment')}</h2>
    <label class="field"><span>${t('WhatsApp number')}</span><input id="st-wa" type="tel" inputmode="tel" value="${esc(prettyPhone(s.whatsapp))}" data-act="s-set-wa"></label>
    <label class="field"><span>${t('UPI ID')} <i>(${t('customers pay you here directly')})</i></span><input id="st-upi" value="${esc(s.upi || '')}" data-act="s-set-upi" autocapitalize="off" placeholder="yourname@okaxis">
      ${/@nukkad$/.test(s.upi || '') ? `<i>${t('This is a demo ID. Put your real UPI ID to receive money.')}</i>` : ''}</label>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <label class="field"><span>${t('Pickup ready in')} (${t('min')})</span><input id="st-ready" type="number" min="5" step="5" value="${esc(s.readyMins || 30)}" data-act="s-set-ready"></label>
      <label class="field"><span>${t('Delivery within')} (${t('min')})</span><input id="st-dmin" type="number" min="10" step="5" value="${esc(s.deliveryMins || 45)}" data-act="s-set-dmin" ${s.deliveryOn ? '' : 'disabled'}></label>
    </div>
    <label class="switch"><span>🛵 ${t('We deliver nearby')}</span><input id="st-del" type="checkbox" ${s.deliveryOn ? 'checked' : ''} data-act="s-set-del"></label>
    <label class="field"><span>${t('Delivery fee')} (₹)</span><input id="st-fee" type="number" min="0" step="5" value="${esc(s.deliveryFee || 0)}" data-act="s-set-fee" ${s.deliveryOn ? '' : 'disabled'}></label>
  </section>
  <p class="note">${S.conn === 'live' ? '🟢 ' + t('Live: orders from any phone arrive here instantly, with a chime.') : t('Demo copy: changes stay on this device. Open the customer app in another tab to see orders arrive here.')}</p>
  <a class="btn btn-ghost wide" href="${IN_CLAUDE ? '#' : '../'}">${t('Open the customer app')}</a>
  <button class="btn btn-danger wide" type="button" data-act="s-logout">${t('Log out')}</button>
  ${S.backend === 'local' ? `<button class="btn btn-link" type="button" data-act="s-reset" style="justify-self:center">${V.arm === 'reset' ? t('Tap again to reset the demo data') : t('Reset demo data on this device')}</button>` : ''}`;
}
function sPoster(s) {
  const link = publicBase() + '?shop=' + encodeURIComponent(s.slug || slugify(s.name));
  const svg = qrSvg(link, 8), off = offersFor(s.id)[0], rt = shopRating(s.id);
  return `<main class="gut poster-wrap">
    <div class="noprint" style="display:flex;justify-content:space-between;gap:8px;padding-top:12px"><button class="back" type="button" data-act="s-poster-x">‹ ${t('Back')}</button>
      ${IN_CLAUDE ? `<span class="small muted">${t('Screenshot this to print it.')}</span>` : `<button class="btn btn-go btn-sm" type="button" data-act="s-print">🖨 ${t('Print poster')}</button>`}</div>
    <div class="poster">
      <p class="p-brand">Nukkad</p>
      <h1>${esc(s.name)}</h1>
      <p class="p-sub">${t('Now taking orders on Nukkad')}</p>
      <div class="p-qr">${svg || `<p class="small">${t('QR code needs an internet connection the first time.')}</p>`}</div>
      <p class="p-cta">${t('Scan to order. Pick up in {n} min or get it delivered.', {n:Number(s.readyMins) || 30})}</p>
      <div class="p-row"><span>⭐ ${rt.n ? rt.avg.toFixed(1) : t('New')}</span><span>💳 UPI · ${t('Cash')}</span><span>₹0 ${t('extra charges')}</span></div>
      ${off ? `<p class="p-offer">🎁 ${esc(offerTitle(off))}</p>` : ''}
      <p class="p-link">${esc(link.replace(/^https?:\/\//, ''))}</p>
    </div>
  </main>`;
}

/* ---------- Seller actions ---------- */
async function sSetStatus(id, status) {
  const o = S.orders.find(x => x.id === id); if (!o) return;
  const prev = o.status;
  await patch('orders', id, {status, statusAt:Date.now()});
  buzz(20);
  if (status === 'cancelled' && prev !== 'cancelled') {
    for (const it of o.items) { const p = prodById(it.pid); if (p) await patch('products', p.id, {stock:p.stock + it.qty}); }
    toast(t('Declined {id}. Stock is back on the shelf.', {id}));
  } else {
    toast('✓ ' + statusText({...o, status}) + '. ' + t('{name} sees it now.', {name:o.buyer.split(' ')[0]}));
    if (status === 'confirmed') { V.ordTab = 'active'; V.newCount = 0; }
  }
  render();
}
async function aiExtract(text, s) {
  if (SAMPLE) {
    const opts = {modelTier:'quick'};
    if (V.photo && IMAGES_OK) opts.images = [V.photo];
    return SAMPLE.json(aiPrompt(text, !!opts.images, s.category), opts);
  }
  if (S.backend === 'supabase' && SB && CFG.smartFillFunction) {
    const r = await SB.functions.invoke(CFG.smartFillFunction, {body:{prompt:aiPrompt(text, false, s.category)}});
    if (r.error) throw r.error;
    return r.data && (r.data.products || r.data);
  }
  return null;
}
async function sAiFill() {
  const s = shopById(V.shopId), text = V.ai.trim();
  if (!text && !V.photo) { toast(t('Type a product first, like “Blue notebook ₹40, 10 left”.')); return; }
  V.aiBusy = true; V.aiNote = ''; render();
  let rows = null, used = 'reader';
  try {
    const out = await aiExtract(text, s);
    const arr = Array.isArray(out) ? out : (out && Array.isArray(out.products) ? out.products : null);
    if (arr) {
      rows = arr.map(r => ({
        name:cap(String(r.name || '').trim()),
        price:r.price == null || isNaN(Number(r.price)) ? '' : String(Number(r.price)),
        stock:r.stock == null || isNaN(parseInt(r.stock, 10)) ? '' : String(parseInt(r.stock, 10)),
        category:CATS.includes(r.category) ? r.category : guessCat(r.name, s.category),
      })).filter(r => r.name);
      used = 'ai';
    }
  } catch (e) {
    if (e && ['not_granted','sampling_disabled','not_declared','capability_disabled','capability_removed'].includes(e.code)) SAMPLE = null;
  }
  if (!rows && text) rows = text.split(/\n+/).map(parseLine).filter(Boolean).map(r => ({...r, category:guessCat(r.name, s.category)}));
  V.aiBusy = false;
  if (!rows || !rows.length) { V.aiNote = t('Couldn’t find a product in that. Try “Notebook ₹40, 10 left”.'); render(); return; }
  V.draft = rows;
  const miss = rows.filter(r => r.price === '' || r.stock === '').length;
  V.aiNote = (used === 'ai' ? '✨ ' + (rows.length === 1 ? t('AI read 1 product.') : t('AI read {n} products.', {n:rows.length})) : (rows.length === 1 ? t('Read 1 product.') : t('Read {n} products.', {n:rows.length}))) + ' ' + (miss ? t('Fill the yellow boxes, then add.') : t('Check them, then add.'));
  render();
  document.getElementById('d0n')?.focus();
}
async function sSaveDraft() {
  const s = shopById(V.shopId), keep = [];
  let added = 0;
  for (const r of V.draft) {
    const name = String(r.name || '').trim(), price = parseFloat(r.price), stock = parseInt(r.stock, 10);
    if (name && !isNaN(price) && price >= 0 && !isNaN(stock) && stock >= 0) {
      const ok = await put('products', {id:'p' + Date.now().toString(36) + rid(3), shopId:s.id, name, category:r.category || s.category, price, stock, desc:'', active:true, at:Date.now()});
      if (ok) added++;
    } else { r.bad = true; keep.push(r); }
  }
  V.draft = keep;
  if (added) { if (!keep.length) { V.ai = ''; V.photo = null; V.aiNote = ''; } buzz(30); toast('🎉 ' + t('Added {n} products. Customers can find them now.', {n:added})); }
  else toast(t('Each row needs a name, a price and a stock count.'));
  render();
}
async function sRegisterSubmit() {
  const r = V.reg, wa = cleanPhone(r.whatsapp);
  const fail = m => { V.regErr = m; FX.enter = false; render(); };
  if (!r.name.trim()) return fail(t('Add your shop’s name.'));
  if (!r.area.trim()) return fail(t('Add your area, like Jayanagar.'));
  if (wa.length < 12) return fail(t('Add a 10-digit WhatsApp number.'));
  if (r.upi.trim() && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(r.upi.trim())) return fail(t('Check the UPI ID. It looks like name@bank.'));
  if (!/^\d{4}$/.test(r.pin)) return fail(t('Choose a PIN of exactly 4 digits.'));
  const id = 's' + Date.now().toString(36) + rid(3);
  const shop = {id, name:r.name.trim(), slug:slugify(r.name) + '-' + rid(3), category:r.category, area:cap(r.area.trim()), address:r.address.trim(), whatsapp:wa, upi:r.upi.trim(),
    desc:r.desc.trim(), deliveryOn:false, deliveryFee:30, readyMins:30, deliveryMins:45, open:true, at:Date.now()};
  if (!(await createShop(shop, r.pin))) return fail(t('Couldn’t create the shop. Check your connection and try again.'));
  V.reg = null; V.regErr = ''; V.shopId = id; V.seen = null; V.tab = 'products'; ls('seller-shop', id);
  afterData(); toast('🎉 ' + t('Welcome to Nukkad, {shop}! Add your first products.', {shop:shop.name})); FX.enter = true; render(); scrollTop();
}
async function sTryPin() {
  const s = shopById(V.pick); if (!s) return;
  if (await checkPin(s, V.pin)) {
    V.shopId = s.id; V.pin = ''; V.pinErr = false; V.seen = null; V.tab = 'orders'; V.pick = null; ls('seller-shop', s.id);
    afterData(); buzz(30); FX.enter = true; FX.count = true; render(); scrollTop(); toast(t('Welcome back, {shop}', {shop:s.name}) + ' 👋');
  } else { V.pinErr = true; V.pin = ''; buzz([40, 40, 40]); render(); }
}
Object.assign(ACT, {
  's-pick': v => { V.pick = v || null; V.pin = ''; V.pinErr = false; FX.enter = true; render(); },
  's-key': v => {
    if (v === 'back') V.pin = V.pin.slice(0, -1);
    else if (V.pin.length < 4) { V.pin += v; V.pinErr = false; buzz(8); }
    render();
    if (V.pin.length === 4) setTimeout(sTryPin, 120);
  },
  's-reg': () => { V.reg = {name:'', category:'Stationery', area:C.area !== 'All' ? C.area : '', address:'', whatsapp:'', upi:'', desc:'', pin:''}; V.regErr = ''; FX.enter = true; render(); scrollTop(); },
  's-regcat': v => { V.reg.category = v; render(); },
  's-reg-cancel': () => { V.reg = null; FX.enter = true; render(); },
  's-tab': v => { V.tab = v; V.arm = null; FX.enter = true; FX.count = true; render(); scrollTop(); },
  's-ordtab': v => { V.ordTab = v; V.arm = null; FX.enter = true; render(); },
  's-status': v => { const [id, st] = v.split('|'); sSetStatus(id, st); },
  's-decline': v => {
    if (V.arm === v) { V.arm = null; sSetStatus(v, 'cancelled'); }
    else { V.arm = v; render(); setTimeout(() => { if (V.arm === v) { V.arm = null; render(); } }, 4000); }
  },
  's-paid': v => { patch('orders', v, {paid:'confirmed'}); buzz(15); toast('✓ ' + t('Marked as paid')); },
  's-open': () => { const s = shopById(V.shopId); const next = !isOpen(s); patch('shops', s.id, {open:next}); buzz(20); toast(next ? '🟢 ' + t('You’re open. Customers can order now.') : '🔴 ' + t('Closed. Customers can browse but not order.')); },
  's-stock': v => { const [pid, d] = v.split('|'), p = prodById(pid); if (p) patch('products', pid, {stock:Math.max(0, p.stock + Number(d))}); },
  's-restock': v => { const p = prodById(v); if (p) { patch('products', v, {stock:p.stock + 10}); toast('+10 ' + p.name); } },
  's-active': v => { const p = prodById(v); if (p) { const next = p.active === false; patch('products', v, {active:next}); toast(next ? t('{name} is visible again', {name:p.name}) : t('{name} hidden from customers', {name:p.name})); } },
  's-sample': () => {
    const s = shopById(V.shopId);
    const SAMPLES = {Stationery:'Blue notebook ₹40, 10 left\nParker pen Rs 250 - 5 pcs\nA4 drawing sheets 5/- stock 100', Grocery:'Toor dal 1kg ₹165, 20 left\nGhee 500ml Rs 340 - 6 pcs', Clothing:'Cotton kurta ₹650, 8 left\nSilk saree Rs 2400 - 2 pcs', Electronics:'USB-C cable ₹199, 30 left\nPower bank 10000mAh Rs 1099 - 4 pcs', Handicrafts:'Wooden elephant ₹350, 6 left\nBrass bell Rs 280 - 10 pcs'};
    V.ai = SAMPLES[s.category] || SAMPLES.Stationery; render();
  },
  's-photo-x': () => { V.photo = null; render(); },
  's-draft-blank': () => { V.draft.push({name:'', price:'', stock:'', category:shopById(V.shopId).category}); render(); document.getElementById(`d${V.draft.length - 1}n`)?.focus(); },
  's-draft-x': v => { V.draft.splice(Number(v), 1); if (!V.draft.length) V.aiNote = ''; render(); },
  's-draft-clear': () => { V.draft = []; V.aiNote = ''; render(); },
  's-draft-save': () => sSaveDraft(),
  's-logout': () => { V.shopId = null; V.pick = null; V.pin = ''; V.seen = null; V.newCount = 0; ls('seller-shop', null); FX.enter = true; render(); scrollTop(); },
  's-reset': () => {
    if (V.arm === 'reset') { V.arm = null; L = seed2(); saveLocal(); useLocal(); seenStatus = null; V.seen = null; afterData(); toast(t('Demo data reset on this device.')); render(); }
    else { V.arm = 'reset'; render(); setTimeout(() => { if (V.arm === 'reset') { V.arm = null; render(); } }, 4000); }
  },
  's-notify': async () => { try { const p = await Notification.requestPermission(); toast(p === 'granted' ? '🔔 ' + t('You’ll get a notification for new orders.') : t('Notifications are off. You’ll still hear the chime.')); } catch (e) { /* ignore */ } render(); },
  's-poster': () => { V.poster = true; FX.enter = true; render(); scrollTop(); },
  's-poster-x': () => { V.poster = false; FX.enter = true; render(); },
  's-print': () => window.print(),
  's-copy': async v => { try { await navigator.clipboard.writeText(v); toast(t('Link copied')); } catch (e) { toast(t('Press and hold the link to copy it.')); } },
  's-offer-kind': v => { V.offer.kind = v; if (v === 'freedel') V.offer.minOrder = 499; V.offerErr = ''; render(); },
  's-offer-pct': v => { V.offer.pct = Number(v); render(); },
  's-offer-toggle': v => { const o = S.offers.find(x => x.id === v); if (o) { patch('offers', v, {active:o.active === false}); toast(o.active === false ? t('Offer is live') : t('Offer paused')); } },
  's-offer-add': async () => {
    const s = shopById(V.shopId), f = V.offer, min = Math.round(Number(f.minOrder) || 0), max = Math.round(Number(f.maxOff) || 0);
    if (min < 100) { V.offerErr = t('Set a minimum order of at least ₹100.'); render(); return; }
    if (f.kind === 'pct' && (max < 10 || max > OFFER_MAX_OFF)) { V.offerErr = t('Max discount must be between ₹10 and ₹{max}.', {max:OFFER_MAX_OFF}); render(); return; }
    if (f.kind === 'pct' && ![5, 10, 15].includes(f.pct)) { V.offerErr = t('Pick 5%, 10% or 15%.'); render(); return; }
    const o = f.kind === 'pct' ? {id:'of' + Date.now().toString(36), shopId:s.id, kind:'pct', pct:f.pct, minOrder:min, maxOff:max, active:true, at:Date.now()} : {id:'of' + Date.now().toString(36), shopId:s.id, kind:'freedel', minOrder:min, active:true, at:Date.now()};
    V.offerErr = '';
    if (await put('offers', o)) { buzz(20); toast('🎁 ' + t('Offer is live: {o}', {o:offerTitle(o)})); }
    render();
  },
});
Object.assign(CHANGE, {
  's-photo': el => { V.photo = el.files && el.files[0] ? el.files[0] : null; render(); },
  's-price': el => { const n = Math.max(0, Number(el.value)); if (!isNaN(n)) patch('products', el.dataset.v, {price:n}).then(() => toast(t('Price updated'))); },
  's-set-wa': el => { const s = shopById(V.shopId), d = cleanPhone(el.value); if (d.length < 12) { toast(t('Enter a 10-digit mobile number.')); render(); return; } patch('shops', s.id, {whatsapp:d}).then(() => toast(t('Orders will go to {n}', {n:prettyPhone(d)}))); },
  's-set-upi': el => { const s = shopById(V.shopId), v = el.value.trim(); if (v && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(v)) { toast(t('Check the UPI ID. It looks like name@bank.')); render(); return; } patch('shops', s.id, {upi:v}).then(() => toast(t('UPI ID saved'))); },
  's-set-ready': el => patch('shops', V.shopId, {readyMins:Math.max(5, Math.round(Number(el.value) || 30))}),
  's-set-dmin': el => patch('shops', V.shopId, {deliveryMins:Math.max(10, Math.round(Number(el.value) || 45))}),
  's-set-del': el => patch('shops', V.shopId, {deliveryOn:el.checked}),
  's-set-fee': el => patch('shops', V.shopId, {deliveryFee:Math.max(0, Math.round(Number(el.value) || 0))}),
});
SUBMIT['s-ai'] = () => sAiFill();
SUBMIT['s-register'] = () => sRegisterSubmit();
document.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.rbind && V.reg) V.reg[el.dataset.rbind] = el.dataset.rbind === 'pin' ? el.value.replace(/\D/g, '').slice(0, 4) : el.value;
  if (el.dataset.sbind === 'pq') { V.pq = el.value; render(); }
  if (el.dataset.obind) { V.offer[el.dataset.obind] = el.value; V.offerErr = ''; }
  if (el.dataset.draft) { const [i, f] = el.dataset.draft.split(':'); const r = V.draft[Number(i)]; if (r) { r[f] = el.value; r.bad = false; } }
  if (el.id === 's-ai-text') V.ai = el.value;
});
document.addEventListener('keydown', e => {
  if (APP() !== 'seller' || !V.pick || V.shopId || /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName || '')) return;
  if (/^[0-9]$/.test(e.key) && V.pin.length < 4) { V.pin += e.key; V.pinErr = false; render(); if (V.pin.length === 4) setTimeout(sTryPin, 120); }
  if (e.key === 'Backspace') { V.pin = V.pin.slice(0, -1); render(); }
});


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

})();
