import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import RegisterForm from '../../components/auth/RegisterForm';
import { Shield, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegisterSubmit = async (data) => {
    setError('');
    setLoading(true);
    
    try {
      await api.post('/api/auth/register', data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const msg = err?.response?.data?.message || err.toString();
      setError(msg);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto text-center px-4">
        <div>
          <div className="inline-flex items-center justify-center bg-brand-success/10 text-brand-success p-4 rounded-full mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-lg font-bold text-brand-textPrimary mb-2">Kayıt Başarılı!</h2>
          <p className="text-xs text-brand-textSecondary leading-relaxed mb-4">
            Astra Bank ailesine başarıyla katıldınız. Hoş geldin hediyesi olarak 5.000 TL bakiyeniz hesabınıza tanımlanmıştır.
          </p>
          <p className="text-xs font-bold text-[#14b8a6]">
            Giriş ekranına yönlendiriliyorsunuz...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto text-left px-4">
      <div>
        
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-[#14b8a6]/10 text-[#14b8a6] p-3 rounded-xl mb-3 border border-[#14b8a6]/20">
            <Shield size={28} />
          </div>
          <h2 className="text-xl font-extrabold text-brand-textPrimary">Astra Bank Üye Kaydı</h2>
          <p className="text-xs text-brand-textSecondary mt-1">Dijital hesaplarınızı anında aktifleştirin</p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-brand-danger/10 border border-brand-danger/20 text-xs font-semibold text-brand-danger text-center">
            {error}
          </div>
        )}

        {/* Form component */}
        <RegisterForm onSubmit={handleRegisterSubmit} loading={loading} />

      </div>
    </div>
  );
};

export default Register;
