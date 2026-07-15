import React from 'react';
import CountUp from '../ui/CountUp';

const BalanceCard = ({ 
  accountName, 
  iban, 
  balance, 
  currency = 'TRY', 
  className = ''
}) => {
  const badgeColor = currency === 'TRY' ? 'text-brand-textPrimary' : 'text-brand-gold bg-brand-gold/10';

  return (
    <div className={`glass-panel p-5 rounded-xl flex justify-between items-center bg-white/[0.01] hover:bg-white/[0.02] transition-colors border border-white/5 ${className}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-bold text-brand-textPrimary truncate">{accountName}</h4>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/10 uppercase ${badgeColor}`}>
            {currency}
          </span>
        </div>
        <span className="text-[10px] text-brand-textMuted tracking-wider block truncate">
          {iban}
        </span>
      </div>
      <div className="text-right shrink-0">
        <span className={`text-base font-extrabold ${currency === 'TRY' ? 'text-brand-textPrimary' : 'text-brand-gold'}`}>
          <CountUp value={balance} currency={currency} />
        </span>
      </div>
    </div>
  );
};

export default BalanceCard;
