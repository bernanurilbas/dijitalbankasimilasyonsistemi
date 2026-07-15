import React from 'react';
import Card from '../ui/Card';

const PortfolioCard = ({ 
  portfolio = [], 
  rates = [] 
}) => {
  const formatCurrency = (val, cur = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', { 
      style: cur === 'GOLD' ? 'decimal' : 'currency', 
      currency: cur === 'GOLD' ? undefined : cur,
      minimumFractionDigits: 2
    }).format(val) + (cur === 'GOLD' ? ' gr' : '');
  };

  // Convert portfolio to TRY values using rates
  const totalValuationTRY = portfolio.reduce((acc, curr) => {
    const rateItem = rates.find(r => r.code === curr.assetType);
    const rate = rateItem ? parseFloat(rateItem.sell) : 1;
    return acc + (curr.amount * rate);
  }, 0);

  return (
    <Card title="Yatırım Portföyüm" subtitle="Toplam yatırım varlıklarınızın anlık değeri">
      <div className="flex flex-col gap-4">
        <div>
          <span className="text-[10px] text-brand-textMuted font-bold uppercase tracking-wider">Toplam Portföy Büyüklüğü</span>
          <h2 className="text-2xl font-extrabold text-brand-primary mt-1">
            {formatCurrency(totalValuationTRY, 'TRY')}
          </h2>
        </div>

        {/* Quantities listed */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-white/5 pt-4 mt-1">
          {portfolio.map((item) => (
            <div key={item.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex flex-col">
              <span className="text-[9px] font-bold text-brand-textMuted uppercase tracking-wider">{item.assetType} Varlığı</span>
              <span className="text-sm font-extrabold text-brand-textPrimary mt-0.5">
                {formatCurrency(item.amount, item.assetType)}
              </span>
            </div>
          ))}
          {portfolio.length === 0 && (
            <div className="col-span-full text-xs text-brand-textMuted py-2 font-semibold">
              Yatırım hesabınızda henüz varlık bulunmamaktadır.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PortfolioCard;
