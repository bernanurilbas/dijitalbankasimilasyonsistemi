import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, loginSuccess, authFailure, clearError } from '../../store/slices/authSlice';
import api from '../../services/api';
import LoginForm from '../../components/auth/LoginForm';
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
      const response = await api.post('/api/auth/login', {
        username: credentials.username,
        password: credentials.password
      });
      
      dispatch(loginSuccess(response.data));
      
      const role = response.data.user.role;
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.toString();
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

export default Login;
