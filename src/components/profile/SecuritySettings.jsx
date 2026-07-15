import React, { useState, useEffect } from 'react';
import Switch from '../ui/Switch';
import Button from '../ui/Button';

const SecuritySettings = ({ 
  user, 
  onSave, 
  loading 
}) => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  useEffect(() => {
    if (user) {
      setTwoFactor(!!user.twoFactor);
      setSmsAlerts(user.smsAlerts !== false);
      setEmailAlerts(user.emailAlerts !== false);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      twoFactor,
      smsAlerts,
      emailAlerts
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
      <div>
        <h3 className="text-sm font-extrabold text-brand-textPrimary tracking-wide uppercase">
          Güvenlik ve Bildirim Tercihleri
        </h3>
        <p className="text-[11px] text-brand-textSecondary mt-0.5 leading-relaxed">
          Hesabınızın giriş güvenliğini ve anlık işlem bilgilendirme kanallarını yönetin.
        </p>
      </div>

      <div className="flex flex-col gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.005]">
        <Switch
          label="İki Adımlı Doğrulama (2FA)"
          description="Hesabınıza giriş yaparken şifrenize ek olarak tek kullanımlık kod istenir."
          checked={twoFactor}
          onChange={(e) => setTwoFactor(e.target.checked)}
        />
        
        <Switch
          label="SMS Anlık İşlem Bilgilendirmesi"
          description="Hesabınızdan para çıkışı gerçekleştiğinde anında SMS bildirimi alırsınız."
          checked={smsAlerts}
          onChange={(e) => setSmsAlerts(e.target.checked)}
        />

        <Switch
          label="E-Posta Güvenlik Raporları"
          description="Yeni cihaz girişi veya şifre değişikliklerinde e-posta raporu gönderilir."
          checked={emailAlerts}
          onChange={(e) => setEmailAlerts(e.target.checked)}
        />
      </div>

      <Button 
        type="submit" 
        variant="primary" 
        loading={loading}
        className="w-full py-2.5"
      >
        Tercihleri Kaydet
      </Button>
    </form>
  );
};

export default SecuritySettings;
