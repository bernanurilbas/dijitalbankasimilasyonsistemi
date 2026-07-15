import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PageHeader from '../../components/layout/PageHeader';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Toast from '../../components/ui/Toast';
import { useTranslation } from '../../hooks/useTranslation';
import { Users, Shield, Terminal, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customersCount: 0,
    staffCount: 0,
    maintenanceMode: false
  });
  const [logs, setLogs] = useState([]);
  
  // Toast states
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [customersRes, staffRes, settingsRes, logsRes] = await Promise.all([
        api.get('/users?role=customer'),
        api.get('/users?role=staff'),
        api.get('/systemSettings'),
        api.get('/systemLogs?_sort=date&_order=desc&_limit=10')
      ]);

      setStats({
        customersCount: customersRes.data.length,
        staffCount: staffRes.data.length,
        maintenanceMode: settingsRes.data?.maintenanceMode || false
      });
      setLogs(logsRes.data);
    } catch (err) {
      setToastMessage(t('dashboard_load_error', 'Gösterge paneli verileri yüklenemedi.'));
      setToastType('danger');
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
        title={t('admin_dashboard_title', 'Sistem Özeti / Yönetim')}
        description={t('admin_dashboard_desc', 'Banka simülasyon sisteminin genel durumunu, aktif kullanıcıları ve en son sistem günlüklerini buradan izleyin.')}
      />

      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Total Customers */}
            <div className="p-6 rounded-2xl border border-brand-border bg-white/[0.005] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-brand-textMuted uppercase font-bold tracking-wider block mb-1">
                  {t('total_customers', 'Toplam Müşteri')}
                </span>
                <span className="text-3xl font-extrabold text-brand-textPrimary">
                  {stats.customersCount}
                </span>
              </div>
              <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
                <Users size={24} />
              </div>
            </div>

            {/* Total Staff */}
            <div className="p-6 rounded-2xl border border-brand-border bg-white/[0.005] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-brand-textMuted uppercase font-bold tracking-wider block mb-1">
                  {t('total_staff', 'Toplam Personel')}
                </span>
                <span className="text-3xl font-extrabold text-brand-textPrimary">
                  {stats.staffCount}
                </span>
              </div>
              <div className="p-3 bg-brand-gold/10 rounded-xl text-brand-gold">
                <Shield size={24} />
              </div>
            </div>

            {/* Maintenance Mode Status */}
            <div className="p-6 rounded-2xl border border-brand-border bg-white/[0.005] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-brand-textMuted uppercase font-bold tracking-wider block mb-1">
                  {t('maintenance_mode', 'Bakım Modu')}
                </span>
                <span className="text-lg font-extrabold block mt-2">
                  <Badge variant={stats.maintenanceMode ? 'danger' : 'success'}>
                    {stats.maintenanceMode ? t('active_state', 'Aktif') : t('inactive_state', 'Aktif Değil')}
                  </Badge>
                </span>
              </div>
              <div className="p-3 bg-brand-danger/10 rounded-xl text-brand-danger">
                <Settings size={24} />
              </div>
            </div>
          </div>

          {/* Recent System Logs */}
          <div className="glass-panel p-6 rounded-2xl border border-brand-border bg-white/[0.005] flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-brand-border pb-4">
              <Terminal size={18} className="text-brand-primary" />
              <h3 className="text-sm font-extrabold text-brand-textPrimary tracking-wide">
                {t('recent_system_logs', 'Son Sistem Günlükleri')}
              </h3>
            </div>

            {logs.length === 0 ? (
              <div className="py-8 text-center text-xs text-brand-textMuted font-bold">
                {t('no_logs_found', 'Kayıtlı sistem günlüğü bulunamadı.')}
              </div>
            ) : (
              <Table
                headers={[
                  t('log_message', 'İşlem Detayı'),
                  t('log_user_role', 'Kullanıcı Rolü'),
                  t('log_date', 'Tarih')
                ]}
              >
                {logs.map((log) => (
                  <tr key={log.id} className="text-xs text-brand-textPrimary font-semibold">
                    <td className="px-4 py-3.5 leading-relaxed">{log.message}</td>
                    <td className="px-4 py-3.5">
                      <Badge 
                        variant={
                          log.userRole === 'admin' 
                            ? 'danger' 
                            : log.userRole === 'staff' 
                            ? 'warning' 
                            : 'info'
                        }
                      >
                        {log.userRole?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-brand-textSecondary text-[10px]">
                      {new Date(log.date).toLocaleString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
