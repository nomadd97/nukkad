
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
