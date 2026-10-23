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

