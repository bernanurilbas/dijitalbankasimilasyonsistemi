import React from 'react';
import { ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';

const ProfitCard = ({ 
  portfolio = [], 
  rates = [] 
}) => {
  // Calculate total purchase cost and total current value
  let totalCost = 0;
  let totalCurrentVal = 0;

  portfolio.forEach((item) => {
    const rateItem = rates.find(r => r.code === item.assetType);
    const currentPrice = rateItem ? parseFloat(rateItem.sell) : item.buyPrice;
    
    totalCost += item.amount * item.buyPrice;
    totalCurrentVal += item.amount * currentPrice;
  });

  const netProfit = totalCurrentVal - totalCost;
  const isGain = netProfit >= 0;

  // Percentage change
  const percentChange = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  const statusColor = isGain ? 'text-brand-success' : 'text-brand-danger';
  const statusBg = isGain ? 'bg-brand-success/5 border-brand-success/10' : 'bg-brand-danger/5 border-brand-danger/10';

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-brand-primary" />
          <span>Portföy Kar / Zarar Analizi</span>
        </div>
      }
      subtitle="Toplam alış maliyeti ile güncel piyasa değeri farkı"
    >
      <div className="flex flex-col gap-4 text-left">
        <div>
          <span className="text-[10px] text-brand-textMuted font-bold uppercase tracking-wider block">Net Kar / Zarar Durumu</span>
          <div className="flex items-baseline gap-3 mt-1.5">
            <h2 className={`text-2xl font-extrabold ${statusColor}`}>
              {isGain ? '+' : ''}
              {formatCurrency(netProfit)}
            </h2>
            {totalCost > 0 && (
              <span className={`inline-flex items-center gap-0.5 text-xs font-extrabold px-2 py-0.5 rounded-full ${statusBg}`}>
                {isGain ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                {percentChange.toFixed(2)}%
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
          <div>
            <span className="text-[9px] text-brand-textMuted font-bold uppercase tracking-wider">Maliyet Değeri</span>
            <span className="text-sm font-extrabold text-brand-textPrimary block mt-0.5">
              {formatCurrency(totalCost)}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-brand-textMuted font-bold uppercase tracking-wider">Piyasa Değeri</span>
            <span className="text-sm font-extrabold text-brand-textPrimary block mt-0.5">
              {formatCurrency(totalCurrentVal)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfitCard;
