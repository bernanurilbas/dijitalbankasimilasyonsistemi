import React from 'react';
import { useSelector } from 'react-redux';
import { History } from 'lucide-react';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';

const AccountTable = ({ iban, currency }) => {
  const { transactions } = useSelector((state) => state.accounts);

  // Filter transactions belonging to this account
  const filtered = transactions.filter(
    (tx) => tx.senderIban === iban || tx.recipientIban === iban
  );

  const formatCurrency = (val, cur) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: cur === 'GOLD' ? 'TRY' : cur
    }).format(val);
  };

  const getCategoryBadge = (tx) => {
    const isTarget = tx.recipientIban === iban;
    
    if (tx.type === 'BILL') return <Badge variant="warning">Fatura</Badge>;
    if (tx.type === 'INVESTMENT_BUY') return <Badge variant="info">Yatırım Alış</Badge>;
    if (tx.type === 'INVESTMENT_SELL') return <Badge variant="success">Yatırım Satış</Badge>;

    if (tx.type === 'INCOMING' || isTarget) {
      return <Badge variant="success">Gelen</Badge>;
    }
    return <Badge variant="default">Giden</Badge>;
  };

  if (filtered.length === 0) {
    return (
      <EmptyState
        title="İşlem Bulunamadı"
        description="Bu hesaba ait henüz herhangi bir para girişi veya çıkışı kaydedilmemiştir."
        icon={History}
      />
    );
  }

  return (
    <Table headers={['Tür', 'Açıklama', 'Tarih', 'Tutar']}>
      {filtered.map((tx) => {
        const isTarget = tx.recipientIban === iban;
        const isIncoming = tx.type === 'INCOMING' || tx.type === 'INVESTMENT_SELL' || isTarget;
        const amountColor = isIncoming ? 'text-brand-success' : 'text-brand-textPrimary';

        return (
          <tr key={tx.id} className="text-xs hover:bg-white/[0.01]">
            <td className="py-2.5 px-4 font-semibold">
              {getCategoryBadge(tx)}
            </td>
            <td className="py-2.5 px-4 font-bold text-brand-textPrimary max-w-[200px] truncate">
              {tx.description}
            </td>
            <td className="py-2.5 px-4 text-brand-textSecondary font-semibold">
              {new Date(tx.date).toLocaleDateString('tr-TR')}
            </td>
            <td className={`py-2.5 px-4 font-extrabold text-right ${amountColor}`}>
              <span>
                {isIncoming ? '+' : '-'}
                {formatCurrency(Math.abs(tx.amount), currency)}
              </span>
            </td>
          </tr>
        );
      })}
    </Table>
  );
};

export default AccountTable;
