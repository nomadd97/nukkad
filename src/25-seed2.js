
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
