import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Switch from '../ui/Switch';
import Button from '../ui/Button';
import api from '../../services/api';
import Toast from '../ui/Toast';

const CardSettings = ({ 
  card, 
  isOpen, 
  onClose,
  onSaveSettings 
}) => {
  const [online, setOnline] = useState(true);
  const [abroad, setAbroad] = useState(false);
  const [contactless, setContactless] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (card) {
      setOnline(card.onlineShopping !== false);
      setAbroad(!!card.abroadUsage);
      setContactless(card.contactless !== false);
    }
  }, [card, isOpen]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedSettings = {
        onlineShopping: online,
        abroadUsage: abroad,
        contactless: contactless
      };

      await onSaveSettings(card.id, updatedSettings);
      
      setToastMsg('Kart güvenlik ayarları güncellendi.');
      setToastOpen(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setToastMsg('Ayarlar kaydedilirken hata oluştu.');
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[100]">
        <Toast
          message={toastMsg}
          type="success"
          isOpen={toastOpen}
          onClose={() => setToastOpen(false)}
        />
      </div>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`${card?.name || 'Astra Debit'} - Kart Tercihleri`}
      >
        <div className="flex flex-col gap-5">
          <p className="text-xs text-brand-textSecondary leading-relaxed">
            Kartınızın kullanım limitlerini ve güvenlik ayarlarını dilediğiniz gibi açıp kapatabilirsiniz.
          </p>

          <div className="flex flex-col gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
            <Switch
              label="İnternet Alışveriş Yetkisi"
              checked={online}
              onChange={(e) => setOnline(e.target.checked)}
            />
            <Switch
              label="Yurt Dışı Kullanım Yetkisi"
              checked={abroad}
              onChange={(e) => setAbroad(e.target.checked)}
            />
            <Switch
              label="Temassız Ödeme Özelliği"
              checked={contactless}
              onChange={(e) => setContactless(e.target.checked)}
            />
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Kapat
            </Button>
            <Button variant="primary" size="sm" loading={loading} onClick={handleSave}>
              Ayarları Kaydet
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CardSettings;
