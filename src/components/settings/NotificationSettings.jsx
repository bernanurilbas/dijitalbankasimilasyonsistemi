import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateNotificationSettings } from '../../store/slices/settingsSlice';
import Switch from '../ui/Switch';

const NotificationSettings = () => {
  const dispatch = useDispatch();
  const savedNotifs = useSelector((state) => state.settings.notifications);

  const [marketing, setMarketing] = useState(true);
  const [transactionSms, setTransactionSms] = useState(true);
  const [securityEmail, setSecurityEmail] = useState(true);

  useEffect(() => {
    setMarketing(savedNotifs.marketing);
    setTransactionSms(savedNotifs.transactionSms);
    setSecurityEmail(savedNotifs.securityEmail);
  }, [savedNotifs]);

  const handleToggle = (key, val) => {
    dispatch(updateNotificationSettings({ [key]: val }));
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.005] text-left">
      <div>
        <span className="text-xs font-bold text-brand-textPrimary block">Bildirim İzinleri</span>
        <span className="text-[10px] text-brand-textMuted leading-relaxed block mt-0.5">
          Kampanya, bilgilendirme ve işlem bildirim kanallarını açıp kapatın.
        </span>
      </div>

      <div className="flex flex-col gap-3.5 mt-2">
        <Switch
          label="Pazarlama ve Kampanya E-Postaları"
          checked={marketing}
          onChange={(e) => {
            setMarketing(e.target.checked);
            handleToggle('marketing', e.target.checked);
          }}
        />

        <Switch
          label="SMS Para Gönderim/Alım Bildirimi"
          checked={transactionSms}
          onChange={(e) => {
            setTransactionSms(e.target.checked);
            handleToggle('transactionSms', e.target.checked);
          }}
        />

        <Switch
          label="E-Posta Ekstre ve Güvenlik Duyuruları"
          checked={securityEmail}
          onChange={(e) => {
            setSecurityEmail(e.target.checked);
            handleToggle('securityEmail', e.target.checked);
          }}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;
