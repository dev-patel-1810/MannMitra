
import React from 'react';
import './Footer.css';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="#">{t('footer.helpline')}</a>
        <a href="#">{t('footer.aboutUs')}</a>
        <a href="#">{t('footer.privacy')}</a>
        <a href="#">{t('footer.contactUs')}</a>
      </div>
      <p>&copy; 2025 Mann Mitra. {t('footer.rightsReserved')}</p>
    </footer>
  );
};

export default Footer;
