import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Shield, ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const AuthLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // Redux'taki temayı alıyoruz
  const reduxTheme = useSelector((state) => state.settings.theme);
  // Eğer localStorage'da kayıtlı bir tema varsa onu, yoksa Redux'takini, o da yoksa varsayılan olarak 'dark'ı seçiyoruz
  const theme = localStorage.getItem('theme') || reduxTheme || 'dark';

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans relative overflow-hidden transition-colors duration-300 ${theme === 'dark'
      ? 'bg-gradient-to-br from-[#0a1b3a] via-[#071124] to-[#030814] dark'
      : 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]'
      }`}>

      {/* Premium glowing blue/turquoise background halo auras */}
      <div className={`absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[130px] pointer-events-none z-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-500/25' : 'bg-blue-300/30'
        }`} />
      <div className={`absolute top-[-30%] left-[15%] w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none z-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-400/20'
        }`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none z-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#14b8a6]/10' : 'bg-teal-300/20'
        }`} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none z-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-600/12' : 'bg-blue-400/10'
        }`} />

      {/* Unified Split-Screen Container Card (Inspired by reference design)
        The background image covers the ENTIRE container (left and right halves).
      */}
      <div
        className={`w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[620px] relative bg-cover bg-center z-10 transition-all duration-300 ${theme === 'dark'
          ? 'border border-white/10 bg-slate-950/20 dark'
          : 'border border-slate-200 bg-white/40'
          }`}
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      >

        {/* Left Side: Empty space with text overlays (occupies 55% width) */}
        <div className="relative w-full md:w-[55%] flex flex-col justify-between p-10 min-h-[300px] md:min-h-auto shrink-0 z-10">

          {/* Subtle blue gradient overlay to blend with image and ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b13]/95 via-[#070b13]/40 to-transparent pointer-events-none -m-1" />

          {/* Logo header */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="bg-brand-primary/20 p-2 rounded-lg text-[#14b8a6] border border-[#14b8a6]/30">
              <Shield size={22} className="text-[#14b8a6]" />
            </div>
            <span className="font-extrabold text-sm text-white tracking-wider uppercase">Astra Bank</span>
          </div>

          {/* Slogan & Descriptions */}
          <div className="relative z-10 mt-auto mb-6">
            <h1 className="text-xl md:text-2xl font-black text-white leading-snug tracking-wide uppercase">
              {t('auth_slogan', 'Sınırları Aşan Dijital Güç')}
            </h1>
            <p className="text-xs text-white/80 font-medium mt-2 leading-relaxed max-w-sm">
              {t('auth_slogan_desc', 'Gelişmiş güvenli cüzdan, anlık piyasa yatırımları ve saniyeler içinde ücretsiz transfer deneyimi.')}
            </p>
          </div>

          {/* Action link block */}
          <div className="relative z-10 mt-auto">
            {isLoginPage ? (
              <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur text-xs font-bold transition-all ${theme === 'dark'
                ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                : 'bg-black/5 border border-black/10 text-slate-700 hover:bg-black/10'
                }`}>
                <span>{t('not_a_customer', 'Müşterimiz değil misiniz?')}</span>
                <Link to="/register" className="text-[#14b8a6] hover:underline flex items-center gap-1">
                  {t('register_now', 'Hemen Üye Olun')}
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur text-xs font-bold transition-all ${theme === 'dark'
                ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                : 'bg-black/5 border border-black/10 text-slate-700 hover:bg-black/10'
                }`}>
                <span>{t('already_registered', 'Zaten üye misiniz?')}</span>
                <Link to="/login" className="text-[#14b8a6] hover:underline flex items-center gap-1">
                  {t('login_now', 'Giriş Yapın')}
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Glassmorphic Overlay Form (occupies 45% width)
          This frosted panel overlays the background image seamlessly.
        */}
        <div className={`w-full md:w-[45%] flex items-center justify-center p-6 sm:p-10 backdrop-blur-2xl transition-all duration-300 relative z-10 ${theme === 'dark'
          ? 'bg-slate-950/45 border-white/10 text-white border-t md:border-t-0 md:border-l'
          : 'bg-white/85 border-slate-200 text-slate-800 border-t md:border-t-0 md:border-l'
          }`}>
          <div className="w-full">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;