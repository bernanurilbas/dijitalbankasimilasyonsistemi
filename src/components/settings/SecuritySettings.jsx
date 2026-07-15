import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSecuritySettings } from '../../store/slices/settingsSlice';
import Switch from '../ui/Switch';
import Select from '../ui/Select';
import { ShieldAlert } from 'lucide-react';

const SecuritySettings = () => {
  const dispatch = useDispatch();
  const savedSec = useSelector((state) => state.settings.security);

  const [autoLogout, setAutoLogout] = useState(15);
  const [rememberDev, setRememberDev] = useState(true);

  useEffect(() => {
    setAutoLogout(savedSec.autoLogoutMinutes);
    setRememberDev(savedSec.rememberDevice);
  }, [savedSec]);

  const handleLogoutChange = (val) => {
    const mins = parseInt(val);
    setAutoLogout(mins);
    dispatch(updateSecuritySettings({ autoLogoutMinutes: mins }));
  };

  const handleDeviceChange = (val) => {
    setRememberDev(val);
    dispatch(updateSecuritySettings({ rememberDevice: val }));
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.005] text-left">
      <div className="flex items-center gap-2">
        <ShieldAlert size={16} className="text-brand-danger" />
        <span className="text-xs font-bold text-brand-textPrimary">Oturum ve Güvenlik Tercihleri</span>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        
        {/* Session Timeout Selector */}
        <Select
          label="Oturum Otomatik Kapanma Süresi"
          value={String(autoLogout)}
          onChange={(e) => handleLogoutChange(e.target.value)}
          options={[
            { value: '5', label: '5 Dakika (Maksimum Güvenlik)' },
            { value: '15', label: '15 Dakika (Önerilen)' },
            { value: '30', label: '30 Dakika' },
            { value: '60', label: '1 Saat' }
          ]}
        />

        {/* Remember Device Switch */}
        <Switch
          label="Bu Cihazı Güvenli Olarak Hatırla"
          description="Aynı tarayıcıdan giriş yaparken daha az güvenlik sorgulaması istenir."
          checked={rememberDev}
          onChange={(e) => handleDeviceChange(e.target.checked)}
        />

      </div>
    </div>
  );
};

export default SecuritySettings;
