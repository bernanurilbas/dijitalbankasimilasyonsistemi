import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../store/slices/settingsSlice';
import Select from '../ui/Select';
import { Globe } from 'lucide-react';

const LanguageSelect = () => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.settings.language);

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.005] text-left">
      <div className="flex items-center gap-2">
        <Globe size={16} className="text-brand-primary animate-pulse" />
        <span className="text-xs font-bold text-brand-textPrimary">Dil Seçimi / Language</span>
      </div>

      <Select
        value={language}
        onChange={(e) => dispatch(setLanguage(e.target.value))}
        options={[
          { value: 'tr', label: 'Türkçe - TR' },
          { value: 'en', label: 'English - EN (Global)' }
        ]}
      />
    </div>
  );
};

export default LanguageSelect;
