
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
