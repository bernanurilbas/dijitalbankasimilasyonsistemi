import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import AccountTable from './AccountTable';
import { useTranslation } from '../../hooks/useTranslation';
import { Calendar, Layers, ShieldCheck, DollarSign } from 'lucide-react';

const AccountDetails = ({
  account,
  isOpen,
  onClose
}) => {
  const { t } = useTranslation();

  if (!account) return null;

  const { name, iban, balance, currency, status, createdAt, createdDate } = account;

  const formatCurrency = (val, cur) => {
    return new Intl.NumberFormat('tr-TR', {
      style: cur === 'GOLD' ? 'decimal' : 'currency',
      currency: cur === 'GOLD' ? undefined : cur,
      minimumFractionDigits: 2
    }).format(val) + (cur === 'GOLD' ? ' gr' : '');
  };

  const footer = (
    <Button variant="secondary" size="sm" onClick={onClose}>
      {t('close', 'Kapat')}
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${name} - ${t('account_details', 'Hesap Detayları')}`}
      footer={footer}
      size="lg"
    >
      <div className="flex flex-col gap-6">

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-brand-border bg-white/[0.01]">

          {/* Status */}
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-brand-success/10 text-brand-success rounded-lg shrink-0 mt-0.5">
              <ShieldCheck size={16} />
            </div>
            <div>
              <span className="text-[9px] text-brand-textMuted font-bold uppercase tracking-wider block">
                {t('account_status', 'Hesap Durumu')}
              </span>
              {status === 'blocked' ? (
                <span className="text-xs font-extrabold text-brand-danger">
                  {t('blocked', 'Bloke')}
                </span>
              ) : (
                <span className="text-xs font-extrabold text-brand-success">
                  {t('active', 'Aktif')}
                </span>
              )}
            </div>
          </div>

          {/* Currency */}
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg shrink-0 mt-0.5">
              <DollarSign size={16} />
            </div>
            <div>
              <span className="text-[9px] text-brand-textMuted font-bold uppercase tracking-wider block">
                {t('currency_type', 'Döviz Türü')}
              </span>
              <span className="text-xs font-extrabold text-brand-textPrimary uppercase">{currency}</span>
            </div>
          </div>

          {/* Type */}
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-white/5 text-brand-textSecondary rounded-lg shrink-0 mt-0.5">
              <Layers size={16} />
            </div>
            <div>
              <span className="text-[9px] text-brand-textMuted font-bold uppercase tracking-wider block">
                {t('account_type', 'Hesap Türü')}
              </span>
              <span className="text-xs font-extrabold text-brand-textPrimary">
                {t('vadesiz', 'Vadesiz Hesap')}
              </span>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-lg shrink-0 mt-0.5">
              <Calendar size={16} />
            </div>
            <div>
              <span className="text-[9px] text-brand-textMuted font-bold uppercase tracking-wider block">
                {t('opening_date', 'Açılış Tarihi')}
              </span>
              <span className="text-xs font-extrabold text-brand-textPrimary">
                {createdAt || createdDate ? new Date(createdAt || createdDate).toLocaleDateString('tr-TR') : '01.07.2026'}
              </span>
            </div>
          </div>

        </div>

        {/* Balance Display */}
        <div className="text-center py-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
          <span className="text-[10px] text-brand-textMuted font-bold uppercase tracking-wider">
            {t('net_balance', 'Güncel Net Bakiye')}
          </span>
          <h2 className="text-2xl font-extrabold text-brand-primary mt-1">
            {formatCurrency(balance, currency)}
          </h2>
          <span className="text-xs font-mono text-brand-textSecondary select-all block mt-2">
            IBAN: {iban}
          </span>
        </div>

        {/* Transaction History for this Account */}
        <div>
          <h4 className="text-sm font-extrabold text-brand-textPrimary uppercase tracking-wide mb-3">
            {t('account_transactions', 'Hesap Hareketleri')}
          </h4>
          <AccountTable iban={iban} currency={currency} />
        </div>

      </div>
    </Modal>
  );
};

export default AccountDetails;
