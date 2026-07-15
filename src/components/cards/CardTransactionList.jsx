import React from 'react';
import { useSelector } from 'react-redux';
import { CreditCard } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';

const CardTransactionList = ({ 
  card, 
  isOpen, 
  onClose 
}) => {
  const { transactions } = useSelector((state) => state.accounts);

  if (!card) return null;

  // Filter transactions where card details correspond (e.g., matching the main account IBAN of the card or mentioning the card)
  const filtered = transactions.filter(
    (tx) => tx.senderIban === card.iban || tx.recipientName?.includes(card.name)
  );

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  const footer = (
    <Button variant="secondary" size="sm" onClick={onClose}>
      Kapat
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${card.name || 'Astra Debit'} - Harcama Geçmişi`}
      footer={footer}
      size="lg"
    >
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <EmptyState
            title="Kart Harcaması Yok"
            description="Bu karta ait henüz herhangi bir üye işyeri veya POS alışveriş kaydı bulunmamaktadır."
            icon={CreditCard}
          />
        ) : (
          <Table headers={['Açıklama', 'Tarih', 'Tutar']}>
            {filtered.map((tx) => {
              const amountVal = Math.abs(tx.amount);
              return (
                <tr key={tx.id} className="text-xs hover:bg-white/[0.01]">
                  <td className="py-2.5 px-4 font-bold text-brand-textPrimary">
                    {tx.description}
                  </td>
                  <td className="py-2.5 px-4 text-brand-textSecondary font-semibold">
                    {new Date(tx.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="py-2.5 px-4 font-extrabold text-right text-brand-textPrimary">
                    -{formatCurrency(amountVal)}
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
      </div>
    </Modal>
  );
};

export default CardTransactionList;
