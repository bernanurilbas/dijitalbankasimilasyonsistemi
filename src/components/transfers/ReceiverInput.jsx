import React from 'react';
import { User, QrCode } from 'lucide-react';
import Input from '../ui/Input';

const ReceiverInput = ({ register, errors, onQrScan }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-xs font-bold text-brand-textPrimary uppercase tracking-wider">Alıcı Bilgileri</h4>
        <button
          type="button"
          onClick={onQrScan}
          className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1.5 focus:outline-none"
          title="Hazır QR Kod Kodlarını Simüle Et"
        >
          <QrCode size={16} />
          QR Kod Simülatörü
        </button>
      </div>

      <Input
        label="Alıcı IBAN"
        id="recipientIban"
        placeholder="TR00 0000 0000 0000 0000 0000 00"
        maxLength={32}
        error={errors.recipientIban?.message}
        {...register('recipientIban', {
          onChange: (e) => {
            const val = e.target.value;
            // Keep only alphanumeric characters and uppercase them
            const cleaned = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            
            // Format to: TRxx xxxx xxxx xxxx xxxx xxxx xx
            let formatted = '';
            for (let i = 0; i < cleaned.length; i++) {
              if (i > 0 && i % 4 === 0) {
                formatted += ' ';
              }
              formatted += cleaned[i];
            }
            e.target.value = formatted.slice(0, 32);
          }
        })}
      />

      <Input
        label="Alıcı Adı Soyadı"
        id="recipientName"
        placeholder="Alıcının tam adını girin"
        icon={User}
        error={errors.recipientName?.message}
        {...register('recipientName')}
      />
    </div>
  );
};

export default ReceiverInput;
