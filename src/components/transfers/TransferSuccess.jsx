import React from 'react';
import { CheckCircle2, Printer, Download, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

const TransferSuccess = ({ 
  receipt, 
  onNewTransfer 
}) => {
  const { referenceNumber, date, senderIban, recipientIban, recipientName, amount, currency, description, type } = receipt;

  const formatCurrency = (val, cur = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: cur }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const textContent = `
==================================================
               ASTRA BANK
            RESMİ İŞLEM DEKONTU (RECEIPT)
==================================================
İşlem Tarihi : ${new Date(date).toLocaleString('tr-TR')}
Referans No  : ${referenceNumber}
İşlem Türü   : ${type}
--------------------------------------------------
GÖNDERİCİ BİLGİLERİ:
IBAN         : ${senderIban}

ALICI BİLGİLERİ:
Adı Soyadı   : ${recipientName}
IBAN         : ${recipientIban}
--------------------------------------------------
TUTAR        : ${formatCurrency(amount, currency)}
AÇIKLAMA     : ${description || 'Para Transferi'}
--------------------------------------------------
Astra Bank A.Ş. tarafından elektronik ortamda
üretilmiştir. Resmi evrak olarak geçerlidir.
==================================================
`;
    const element = document.createElement("a");
    const file = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `dekont-${referenceNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
      
      {/* Visual confirmation card */}
      <div className="glass-panel p-8 rounded-2xl border border-brand-border text-center">
        <div className="inline-flex items-center justify-center bg-brand-success/10 text-brand-success p-4 rounded-full mb-4">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-xl font-extrabold text-brand-textPrimary">Gönderim Başarılı</h2>
        <p className="text-xs text-brand-textSecondary mt-1 leading-relaxed">
          Transfer talebiniz güvenle gerçekleştirilmiş ve hesap bakiyeniz güncellenmiştir.
        </p>

        {/* Printable Receipt Frame */}
        <div 
          id="receipt-printable-frame" 
          className="mt-6 p-5 border border-white/5 rounded-xl bg-white/[0.005] text-left text-xs text-brand-textSecondary flex flex-col gap-3 font-mono"
        >
          <div className="flex justify-between font-sans border-b border-white/5 pb-2 text-[10px] uppercase font-bold text-brand-textMuted tracking-wider">
            <span>Astra Dekont</span>
            <span>{type}</span>
          </div>

          <div className="flex justify-between">
            <span>Referans No:</span>
            <span className="font-bold text-brand-textPrimary select-all">{referenceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>İşlem Tarihi:</span>
            <span className="font-bold text-brand-textPrimary">{new Date(date).toLocaleString('tr-TR')}</span>
          </div>
          <div className="flex justify-between">
            <span>Gönderici IBAN:</span>
            <span className="font-bold text-brand-textPrimary">{senderIban}</span>
          </div>
          <div className="flex justify-between">
            <span>Alıcı Unvan:</span>
            <span className="font-bold text-brand-textPrimary">{recipientName}</span>
          </div>
          <div className="flex justify-between">
            <span>Alıcı IBAN:</span>
            <span className="font-bold text-brand-textPrimary">{recipientIban}</span>
          </div>
          <div className="flex justify-between border-t border-white/5 pt-2 text-sm text-brand-primary font-bold font-sans">
            <span>Net Tutar:</span>
            <span>{formatCurrency(amount, currency)}</span>
          </div>
        </div>

        {/* Receipt Action Buttons */}
        <div className="flex justify-center gap-3 mt-6 no-print">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handlePrint}
            className="flex items-center gap-1.5"
          >
            <Printer size={14} />
            Yazdır
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleDownload}
            className="flex items-center gap-1.5"
          >
            <Download size={14} />
            Dekont İndir
          </Button>
        </div>

      </div>

      {/* Back to new transfer */}
      <Button 
        variant="primary" 
        size="md" 
        onClick={onNewTransfer}
        className="flex items-center justify-center gap-2 no-print"
      >
        <span>Yeni Transfer Yap</span>
        <ArrowRight size={16} />
      </Button>

    </div>
  );
};

export default TransferSuccess;
