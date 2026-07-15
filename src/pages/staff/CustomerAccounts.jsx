import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PageHeader from '../../components/layout/PageHeader';
import SearchBox from '../../components/ui/SearchBox';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Toast from '../../components/ui/Toast';
import AccountDetails from '../../components/accounts/AccountDetails';
import { useTranslation } from '../../hooks/useTranslation';
import { User, Landmark, ShieldAlert, ShieldCheck } from 'lucide-react';

const CustomerAccounts = () => {
  const { t: translate } = useTranslation();
  
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [activeAccountDetails, setActiveAccountDetails] = useState(null);

  // Toast states
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Fetch all customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users?role=customer');
        setCustomers(response.data);
      } catch (err) {
        console.error('Failed to load customers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Fetch accounts when customer is selected
  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setAccountsLoading(true);
    setAccounts([]);
    try {
      const response = await api.get(`/accounts?userId=${customer.id}`);
      setAccounts(response.data);
    } catch (err) {
      console.error('Failed to load customer accounts', err);
    } finally {
      setAccountsLoading(false);
    }
  };

  const handleToggleStatus = async (customer) => {
    const nextStatus = customer.status === 'blocked' ? 'active' : 'blocked';
    
    try {
      // 1. Update user status in database
      await api.patch(`/users/${customer.id}`, { status: nextStatus });
      
      // 2. Post system log
      await api.post('/systemLogs', {
        message: `${customer.fullName} (${customer.username}) kullanıcısının hesabı ${nextStatus === 'blocked' ? 'bloke edildi' : 'aktif edildi'}.`,
        userId: '2', // Staff Elif Demir ID
        userRole: 'staff',
        date: new Date().toISOString()
      });

      // Update local state for selectedCustomer
      setSelectedCustomer(prev => ({ ...prev, status: nextStatus }));
      
      // Update customers list in background
      setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, status: nextStatus } : c));
      
      // Show toast
      setToastMessage(translate('customer_status_updated', 'Müşteri durumu başarıyla güncellendi.'));
      setToastType('success');
      setToastOpen(true);
    } catch (err) {
      setToastMessage(translate('customer_status_update_error', 'Müşteri durumu güncellenirken bir sorun oluştu.'));
      setToastType('danger');
      setToastOpen(true);
    }
  };

  // Filter customers by search input
  const filteredCustomers = customers.filter(c =>
    c.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phoneNumber?.includes(searchQuery)
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={translate('customer_accounts_inspection', 'Müşteri Hesap Sorgulama')}
        description={translate('customer_accounts_inspection_desc', 'Herhangi bir müşteriyi arayın, hesaplarını listeleyin ve hesap hareketlerini detaylı olarak inceleyin.')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Section: Customer Search & List */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-brand-border bg-white/[0.005]">
            <span className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider block mb-3">
              {translate('search_customer', 'Müşteri Ara')}
            </span>
            <SearchBox
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={translate('search_by_name_or_iban', 'Ad, kullanıcı adı veya telefon...')}
              className="w-full"
            />
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-brand-border bg-white/[0.005] max-h-[400px] overflow-y-auto flex flex-col gap-2">
            <span className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider block px-2 mb-1">
              {translate('results', 'Sonuçlar')} ({filteredCustomers.length})
            </span>
            {loading ? (
              <div className="py-6 flex justify-center"><Spinner size="sm" /></div>
            ) : filteredCustomers.length === 0 ? (
              <div className="py-6 text-center text-xs text-brand-textMuted font-bold">
                {translate('no_customers_found', 'Müşteri bulunamadı.')}
              </div>
            ) : (
              filteredCustomers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectCustomer(c)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedCustomer?.id === c.id
                      ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary'
                      : 'border-brand-border hover:bg-white/[0.02] text-brand-textSecondary hover:text-brand-textPrimary'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary shrink-0">
                    <User size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold truncate">{c.fullName}</h4>
                    <p className="text-[9px] font-mono text-brand-textMuted mt-0.5 truncate">{c.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Section: Accounts View */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {selectedCustomer ? (
            <div className="glass-panel p-6 rounded-2xl border border-brand-border bg-white/[0.005] min-h-[300px]">
              
              {/* Selected Customer Details */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-brand-border pb-4 mb-6">
                <div>
                  <h3 className="text-sm font-extrabold text-brand-textPrimary uppercase tracking-wide">
                    {selectedCustomer.fullName}
                  </h3>
                  <span className="text-[9px] font-mono text-brand-textMuted mt-1 block">
                    {translate('username', 'Kullanıcı Adı')}: {selectedCustomer.username} • {translate('phone', 'Telefon')}: {selectedCustomer.phoneNumber}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={selectedCustomer.status === 'blocked' ? 'danger' : 'success'}>
                    {selectedCustomer.status === 'blocked' ? translate('blocked', 'Bloke') : translate('active', 'Aktif')}
                  </Badge>
                  
                  <Button
                    variant={selectedCustomer.status === 'blocked' ? 'success' : 'danger'}
                    size="sm"
                    className="py-1 px-2.5 text-[10px] flex items-center gap-1 shrink-0"
                    onClick={() => handleToggleStatus(selectedCustomer)}
                  >
                    {selectedCustomer.status === 'blocked' ? (
                      <>
                        <ShieldCheck size={12} />
                        {translate('unblock', 'Bloke Kaldır')}
                      </>
                    ) : (
                      <>
                        <ShieldAlert size={12} />
                        {translate('block', 'Bloke Et')}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Accounts list */}
              <span className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider block mb-4">
                {translate('customer_accounts', 'Müşteri Hesapları')}
              </span>

              {accountsLoading ? (
                <div className="py-12 flex justify-center"><Spinner size="md" /></div>
              ) : accounts.length === 0 ? (
                <div className="py-12 text-center text-xs text-brand-textMuted font-bold">
                  {translate('no_active_accounts', 'Bu müşteriye ait aktif banka hesabı bulunmamaktadır.')}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accounts.map((acc) => (
                    <div
                      key={acc.id}
                      onClick={() => setActiveAccountDetails(acc)}
                      className="p-4 rounded-xl border border-brand-border bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer flex flex-col justify-between h-32 text-left group"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] text-brand-textMuted font-mono block uppercase truncate max-w-[120px]">
                            {acc.currency} - {acc.name}
                          </span>
                          <Badge variant={acc.status === 'blocked' ? 'danger' : 'success'}>
                            {acc.status === 'blocked' ? translate('blocked', 'Bloke') : translate('active', 'Aktif')}
                          </Badge>
                        </div>
                        <span className="text-[9px] font-mono text-brand-textSecondary mt-1.5 block select-all">
                          {acc.iban}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-end mt-4">
                        <div>
                          <span className="text-[8px] text-brand-textMuted font-bold uppercase block">
                            {translate('current_balance', 'Mevcut Bakiye')}
                          </span>
                          <span className="text-sm font-extrabold text-brand-textPrimary mt-0.5 block">
                            {new Intl.NumberFormat('tr-TR', { 
                              style: acc.currency === 'GOLD' ? 'decimal' : 'currency', 
                              currency: acc.currency === 'GOLD' ? undefined : acc.currency 
                            }).format(acc.balance)}
                            {acc.currency === 'GOLD' ? ' gr' : ''}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-brand-primary group-hover:underline flex items-center gap-0.5 shrink-0">
                          {translate('inspect_details', 'Detayları İncele')} →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl border border-brand-border bg-white/[0.005] flex flex-col items-center justify-center text-center min-h-[300px]">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4">
                <Landmark size={24} />
              </div>
              <h4 className="text-xs font-bold text-brand-textPrimary uppercase tracking-wide">
                {translate('no_customer_selected', 'Müşteri Seçilmedi')}
              </h4>
              <p className="text-[10px] text-brand-textMuted mt-1 max-w-xs leading-relaxed">
                {translate('select_customer_to_inspect_desc', 'Hesaplarını ve işlem hareketlerini görüntülemek için sol taraftaki listeden bir müşteri seçin.')}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Account Details Inspector Modal */}
      {activeAccountDetails && (
        <AccountDetails
          account={activeAccountDetails}
          isOpen={!!activeAccountDetails}
          onClose={() => setActiveAccountDetails(null)}
        />
      )}

      {/* Toast Notification */}
      <div className="fixed bottom-6 right-6 z-50">
        <Toast
          message={toastMessage}
          type={toastType}
          isOpen={toastOpen}
          onClose={() => setToastOpen(false)}
        />
      </div>
    </div>
  );
};

export default CustomerAccounts;
