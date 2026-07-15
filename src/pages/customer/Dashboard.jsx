import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccounts } from '../../store/slices/accountSlice';
import { useTranslation } from '../../hooks/useTranslation';
import PageHeader from '../../components/layout/PageHeader';
import StatisticCard from '../../components/cards/StatisticCard';
import BalanceCard from '../../components/cards/BalanceCard';
import IncomeChart from '../../components/dashboard/IncomeChart';
import ExpenseChart from '../../components/dashboard/ExpenseChart';
import QuickActions from '../../components/dashboard/QuickActions';
import RecentTransactions from '../../components/dashboard/RecentTransactions';
import NotificationWidget from '../../components/dashboard/NotificationWidget';
import { TrendingUp, TrendingDown, Landmark } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { accounts, loading } = useSelector((state) => state.accounts);
  const { stats } = useSelector((state) => state.dashboard);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  // Calculate sum of TRY values for accounts
  const totalTRYBalance = accounts.reduce((acc, curr) => {
    if (curr.currency === 'TRY') return acc + curr.balance;
    if (curr.currency === 'USD') return acc + (curr.balance * 34.2); // mock rates for display
    if (curr.currency === 'EUR') return acc + (curr.balance * 37.1);
    if (curr.currency === 'GOLD') return acc + (curr.balance * 2500); // 2500 tl/gr mock gold rate
    return acc;
  }, 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Title */}
      <PageHeader 
        title={t('dashboard_title', 'Genel Durum')} 
        description={t('dashboard_desc', 'Hesap özetlerinizi, nakit akışınızı ve hızlı finansal kısayollarınızı buradan inceleyebilirsiniz.')}
      />

      {/* Top Statistic Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatisticCard
          title={t('total_assets_try', 'Toplam Varlıklarım (TRY)')}
          value={totalTRYBalance}
          currency="TRY"
          icon={Landmark}
        />
        <StatisticCard
          title={t('monthly_total_income', 'Aylık Toplam Gelir')}
          value={stats.monthlyIncome}
          currency="TRY"
          change={stats.incomeChange}
          changeType="increase"
          icon={TrendingUp}
        />
        <StatisticCard
          title={t('monthly_total_expense', 'Aylık Toplam Gider')}
          value={stats.monthlyExpense}
          currency="TRY"
          change={stats.expenseChange}
          changeType="decrease"
          icon={TrendingDown}
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Accounts List Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-extrabold text-brand-textPrimary tracking-wide uppercase">{t('my_bank_accounts', 'Banka Hesaplarım')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                [1, 2].map((i) => (
                  <div key={i} className="h-[90px] animate-pulse bg-white/[0.03] border border-white/5 rounded-xl" />
                ))
              ) : accounts.length === 0 ? (
                <div className="text-xs text-brand-textMuted py-4">{t('no_bank_accounts', 'Kayıtlı banka hesabı bulunamadı.')}</div>
              ) : (
                accounts.map((acc) => (
                  <BalanceCard
                    key={acc.id}
                    accountName={acc.name}
                    iban={acc.iban}
                    balance={acc.balance}
                    currency={acc.currency}
                  />
                ))
              )}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IncomeChart />
            <ExpenseChart />
          </div>

          {/* Recent Operations */}
          <RecentTransactions />

        </div>

        {/* Right Column (Span 1) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Quick Actions Shortcuts */}
          <QuickActions />

          {/* Alert Alerts Widgets */}
          <NotificationWidget />

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
