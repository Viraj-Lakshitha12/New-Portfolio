import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'hero.title': 'Full Stack Software Engineer',
    'hero.subtitle': 'I architect and build scalable, high-performance web applications with a focus on seamless user experiences and robust backend systems.',
    'hero.cta': 'View My Work',
    'about.title': 'About Me',
    'tech.title': 'Tech Stack',
    'guestbook.title': 'Guestbook'
  },
  si: {
    'nav.home': 'මුල් පිටුව',
    'nav.about': 'මම ගැන',
    'nav.skills': 'හැකියාවන්',
    'nav.experience': 'අත්දැකීම්',
    'nav.projects': 'ව්‍යාපෘති',
    'nav.contact': 'සම්බන්ධ වන්න',
    'hero.title': 'Full Stack මෘදුකාංග ඉංජිනේරු',
    'hero.subtitle': 'මම ඉහළ ක්‍රියාකාරීත්වයකින් යුත්, පරිමාණය කළ හැකි වෙබ් යෙදුම් සහ ශක්තිමත් පසුබිම් පද්ධති නිර්මාණය කරමි.',
    'hero.cta': 'මගේ වැඩ බලන්න',
    'about.title': 'මම ගැන',
    'tech.title': 'තාක්ෂණයන්',
    'guestbook.title': 'අමුත්තන්ගේ පොත'
  }
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('vldev_lang');
    if (saved && (saved === 'en' || saved === 'si')) {
      setLang(saved);
    }
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'si' : 'en';
    setLang(newLang);
    localStorage.setItem('vldev_lang', newLang);
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
