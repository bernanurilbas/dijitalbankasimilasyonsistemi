import React from 'react';
import { User, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';
import Card from '../ui/Card';

const ProfileCard = ({ 
  user 
}) => {
  if (!user) return null;

  const { fullName, email, phoneNumber, phone, role, createdAt, createdDate } = user;

  // Generate Initials
  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getRoleLabel = (r) => {
    switch (r) {
      case 'admin':
        return 'Sistem Yöneticisi';
      case 'employee':
        return 'Banka Personeli';
      case 'customer':
      default:
        return 'Bireysel Müşteri';
    }
  };

  return (
    <Card className="h-full">
      <div className="flex flex-col items-center text-center gap-5 p-2">
        
        {/* User initials avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-primary to-purple-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg border-2 border-white/10 select-none">
          {getInitials(fullName)}
        </div>

        {/* User details summary */}
        <div>
          <h3 className="text-base font-extrabold text-brand-textPrimary">{fullName}</h3>
          <span className="text-[10px] text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-0.5 rounded-full font-bold uppercase mt-1 inline-block">
            {getRoleLabel(role)}
          </span>
        </div>

        {/* Contact info deck */}
        <div className="w-full flex flex-col gap-3.5 border-t border-white/5 pt-5 mt-1 text-xs text-left">
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/[0.02] border border-white/5 rounded-lg text-brand-textMuted">
              <Mail size={14} />
            </div>
            <div>
              <span className="text-[9px] text-brand-textMuted uppercase font-bold tracking-wider block">E-Posta Adresi</span>
              <span className="font-semibold text-brand-textSecondary">{email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/[0.02] border border-brand-border rounded-lg text-brand-textMuted">
              <Phone size={14} />
            </div>
            <div>
              <span className="text-[9px] text-brand-textMuted uppercase font-bold tracking-wider block">Telefon Numarası</span>
              <span className="font-semibold text-brand-textSecondary">{phoneNumber || phone || 'Tanımlanmamış'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/[0.02] border border-brand-border rounded-lg text-brand-textMuted">
              <Calendar size={14} />
            </div>
            <div>
              <span className="text-[9px] text-brand-textMuted uppercase font-bold tracking-wider block">Kayıt Tarihi</span>
              <span className="font-semibold text-brand-textSecondary">
                {createdAt || createdDate ? new Date(createdAt || createdDate).toLocaleDateString('tr-TR') : '09.07.2026'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </Card>
  );
};

export default ProfileCard;
