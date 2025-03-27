// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './utils/translations';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translations.en },
      es: { translation: translations.es },
      ko: { translation: translations.ko }
    },
    lng: 'es', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already escapes values
    }
  });

export default i18n;