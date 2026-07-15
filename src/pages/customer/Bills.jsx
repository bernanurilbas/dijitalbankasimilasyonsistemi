import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccounts, payBill } from '../../store/slices/accountSlice';
import { fetchTransactionsHistory } from '../../store/slices/transactionSlice';
import api from '../../services/api';
import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import InfoCard from '../../components/cards/InfoCard';
import { 
  Zap, 
  Droplet, 
  Flame, 
  Globe, 
  Phone, 
  Search, 
  CreditCard, 
  Calendar, 
  FileText, 
  History, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';

const CATEGORIES = [
  { value: 'ELECTRICITY', label: 'Elektrik' },
  { value: 'WATER', label: 'Su' },
  { value: 'GAS', label: 'Doğalgaz' },
  { value: 'INTERNET', label: 'İnternet / TV' },
  { value: 'PHONE', label: 'Telefon / Mobil' }
];

const PROVIDERS = {
  ELECTRICITY: [
    { value: 'EnerjiSA Elektrik', label: 'EnerjiSA Elektrik' },
    { value: 'CK Boğaziçi Elektrik', label: 'CK Boğaziçi Elektrik' },
    { value: 'Limak Enerji', label: 'Limak Enerji' }
  ],
  WATER: [
    { value: 'İSKİ Su', label: 'İSKİ Su' },
    { value: 'İSU Su', label: 'İSU Su' },
    { value: 'ASKİ Su', label: 'ASKİ Su' }
  ],
  GAS: [
    { value: 'İGDAŞ Doğalgaz', label: 'İGDAŞ Doğalgaz' },
    { value: 'Başkentgaz Doğalgaz', label: 'Başkentgaz Doğalgaz' }
  ],
  INTERNET: [
    { value: 'Turkcell Ev İnterneti', label: 'Turkcell Ev İnterneti' },
    { value: 'Türk Telekom İnternet', label: 'Türk Telekom İnternet' },
    { value: 'KabloNet İnternet', label: 'KabloNet İnternet' }
  ],
  PHONE: [
    { value: 'Türk Telekom Telefon', label: 'Türk Telekom Telefon' },
    { value: 'Turkcell Mobil', label: 'Turkcell Mobil' },
    { value: 'Vodafone Mobil', label: 'Vodafone Mobil' }
  ]
};

const Bills = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { accounts } = useSelector((state) => state.accounts);
  const { transactions } = useSelector((state) => state.transaction);

  // Bill lists states
  const [allBills, setAllBills] = useState([]);
  const [loadingBills, setLoadingBills] = useState(false);

  // Form States
  const [category, setCategory] = useState('ELECTRICITY');
  const [provider, setProvider] = useState('EnerjiSA Elektrik');
  const [subscriberNumber, setSubscriberNumber] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  
  // Search Result State
  const [queriedBill, setQueriedBill] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // UI Flow States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  // Toast Alerts
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  // Pre-load data
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAccounts(user.id));
      dispatch(fetchTransactionsHistory(user.id));
      loadAllBills();
    }
  }, [dispatch, user]);

  // Set default provider when category changes
  useEffect(() => {
    if (PROVIDERS[category] && PROVIDERS[category].length > 0) {
      setProvider(PROVIDERS[category][0].value);
    }
    setQueriedBill(null);
    setSearchAttempted(false);
  }, [category]);

  const loadAllBills = async () => {
    try {
      setLoadingBills(true);
      const response = await api.get('/bills');
      setAllBills(response.data);
    } catch (err) {
      console.error('Faturalar yüklenirken hata oluştu:', err);
    } finally {
      setLoadingBills(false);
    }
  };

  // Only display TRY accounts for bill payment
  const tryAccounts = accounts.filter(acc => acc.currency === 'TRY');

  // Set default account selection when accounts load
  useEffect(() => {
    if (tryAccounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(tryAccounts[0].id);
    }
  }, [accounts, selectedAccountId, tryAccounts]);

  const getCategoryIcon = (providerName) => {
    const name = providerName?.toLowerCase() || '';
    if (name.includes('elektrik') || name.includes('enerji')) return { Icon: Zap, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' };
    if (name.includes('su')) return { Icon: Droplet, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
    if (name.includes('doğalgaz') || name.includes('gaz')) return { Icon: Flame, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
    if (name.includes('internet') || name.includes('net')) return { Icon: Globe, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' };
    return { Icon: Phone, color: 'text-green-500 bg-green-500/10 border-green-500/20' };
  };

  const handleQueryBill = (e) => {
    e.preventDefault();
    if (!subscriberNumber.trim()) {
      showToast('Lütfen abone numaranızı girin.', 'warning');
      return;
    }

    // Search bill locally in allBills
    const bill = allBills.find(
      b => b.provider.toLowerCase() === provider.toLowerCase() && 
           b.subscriberNumber === subscriberNumber.trim()
    );

    setSearchAttempted(true);
    if (bill) {
      setQueriedBill(bill);
    } else {
      setQueriedBill(null);
    }
  };

  const handleQuickPaySelect = (bill) => {
    // Determine category based on provider name
    const provName = bill.provider.toLowerCase();
    let cat = 'ELECTRICITY';
    if (provName.includes('su')) cat = 'WATER';
    else if (provName.includes('doğalgaz')) cat = 'GAS';
    else if (provName.includes('internet')) cat = 'INTERNET';
    else if (provName.includes('telefon') || provName.includes('mobil')) cat = 'PHONE';

    setCategory(cat);
    // Use timeout to let category useEffect update provider list first
    setTimeout(() => {
      setProvider(bill.provider);
      setSubscriberNumber(bill.subscriberNumber);
      setQueriedBill(bill);
      setSearchAttempted(true);
    }, 50);

    // Scroll smoothly to query form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmOpen = () => {
    if (!selectedAccountId) {
      showToast('Lütfen ödeme yapılacak TRY hesabı seçin.', 'danger');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handlePayBill = async () => {
    if (!queriedBill) return;
    setPayLoading(true);

    try {
      await dispatch(payBill({
        userId: user.id,
        accountId: selectedAccountId,
        billId: queriedBill.id,
        amount: queriedBill.amount,
        provider: queriedBill.provider
      })).unwrap();

      showToast(`${queriedBill.provider} faturası başarıyla ödendi!`, 'success');
      
      // Reset form and refresh list
      setQueriedBill(null);
      setSubscriberNumber('');
      setSearchAttempted(false);
      setIsConfirmOpen(false);
      
      // Reload lists
      loadAllBills();
      dispatch(fetchTransactionsHistory(user.id));
    } catch (err) {
      showToast(err || 'Fatura ödeme işlemi başarısız oldu.', 'danger');
    } finally {
      setPayLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setToastOpen(true);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  const unpaidBills = allBills.filter(b => !b.isPaid);
  const billTransactions = transactions.filter(tx => tx.type === 'bill');
  const selectedAccount = tryAccounts.find(a => a.id === selectedAccountId);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
      <div className="fixed bottom-6 right-6 z-50">
        <Toast
          message={toastMsg}
          type={toastType}
          isOpen={toastOpen}
          onClose={() => setToastOpen(false)}
        />
      </div>

      <PageHeader
        title="Fatura Ödemeleri"
        description="Elektrik, su, doğalgaz, internet ve telefon faturalarınızı sorgulayabilir, hesabınızdan anında güvenle ödeyebilirsiniz."
      />

      {/* Grid Layout: Form and Outstanding List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Payment Form (Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-6">
            <h3 className="text-sm font-extrabold text-brand-textPrimary tracking-wide uppercase flex items-center gap-2">
              <Search size={16} className="text-brand-primary" /> Fatura Sorgulama & Ödeme
            </h3>

            <form onSubmit={handleQueryBill} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Fatura Türü"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={CATEGORIES}
              />

              <Select
                label="Kurum / Sağlayıcı"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                options={PROVIDERS[category] || []}
              />

              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    label="Abone / Sözleşme No"
                    placeholder="Örn: 10293847"
                    value={subscriberNumber}
                    onChange={(e) => setSubscriberNumber(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="primary" className="h-[42px] px-4">
                  <Search size={16} />
                </Button>
              </div>
            </form>

            {/* Sandbox Helpers (Quick subscriber numbers for simulation) */}
            <div className="flex flex-col gap-2 p-3 bg-brand-bg/50 border border-brand-border rounded-xl text-xs">
              <span className="font-semibold text-brand-textSecondary">Simülasyon Hızlı Giriş Numaraları:</span>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => { setCategory('WATER'); setTimeout(() => { setProvider('İSKİ Su'); setSubscriberNumber('10293847'); }, 20); }} 
                  className="bg-brand-bg hover:bg-brand-border/10 text-brand-textPrimary border border-brand-border py-1 px-2.5 rounded transition"
                >
                  İSKİ Su (10293847)
                </button>
                <button 
                  onClick={() => { setCategory('GAS'); setTimeout(() => { setProvider('İGDAŞ Doğalgaz'); setSubscriberNumber('99281726'); }, 20); }} 
                  className="bg-brand-bg hover:bg-brand-border/10 text-brand-textPrimary border border-brand-border py-1 px-2.5 rounded transition"
                >
                  İGDAŞ Doğalgaz (99281726)
                </button>
                <button 
                  onClick={() => { setCategory('INTERNET'); setTimeout(() => { setProvider('Turkcell Ev İnterneti'); setSubscriberNumber('44837261'); }, 20); }} 
                  className="bg-brand-bg hover:bg-brand-border/10 text-brand-textPrimary border border-brand-border py-1 px-2.5 rounded transition"
                >
                  Turkcell (44837261)
                </button>
                <button 
                  onClick={() => { setCategory('PHONE'); setTimeout(() => { setProvider('Türk Telekom Telefon'); setSubscriberNumber('55263718'); }, 20); }} 
                  className="bg-brand-bg hover:bg-brand-border/10 text-brand-textPrimary border border-brand-border py-1 px-2.5 rounded transition"
                >
                  T. Telekom (55263718)
                </button>
              </div>
            </div>

            {/* Query Results */}
            {searchAttempted && (
              <div className="border-t border-brand-border pt-6 mt-2">
                {queriedBill ? (
                  <div className="flex flex-col gap-5">
                    <div className="bg-brand-success/5 border border-brand-success/20 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg border ${getCategoryIcon(queriedBill.provider).color}`}>
                          {React.createElement(getCategoryIcon(queriedBill.provider).Icon, { size: 20 })}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-brand-textPrimary">{queriedBill.provider}</h4>
                          <p className="text-xs text-brand-textMuted mt-0.5">Abone No: {queriedBill.subscriberNumber}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-bold text-brand-success">{formatCurrency(queriedBill.amount)}</span>
                        <span className="text-[10px] text-brand-textMuted flex items-center gap-1 mt-0.5">
                          <Calendar size={10} /> Son Gün: {queriedBill.dueDate}
                        </span>
                      </div>
                    </div>

                    {/* Account Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                      <Select
                        label="Ödeme Yapılacak Hesap"
                        value={selectedAccountId}
                        onChange={(e) => setSelectedAccountId(e.target.value)}
                        options={tryAccounts.map(acc => ({
                          value: acc.id,
                          label: `${acc.name} (${formatCurrency(acc.balance)})`
                        }))}
                      />
                      <Button 
                        variant="success" 
                        onClick={handleConfirmOpen}
                        className="w-full flex items-center gap-2 h-[42px]"
                      >
                        <CreditCard size={16} /> Faturayı Hemen Öde
                      </Button>
                    </div>
                  </div>
                ) : (
                  <InfoCard
                    title="Fatura Bulunamadı"
                    text="Girdiğiniz abone numarasına ait güncel ödenmemiş bir fatura kaydı bulunamadı. Lütfen bilgileri kontrol edip tekrar deneyin."
                    type="warning"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Predefined Pending Bills */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-brand-border flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-brand-textPrimary tracking-wide uppercase flex items-center gap-2">
              <FileText size={16} className="text-brand-primary" /> Bekleyen Faturalar
            </h3>

            <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
              {loadingBills ? (
                <div className="text-xs text-brand-textMuted py-4 text-center">Yükleniyor...</div>
              ) : unpaidBills.length === 0 ? (
                <div className="text-xs text-brand-textMuted py-6 text-center bg-brand-bg/30 border border-dashed border-brand-border rounded-xl">
                  Ödenmemiş faturanız bulunmamaktadır. Harika!
                </div>
              ) : (
                unpaidBills.map((bill) => {
                  const { Icon, color } = getCategoryIcon(bill.provider);
                  const isNearDue = new Date(bill.dueDate) <= new Date(new Date().setDate(new Date().getDate() + 7));
                  return (
                    <div 
                      key={bill.id}
                      className="p-3 bg-brand-bg/50 border border-brand-border hover:border-brand-border/80 rounded-xl flex items-center justify-between gap-3 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${color} shrink-0`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-brand-textPrimary truncate">{bill.provider}</span>
                          <span className="text-[10px] text-brand-textMuted mt-0.5">No: {bill.subscriberNumber}</span>
                          <span className={`text-[9px] mt-0.5 flex items-center gap-0.5 font-semibold ${isNearDue ? 'text-brand-danger' : 'text-brand-textMuted'}`}>
                            <Calendar size={8} /> Vade: {bill.dueDate}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-xs font-bold text-brand-textPrimary">{formatCurrency(bill.amount)}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="py-1 px-2.5 text-[10px] font-bold"
                          onClick={() => handleQuickPaySelect(bill)}
                        >
                          Öde
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Payment History */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-border flex flex-col gap-4">
        <h3 className="text-sm font-extrabold text-brand-textPrimary tracking-wide uppercase flex items-center gap-2">
          <History size={16} className="text-brand-primary" /> Fatura Ödeme Geçmişi
        </h3>

        {billTransactions.length === 0 ? (
          <div className="text-xs text-brand-textMuted py-8 text-center bg-brand-bg/30 border border-dashed border-brand-border rounded-xl">
            Son dönemde gerçekleştirilmiş fatura ödemeniz bulunmamaktadır.
          </div>
        ) : (
          <div className="w-full">
            <Table headers={['İşlem Tarihi', 'Fatura Kurumu', 'Açıklama', 'Ödenen Tutar', 'Referans No']}>
              {billTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-3.5 px-4 text-xs text-brand-textSecondary font-semibold">
                    {new Date(tx.date).toLocaleDateString('tr-TR')} {new Date(tx.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-bold text-brand-textPrimary">
                    {tx.recipientName}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-brand-textSecondary font-medium">
                    {tx.description}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-extrabold text-brand-danger">
                    {formatCurrency(Math.abs(tx.amount))}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-brand-textMuted font-mono select-all">
                    {tx.referenceNumber}
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {queriedBill && selectedAccount && (
        <Modal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          title="Fatura Ödeme Onayı"
        >
          <div className="flex flex-col gap-5">
            <div className="p-4 bg-brand-bg/40 border border-brand-border rounded-xl flex flex-col gap-3 text-xs text-brand-textSecondary">
              <div className="flex justify-between">
                <span>Fatura Kurumu:</span>
                <span className="font-bold text-brand-textPrimary">{queriedBill.provider}</span>
              </div>
              <div className="flex justify-between">
                <span>Abone Numarası:</span>
                <span className="font-bold text-brand-textPrimary font-mono">{queriedBill.subscriberNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Son Ödeme Tarihi:</span>
                <span className="font-bold text-brand-textPrimary">{queriedBill.dueDate}</span>
              </div>
              <div className="border-t border-brand-border/40 my-1" />
              <div className="flex justify-between">
                <span>Ödeyen Hesap:</span>
                <span className="font-bold text-brand-textPrimary">{selectedAccount.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Hesap Bakiyesi:</span>
                <span className="font-bold text-brand-textPrimary">{formatCurrency(selectedAccount.balance)}</span>
              </div>
              <div className="border-t border-brand-border/40 my-1" />
              <div className="flex justify-between text-sm text-brand-primary font-bold">
                <span>Toplam Ödenecek Tutar:</span>
                <span>{formatCurrency(queriedBill.amount)}</span>
              </div>
            </div>

            {selectedAccount.balance < queriedBill.amount ? (
              <InfoCard
                title="Yetersiz Bakiye"
                text="Seçtiğiniz hesapta faturayı ödemek için yeterli bakiye bulunmamaktadır. Lütfen başka bir hesap seçin veya hesabınıza bakiye yükleyin."
                type="danger"
              />
            ) : (
              <p className="text-xs text-brand-textMuted leading-relaxed">
                Ödemeyi onayladığınızda fatura tutarı hesabınızdan anında düşülecek ve fatura durumu 'Ödendi' olarak güncellenecektir. Bu işlem geri alınamaz.
              </p>
            )}

            <div className="flex gap-3 justify-end mt-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setIsConfirmOpen(false)}
              >
                İptal Et
              </Button>
              <Button 
                variant="success" 
                size="sm" 
                loading={payLoading}
                disabled={selectedAccount.balance < queriedBill.amount}
                onClick={handlePayBill}
              >
                Ödemeyi Tamamla
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Bills;
