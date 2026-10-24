import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import neTranslation from './locales/ne/translation.json';

const resources = {
  en: { translation: enTranslation },
  ne: { translation: neTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ne'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'katarbari_lang',
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

// Keep HTML lang attribute and document title synchronized
i18n.on('languageChanged', (lng) => {
  const cleanLang = (lng || 'en').split('-')[0];
  document.documentElement.lang = cleanLang;
  document.documentElement.setAttribute('dir', 'ltr');
  document.title = i18n.t('seo.defaultTitle');
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', i18n.t('seo.defaultDescription'));
  }
});

export default i18n;
