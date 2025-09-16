import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
// import guTranslations from './locales/gu.json';
import hiTranslations from './locales/hi.json';


i18n
.use(initReactI18next)
.init({
    resources: {
    en: { translation: enTranslations },
    // gu: { translation: guTranslations },
    hi: { translation: hiTranslations }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
    escapeValue: false
    }
});

export default i18n;