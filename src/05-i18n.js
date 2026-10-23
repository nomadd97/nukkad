
/* ---------- Languages ----------
   Keys are the English text. The build fills I18N from tools/i18n.tsv.
   Missing words fall back to English, so nothing ever shows blank. */
const LANGS = {
  en:{name:'English', short:'EN', code:'en', voice:'en-IN', sample:'Order from your street', hello:'Language: English'},
  hi:{name:'हिंदी', short:'हि', code:'hi', voice:'hi-IN', sample:'अपनी गली से ऑर्डर करें', hello:'भाषा: हिंदी'},
  kn:{name:'ಕನ್ನಡ', short:'ಕ', code:'kn', voice:'kn-IN', sample:'ನಿಮ್ಮ ಬೀದಿಯಿಂದ ಆರ್ಡರ್ ಮಾಡಿ', hello:'ಭಾಷೆ: ಕನ್ನಡ'},
};
const I18N = /*@I18N@*/{hi:{}, kn:{}};
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
