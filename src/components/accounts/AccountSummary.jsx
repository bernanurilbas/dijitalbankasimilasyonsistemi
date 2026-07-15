import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Card from '../ui/Card';

const AccountSummary = ({ accounts = [] }) => {
  const { t } = useTranslation();
  // Rates for TRY value conversion
  const rates = { TRY: 1, USD: 34.2, EUR: 37.1, GOLD: 2500 };

  const totalAssetsTRY = accounts.reduce((acc, curr) => {
    const rate = rates[curr.currency] || 1;
    return acc + (curr.balance * rate);
  }, 0);

  const currencyDistribution = accounts.reduce((acc, curr) => {
    acc[curr.currency] = (acc[curr.currency] || 0) + curr.balance;
    return acc;
  }, {});

  const formatCurrency = (val, cur) => {
    return new Intl.NumberFormat('tr-TR', {
      style: cur === 'GOLD' ? 'decimal' : 'currency',
      currency: cur === 'GOLD' ? undefined : cur,
      minimumFractionDigits: 2
    }).format(val) + (cur === 'GOLD' ? ' gr' : '');
  };

  return (
    <Card title={t('asset_summary', 'Varlık Dağılım Özeti')} subtitle={t('total_assets', 'Tüm hesaplarınızdaki toplam birikimleriniz')}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Total Assets */}
        <div>
          <span className="text-[10px] text-brand-textMuted font-bold uppercase tracking-wider">{t('total_portfolio', 'TOPLAM PORTFÖY DEĞERİ (TRY)')}</span>
          <h2 className="text-2xl font-extrabold text-brand-primary mt-1">
            {formatCurrency(totalAssetsTRY, 'TRY')}
          </h2>
        </div>

        {/* Currency Distribution Row */}
        <div className="flex flex-wrap gap-4">
          {Object.entries(currencyDistribution).map(([cur, bal]) => {
            const colors = {
              TRY: 'border-blue-500/20 text-blue-400 bg-blue-500/5',
              USD: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5',
              EUR: 'border-purple-500/20 text-purple-400 bg-purple-500/5',
              GOLD: 'border-amber-500/20 text-amber-400 bg-amber-500/5',
            };
            const col = colors[cur] || colors.TRY;
            const savingsKey = `${cur.toLowerCase()}_savings`;

            return (
              <div key={cur} className={`px-4 py-2 border rounded-xl flex flex-col ${col}`}>
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-textMuted">{t(savingsKey, `${cur} Birikimi`)}</span>
                <span className="text-xs font-extrabold mt-0.5">{formatCurrency(bal, cur)}</span>
              </div>
            );
          })}
        </div>

      </div>
    </Card>
  );
};

export default AccountSummary;
