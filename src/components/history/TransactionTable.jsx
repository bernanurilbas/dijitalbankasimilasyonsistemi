import React from 'react';
import { Eye } from 'lucide-react';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const TransactionTable = ({ 
  transactions = [], 
  onViewReceipt 
}) => {
  const formatCurrency = (val, cur) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: cur === 'GOLD' ? 'TRY' : cur
    }).format(val);
  };

  const getCategoryBadge = (type) => {
    switch (type) {
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

  return (
    <Table headers={['Tür', 'Açıklama', 'Tarih', 'Tutar', 'Aksiyon']}>
      {transactions.map((tx) => {
        const isIncoming = tx.type === 'incoming' || tx.type === 'deposit' || tx.type === 'investment_sell';
        const amountColor = isIncoming ? 'text-brand-success' : 'text-brand-textPrimary';

        return (
          <tr key={tx.id} className="text-xs hover:bg-white/[0.01]">
            <td className="py-3.5 px-4 font-semibold">
              {getCategoryBadge(tx.type)}
            </td>
            <td className="py-3.5 px-4 font-bold text-brand-textPrimary max-w-[220px] truncate">
              {tx.description}
            </td>
            <td className="py-3.5 px-4 text-brand-textSecondary font-semibold">
              {new Date(tx.date).toLocaleDateString('tr-TR')}
            </td>
            <td className={`py-3.5 px-4 font-extrabold text-right ${amountColor}`}>
              <span>
                {isIncoming ? '+' : '-'}
                {formatCurrency(Math.abs(tx.amount), tx.currency)}
              </span>
            </td>
            <td className="py-3.5 px-4 text-right">
              <Button 
                variant="secondary" 
                size="sm" 
                className="py-1 px-2.5 text-[10px]"
                onClick={() => onViewReceipt(tx)}
              >
                <Eye size={12} className="mr-1" />
                Dekont Gör
              </Button>
            </td>
          </tr>
        );
      })}
    </Table>
  );
};

export default TransactionTable;
