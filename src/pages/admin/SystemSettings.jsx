import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Switch from '../../components/ui/Switch';
import Toast from '../../components/ui/Toast';
import Spinner from '../../components/ui/Spinner';
import { useTranslation } from '../../hooks/useTranslation';
import { Settings, Save } from 'lucide-react';

const SystemSettings = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  // Form states
  const [transferFeeTRY, setTransferFeeTRY] = useState('');
  const [eftFeeTRY, setEftFeeTRY] = useState('');
  const [fastFeeTRY, setFastFeeTRY] = useState('');
  const [interestRateTRY, setInterestRateTRY] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Toast states
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/systemSettings');
      const data = response.data;
      if (data) {
        setTransferFeeTRY(data.transferFeeTRY?.toString() || '0');
        setEftFeeTRY(data.eftFeeTRY?.toString() || '0');
        setFastFeeTRY(data.fastFeeTRY?.toString() || '0');
        setInterestRateTRY(data.interestRateTRY?.toString() || '0');
        setMaintenanceMode(!!data.maintenanceMode);
      }
    } catch (err) {
      setToastMessage(t('settings_load_error', 'Sistem ayarları yüklenemedi.'));
      setToastType('danger');
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    const payload = {
      transferFeeTRY: parseFloat(transferFeeTRY) || 0,
      eftFeeTRY: parseFloat(eftFeeTRY) || 0,
      fastFeeTRY: parseFloat(fastFeeTRY) || 0,
      interestRateTRY: parseFloat(interestRateTRY) || 0,
      maintenanceMode
    };

    try {
      // 1. Update backend system settings
      await api.patch('/systemSettings', payload);

      // 2. Post log
      await api.post('/systemLogs', {
        message: `Banka finansal ayarları güncellendi. Yeni faiz oranı: %${payload.interestRateTRY}, Havale: ${payload.transferFeeTRY} TL, EFT: ${payload.eftFeeTRY} TL, FAST: ${payload.fastFeeTRY} TL. Bakım modu: ${payload.maintenanceMode ? 'Aktif' : 'Pasif'}.`,
        userId: '1',
        userRole: 'admin',
        date: new Date().toISOString()
      });

      setToastMessage(t('settings_save_success', 'Sistem ayarları başarıyla kaydedildi.'));
      setToastType('success');
      setToastOpen(true);
    } catch (err) {
      setToastMessage(t('settings_save_error', 'Ayarlar kaydedilirken hata oluştu.'));
      setToastType('danger');
      setToastOpen(true);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Notification */}
      <div className="fixed bottom-6 right-6 z-50">
        <Toast
          message={toastMessage}
          type={toastType}
          isOpen={toastOpen}
          onClose={() => setToastOpen(false)}
        />
      </div>

      <PageHeader
        title={t('system_settings_title', 'Sistem Finansal Ayarları')}
        description={t('system_settings_desc', 'Banka para transfer ücretlerini, faiz oranlarını ve bakım modu durumunu yapılandırın.')}
      />

      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleSaveSettings} className="glass-panel p-6 rounded-2xl border border-brand-border bg-white/[0.005] max-w-xl text-left flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-brand-border pb-4">
            <Settings size={18} className="text-brand-primary" />
            <h3 className="text-sm font-extrabold text-brand-textPrimary tracking-wide">
              {t('settings_title', 'Ayarlar')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="number"
              step="0.01"
              label={t('transfer_fee_try', 'Havale Ücreti (TRY)')}
              value={transferFeeTRY}
              onChange={(e) => setTransferFeeTRY(e.target.value)}
              required
            />

            <Input
              type="number"
              step="0.01"
              label={t('eft_fee_try', 'EFT Ücreti (TRY)')}
              value={eftFeeTRY}
              onChange={(e) => setEftFeeTRY(e.target.value)}
              required
            />

            <Input
              type="number"
              step="0.01"
              label={t('fast_fee_try', 'FAST Ücreti (TRY)')}
              value={fastFeeTRY}
              onChange={(e) => setFastFeeTRY(e.target.value)}
              required
            />

            <Input
              type="number"
              step="0.01"
              label={t('interest_rate_try', 'TL Mevduat Faiz Oranı (%)')}
              value={interestRateTRY}
              onChange={(e) => setInterestRateTRY(e.target.value)}
              required
            />
          </div>

          {/* Maintenance Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-brand-border bg-white/[0.01]">
            <div>
              <span className="text-xs font-bold text-brand-textPrimary block">
                {t('maintenance_mode', 'Bakım Modu')}
              </span>
              <span className="text-[10px] text-brand-textMuted mt-0.5 block">
                {t('maintenance_mode_desc', 'Aktifleştirildiğinde bankacılık işlemleri durdurulur ve uyarı ekranı gösterilir.')}
              </span>
            </div>
            <Switch
              checked={maintenanceMode}
              onChange={(checked) => setMaintenanceMode(checked)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={saveLoading}
              className="px-6 flex items-center gap-1.5"
            >
              <Save size={16} />
              {t('save_settings', 'Ayarları Kaydet')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SystemSettings;
