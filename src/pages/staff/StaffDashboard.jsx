import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PageHeader from '../../components/layout/PageHeader';
import SearchBox from '../../components/ui/SearchBox';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import Spinner from '../../components/ui/Spinner';
import { useTranslation } from '../../hooks/useTranslation';
import { Trash2 } from 'lucide-react';

const StaffDashboard = () => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Deletion modal states
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Toast states
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users?role=customer');
      setCustomers(response.data);
    } catch (err) {
      setToastMessage(t('customer_load_error', 'Müşteri listesi yüklenemedi.'));
      setToastType('danger');
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);



  const handleDeleteCustomerConfirm = async () => {
    if (!customerToDelete) return;
    try {
      setDeleteLoading(true);
      
      // 1. Fetch associated bank accounts
      const accountsRes = await api.get(`/accounts?userId=${customerToDelete.id}`);
      const customerAccounts = accountsRes.data;

      // 2. Delete all associated bank accounts in parallel
      await Promise.all(
        customerAccounts.map(acc => api.delete(`/accounts/${acc.id}`))
      );

      // 3. Delete the user (customer)
      await api.delete(`/users/${customerToDelete.id}`);

      // 4. Post system log
      await api.post('/systemLogs', {
        message: `${customerToDelete.fullName} (${customerToDelete.username}) kullanıcısı ve ilişkili ${customerAccounts.length} banka hesabı sistemden kalıcı olarak silindi.`,
        userId: '2', // Staff ID
        userRole: 'staff',
        date: new Date().toISOString()
      });

      setToastMessage(t('customer_deleted_success', 'Müşteri ve ilişkili tüm hesapları başarıyla silindi.'));
      setToastType('success');
      setToastOpen(true);
      setCustomerToDelete(null);
      fetchCustomers();
    } catch (err) {
      setToastMessage(t('customer_delete_error', 'Müşteri silinirken bir sorun oluştu.'));
      setToastType('danger');
      setToastOpen(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phoneNumber?.includes(search)
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Notification */}
      <div className="fixed bottom-6 right-6 z-50">
        <Toast
          message={toastMessage}
          type={toastType}
          isOpen={toastOpen}
          onClose={() => setToastOpen(false)}
        />
      </div>

      <PageHeader
        title={t('customer_management', 'Müşteri Yönetimi')}
        description={t('customer_management_desc', 'Bankamıza kayıtlı tüm müşterilerin listesini inceleyin, durumlarını aktif/bloke olarak güncelleyin.')}
      />

      <div className="flex justify-between items-center gap-4">
        <SearchBox
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('customer_search_placeholder', 'Müşteri adı, e-posta veya telefon ile arayın...')}
          className="max-w-md"
        />
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-brand-border bg-white/[0.005]">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-12 text-center text-xs text-brand-textMuted font-bold">
            {t('no_customers_found', 'Kayıtlı müşteri bulunamadı.')}
          </div>
        ) : (
          <Table
            headers={[
              t('customer_name', 'Müşteri Adı'),
              t('username', 'Kullanıcı Adı'),
              t('email', 'E-posta'),
              t('phone', 'Telefon'),
              t('status', 'Durum'),
              t('actions', 'İşlemler')
            ]}
          >
            {filteredCustomers.map((c) => (
              <tr key={c.id} className="text-xs text-brand-textPrimary font-semibold">
                <td className="px-4 py-4">{c.fullName}</td>
                <td className="px-4 py-4 font-mono">{c.username}</td>
                <td className="px-4 py-4">{c.email}</td>
                <td className="px-4 py-4 font-mono">{c.phoneNumber}</td>
                <td className="px-4 py-4">
                  <Badge variant={c.status === 'blocked' ? 'danger' : 'success'}>
                    {c.status === 'blocked' ? t('blocked', 'Bloke') : t('active', 'Aktif')}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="danger"
                      size="sm"
                      className="py-1 px-2.5 text-[10px] flex items-center gap-1"
                      onClick={() => setCustomerToDelete(c)}
                    >
                      <Trash2 size={12} />
                      {t('delete', 'Sil')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>



      {/* Delete Customer Confirmation Modal */}
      <Modal
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        title={t('delete_customer', 'Müşteriyi Sil')}
      >
        <div className="flex flex-col gap-4 text-left">
          <p className="text-sm text-brand-textPrimary leading-relaxed">
            {t('delete_customer_confirm', '[name] adlı müşteriyi ve tüm banka hesaplarını kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')
              .replace('[name]', customerToDelete?.fullName || '')}
          </p>
          <div className="flex justify-end gap-3 mt-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setCustomerToDelete(null)}
              disabled={deleteLoading}
            >
              {t('cancel', 'İptal')}
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              onClick={handleDeleteCustomerConfirm}
              loading={deleteLoading}
            >
              {t('delete', 'Sil')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StaffDashboard;
