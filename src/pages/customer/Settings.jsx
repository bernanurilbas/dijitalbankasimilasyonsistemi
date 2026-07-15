import React from 'react';
import PageHeader from '../../components/layout/PageHeader';
import ThemeSwitch from '../../components/settings/ThemeSwitch';
import LanguageSelect from '../../components/settings/LanguageSelect';
import NotificationSettings from '../../components/settings/NotificationSettings';
import SecuritySettings from '../../components/settings/SecuritySettings';
import { useTranslation } from '../../hooks/useTranslation';

const Settings = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <PageHeader 
        title={t('settings_title', 'Genel Ayarlar')} 
        description={t('settings_desc_no_theme', 'Dil seçeneklerini, işlem bildirimlerini ve oturum güvenlik tercihlerinizi kişiselleştirin.')}
      />

      {/* Settings Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Visual Themes & Translations */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-brand-border bg-white/[0.005]">
            <h3 className="text-sm font-extrabold text-brand-textPrimary tracking-wide uppercase mb-4 text-left">
              {t('appearance_and_language', 'Görünüm ve Dil')}
            </h3>
            <div className="flex flex-col gap-5">
              <ThemeSwitch />
              <LanguageSelect />
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Sessions */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-brand-border bg-white/[0.005] flex flex-col gap-5">
            <h3 className="text-sm font-extrabold text-brand-textPrimary tracking-wide uppercase text-left">
              {t('notifications_and_security', 'Bildirimler ve Cihaz Güvenliği')}
            </h3>
            <NotificationSettings />
            <SecuritySettings />
          </div>
        </div>

      </div>

    </div>
  );
};

export default Settings;
