import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards, toggleFreezeCard, updateCardLimit, createVirtualCard } from '../../store/slices/cardSlice';
import { fetchAccounts } from '../../store/slices/accountSlice';
import PageHeader from '../../components/layout/PageHeader';
import BankCard from '../../components/cards/BankCard';
import VirtualCard from '../../components/cards/VirtualCard';
import CardLimit from '../../components/cards/CardLimit';
import CardSettings from '../../components/cards/CardSettings';
import CardTransactionList from '../../components/cards/CardTransactionList';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import api from '../../services/api';
import { Plus, CreditCard } from 'lucide-react';

const Cards = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cards, loading } = useSelector((state) => state.cards);
  const { accounts } = useSelector((state) => state.accounts);

  // Selected Card for Modals
  const [activeCard, setActiveCard] = useState(null);

  // Modal Open/Close states
  const [isLimitOpen, setIsLimitOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTxOpen, setIsTxOpen] = useState(false);
  const [isCreateVirtualOpen, setIsCreateVirtualOpen] = useState(false);

  // Virtual Card Form State
  const [virtualName, setVirtualName] = useState('');
  const [virtualLimit, setVirtualLimit] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Toast State
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCards(user.id));
      dispatch(fetchAccounts(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      // Pre-select first account (preferably TRY)
      const tryAcc = accounts.find(a => a.currency === 'TRY');
      setSelectedAccountId(tryAcc ? tryAcc.id : accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setToastOpen(true);
  };

  // Actions
  const handleFreezeToggle = async (cardId, isFrozen) => {
    try {
      await dispatch(toggleFreezeCard({ cardId, isFrozen })).unwrap();
      showToast(isFrozen ? 'Kart aktif duruma getirildi.' : 'Kart donduruldu.');
      dispatch(fetchCards(user.id));
    } catch (err) {
      showToast('İşlem gerçekleştirilemedi.', 'danger');
    }
  };

  const handleLimitSave = async (cardId, newLimit) => {
    try {
      await dispatch(updateCardLimit({ cardId, newLimit })).unwrap();
      showToast('Kart harcama limiti güncellendi.');
      dispatch(fetchCards(user.id));
    } catch (err) {
      showToast('Limit güncellenemedi.', 'danger');
      throw err;
    }
  };

  const handleSaveSettings = async (cardId, updatedSettings) => {
    try {
      await api.patch(`/cards/${cardId}`, updatedSettings);
      showToast('Kart tercihleri başarıyla kaydedildi.');
      dispatch(fetchCards(user.id));
    } catch (err) {
      showToast('Ayarlar kaydedilirken sorun oluştu.', 'danger');
      throw err;
    }
  };

  const handleCreateVirtualSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const numericLimit = parseFloat(virtualLimit);
    if (isNaN(numericLimit) || numericLimit <= 0) {
      setFormError('Lütfen geçerli bir limit girin.');
      return;
    }

    // Check account balance
    const bindAccount = accounts.find(a => a.id === selectedAccountId);
    if (bindAccount && bindAccount.balance < numericLimit) {
      setFormError('Sanal kart limiti bağlı hesap bakiyesinden yüksek olamaz.');
      return;
    }

    setCreateLoading(true);
    try {
      await dispatch(createVirtualCard({
        userId: user.id,
        accountId: selectedAccountId,
        name: virtualName.trim() || 'Sanal Kart',
        limit: numericLimit
      })).unwrap();

      showToast('Sanal kartınız başarıyla oluşturuldu.');
      setIsCreateVirtualOpen(false);
      setVirtualName('');
      setVirtualLimit('');
      dispatch(fetchCards(user.id));
    } catch (err) {
      setFormError('Sanal kart oluşturulamadı.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Divide cards into physical and virtual
  const physicalCards = cards.filter(c => c.type !== 'virtual');
  const virtualCards = cards.filter(c => c.type === 'virtual');

  return (
    <div className="flex flex-col gap-6">
      
      {/* Toast popup */}
      <div className="fixed bottom-6 right-6 z-50">
        <Toast
          message={toastMsg}
          type={toastType}
          isOpen={toastOpen}
          onClose={() => setToastOpen(false)}
        />
      </div>

      {/* Header */}
      <PageHeader 
        title="Kartlarım" 
        description="Fiziksel banka kartlarınızı kontrol edin, harcama limitlerini yönetin ve anında güvenli sanal kart oluşturun."
        actions={
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsCreateVirtualOpen(true)}
          >
            <Plus size={16} className="mr-1.5" />
            Sanal Kart Oluştur
          </Button>
        }
      />

      {/* Physical Cards Row */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-extrabold text-brand-textPrimary tracking-wide uppercase">Banka Kartlarım</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="h-64 animate-pulse bg-white/[0.03] border border-white/5 rounded-2xl" />
          ) : physicalCards.length === 0 ? (
            <div className="text-xs text-brand-textMuted py-4 font-semibold">Aktif fiziksel kartınız bulunmamaktadır.</div>
          ) : (
            physicalCards.map((card) => (
              <BankCard
                key={card.id}
                card={card}
                onFreeze={handleFreezeToggle}
                onLimitChange={(c) => {
                  setActiveCard(c);
                  setIsLimitOpen(true);
                }}
                onViewTransactions={(c) => {
                  setActiveCard(c);
                  setIsTxOpen(true);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Virtual Cards Row */}
      <div className="flex flex-col gap-3 mt-6">
        <h3 className="text-sm font-extrabold text-brand-textPrimary tracking-wide uppercase">Sanal Kartlarım</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="h-64 animate-pulse bg-white/[0.03] border border-white/5 rounded-2xl" />
          ) : virtualCards.length === 0 ? (
            <div className="text-xs text-brand-textMuted py-4 font-semibold">
              Kayıtlı aktif sanal kartınız bulunmamaktadır. Sağ üstten anında oluşturabilirsiniz.
            </div>
          ) : (
            virtualCards.map((card) => (
              <VirtualCard
                key={card.id}
                card={card}
                onFreeze={handleFreezeToggle}
                onLimitChange={(c) => {
                  setActiveCard(c);
                  setIsLimitOpen(true);
                }}
                onViewTransactions={(c) => {
                  setActiveCard(c);
                  setIsTxOpen(true);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Card Limit Update Modal */}
      <CardLimit
        card={activeCard}
        isOpen={isLimitOpen}
        onClose={() => setIsLimitOpen(false)}
        onSave={handleLimitSave}
      />

      {/* Card Settings Preferences Modal */}
      <CardSettings
        card={activeCard}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSettings={handleSaveSettings}
      />

      {/* Card Transactions History Modal */}
      <CardTransactionList
        card={activeCard}
        isOpen={isTxOpen}
        onClose={() => setIsTxOpen(false)}
      />

      {/* Create Virtual Card Modal */}
      <Modal
        isOpen={isCreateVirtualOpen}
        onClose={() => setIsCreateVirtualOpen(false)}
        title="Yeni Sanal Kart Oluştur"
      >
        <form onSubmit={handleCreateVirtualSubmit} className="flex flex-col gap-4">
          <p className="text-xs text-brand-textSecondary leading-relaxed">
            Sanal kartlar, internet alışverişlerinizde fiziksel kart bilgilerinizi paylaşmadan güvenle alışveriş yapmanızı sağlar.
          </p>

          <Input
            label="Sanal Kart Adı"
            placeholder="E-Ticaret Alışverişim"
            value={virtualName}
            onChange={(e) => setVirtualName(e.target.value)}
          />

          <Select
            label="Bağlanacak Hesap"
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            options={accounts.map(a => ({
              value: a.id,
              label: `${a.name} (${a.currency} - Bakiye: ${a.balance})`
            }))}
          />

          <Input
            type="number"
            label="Sanal Kart Başlangıç Limiti (TL)"
            placeholder="1500"
            value={virtualLimit}
            onChange={(e) => setVirtualLimit(e.target.value)}
            error={formError}
          />

          <div className="flex gap-3 justify-end mt-4">
            <Button variant="secondary" size="sm" onClick={() => setIsCreateVirtualOpen(false)}>
              İptal
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={createLoading}>
              Kart Oluştur
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Cards;
