import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <p className="footer-text">
        ⚖️ LegalTrack — {t.footerSlogan}
      </p>
      <p className="footer-text">
        © {new Date().getFullYear()} LegalTrack. {t.allRightsReserved}
      </p>
    </footer>
  );
};

export default Footer;