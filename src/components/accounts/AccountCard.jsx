import React, { useState } from 'react';
import { Copy, Check, Eye, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const AccountCard = ({ 
  account, 
  onViewDetails,
  onDelete
}) => {
  const [copied, setCopied] = useState(false);

  const { name, iban, balance, currency, status } = account;

  const handleCopyIban = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (val, cur) => {
    return new Intl.NumberFormat('tr-TR', {
      style: cur === 'GOLD' ? 'decimal' : 'currency',
      currency: cur === 'GOLD' ? undefined : cur,
      minimumFractionDigits: 2
    }).format(val) + (cur === 'GOLD' ? ' gr' : '');
  };

  // Dynamic gradients based on currency
  const gradients = {
    TRY: 'from-blue-600/20 to-blue-900/10 border-blue-500/20',
    USD: 'from-emerald-600/20 to-emerald-900/10 border-emerald-500/20',
    EUR: 'from-purple-600/20 to-purple-900/10 border-purple-500/20',
    GOLD: 'from-amber-500/20 to-amber-800/10 border-amber-500/20',
  };

  const curGradient = gradients[currency] || gradients.TRY;

  return (
    <div className={`glass-panel p-5 rounded-2xl bg-gradient-to-br ${curGradient} border shadow-lg flex flex-col justify-between h-44 transition-all hover:scale-[1.01]`}>
      
      {/* Top Header info */}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-bold text-brand-textPrimary truncate max-w-[150px]">{name}</h4>
          <span className="text-[10px] text-brand-textMuted tracking-wider block mt-0.5">Vadesiz Hesap</span>
        </div>
        <div className="flex items-center gap-2">
          {status === 'blocked' ? (
            <Badge variant="danger">Bloke</Badge>
          ) : (
            <Badge variant="success">Aktif</Badge>
          )}
        </div>
      </div>

      {/* Balance display */}
      <div>
        <span className="text-[9px] text-brand-textMuted uppercase font-bold tracking-wider">Mevcut Bakiye</span>
        <h3 className="text-xl font-extrabold text-brand-textPrimary mt-0.5">
          {formatCurrency(balance, currency)}
        </h3>
      </div>

      {/* Footer / Actions */}
      <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1">
        <button 
          onClick={handleCopyIban}
          className="text-[10px] font-bold text-brand-textSecondary hover:text-brand-textPrimary flex items-center gap-1 transition-colors"
        >
          {copied ? <Check size={12} className="text-brand-success" /> : <Copy size={12} />}
          <span className="font-mono truncate max-w-[120px]">{iban}</span>
        </button>

        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            className="py-1 px-2.5 text-[10px]"
            onClick={() => onViewDetails(account)}
          >
            <Eye size={12} className="mr-1" />
            İncele
          </Button>

          <Button 
            variant="danger" 
            size="sm" 
            className="py-1 px-2 text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-none"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(account);
            }}
          >
            <Trash2 size={12} className="mr-1" />
            Sil
          </Button>
        </div>
      </div>

    </div>
  );
};

export default AccountCard;
