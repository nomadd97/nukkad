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
