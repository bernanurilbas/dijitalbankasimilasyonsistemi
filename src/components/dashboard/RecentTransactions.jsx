import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Badge from '../ui/Badge';

const RecentTransactions = () => {
  const navigate = useNavigate();
  const { transactions } = useSelector((state) => state.accounts);

  // Take last 4 transactions
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  const formatCurrency = (val, cur) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: cur === 'GOLD' ? 'TRY' : cur // simple fallback
    }).format(val);
  };

  const getCategoryBadge = (type) => {
    switch (type) {
      case 'INCOMING':
        return <Badge variant="success">Gelen</Badge>;
      case 'OUTGOING':
        return <Badge variant="default">Giden</Badge>;
      case 'BILL':
        return <Badge variant="warning">Fatura</Badge>;
      case 'INVESTMENT_BUY':
        return <Badge variant="info">Yatırım Alış</Badge>;
      case 'INVESTMENT_SELL':
        return <Badge variant="success">Yatırım Satış</Badge>;
      default:
        return <Badge variant="default">İşlem</Badge>;
    }
  };

  return (
    <Card 
      title="Son İşlemler" 
      subtitle="Hesabınıza ait en son hesap hareketleri"
      footer={
        <button 
          onClick={() => navigate('/history')}
          className="text-xs font-bold text-brand-primary hover:underline"
        >
          Tümünü Görüntüle
        </button>
      }
    >
      {recent.length === 0 ? (
        <div className="text-center py-6 text-xs text-brand-textMuted font-semibold">
          Henüz yapılmış bir finansal işlem bulunmuyor.
        </div>
      ) : (
        <Table headers={['Tür', 'Açıklama', 'Tarih', 'Tutar']}>
          {recent.map((tx) => {
            const isPositive = tx.type === 'INCOMING' || tx.type === 'INVESTMENT_SELL';
            const amountColor = isPositive ? 'text-brand-success' : 'text-brand-textPrimary';

            return (
              <tr key={tx.id} className="text-xs hover:bg-white/[0.01]">
                <td className="py-3 px-4 font-semibold">
                  {getCategoryBadge(tx.type)}
                </td>
                <td className="py-3 px-4 font-bold text-brand-textPrimary max-w-[140px] truncate">
                  {tx.description}
                </td>
                <td className="py-3 px-4 text-brand-textSecondary font-semibold">
                  {new Date(tx.date).toLocaleDateString('tr-TR')}
                </td>
                <td className={`py-3 px-4 font-extrabold text-right ${amountColor}`}>
                  <span className="inline-flex items-center gap-0.5">
                    {isPositive ? '+' : '-'}
                    {formatCurrency(tx.amount, tx.currency)}
                  </span>
                </td>
              </tr>
            );
          })}
        </Table>
      )}
    </Card>
  );
};

export default RecentTransactions;
