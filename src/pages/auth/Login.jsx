import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, loginSuccess, authFailure, clearError } from '../../store/slices/authSlice';
import { Shield } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [localError, setLocalError] = useState('');

  const handleLoginSubmit = async (credentials) => {
    setLocalError('');
    dispatch(clearError());
    dispatch(authStart());

    try {
      // 1. Kendi sunucumuz yerine public/db.json dosyasını fetch ediyoruz
      const response = await fetch('/db.json');
      if (!response.ok) {
        throw new Error('Veri tabanına erişilemedi.');
      }
      const data = await response.json();

      // 2. db.json içerisindeki users veya users dizisinden kullanıcıyı eşleştiriyoruz
      // db.json yapına göre data.users veya doğrudan data kullanılabilir.
      const usersList = data.users || [];
      const user = usersList.find(
        (u) => u.username === credentials.username && u.password === credentials.password
      );

      if (!user) {
        throw new Error('Kullanıcı adı veya şifre hatalı!');
      }

      // 3. Redux state'ine göndermek için sunucunun döndüğü yapıya benzer bir obje hazırlıyoruz
      const loginData = {
        user: {
          id: user.id,
          username: user.username,
          name: user.name || user.username,
          role: user.role,
          email: user.email || ''
        },
        token: "mock-jwt-token-for-vercel" // Giriş durumunu korumak için geçici bir token
      };

      dispatch(loginSuccess(loginData));

      const role = user.role;
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.message || 'Bir hata oluştu.';
      dispatch(authFailure(msg));
      setLocalError(msg);
    }
  };

  const handleQuickLogin = (username, password) => {
    handleLoginSubmit({ username, password });
  };

  return (
    <div className="w-full max-w-md mx-auto text-left px-4">
      <div>

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-[#14b8a6]/10 text-[#14b8a6] p-3 rounded-xl mb-3 border border-[#14b8a6]/20">
            <Shield size={28} />
          </div>
          <h2 className="text-xl font-extrabold text-brand-textPrimary">Astra Bank</h2>
          <p className="text-xs text-brand-textSecondary mt-1">Dijital Bankacılık Platformu</p>
        </div>

        {/* Global Error Banner */}
        {(localError || error) && (
          <div className="mb-4 p-3 rounded-lg bg-brand-danger/10 border border-brand-danger/20 text-xs font-semibold text-brand-danger text-center">
            {localError || error}
          </div>
        )}

        {/* Form component */}
        {/* Not: Eski Login bileşeni içindeki formu aynen çağırıyoruz */}
        <LoginForm onSubmit={handleLoginSubmit} loading={loading} />

        {/* Quick Login Panel */}
        <div className="mt-6 pt-5 border-t border-brand-border text-left">
          <span className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider block mb-2.5">
            Hızlı Test Girişi
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickLogin('customer', 'customerpassword')}
              className="px-3 py-1.5 border border-brand-border text-brand-textSecondary hover:text-brand-textPrimary hover:bg-brand-primary/5 text-xs font-semibold rounded-lg transition-all cursor-pointer"
            >
              Müşteri
            </button>
            <button
              onClick={() => handleQuickLogin('staff', 'staffpassword')}
              className="px-3 py-1.5 border border-brand-border text-brand-textSecondary hover:text-brand-textPrimary hover:bg-brand-primary/5 text-xs font-semibold rounded-lg transition-all cursor-pointer"
            >
              Banka Görevlisi
            </button>
            <button
              onClick={() => handleQuickLogin('admin', 'adminpassword')}
              className="px-3 py-1.5 border border-brand-border text-brand-textSecondary hover:text-brand-textPrimary hover:bg-brand-primary/5 text-xs font-semibold rounded-lg transition-all cursor-pointer"
            >
              Yönetici
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Alt kısımdaki LoginForm bileşenini import edebilmek için asıl dosyanın sonundaki import'u koruyoruz
import LoginForm from '../../components/auth/LoginForm';

export default Login;