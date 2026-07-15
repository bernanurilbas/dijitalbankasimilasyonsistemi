import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ReceiverInput from './ReceiverInput';
import AmountInput from './AmountInput';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { QrCode, Receipt } from 'lucide-react';

const schema = yup.object().shape({
  senderAccountId: yup.string().required('Gönderici hesap seçimi zorunludur.'),
  recipientIban: yup.string()
    .required('IBAN zorunludur.')
    .transform(value => value.replace(/\s+/g, ''))
    .length(26, 'IBAN uzunluğu 26 karakter olmalıdır.')
    .test('starts-tr', 'IBAN "TR" ile başlamalıdır.', val => val?.toUpperCase().startsWith('TR')),
  recipientName: yup.string()
    .required('Alıcı Ad Soyad alanı zorunludur.')
    .min(3, 'En az 3 karakter girilmelidir.'),
  amount: yup.number()
    .required('Tutar zorunludur.')
    .typeError('Lütfen sayısal bir tutar girin.')
    .positive('Tutar sıfırdan büyük olmalıdır.'),
  description: yup.string(),
});

const TransferForm = ({ accounts = [], onSubmit }) => {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      senderAccountId: accounts[0]?.id || '',
      recipientIban: '',
      recipientName: '',
      amount: '',
      description: '',
    }
  });

  const selectedAccountId = watch('senderAccountId');

  // Sync default value if accounts load late
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setValue('senderAccountId', accounts[0].id);
    }
  }, [accounts, selectedAccountId, setValue]);

  // Mock QRs list for simulator
  const mockQrs = [
    { name: 'Ahmet Yılmaz (Astra Bank - Havale)', iban: 'TR98 0006 2000 0000 1000 1000 5001' },
    { name: 'Zeynep Kaya (Diğer Banka - EFT/FAST)', iban: 'TR98 0006 2000 0000 9999 9999 9999' }
  ];

  const handleQrSelect = (qr) => {
    setValue('recipientIban', qr.iban);
    setValue('recipientName', qr.name.split(' (')[0]);
    setIsQrModalOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 text-left">
        
        {/* Recipient details */}
        <ReceiverInput
          register={register}
          errors={errors}
          onQrScan={() => setIsQrModalOpen(true)}
        />

        {/* Sender account & Amount */}
        <AmountInput
          register={register}
          errors={errors}
          accounts={accounts}
          selectedAccountId={selectedAccountId}
        />

        {/* Description field */}
        <Input
          label="Açıklama (İsteğe Bağlı)"
          id="description"
          placeholder="Örn: Kira Ödemesi, Alışveriş..."
          icon={Receipt}
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Submit */}
        <Button type="submit" variant="primary" className="w-full mt-2 py-3">
          Devam Et (İşlem Özeti)
        </Button>

      </form>

      {/* QR Code Simulation Modal */}
      <Modal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        title="QR Kod Simülatörü"
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-brand-textSecondary leading-relaxed">
            Bankacılık uygulamasında kamerayla taranmış bir alıcı QR kodunu simüle etmek için aşağıdaki alıcılardan birini seçebilirsiniz:
          </p>

          <div className="flex flex-col gap-2">
            {mockQrs.map((qr, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQrSelect(qr)}
                className="p-3 text-left border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] rounded-lg transition-colors flex items-center gap-3"
              >
                <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg">
                  <QrCode size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-brand-textPrimary block">{qr.name}</span>
                  <span className="text-[10px] text-brand-textMuted font-mono block mt-0.5">{qr.iban}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TransferForm;
