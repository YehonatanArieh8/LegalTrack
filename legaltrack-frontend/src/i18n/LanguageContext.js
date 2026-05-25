import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );

  const t = translations[language];

  // Apply direction to body when language changes
  useEffect(() => {
    document.body.setAttribute('dir', t.dir);
    document.body.setAttribute('lang', language);
  }, [language, t.dir]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for easy use in components
export const useLanguage = () => useContext(LanguageContext);