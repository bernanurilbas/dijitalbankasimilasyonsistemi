import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PageHeader from '../../components/layout/PageHeader';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import Spinner from '../../components/ui/Spinner';
import { useTranslation } from '../../hooks/useTranslation';
import { Plus, UserMinus, ShieldAlert, ShieldCheck, Eye } from 'lucide-react';

const StaffManagement = () => {
  const { t } = useTranslation();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // New staff modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const [address, setAddress] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  // Delete staff modal states
  const [deleteStaffData, setDeleteStaffData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Inspect staff modal states
  const [inspectStaff, setInspectStaff] = useState(null);
  const [inspectLogs, setInspectLogs] = useState([]);
  const [inspectLogsLoading, setInspectLogsLoading] = useState(false);

  const handleInspectStaff = async (staff) => {
    setInspectStaff(staff);
    setInspectLogsLoading(true);
    setInspectLogs([]);
    try {
      const response = await api.get(`/systemLogs?userId=${staff.id}&_sort=date&_order=desc`);
      setInspectLogs(response.data);
    } catch (err) {
      console.error('Failed to load staff activity logs', err);
    } finally {
      setInspectLogsLoading(false);
    }
  };

  // Toast states
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users?role=staff');
      setStaffList(response.data);
    } catch (err) {
      setToastMessage(t('staff_load_error', 'Personel listesi yüklenemedi.'));
      setToastType('danger');
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !username || !email || !phoneNumber || !password) return;

    setAddLoading(true);
    const newStaff = {
      fullName,
      username,
      email,
      phoneNumber,
      password,
      role: 'staff',
      status: 'active',
      school: school.trim() || t('not_specified', 'Belirtilmedi'),
      address: address.trim() || t('not_specified', 'Belirtilmedi')
    };

    try {
      // 1. Create staff user
      await api.post('/users', newStaff);

      // 2. Post system log
      await api.post('/systemLogs', {
        message: `Yeni personel hesabı oluşturuldu: ${fullName} (${username})`,
        userId: '1', // Admin ID
        userRole: 'admin',
        date: new Date().toISOString()
      });

      setToastMessage(t('staff_created_success', 'Personel hesabı başarıyla oluşturuldu.'));
      setToastType('success');
      setToastOpen(true);

      // Reset & close
      setIsAddOpen(false);
      setFullName('');
      setUsername('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setSchool('');
      setAddress('');
      fetchStaff();
    } catch (err) {
      setToastMessage(t('staff_create_error', 'Personel oluşturulurken hata oluştu.'));
      setToastType('danger');
      setToastOpen(true);
    } finally {
      setAddLoading(false);
    }
  };

  const handleToggleStatus = async (staff) => {
    const nextStatus = staff.status === 'blocked' ? 'active' : 'blocked';
    
    try {
      await api.patch(`/users/${staff.id}`, { status: nextStatus });
      
      await api.post('/systemLogs', {
        message: `${staff.fullName} personelinin hesabı ${nextStatus === 'blocked' ? 'durduruldu (bloke)' : 'etkinleştirildi'}.`,
        userId: '1',
        userRole: 'admin',
        date: new Date().toISOString()
      });

      setToastMessage(t('staff_status_updated', 'Personel durumu başarıyla güncellendi.'));
      setToastType('success');
      setToastOpen(true);
      
      fetchStaff();
    } catch (err) {
      setToastMessage(t('staff_status_update_error', 'Personel durumu güncellenirken bir sorun oluştu.'));
      setToastType('danger');
      setToastOpen(true);
    }
  };

  const handleDeleteStaffConfirm = async () => {
    if (!deleteStaffData) return;
    setDeleteLoading(true);

    try {
      // 1. Delete user
      await api.delete(`/users/${deleteStaffData.id}`);

      // 2. Post system log
      await api.post('/systemLogs', {
        message: `Personel hesabı kalıcı olarak silindi: ${deleteStaffData.fullName} (${deleteStaffData.username})`,
        userId: '1',
        userRole: 'admin',
        date: new Date().toISOString()
      });

      setToastMessage(t('staff_deleted_success', 'Personel hesabı başarıyla silindi.'));
      setToastType('success');
      setToastOpen(true);

      setDeleteStaffData(null);
      fetchStaff();
    } catch (err) {
      setToastMessage(t('staff_delete_error', 'Personel silinirken hata oluştu.'));
      setToastType('danger');
      setToastOpen(true);
    } finally {
      setDeleteLoading(false);
    }
  };

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
        title={t('staff_management_title', 'Personel Yönetimi')}
        description={t('staff_management_desc', 'Banka görevlilerini listeleyin, yeni çalışan ekleyin veya mevcut olanların yetkilerini askıya alın/silin.')}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus size={16} className="mr-1.5" />
            {t('add_new_staff', 'Yeni Görevli Ekle')}
          </Button>
        }
      />

      <div className="glass-panel p-6 rounded-2xl border border-brand-border bg-white/[0.005]">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : staffList.length === 0 ? (
          <div className="py-12 text-center text-xs text-brand-textMuted font-bold">
            {t('no_staff_found', 'Kayıtlı banka görevlisi bulunamadı.')}
          </div>
        ) : (
          <Table
            headers={[
              t('customer_name', 'Ad Soyad'),
              t('username', 'Kullanıcı Adı'),
              t('email', 'E-posta'),
              t('phone', 'Telefon'),
              t('status', 'Durum'),
              t('actions', 'İşlemler')
            ]}
          >
            {staffList.map((s) => (
              <tr key={s.id} className="text-xs text-brand-textPrimary font-semibold">
                <td className="px-4 py-4">{s.fullName}</td>
                <td className="px-4 py-4 font-mono">{s.username}</td>
                <td className="px-4 py-4">{s.email}</td>
                <td className="px-4 py-4 font-mono">{s.phoneNumber}</td>
                <td className="px-4 py-4">
                  <Badge variant={s.status === 'blocked' ? 'danger' : 'success'}>
                    {s.status === 'blocked' ? t('blocked', 'Bloke') : t('active', 'Aktif')}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant={s.status === 'blocked' ? 'success' : 'warning'}
                      size="sm"
                      className="py-1 px-2.5 text-[10px] flex items-center gap-1"
                      onClick={() => handleToggleStatus(s)}
                    >
                      {s.status === 'blocked' ? (
                        <>
                          <ShieldCheck size={12} />
                          {t('unblock', 'Etkinleştir')}
                        </>
                      ) : (
                        <>
                          <ShieldAlert size={12} />
                          {t('block', 'Askıya Al')}
                        </>
                      )}
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      className="py-1 px-2.5 text-[10px] flex items-center gap-1"
                      onClick={() => setDeleteStaffData(s)}
                    >
                      <UserMinus size={12} />
                      {t('delete', 'Sil')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      {/* Add New Staff Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={t('add_new_staff', 'Yeni Görevli Ekle')}
      >
        <form onSubmit={handleAddStaffSubmit} className="flex flex-col gap-4 text-left">
          <Input
            label={t('customer_name', 'Ad Soyad')}
            placeholder="Örn: Elif Demir"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label={t('username', 'Kullanıcı Adı')}
            placeholder="Örn: elifdemir"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input
            type="email"
            label={t('email', 'E-posta')}
            placeholder="Örn: elif@astrabank.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label={t('phone', 'Telefon')}
            placeholder="Örn: +90 555 123 4567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

          <Input
            type="password"
            label={t('password', 'Şifre')}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex gap-3 justify-end mt-4">
            <Button variant="secondary" size="sm" onClick={() => setIsAddOpen(false)}>
              {t('cancel', 'İptal')}
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={addLoading}>
              {t('confirm', 'Ekle')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Custom Confirmation Modal for deletion */}
      <Modal
        isOpen={!!deleteStaffData}
        onClose={() => setDeleteStaffData(null)}
        title={t('delete', 'Personeli Kaldır')}
      >
        <div className="flex flex-col gap-4 text-left">
          <p className="text-xs text-brand-textSecondary leading-relaxed">
            {t('delete_staff_confirm', 'Personeli silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')}
          </p>
          <div className="p-3 bg-brand-danger/10 border border-brand-danger/20 rounded-lg text-brand-danger font-bold text-xs font-mono">
            {deleteStaffData?.fullName} ({deleteStaffData?.username})
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" size="sm" onClick={() => setDeleteStaffData(null)}>
              {t('cancel', 'Vazgeç')}
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteStaffConfirm} loading={deleteLoading}>
              {t('confirm_delete', 'Sil')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StaffManagement;
