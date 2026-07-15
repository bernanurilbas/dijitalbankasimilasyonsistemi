import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import { MessageSquare, Plus, Send } from 'lucide-react';

const Support = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  
  // Data states
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New ticket form states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Selected ticket and reply states
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  // Toast states
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchTickets = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await api.get(`/supportTickets?userId=${user.id}&_sort=createdAt&_order=desc`);
      setTickets(response.data);
    } catch (err) {
      setToastMessage(t('tickets_load_error', 'Destek talepleri yüklenemedi.'));
      setToastType('danger');
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  // Handle creating a new support ticket
  const handleCreateTicketSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    setCreateLoading(true);
    const newTicket = {
      userId: user.id,
      title: newTitle.trim(),
      message: newMessage.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
      responses: [],
      unreadByStaff: true,
      unreadByCustomer: false
    };

    try {
      await api.post('/supportTickets', newTicket);

      // Post system log
      await api.post('/systemLogs', {
        message: `${user.fullName} (${user.username}) yeni destek talebi oluşturdu: ${newTitle.trim()}`,
        userId: user.id,
        userRole: 'customer',
        date: new Date().toISOString()
      });

      setToastMessage(t('ticket_create_success', 'Destek talebiniz başarıyla oluşturuldu.'));
      setToastType('success');
      setToastOpen(true);

      setIsCreateOpen(false);
      setNewTitle('');
      setNewMessage('');
      fetchTickets();
    } catch (err) {
      setToastMessage(t('ticket_create_error', 'Destek talebi oluşturulurken hata oluştu.'));
      setToastType('danger');
      setToastOpen(true);
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle customer reply/message within a ticket
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    setReplyLoading(true);
    const newResponse = {
      sender: 'customer',
      message: replyText.trim(),
      date: new Date().toISOString()
    };
    const updatedResponses = [...selectedTicket.responses, newResponse];

    try {
      // 1. Update ticket responses & set status to 'open' (waiting for staff)
      const response = await api.patch(`/supportTickets/${selectedTicket.id}`, {
        status: 'open',
        responses: updatedResponses,
        unreadByStaff: true,
        unreadByCustomer: false
      });

      // 2. Post system log
      await api.post('/systemLogs', {
        message: `${user.fullName} (${user.username}) destek talebine yanıt gönderdi (ID: ${selectedTicket.id}).`,
        userId: user.id,
        userRole: 'customer',
        date: new Date().toISOString()
      });

      setToastMessage(t('message_sent_success', 'Mesajınız başarıyla iletildi.'));
      setToastType('success');
      setToastOpen(true);

      setReplyText('');
      setSelectedTicket(response.data); // Update modal thread
      fetchTickets(); // Refresh background list
    } catch (err) {
      setToastMessage(t('message_sent_error', 'Mesaj gönderilirken hata oluştu.'));
      setToastType('danger');
      setToastOpen(true);
    } finally {
      setReplyLoading(false);
    }
  };

  const handleOpenTicket = async (tkt) => {
    setSelectedTicket(tkt);
    
    // Mark as read by customer immediately if it was unread
    if (tkt.unreadByCustomer) {
      try {
        await api.patch(`/supportTickets/${tkt.id}`, { unreadByCustomer: false });
        setTickets(prev => prev.map(item => item.id === tkt.id ? { ...item, unreadByCustomer: false } : item));
      } catch (err) {
        console.error('Failed to update unread status', err);
      }
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
        title={t('support_requests', 'Destek Talepleri')}
        description={t('support_desc_customer', 'Banka temsilcilerimizle anlık mesajlaşın, sorularınızı veya sorunlarınızı iletin.')}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus size={16} className="mr-1.5" />
            {t('new_request', 'Yeni Talep Oluştur')}
          </Button>
        }
      />

      <div className="glass-panel p-6 rounded-2xl border border-brand-border bg-white/[0.005]">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-12 text-center text-xs text-brand-textMuted font-bold">
            {t('no_tickets_found', 'Kayıtlı destek talebi bulunamadı.')}
          </div>
        ) : (
          <Table
            headers={[
              t('ticket_title', 'Talep Başlığı'),
              t('ticket_date', 'Tarih'),
              t('ticket_status', 'Talep Durumu'),
              t('actions', 'İşlemler')
            ]}
          >
            {tickets.map((tkt) => (
              <tr key={tkt.id} className="text-xs text-brand-textPrimary font-semibold">
                <td className="px-4 py-4 truncate max-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span>{tkt.title}</span>
                    {tkt.unreadByCustomer && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.6)] shrink-0" />
                    )}
                  </div>
                </td>
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
                    {t('inspect', 'İncele / Mesajlaş')}
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      {/* New Support Ticket Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={t('new_request', 'Yeni Destek Talebi')}
      >
        <form onSubmit={handleCreateTicketSubmit} className="flex flex-col gap-4">
          <Input
            label={t('ticket_title', 'Talep Başlığı')}
            placeholder="Örn: Limit Artışı Talebi"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-bold text-brand-textPrimary block mb-1.5">
              {t('ticket_message', 'Açıklama / Mesaj')}
            </label>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Sorunuzu detaylı bir şekilde yazın..."
              rows={4}
              className="w-full bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-xs text-brand-textPrimary placeholder-brand-textMuted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
              required
            />
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <Button variant="secondary" size="sm" onClick={() => setIsCreateOpen(false)}>
              {t('cancel', 'İptal')}
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={createLoading}>
              {t('confirm', 'Oluştur')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Ticket Details & Chat Modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket ? selectedTicket.title : ''}
        size="lg"
      >
        {selectedTicket && (
          <div className="flex flex-col gap-6 text-left">
            
            {/* Initial Request Card */}
            <div className="p-4 rounded-xl border border-brand-border bg-white/[0.01]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] text-brand-textMuted font-bold uppercase tracking-wider block">
                  {t('my_request', 'İlk Talebim')}
                </span>
                <span className="text-[10px] text-brand-textMuted font-mono">
                  {new Date(selectedTicket.createdAt).toLocaleString('tr-TR')}
                </span>
              </div>
              <p className="text-xs text-brand-textSecondary leading-relaxed bg-white/[0.005] p-3 rounded-lg border border-white/5">
                {selectedTicket.message}
              </p>
            </div>

            {/* Conversation History / Chat bubbles */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-brand-textMuted font-bold uppercase tracking-wider block">
                {t('conversation', 'Yazışmalar')}
              </span>
              
              <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1">
                {selectedTicket.responses && selectedTicket.responses.length > 0 ? (
                  selectedTicket.responses.map((resp, index) => {
                    const isStaff = resp.sender === 'staff';
                    return (
                      <div 
                        key={index}
                        className={`p-3 rounded-xl border max-w-[85%] ${isStaff ? 'mr-auto bg-white/[0.01] border-brand-border' : 'ml-auto bg-brand-primary/5 border-brand-primary/10 text-right'}`}
                      >
                        <span className="text-[8px] text-brand-textMuted font-mono block mb-1">
                          {isStaff ? t('staff', 'Banka Görevlisi') : t('my_message', 'Ben')} • {new Date(resp.date).toLocaleString('tr-TR')}
                        </span>
                        <p className="text-xs text-brand-textSecondary leading-relaxed">{resp.message}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-[10px] text-brand-textMuted py-4 font-bold">
                    {t('waiting_for_staff', 'Talebiniz alınmıştır, banka temsilcisi yanıtı bekleniyor.')}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendReply} className="flex flex-col gap-4 border-t border-brand-border pt-4">
              <div>
                <label className="text-xs font-bold text-brand-textPrimary block mb-1.5">
                  {t('write_message', 'Yeni Mesaj')}
                </label>
                <div className="flex gap-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={t('write_response_placeholder', 'Mesajınızı buraya yazın...')}
                    rows={2}
                    className="flex-1 bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-xs text-brand-textPrimary placeholder-brand-textMuted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
                    required
                  />
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="sm" 
                    className="px-4 shrink-0 flex items-center justify-center gap-1.5"
                    loading={replyLoading}
                  >
                    <Send size={14} />
                  </Button>
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <Button variant="secondary" size="sm" onClick={() => setSelectedTicket(null)}>
                  {t('close', 'Kapat')}
                </Button>
              </div>
            </form>

          </div>
        )}
      </Modal>
    </div>
  );
};

export default Support;
