import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import doiTranslations from './locales/doi.json';
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';


// Always sync i18n language with localStorage on load
let savedLang = localStorage.getItem('appLanguage');
if (!savedLang || (savedLang !== 'en' && savedLang !== 'hi' && savedLang !== 'doi')) {
  savedLang = 'en';
  localStorage.setItem('appLanguage', 'en');
}

i18n.on('languageChanged', (lng) => {
  if (lng && (lng === 'en' || lng === 'hi' || lng === 'doi')) {
    localStorage.setItem('appLanguage', lng);
  }
});

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      hi: { translation: hiTranslations },
      doi: { translation: doiTranslations }
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
