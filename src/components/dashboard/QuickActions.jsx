import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Receipt, CreditCard, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { label: 'Para Gönder', icon: Send, path: '/transfers', color: 'text-brand-primary bg-brand-primary/10' },
    { label: 'Fatura Öde', icon: Receipt, path: '/bills', color: 'text-brand-warning bg-brand-warning/10' },
    { label: 'Kart Yönetimi', icon: CreditCard, path: '/cards', color: 'text-brand-success bg-brand-success/10' },
    { label: 'Yatırımlar', icon: TrendingUp, path: '/investments', color: 'text-brand-gold bg-brand-gold/10' },
  ];

  return (
    <Card title="Hızlı İşlemler" subtitle="Sık kullanılan finansal araçlar">
      <div className="grid grid-cols-2 gap-4">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(act.path)}
              className="flex flex-col items-center justify-center p-4 border border-brand-border rounded-xl bg-white/[0.01] hover:bg-white/[0.03] active:scale-[0.98] transition-all"
            >
              <div className={`p-3 rounded-lg mb-2 ${act.color}`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-bold text-brand-textPrimary">{act.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
