import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language ? i18n.language.split('-')[0] : 'en');

  const toggleLanguage = (langCode: string) => {
    if (currentLang !== langCode) {
      i18n.changeLanguage(langCode);
      localStorage.setItem('katarbari_lang', langCode);
    }
  };

  return (
    <div 
      className="inline-flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-semibold"
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => toggleLanguage('en')}
        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
          currentLang === 'en'
            ? 'bg-white text-slate-900 font-bold shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        aria-pressed={currentLang === 'en'}
      >
        English
      </button>

      <button
        type="button"
        onClick={() => toggleLanguage('ne')}
        className={`px-2.5 py-1 rounded-md font-ne transition-colors cursor-pointer ${
          currentLang === 'ne'
            ? 'bg-white text-slate-900 font-bold shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        aria-pressed={currentLang === 'ne'}
      >
        नेपाली
      </button>
    </div>
  );
}
