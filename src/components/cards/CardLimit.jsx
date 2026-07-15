import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Sliders } from 'lucide-react';

const CardLimit = ({ 
  card, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [limitVal, setLimitVal] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (card) {
      setLimitVal(String(card.limit));
      setError('');
    }
  }, [card, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numericLimit = parseFloat(limitVal);
    if (isNaN(numericLimit) || numericLimit < 0) {
      setError('Lütfen geçerli bir limit tutarı girin.');
      return;
    }

    if (numericLimit > 250000) {
      setError('Maksimum günlük alışveriş limiti 250.000 TL olabilir.');
      return;
    }

    setLoading(true);
    try {
      await onSave(card.id, numericLimit);
      onClose();
    } catch (err) {
      setError('Limit güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kart Harcama Limiti Güncelle"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-xs text-brand-textSecondary leading-relaxed">
          Kartınızın günlük/aylık internet ve fiziki mağaza harcama limitini güncelleyebilirsiniz. Limit anında devreye girer.
        </p>

        <Input
          type="number"
          label="Yeni Harcama Limiti (TL)"
          placeholder="5000"
          icon={Sliders}
          value={limitVal}
          onChange={(e) => setLimitVal(e.target.value)}
          error={error}
        />

        <div className="flex gap-3 justify-end mt-4">
          <Button variant="secondary" size="sm" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={loading}>
            Limiti Güncelle
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CardLimit;
