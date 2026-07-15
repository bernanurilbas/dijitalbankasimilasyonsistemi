import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../store/slices/settingsSlice';
import { useTranslation } from '../../hooks/useTranslation';
import { Sun, Moon } from 'lucide-react';

const ThemeSwitch = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.settings.theme);
  const { t } = useTranslation();

  const handleToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(nextTheme));
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.005]">
      <div className="text-left">
        <span className="text-xs font-bold text-brand-textPrimary block">{t('theme_preference', 'Tema Seçimi')}</span>
        <span className="text-[10px] text-brand-textMuted leading-relaxed block mt-0.5">
          {t('theme_desc', 'Uygulama genel görünümünü aydınlık veya karanlık moda alın.')}
        </span>
      </div>

      <button
        onClick={handleToggle}
        className="relative w-14 h-8 bg-white/5 border border-white/10 rounded-full p-1 transition-all duration-300 flex items-center cursor-pointer focus:outline-none"
      >
        {/* Sliding Dot */}
        <div 
          className={`w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-white transition-all duration-300 ${theme === 'dark' ? 'translate-x-6 bg-indigo-600' : 'translate-x-0'}`}
        >
          {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
        </div>
      </button>
    </div>
  );
};

export default ThemeSwitch;
