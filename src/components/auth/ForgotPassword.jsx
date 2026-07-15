import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ForgotPassword = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleOpen = (e) => {
    e.preventDefault();
    setIsOpen(true);
    setSuccess(false);
    setEmail('');
    setError('');
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Lütfen e-posta adresinizi girin.');
      return;
    }
    // Simple email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    setSuccess(true);
  };

  const footer = (
    <Button variant="secondary" size="sm" onClick={() => setIsOpen(false)}>
      Kapat
    </Button>
  );

  return (
    <>
      <a 
        href="#" 
        onClick={handleOpen}
        className="text-xs font-semibold text-brand-primary hover:underline transition-all"
      >
        Şifremi Unuttum
      </a>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Şifremi Unuttum"
        footer={success ? footer : null}
      >
        {success ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center bg-brand-success/10 text-brand-success p-3 rounded-full mb-4">
              <CheckCircle size={32} />
            </div>
            <h4 className="font-bold text-brand-textPrimary mb-2">Talep Alındı</h4>
            <p className="text-sm text-brand-textSecondary leading-relaxed">
              **{email}** adresine şifre sıfırlama talimatları gönderilmiştir. Lütfen gelen kutunuzu kontrol edin.
            </p>
          </div>
        ) : (
          <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
            <p className="text-xs text-brand-textSecondary leading-relaxed">
              Sisteme kayıtlı e-posta adresinizi girdiğinizde, şifrenizi sıfırlamanız için gerekli bağlantı tarafınıza gönderilecektir.
            </p>

            <Input
              type="email"
              label="E-Posta Adresi"
              placeholder="ornek@email.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />

            <div className="flex gap-3 justify-end mt-4">
              <Button variant="secondary" size="sm" onClick={() => setIsOpen(false)}>
                İptal
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Gönder
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default ForgotPassword;
