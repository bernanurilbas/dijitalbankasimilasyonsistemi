import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const TransferSummary = ({ 
  data, 
  accounts = [], 
  onConfirm, 
  onCancel,
  loading 
}) => {
  const { senderAccountId, recipientIban, recipientName, amount, description } = data;

  const senderAccount = accounts.find(a => a.id === senderAccountId);
  
  // Decide transfer type and fees
  const cleanIban = recipientIban.replace(/\s+/g, '');
  // Astra bank prefix check
  const isAstraBank = cleanIban.startsWith('TR9800062000000010001000') || cleanIban.includes('100010005001');
  const type = isAstraBank ? 'HAVALE' : (amount <= 5000 ? 'FAST' : 'EFT');
  const fee = isAstraBank ? 0.00 : (type === 'FAST' ? 2.50 : 5.00);

  const formatCurrency = (val, cur = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: cur }).format(val);
  };

  const totalDebit = parseFloat(amount) + fee;

  return (
    <Card title="Transfer Detay Onayı" subtitle="Lütfen gönderim bilgilerinizi kontrol edin">
      <div className="flex flex-col gap-5 text-sm text-left">
        
        {/* Info Rows */}
        <div className="flex flex-col gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          
          {/* Sender */}
          <div className="flex justify-between items-start border-b border-white/5 pb-3">
            <div>
              <span className="text-[10px] text-brand-textMuted uppercase font-bold tracking-wider block">Gönderen Hesap</span>
              <span className="font-bold text-brand-textPrimary">{senderAccount?.name}</span>
              <span className="text-xs text-brand-textSecondary block font-mono mt-0.5">{senderAccount?.iban}</span>
            </div>
            <span className="font-extrabold text-brand-textPrimary mt-1">
              {formatCurrency(senderAccount?.balance, senderAccount?.currency)}
            </span>
          </div>

          {/* Recipient */}
          <div className="flex justify-between items-start border-b border-white/5 pb-3">
            <div>
              <span className="text-[10px] text-brand-textMuted uppercase font-bold tracking-wider block">Alıcı Hesap</span>
              <span className="font-bold text-brand-textPrimary">{recipientName}</span>
              <span className="text-xs text-brand-textSecondary block font-mono mt-0.5">{recipientIban}</span>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-brand-textMuted uppercase font-bold tracking-wider block">Transfer Türü</span>
              <span className="font-bold text-brand-primary">{type}</span>
            </div>
            <div>
              <span className="text-[10px] text-brand-textMuted uppercase font-bold tracking-wider block">Açıklama</span>
              <span className="font-semibold text-brand-textPrimary truncate block">{description || 'Para Transferi'}</span>
            </div>
          </div>

        </div>

        {/* Fees Breakdowns */}
        <div className="flex flex-col gap-2 px-1">
          <div className="flex justify-between text-xs font-semibold text-brand-textSecondary">
            <span>Gönderilecek Tutar:</span>
            <span>{formatCurrency(amount, senderAccount?.currency)}</span>
          </div>
          <div className="flex justify-between text-xs font-semibold text-brand-textSecondary">
            <span>İşlem Masrafı:</span>
            <span>{fee === 0 ? 'Ücretsiz' : formatCurrency(fee)}</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-brand-textPrimary border-t border-white/5 pt-3 mt-1">
            <span>Toplam Çekilecek Tutar:</span>
            <span className="text-brand-primary">{formatCurrency(totalDebit, senderAccount?.currency)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-4">
          <Button variant="secondary" size="md" onClick={onCancel} disabled={loading}>
            Geri Dön
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            loading={loading}
            onClick={() => onConfirm({ type, fee })}
          >
            Gönderimi Onayla
          </Button>
        </div>

      </div>
    </Card>
  );
};

export default TransferSummary;
