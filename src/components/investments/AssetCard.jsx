import React from 'react';
import Button from '../ui/Button';

const AssetCard = ({ 
  rate, 
  onBuy, 
  onSell 
}) => {
  const { code, name, buy, sell, change } = rate;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  const isPositive = parseFloat(change) >= 0;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors flex flex-col justify-between h-44">
      
      {/* Top Header info */}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-extrabold text-brand-textPrimary">{code}</h4>
          <span className="text-[10px] text-brand-textMuted font-semibold mt-0.5 block">{name}</span>
        </div>
        
        {/* Rate change indicator */}
        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isPositive ? 'text-brand-success bg-brand-success/5' : 'text-brand-danger bg-brand-danger/5'}`}>
          {isPositive ? '+' : ''}
          {change}%
        </span>
      </div>

      {/* Buying / Selling Rates */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>
          <span className="text-[9px] text-brand-textMuted uppercase font-bold tracking-wider">Banka Alış</span>
          <span className="text-sm font-extrabold text-brand-textPrimary block mt-0.5">
            {formatCurrency(parseFloat(buy))}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-brand-textMuted uppercase font-bold tracking-wider">Banka Satış</span>
          <span className="text-sm font-extrabold text-brand-textPrimary block mt-0.5">
            {formatCurrency(parseFloat(sell))}
          </span>
        </div>
      </div>

      {/* Buttons Action Row */}
      <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-3 mt-1">
        <Button 
          variant="secondary" 
          size="sm" 
          className="py-1 px-3 text-xs text-brand-success border border-brand-success/20 hover:bg-brand-success/5 font-bold"
          onClick={() => onSell(rate)}
        >
          Sat
        </Button>
        <Button 
          variant="primary" 
          size="sm" 
          className="py-1 px-3 text-xs bg-brand-primary/20 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary/30 font-bold"
          onClick={() => onBuy(rate)}
        >
          Al
        </Button>
      </div>

    </div>
  );
};

export default AssetCard;
