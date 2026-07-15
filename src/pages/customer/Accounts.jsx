import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccounts, createSubAccount, fetchTransactions, deleteAccount } from '../../store/slices/accountSlice';
import { useTranslation } from '../../hooks/useTranslation';
import PageHeader from '../../components/layout/PageHeader';
import AccountCard from '../../components/accounts/AccountCard';
import AccountSummary from '../../components/accounts/AccountSummary';
import AccountDetails from '../../components/accounts/AccountDetails';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import { Plus, Landmark } from 'lucide-react';

const Accounts = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { accounts, loading } = useSelector((state) => state.accounts);
  const { t } = useTranslation();

  // Modal & Toast States
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteAccountData, setDeleteAccountData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Form States for New Account
  const [accountName, setAccountName] = useState('');
  const [currency, setCurrency] = useState('TRY');
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAccounts(user.id));
      dispatch(fetchTransactions(user.id));
    }
  }, [dispatch, user]);

  const handleViewDetails = (account) => {
    setSelectedAccount(account);
    setIsDetailsOpen(true);
  };

  const handleCreateAccountSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      await dispatch(createSubAccount({
        userId: user.id,
        currency,
        name: accountName.trim() || `${currency} Birikim Hesabı`
      })).unwrap();

      // Refresh accounts list
      dispatch(fetchAccounts(user.id));

      setIsCreateOpen(false);
      setAccountName('');
      setCurrency('TRY');
      setToastMessage(t('account_open_success', 'Yeni hesabınız başarıyla aktifleştirildi.'));
      setToastOpen(true);
    } catch (err) {
      setToastMessage(t('account_open_error', 'Hesap oluşturulurken bir sorun oluştu.'));
      setToastOpen(true);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteAccountConfirm = async () => {
    if (!deleteAccountData) return;
    setDeleteLoading(true);

    try {
      await dispatch(deleteAccount({
        userId: user.id,
        accountId: deleteAccountData.id,
        name: deleteAccountData.name,
        iban: deleteAccountData.iban
      })).unwrap();

      setDeleteAccountData(null);
      setToastMessage(t('close_account_success', 'Hesabınız başarıyla kapatıldı.'));
      setToastType('success');
      setToastOpen(true);
    } catch (err) {
      setToastMessage(typeof err === 'string' ? t(err, err) : t('close_account_error', 'Hesap kapatılırken bir sorun oluştu.'));
      setToastType('danger');
      setToastOpen(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Toast Alert */}
      <div className="fixed bottom-6 right-6 z-50">
        <Toast
          message={toastMessage}
          type={toastType}
          isOpen={toastOpen}
          onClose={() => setToastOpen(false)}
        />
      </div>

      {/* Page Title & Fast Action */}
      <PageHeader 
        title={t('my_accounts', 'Hesaplarım')} 
        description={t('account_desc', 'Mevcut vadesiz, döviz ve altın hesaplarınızı inceleyin, yeni yatırım hesapları oluşturun.')}
        actions={
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus size={16} className="mr-1.5" />
            {t('new_account', 'Yeni Hesap Aç')}
          </Button>
        }
      />

      {/* Account Total Portföy Summary */}
      <AccountSummary accounts={accounts} />

      {/* Accounts Cards List Grid */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-extrabold text-brand-textPrimary tracking-wide uppercase">{t('all_accounts', 'Tüm Hesaplarım')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-44 animate-pulse bg-white/[0.03] border border-white/5 rounded-2xl" />
            ))
          ) : accounts.length === 0 ? (
            <div className="col-span-full text-center py-8 text-xs text-brand-textMuted font-semibold">
              {t('no_active_accounts', 'Kayıtlı aktif banka hesabınız bulunmamaktadır.')}
            </div>
          ) : (
            accounts.map((acc) => (
              <AccountCard
                key={acc.id}
                account={acc}
                onViewDetails={handleViewDetails}
                onDelete={(account) => setDeleteAccountData(account)}
              />
            ))
          )}
        </div>
      </div>

      {/* Account Details Modal */}
      <AccountDetails
        account={selectedAccount}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* Create New Account Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={t('new_account', 'Yeni Hesap Aç')}
      >
        <form onSubmit={handleCreateAccountSubmit} className="flex flex-col gap-4">
          <p className="text-xs text-brand-textSecondary leading-relaxed">
            {t('account_modal_desc', 'Dilediğiniz para biriminden anında ek birikim hesabı açabilirsiniz. Herhangi bir hesap işletim ücreti alınmaz.')}
          </p>

          <Input
            label={t('account_name', 'Hesap Adı (İsteğe Bağlı)')}
            placeholder={t('account_name_placeholder', 'Örn: Tatil Birikimi')}
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />

          <Select
            label={t('currency', 'Para Birimi')}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            options={[
              { value: 'TRY', label: 'TRY - Türk Lirası' },
              { value: 'USD', label: 'USD - Amerikan Doları' },
              { value: 'EUR', label: 'EUR - Euro' },
              { value: 'GOLD', label: 'GOLD - Altın (Gram)' },
            ]}
          />

          <div className="flex gap-3 justify-end mt-4">
            <Button variant="secondary" size="sm" onClick={() => setIsCreateOpen(false)}>
              {t('cancel', 'İptal')}
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={createLoading}>
              {t('new_account', 'Hesap Aç')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={!!deleteAccountData}
        onClose={() => setDeleteAccountData(null)}
        title={t('close_account', 'Hesabı Kapat')}
        size="sm"
      >
        <div className="flex flex-col gap-4 text-center">
          <p className="text-sm text-brand-textSecondary leading-relaxed">
            {t('is_sure_delete_account', 'isimli hesabı kapatmak istediğinize emin misiniz?').replace('{name}', deleteAccountData?.name)}
            <span className="font-mono text-[11px] block mt-1 text-brand-textMuted">{deleteAccountData?.iban}</span>
          </p>
          {deleteAccountData?.balance > 0 && (
            <p className="text-xs text-brand-danger bg-brand-danger/10 p-2.5 rounded-lg font-bold">
              {t('close_account_warning', 'Dikkat: Hesabınızda bakiye bulunmaktadır. Kapatma durumunda bakiye silinecektir!')}
            </p>
          )}
          <div className="flex gap-3 justify-center mt-4">
            <Button variant="secondary" size="sm" onClick={() => setDeleteAccountData(null)}>
              {t('give_up', 'Vazgeç')}
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteAccountConfirm} loading={deleteLoading}>
              {t('close_account', 'Hesabı Kapat')}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Accounts;
