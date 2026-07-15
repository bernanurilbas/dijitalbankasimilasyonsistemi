import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  updateProfileDetails, updateUserPassword, updateSecurityPreferences, resetProfileState 
} from '../../store/slices/profileSlice';
import PageHeader from '../../components/layout/PageHeader';
import ProfileCard from '../../components/profile/ProfileCard';
import ProfileForm from '../../components/profile/ProfileForm';
import PasswordForm from '../../components/profile/PasswordForm';
import SecuritySettings from '../../components/profile/SecuritySettings';
import Toast from '../../components/ui/Toast';
import InfoCard from '../../components/cards/InfoCard';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, error, success } = useSelector((state) => state.profile);

  const [activeTab, setActiveTab] = useState('details'); // details, password, security

  // Toast States
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    return () => {
      dispatch(resetProfileState());
    };
  }, [dispatch]);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setToastOpen(true);
  };

  const handleUpdateDetails = async (data) => {
    try {
      await dispatch(updateProfileDetails({ userId: user.id, data })).unwrap();
      showToast('Profil bilgileriniz başarıyla güncellendi.');
    } catch (err) {
      showToast(err || 'Profil güncellenirken hata oluştu.', 'danger');
    }
  };

  const handleUpdatePassword = async (data) => {
    try {
      await dispatch(updateUserPassword({ 
        userId: user.id, 
        currentPassword: data.currentPassword, 
        newPassword: data.newPassword 
      })).unwrap();
      showToast('Şifreniz başarıyla değiştirildi.');
    } catch (err) {
      showToast(err || 'Şifre değiştirilirken hata oluştu.', 'danger');
    }
  };

  const handleUpdateSecurity = async (prefs) => {
    try {
      await dispatch(updateSecurityPreferences({ userId: user.id, prefs })).unwrap();
      showToast('Güvenlik tercihleriniz başarıyla kaydedildi.');
    } catch (err) {
      showToast(err || 'Tercihler kaydedilirken hata oluştu.', 'danger');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      
      {/* Toast Alert Popups */}
      <div className="fixed bottom-6 right-6 z-50">
        <Toast
          message={toastMsg}
          type={toastType}
          isOpen={toastOpen}
          onClose={() => setToastOpen(false)}
        />
      </div>

      {/* Header */}
      <PageHeader 
        title="Profil ve Ayarlar" 
        description="Kişisel bilgilerinizi güncelleyin, şifrenizi değiştirin ve hesap güvenlik tercihlerinizi yapılandırın."
      />

      {/* Profile Error Indicator */}
      {error && (
        <InfoCard
          title="İşlem Hatası"
          text={error}
          type="danger"
        />
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Summary Profile Card */}
        <div className="md:col-span-1">
          <ProfileCard user={user} />
        </div>

        {/* Right Side: Tabbed Form Controls */}
        <div className="md:col-span-2 flex flex-col gap-5">
          
          {/* Tabs header list */}
          <div className="flex border-b border-white/5 gap-2 no-print">
            <button
              onClick={() => {
                dispatch(resetProfileState());
                setActiveTab('details');
              }}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 focus:outline-none ${activeTab === 'details' ? 'text-brand-primary border-brand-primary' : 'text-brand-textSecondary border-transparent hover:text-brand-textPrimary'}`}
            >
              Kişisel Bilgiler
            </button>
            <button
              onClick={() => {
                dispatch(resetProfileState());
                setActiveTab('password');
              }}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 focus:outline-none ${activeTab === 'password' ? 'text-brand-primary border-brand-primary' : 'text-brand-textSecondary border-transparent hover:text-brand-textPrimary'}`}
            >
              Şifre Değiştir
            </button>
            <button
              onClick={() => {
                dispatch(resetProfileState());
                setActiveTab('security');
              }}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 focus:outline-none ${activeTab === 'security' ? 'text-brand-primary border-brand-primary' : 'text-brand-textSecondary border-transparent hover:text-brand-textPrimary'}`}
            >
              Güvenlik Tercihleri
            </button>
          </div>

          {/* Render Tab Contents inside glass panels */}
          <div className="glass-panel p-8 rounded-2xl border border-brand-border bg-white/[0.005]">
            {activeTab === 'details' && (
              <ProfileForm 
                user={user} 
                onSubmit={handleUpdateDetails} 
                loading={loading} 
              />
            )}
            
            {activeTab === 'password' && (
              <PasswordForm 
                onSubmit={handleUpdatePassword} 
                loading={loading} 
              />
            )}

            {activeTab === 'security' && (
              <SecuritySettings 
                user={user} 
                onSave={handleUpdateSecurity} 
                loading={loading} 
              />
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;
