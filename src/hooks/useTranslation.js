import { useSelector } from 'react-redux';
import { translations } from '../utils/translations';

export const useTranslation = () => {
  const language = useSelector((state) => state.settings.language) || 'tr';

  const t = (key, defaultValue = '') => {
    return translations[language]?.[key] || translations['tr']?.[key] || defaultValue || key;
  };

  return {
    t,
    language,
    isTr: language === 'tr',
    isEn: language === 'en'
  };
};
