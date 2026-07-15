import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

const InfoCard = ({ 
  title, 
  text, 
  type = 'info', 
  icon: Icon,
  className = ''
}) => {
  const defaultIcons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    danger: AlertCircle,
  };

  const RenderIcon = Icon || defaultIcons[type];

  const colors = {
    info: 'bg-brand-primary/5 border-brand-primary/20 text-brand-primary',
    success: 'bg-brand-success/5 border-brand-success/20 text-brand-success',
    warning: 'bg-brand-warning/5 border-brand-warning/20 text-brand-warning',
    danger: 'bg-brand-danger/5 border-brand-danger/20 text-brand-danger',
  };

  return (
    <div className={`p-4 rounded-xl border flex gap-3 ${colors[type]} ${className}`}>
      {RenderIcon && (
        <div className="shrink-0 mt-0.5">
          <RenderIcon size={18} />
        </div>
      )}
      <div>
        {title && <h4 className="text-xs font-bold uppercase tracking-wider mb-1 text-current">{title}</h4>}
        <p className="text-xs font-semibold leading-relaxed text-brand-textPrimary">{text}</p>
      </div>
    </div>
  );
};

export default InfoCard;
