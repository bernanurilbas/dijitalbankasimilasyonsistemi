import React from 'react';
import { Eye } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const TransactionCard = ({ 
  transaction, 
  onViewReceipt 
}) => {
  const { type, description, date, amount, currency } = transaction;

  const formatCurrency = (val, cur) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: cur === 'GOLD' ? 'TRY' : cur
    }).format(val);
  };

  const getCategoryBadge = (t) => {
    switch (t) {
      case 'incoming':
      case 'deposit':
        return <Badge variant="success">Gelen</Badge>;
      case 'outgoing':
      case 'transfer':
      case 'eft':
      case 'fast':
        return <Badge variant="default">Giden</Badge>;
      case 'bill':
        return <Badge variant="warning">Fatura</Badge>;
      case 'investment_buy':
        return <Badge variant="info">Yatırım Alış</Badge>;
      case 'investment_sell':
        return <Badge variant="success">Yatırım Satış</Badge>;
      default:
        return <Badge variant="default">İşlem</Badge>;
    }
  };

  const isIncoming = type === 'incoming' || type === 'deposit' || type === 'investment_sell';
  const amountColor = isIncoming ? 'text-brand-success' : 'text-brand-textPrimary';

  return (
    <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.005] flex justify-between items-center hover:bg-white/[0.015] transition-colors">
      <div className="min-w-0 flex flex-col gap-1 text-left">
        <div className="flex items-center gap-2">
          {getCategoryBadge(type)}
          <span className="text-[10px] text-brand-textMuted font-semibold">
            {new Date(date).toLocaleDateString('tr-TR')}
          </span>
        </div>
        <h4 className="text-xs font-bold text-brand-textPrimary truncate max-w-[200px]">
          {description}
        </h4>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className={`text-sm font-extrabold ${amountColor}`}>
          {isIncoming ? '+' : '-'}
          {formatCurrency(Math.abs(amount), currency)}
        </span>
        <Button 
          variant="secondary" 
          size="sm" 
          className="p-2"
          onClick={() => onViewReceipt(transaction)}
          title="Dekontu İncele"
        >
          <Eye size={14} />
        </Button>
      </div>
    </div>
  );
};

export default TransactionCard;
