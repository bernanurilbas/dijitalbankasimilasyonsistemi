import React from 'react';

const Footer = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-6 border-t border-brand-border text-center text-xs text-brand-textMuted flex flex-col sm:flex-row justify-between items-center gap-4 ${className}`}>
      <div>
        &copy; {currentYear} Astra Bank A.Ş. Tüm hakları saklıdır.
      </div>
      <div className="flex gap-4 font-semibold">
        <a href="#" className="hover:text-brand-textPrimary transition-colors">Kullanım Koşulları</a>
        <a href="#" className="hover:text-brand-textPrimary transition-colors">Gizlilik Politikası</a>
        <a href="#" className="hover:text-brand-textPrimary transition-colors">İletişim</a>
      </div>
    </footer>
  );
};

export default Footer;
