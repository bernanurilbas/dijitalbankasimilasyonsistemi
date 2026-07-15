import React from 'react';
import ChartCard from '../cards/ChartCard';

const InvestmentChart = ({ 
  portfolio = [], 
  rates = [],
  accounts = []
}) => {
  // Rates mapping
  const rateMap = { TRY: 1, USD: 34.2, EUR: 37.1, GOLD: 2500 };
  rates.forEach(r => {
    rateMap[r.code] = parseFloat(r.sell);
  });

  // Calculate allocations in TRY
  const allocations = [];

  // 1. Gather all balances from active bank accounts
  let totalAssets = 0;
  
  accounts.forEach(acc => {
    const rate = rateMap[acc.currency] || 1;
    const valueTRY = acc.balance * rate;
    totalAssets += valueTRY;

    const existing = allocations.find(a => a.name === acc.currency);
    if (existing) {
      existing.value += valueTRY;
    } else {
      allocations.push({ name: acc.currency, value: valueTRY, rawAmount: acc.balance });
    }
  });

  if (totalAssets === 0) {
    return (
      <ChartCard title="Varlık Dağılımı" subtitle="Yatırım portföyünüzün döviz cinsi oranı">
        <div className="text-xs text-brand-textMuted py-6 font-semibold">Hesap bakiyeleriniz boş olduğu için grafik çizilemedi.</div>
      </ChartCard>
    );
  }

  // Calculate percentages
  const segments = allocations
    .map(al => ({
      ...al,
      percentage: (al.value / totalAssets) * 100
    }))
    .filter(al => al.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage);

  // SVG Donut Circle Constants
  const radius = 45;
  const cx = 100;
  const cy = 100;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius; // ~282.74

  const colors = {
    TRY: '#3b82f6', // Blue
    USD: '#10b981', // Emerald
    EUR: '#a855f7', // Purple
    GOLD: '#f59e0b', // Gold
  };

  let cumulativePercentage = 0;

  return (
    <ChartCard title="Varlık Dağılımı" subtitle="Yatırım portföyünüzün döviz cinsi oranı">
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-around">
        
        {/* SVG Donut Graphic */}
        <div className="relative w-36 h-36">
          <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
            {/* Background empty track */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth={strokeWidth}
            />

            {/* Segmented Rings */}
            {segments.map((seg, idx) => {
              const strokeDashoffset = circumference - (seg.percentage / 100) * circumference;
              const rotation = (cumulativePercentage / 100) * 360;
              cumulativePercentage += seg.percentage;

              return (
                <circle
                  key={idx}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="transparent"
                  stroke={colors[seg.name] || '#64748b'}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform={`rotate(${rotation} ${cx} ${cy})`}
                  className="transition-all duration-500"
                  strokeLinecap={seg.percentage === 100 ? 'butt' : 'round'}
                />
              );
            })}
          </svg>
          {/* Centered Total Percentage Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
            <span className="text-[9px] text-brand-textMuted uppercase font-bold tracking-wider">Net Varlık</span>
            <span className="text-xs font-extrabold text-brand-textPrimary mt-0.5">
              {new Intl.NumberFormat('tr-TR', { notation: 'compact' }).format(totalAssets)} TL
            </span>
          </div>
        </div>

        {/* Legend / Label list */}
        <div className="flex flex-col gap-2 text-left">
          {segments.map((seg, idx) => {
            const dotColor = colors[seg.name] || '#64748b';
            return (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: dotColor }}></span>
                <span className="font-bold text-brand-textPrimary">{seg.name}</span>
                <span className="text-brand-textSecondary font-semibold">({seg.percentage.toFixed(1)}%)</span>
              </div>
            );
          })}
        </div>

      </div>
    </ChartCard>
  );
};

export default InvestmentChart;
