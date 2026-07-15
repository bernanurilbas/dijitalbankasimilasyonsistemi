import React from 'react';
import { DollarSign } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';

const AmountInput = ({ register, errors, accounts = [], selectedAccountId }) => {
  const currentAccount = accounts.find((a) => a.id === selectedAccountId);
  const currency = currentAccount ? currentAccount.currency : 'TRY';
  const balance = currentAccount ? currentAccount.balance : 0;

  const formatCurrency = (val, cur) => {
    return new Intl.NumberFormat('tr-TR', {
      style: cur === 'GOLD' ? 'decimal' : 'currency',
      currency: cur === 'GOLD' ? undefined : cur,
      minimumFractionDigits: 2
    }).format(val) + (cur === 'GOLD' ? ' gr' : '');
  };

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-xs font-bold text-brand-textPrimary uppercase tracking-wider mb-1">Hesap ve Tutar Bilgileri</h4>

      {/* Sender Account Selection */}
      <Select
        label="Gönderici Hesap"
        id="senderAccountId"
        error={errors.senderAccountId?.message}
        options={accounts.map((a) => ({
          value: a.id,
          label: `${a.name} (${formatCurrency(a.balance, a.currency)})`,
        }))}
        {...register('senderAccountId')}
      />

      {/* Balance Indicator Alert */}
      {currentAccount && (
        <div className="text-[10px] font-bold text-brand-textMuted bg-white/[0.01] border border-white/5 p-2.5 rounded-lg flex justify-between">
          <span>KULLANILABİLİR BAKİYE</span>
          <span className="text-brand-primary">{formatCurrency(balance, currency)}</span>
        </div>
      )}

      {/* Amount Input */}
      <Input
        type="number"
        step="any"
        label={`Tutar (${currency})`}
        id="amount"
        placeholder="0.00"
        icon={DollarSign}
        error={errors.amount?.message}
        {...register('amount')}
      />
    </div>
  );
};

export default AmountInput;
