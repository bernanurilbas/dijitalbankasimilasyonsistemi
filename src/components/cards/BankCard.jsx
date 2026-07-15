import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Sliders, ToggleLeft, ToggleRight, History } from 'lucide-react';
import Button from '../ui/Button';

const BankCard = ({ 
  card, 
  onFreeze, 
  onLimitChange, 
  onViewTransactions 
}) => {
  const { id, cardHolder, cardNumber, expiryDate, limit, balance, isFrozen, type } = card;

  const formatCardNumber = (num) => {
    // Mask first 12 digits
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
            : 'bg-gradient-to-br from-[#0c1424] via-[#09223e] to-[#040914]'
        }`}
      >
        {!isFrozen && (
          <>
            {/* Glossy holographic highlight leak */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent skew-x-12 pointer-events-none" />
            {/* Decorative holographic glow spots */}
            <div className="absolute -left-16 -top-16 w-48 h-48 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none" />
            <div className="absolute -right-16 -bottom-16 w-52 h-52 rounded-full bg-blue-600/15 blur-2xl pointer-events-none" />
          </>
        )}
        
        {/* Top Header */}
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h4 className="text-[10px] font-extrabold tracking-widest text-white/90 uppercase">ASTRA BANK</h4>
            <span className="text-[7px] font-extrabold text-[#14b8a6] tracking-widest uppercase block mt-0.5">DEBIT CARD</span>
          </div>
          {/* Golden Embossed Card Chip */}
          <div className="w-9 h-7 bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col justify-between p-1 border border-yellow-200/20 shrink-0">
            <div className="h-[1px] w-full bg-black/15" />
            <div className="flex justify-between w-full h-2">
              <div className="w-[1px] h-full bg-black/15" />
              <div className="w-[1px] h-full bg-black/15" />
            </div>
            <div className="h-[1px] w-full bg-black/15" />
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
          <span>Harcama Limiti:</span>
          <span className="font-extrabold text-brand-textPrimary">{formatCurrency(limit)}</span>
        </div>

        <div className="flex gap-2">
          {/* History */}
          <button
            onClick={() => onViewTransactions(card)}
            className="p-2 border border-white/10 rounded-lg text-brand-textSecondary hover:text-brand-textPrimary hover:bg-white/5 transition-all"
            title="Harcama Geçmişi"
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

export default BankCard;
