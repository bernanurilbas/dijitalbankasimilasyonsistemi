import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PageHeader from '../../components/layout/PageHeader';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import Spinner from '../../components/ui/Spinner';
import { useTranslation } from '../../hooks/useTranslation';
import { MessageSquare, CheckCircle, Clock } from 'lucide-react';

const SupportTickets = () => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, open, resolved
  
  // Selected ticket and reply states
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  // Toast states
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsRes, usersRes] = await Promise.all([
        api.get('/supportTickets?_sort=createdAt&_order=desc'),
        api.get('/users?role=customer')
      ]);
      setTickets(ticketsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setToastMessage(t('tickets_load_error', 'Destek talepleri yüklenemedi.'));
      setToastType('danger');
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTicket = async (tkt) => {
    setSelectedTicket(tkt);
    
    // Mark as read by staff immediately if it was unread
    if (tkt.unreadByStaff) {
      try {
        await api.patch(`/supportTickets/${tkt.id}`, { unreadByStaff: false });
        setTickets(prev => prev.map(item => item.id === tkt.id ? { ...item, unreadByStaff: false } : item));
      } catch (err) {
        console.error('Failed to update unread status', err);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendResponse = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    
    setReplyLoading(true);
    const newResponse = {
      sender: 'staff',
      message: replyText.trim(),
      date: new Date().toISOString()
    };
    const updatedResponses = [...selectedTicket.responses, newResponse];

    try {
      // 1. Update ticket in database
      const response = await api.patch(`/supportTickets/${selectedTicket.id}`, {
        status: 'resolved',
        responses: updatedResponses,
        unreadByCustomer: true,
        unreadByStaff: false
      });

      // 2. Post system log
      await api.post('/systemLogs', {
        message: `${selectedTicket.id} nolu destek talebine yanıt gönderildi ve çözümlendi.`,
        userId: '2', // Staff Elif Demir ID
        userRole: 'staff',
        date: new Date().toISOString()
      });

      setToastMessage(t('ticket_resolved_success', 'Destek talebi başarıyla yanıtlandı.'));
      setToastType('success');
      setToastOpen(true);
      
      setReplyText('');
      setSelectedTicket(response.data); // Update modal view
      fetchData(); // Refresh list in background
    } catch (err) {
      setToastMessage(t('ticket_resolve_error', 'Destek talebi yanıtlanırken hata oluştu.'));
      setToastType('danger');
      setToastOpen(true);
    } finally {
      setReplyLoading(false);
    }
  };

  const getUserName = (userId) => {
    const found = users.find(u => u.id === userId);
    return found ? found.fullName : `Müşteri (ID: ${userId})`;
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'open') return ticket.status === 'open';
    if (filter === 'resolved') return ticket.status === 'resolved';
    return true;
  });

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
        title={t('support_management', 'Destek Talepleri Yönetimi')}
        description={t('support_management_desc', 'Müşterilerinizden gelen destek taleplerini inceleyin ve anında yanıtlayarak çözüme kavuşturun.')}
      />

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${filter === 'all' ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white/[0.01] border-brand-border text-brand-textSecondary hover:bg-white/5'}`}
        >
          {t('all', 'Tümü')}
        </button>
        <button
          onClick={() => setFilter('open')}
          className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${filter === 'open' ? 'bg-brand-warning border-brand-warning text-white' : 'bg-white/[0.01] border-brand-border text-brand-textSecondary hover:bg-white/5'}`}
        >
          {t('open', 'Açık')}
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${filter === 'resolved' ? 'bg-brand-success border-brand-success text-white' : 'bg-white/[0.01] border-brand-border text-brand-textSecondary hover:bg-white/5'}`}
        >
          {t('resolved', 'Çözüldü')}
        </button>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-brand-border bg-white/[0.005]">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-12 text-center text-xs text-brand-textMuted font-bold">
            {t('no_tickets_found', 'Kayıtlı destek talebi bulunamadı.')}
          </div>
        ) : (
          <Table
            headers={[
              t('ticket_title', 'Talep Başlığı'),
              t('customer', 'Müşteri'),
              t('ticket_date', 'Tarih'),
              t('ticket_status', 'Talep Durumu'),
              t('actions', 'İşlemler')
            ]}
          >
            {filteredTickets.map((tkt) => (
              <tr key={tkt.id} className="text-xs text-brand-textPrimary font-semibold">
                <td className="px-4 py-4 truncate max-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span>{tkt.title}</span>
                    {tkt.unreadByStaff && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.6)] shrink-0" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">{getUserName(tkt.userId)}</td>
                <td className="px-4 py-4 font-mono">{new Date(tkt.createdAt).toLocaleDateString('tr-TR')}</td>
                <td className="px-4 py-4">
                  <Badge variant={tkt.status === 'resolved' ? 'success' : 'warning'}>
                    {tkt.status === 'resolved' ? t('resolved', 'Çözüldü') : t('open', 'Açık')}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="py-1 px-2.5 text-[10px] flex items-center gap-1"
                    onClick={() => handleOpenTicket(tkt)}
                  >
                    <MessageSquare size={12} />
                    {t('inspect', 'İncele')}
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      {/* Ticket Details & Response Modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket ? selectedTicket.title : ''}
        size="lg"
      >
        {selectedTicket && (
          <div className="flex flex-col gap-6 text-left">
            
            {/* Customer Message Card */}
            <div className="p-4 rounded-xl border border-brand-border bg-white/[0.01]">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] text-brand-textMuted font-bold uppercase tracking-wider block">{t('customer', 'Müşteri')}</span>
                  <span className="text-xs font-extrabold text-brand-textPrimary">{getUserName(selectedTicket.userId)}</span>
                </div>
                <span className="text-[10px] text-brand-textMuted font-mono">
                  {new Date(selectedTicket.createdAt).toLocaleString('tr-TR')}
                </span>
              </div>
              <p className="text-xs text-brand-textSecondary leading-relaxed bg-white/[0.005] p-3 rounded-lg border border-white/5">
                {selectedTicket.message}
              </p>
            </div>

            {/* Conversation History */}
            {selectedTicket.responses && selectedTicket.responses.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-[10px] text-brand-textMuted font-bold uppercase tracking-wider block">
                  {t('history', 'Geçmiş Yanıtlar')}
                </span>
                <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-1">
                  {selectedTicket.responses.map((resp, index) => {
                    const isStaff = resp.sender === 'staff';
                    return (
                      <div 
                        key={index}
                        className={`p-3 rounded-xl border max-w-[85%] ${isStaff ? 'ml-auto bg-brand-primary/5 border-brand-primary/10 text-right' : 'mr-auto bg-white/[0.01] border-brand-border'}`}
                      >
                        <span className="text-[8px] text-brand-textMuted font-mono block mb-1">
                          {isStaff ? t('staff', 'Banka Görevlisi') : t('customer', 'Müşteri')} • {new Date(resp.date).toLocaleString('tr-TR')}
                        </span>
                        <p className="text-xs text-brand-textSecondary leading-relaxed">{resp.message}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reply Form */}
            <form onSubmit={handleSendResponse} className="flex flex-col gap-4 border-t border-brand-border pt-4">
              <div>
                <label className="text-xs font-bold text-brand-textPrimary block mb-1.5">
                  {t('response', 'Yanıtınız')}
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t('write_response_placeholder', 'Yanıtınızı buraya yazın...')}
                  rows={3}
                  className="w-full bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-xs text-brand-textPrimary placeholder-brand-textMuted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="secondary" size="sm" onClick={() => setSelectedTicket(null)}>
                  {t('close', 'Kapat')}
                </Button>
                <Button type="submit" variant="primary" size="sm" loading={replyLoading}>
                  {t('send_response', 'Yanıt Gönder')}
                </Button>
              </div>
            </form>

          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupportTickets;
