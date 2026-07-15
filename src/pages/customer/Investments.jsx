import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRates, fetchInvestments, buyAsset, sellAsset } from '../../store/slices/investmentSlice';
import { fetchAccounts } from '../../store/slices/accountSlice';
import PageHeader from '../../components/layout/PageHeader';
import PortfolioCard from '../../components/investments/PortfolioCard';
import ProfitCard from '../../components/investments/ProfitCard';
import AssetCard from '../../components/investments/AssetCard';
import InvestmentChart from '../../components/investments/InvestmentChart';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import { DollarSign, Landmark } from 'lucide-react';

const Investments = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { rates, portfolio, loading } = useSelector((state) => state.investments);
  const { accounts } = useSelector((state) => state.accounts);

  // Trade Modal State
  const [tradeAsset, setTradeAsset] = useState(null); // Rate object (USD, EUR, GOLD)
  const [tradeMode, setTradeMode] = useState('BUY'); // BUY or SELL
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeError, setTradeError] = useState('');

  // Toast Notifications
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchRates());
      dispatch(fetchInvestments(user.id));
      dispatch(fetchAccounts(user.id));
    }
  }, [dispatch, user]);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setToastOpen(true);
  };

  const handleOpenTrade = (asset, mode) => {
    setTradeAsset(asset);
    setTradeMode(mode);
    setTradeAmount('');
    setTradeError('');
    setIsTradeOpen(true);
  };

  const handleTradeSubmit = async (e) => {
    e.preventDefault();
    setTradeError('');

    const qty = parseFloat(tradeAmount);
    if (isNaN(qty) || qty <= 0) {
      setTradeError('Lütfen geçerli bir miktar girin.');
      return;
    }

    const tryAccount = accounts.find(a => a.currency === 'TRY');
    const assetAccount = accounts.find(a => a.currency === tradeAsset.code);

    if (!tryAccount) {
      setTradeError('İşlemin yapılabilmesi için bir vadesiz TL hesabınız olmalıdır.');
      return;
    }

    if (!assetAccount) {
      setTradeError(`İşlemin yapılabilmesi için aktif bir vadesiz ${tradeAsset.code} hesabınız olmalıdır.`);
      return;
    }

    const rate = tradeMode === 'BUY' ? parseFloat(tradeAsset.sell) : parseFloat(tradeAsset.buy);
    const totalTRY = qty * rate;

    if (tradeMode === 'BUY') {
      if (tryAccount.balance < totalTRY) {
        setTradeError('TL hesabınızda bu işlemi gerçekleştirecek bakiye bulunmamaktadır.');
        return;
      }
    } else {
      if (assetAccount.balance < qty) {
        setTradeError(`Vadesiz hesabınızda yeterli miktarda ${tradeAsset.code} bulunmamaktadır.`);
        return;
      }
    }

    setTradeLoading(true);
    try {
      if (tradeMode === 'BUY') {
        await dispatch(buyAsset({
          userId: user.id,
          tryAccountId: tryAccount.id,
          targetAccountId: assetAccount.id,
          assetType: tradeAsset.code,
          amount: qty,
          rate
        })).unwrap();
        showToast(`${qty} ${tradeAsset.code} alım işlemi başarıyla gerçekleşti.`);
      } else {
        await dispatch(sellAsset({
          userId: user.id,
          tryAccountId: tryAccount.id,
          targetAccountId: assetAccount.id,
          assetType: tradeAsset.code,
          amount: qty,
          rate
        })).unwrap();
        showToast(`${qty} ${tradeAsset.code} satım işlemi başarıyla gerçekleşti.`);
      }
      setIsTradeOpen(false);
    } catch (err) {
      setTradeError('Yatırım işlemi sırasında hata oluştu.');
    } finally {
      setTradeLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  const selectedRateValue = tradeAsset
    ? (tradeMode === 'BUY' ? parseFloat(tradeAsset.sell) : parseFloat(tradeAsset.buy))
    : 0;

  const calculatedTRYValue = tradeAmount && !isNaN(parseFloat(tradeAmount))
    ? parseFloat(tradeAmount) * selectedRateValue
    : 0;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50">
        <Toast
          message={toastMsg}
          type={toastType}
          isOpen={toastOpen}
          onClose={() => setToastOpen(false)}
        />
      </div>

      {/* Page Header */}
      <PageHeader 
        title="Yatırım Portföyü" 
        description="Canlı altın ve döviz fiyatlarını takip edin, anında alım satım işlemleri yaparak birikimlerinizi değerlendirin."
      />

      {/* Portfolios stats section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PortfolioCard portfolio={portfolio} rates={rates} />
        <ProfitCard portfolio={portfolio} rates={rates} />
      </div>

      {/* SVG allocation pie and Rates lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Donut */}
        <div className="lg:col-span-1">
          <InvestmentChart 
            portfolio={portfolio} 
            rates={rates} 
            accounts={accounts} 
          />
        </div>

        {/* Live Rates Asset Cards */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <h3 className="text-sm font-extrabold text-brand-textPrimary tracking-wide uppercase text-left">Piyasa Fiyatları (Canlı)</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && rates.length === 0 ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-44 animate-pulse bg-white/[0.03] border border-white/5 rounded-2xl" />
              ))
            ) : (
              rates.map((rate) => (
                <AssetCard
                  key={rate.id}
                  rate={rate}
                  onBuy={(asset) => handleOpenTrade(asset, 'BUY')}
                  onSell={(asset) => handleOpenTrade(asset, 'SELL')}
                />
              ))
            )}
          </div>
        </div>

      </div>

      {/* Trade Buy / Sell Modal */}
      {tradeAsset && (
        <Modal
          isOpen={isTradeOpen}
          onClose={() => setIsTradeOpen(false)}
          title={`${tradeAsset.code} - Yatırım İşlemi (${tradeMode === 'BUY' ? 'Alış' : 'Satış'})`}
        >
          <form onSubmit={handleTradeSubmit} className="flex flex-col gap-4 text-left">
            <p className="text-xs text-brand-textSecondary leading-relaxed">
              {tradeMode === 'BUY' 
                ? `TL bakiyeniz üzerinden ${tradeAsset.code} satın alabilirsiniz. İşlem anında gerçekleşir.`
                : `Birikmiş ${tradeAsset.code} varlığınızı güncel fiyattan TL'ye çevirebilirsiniz.`
              }
            </p>

            {/* Current Transaction Price */}
            <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex justify-between items-center text-xs">
              <span className="text-brand-textMuted font-bold uppercase tracking-wider">Piyasa İşlem Kuru:</span>
              <span className="font-extrabold text-brand-primary">{formatCurrency(selectedRateValue)}</span>
            </div>

            {/* Amount input */}
            <Input
              type="number"
              step="any"
              label={`Miktar (${tradeAsset.code === 'GOLD' ? 'Gr' : 'Adet'})`}
              placeholder={tradeAsset.code === 'GOLD' ? '5.00' : '100'}
              value={tradeAmount}
              onChange={(e) => setTradeAmount(e.target.value)}
              error={tradeError}
              icon={DollarSign}
            />

            {/* Equivalent value indicator */}
            {calculatedTRYValue > 0 && (
              <div className="text-[10px] font-bold text-brand-textMuted bg-white/[0.005] border border-white/5 p-2.5 rounded-lg flex justify-between">
                <span>TAHMİNİ TL TUTARI:</span>
                <span className="text-brand-success">{formatCurrency(calculatedTRYValue)}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex gap-3 justify-end mt-4">
              <Button variant="secondary" size="sm" onClick={() => setIsTradeOpen(false)}>
                İptal
              </Button>
              <Button type="submit" variant="primary" size="sm" loading={tradeLoading}>
                {tradeMode === 'BUY' ? 'Alış Yap' : 'Satış Yap'}
              </Button>
            </div>

          </form>
        </Modal>
      )}

    </div>
  );
};

export default Investments;
