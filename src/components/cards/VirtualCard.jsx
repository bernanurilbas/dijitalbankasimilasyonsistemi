import React from 'react';
import { motion } from 'framer-motion';
import { Sliders, ToggleLeft, ToggleRight, History } from 'lucide-react';
import Button from '../ui/Button';

const VirtualCard = ({ 
  card, 
  onFreeze, 
  onLimitChange, 
  onViewTransactions 
}) => {
  const { id, cardHolder, cardNumber, expiryDate, limit, isFrozen, name } = card;

  const formatCardNumber = (num) => {
    return `•••• •••• •••• ${num.slice(-4)}`;
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Visual Card Body */}
      <motion.div 
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.2 }}
        className={`relative h-48 rounded-2xl p-6 overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 cursor-pointer ${
          isFrozen 
            ? 'bg-slate-900/60 grayscale opacity-60' 
            : 'bg-gradient-to-br from-[#16062a] via-[#2a0c4f] to-[#07020d]'
        }`}
      >
        {!isFrozen && (
          <>
            {/* Glossy holographic highlight leak */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent skew-x-12 pointer-events-none" />
            {/* Decorative holographic glow spots */}
            <div className="absolute -left-16 -top-16 w-48 h-48 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />
            <div className="absolute -right-16 -bottom-16 w-52 h-52 rounded-full bg-pink-500/15 blur-2xl pointer-events-none" />
          </>
        )}
        
        {/* Top Header */}
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h4 className="text-[10px] font-extrabold tracking-widest text-white/90 uppercase">ASTRA BANK</h4>
            <span className="text-[7px] font-extrabold text-purple-400 tracking-widest uppercase block mt-0.5">{name || 'SANAL KART'}</span>
          </div>
          {/* Neon Purple Virtual Badge */}
          <div className="text-[8px] font-black text-purple-300 bg-purple-500/15 border border-purple-400/30 px-2 py-0.5 rounded-md uppercase tracking-widest shadow-sm">
            VIRTUAL
          </div>
        </div>

        {/* Card Number */}
        <div className="mt-8 relative z-10">
          <span className="text-base font-mono tracking-widest text-white font-extrabold select-all drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]">
            {formatCardNumber(cardNumber)}
          </span>
        </div>

        {/* Card Holder & Expiry Date */}
        <div className="mt-6 flex justify-between items-end relative z-10">
          <div>
            <span className="text-[8px] text-white/40 uppercase font-bold tracking-wider block">Kart Sahibi</span>
            <span className="text-xs font-mono font-bold text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{cardHolder}</span>
          </div>
          <div className="text-right">
            <span className="text-[8px] text-white/40 uppercase font-bold tracking-wider block">S.K.T</span>
            <span className="text-xs font-mono font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{expiryDate}</span>
          </div>
        </div>

      </motion.div>

      {/* Card Controls Panel */}
      <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-brand-textSecondary font-semibold">
          <span>Kalan Limit:</span>
          <span className="font-extrabold text-brand-textPrimary">{formatCurrency(limit)}</span>
        </div>

        <div className="flex gap-2">
          {/* History */}
          <button
            onClick={() => onViewTransactions(card)}
            className="p-2 border border-white/10 rounded-lg text-brand-textSecondary hover:text-brand-textPrimary hover:bg-white/5 transition-all"
            title="Sanal Harcama Geçmişi"
          >
            <History size={16} />
          </button>

          {/* Limit */}
          <button
            onClick={() => onLimitChange(card)}
            className="p-2 border border-white/10 rounded-lg text-brand-textSecondary hover:text-brand-textPrimary hover:bg-white/5 transition-all"
            title="Limit Güncelle"
          >
            <Sliders size={16} />
          </button>

          {/* Toggle Freeze */}
          <button
            onClick={() => onFreeze(id, isFrozen)}
            className={`p-2 border rounded-lg flex items-center gap-1.5 font-bold text-xs transition-all ${isFrozen ? 'border-brand-success/20 text-brand-success hover:bg-brand-success/5' : 'border-brand-danger/20 text-brand-danger hover:bg-brand-danger/5'}`}
            title={isFrozen ? 'Kartı Aktifleştir' : 'Kartı Dondur'}
          >
            {isFrozen ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
            <span>{isFrozen ? 'Aktif Et' : 'Dondur'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualCard;
