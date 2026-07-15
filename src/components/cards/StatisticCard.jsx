import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import CountUp from '../ui/CountUp';

const StatisticCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'increase', 
  icon: Icon,
  currency = '',
  className = ''
}) => {
  const isIncrease = changeType === 'increase';

  return (
    <div className={`glass-panel p-5 rounded-xl shadow-md ${className}`}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="bg-brand-primary/10 text-brand-primary p-1.5 rounded-lg">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className="text-xl font-extrabold text-brand-textPrimary">
          {typeof value === 'number' ? (
            <CountUp value={value} currency={currency} />
          ) : (
            value
          )}
        </h3>
        {change !== undefined && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${isIncrease ? 'text-brand-success' : 'text-brand-danger'}`}>
            {isIncrease ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
            {change}%
          </span>
        )}
      </div>
    </div>
  );
};

export default StatisticCard;
