import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTransactionsHistory, setSearchFilter, setCurrentPage, setSelectedTransaction 
} from '../../store/slices/transactionSlice';
import PageHeader from '../../components/layout/PageHeader';
import SearchBox from '../../components/ui/SearchBox';
import FilterBar from '../../components/history/FilterBar';
import TransactionTable from '../../components/history/TransactionTable';
import TransactionCard from '../../components/history/TransactionCard';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { History as HistoryIcon, Printer, Download } from 'lucide-react';

const History = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { 
    transactions, filters, pagination, selectedTransaction, loading 
  } = useSelector((state) => state.transaction);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTransactionsHistory(user.id));
    }
  }, [dispatch, user]);

  // 1. Client-Side Filtering
  const filteredTransactions = transactions.filter((tx) => {
    // Search text check
    const matchesSearch = tx.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
                          tx.referenceNumber?.toLowerCase().includes(filters.search.toLowerCase());

    // Currency check
    const matchesCurrency = filters.currency === 'ALL' || tx.currency === filters.currency;

    // Type check
    let matchesType = true;
    if (filters.type === 'INCOMING') {
      matchesType = tx.type === 'incoming' || tx.type === 'deposit' || tx.type === 'investment_sell';
    } else if (filters.type === 'OUTGOING') {
      matchesType = tx.type === 'outgoing' || tx.type === 'transfer' || tx.type === 'eft' || tx.type === 'fast';
    } else if (filters.type === 'BILL') {
      matchesType = tx.type === 'bill';
    } else if (filters.type === 'INVESTMENT') {
      matchesType = tx.type === 'investment_buy' || tx.type === 'investment_sell';
    }

    // Date range check
    let matchesDate = true;
    if (filters.dateRange !== 'ALL') {
      const txDate = new Date(tx.date);
      const today = new Date();
      const diffTime = Math.abs(today - txDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (filters.dateRange === 'WEEK') {
        matchesDate = diffDays <= 7;
      } else if (filters.dateRange === 'MONTH') {
        matchesDate = diffDays <= 30;
      }
    }

    return matchesSearch && matchesCurrency && matchesType && matchesDate;
  });

  // 2. Pagination calculation
  const totalPages = Math.ceil(filteredTransactions.length / pagination.itemsPerPage);
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex, 
    startIndex + pagination.itemsPerPage
  );

  const formatCurrency = (val, cur = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: cur === 'GOLD' ? 'TRY' : cur }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!selectedTransaction) return;
    const { referenceNumber, date, type, senderIban, recipientIban, recipientName, amount, currency, description } = selectedTransaction;

    const isIncoming = type === 'incoming' || type === 'deposit' || type === 'investment_sell';

    const textContent = `
==================================================
               ASTRA BANK
            RESMİ İŞLEM DEKONTU (RECEIPT)
==================================================
İşlem Tarihi : ${new Date(date).toLocaleString('tr-TR')}
Referans No  : ${referenceNumber}
İşlem Yönü   : ${isIncoming ? 'HESABA GELEN HAREKET' : 'HESAPTAN ÇIKAN HAREKET'}
--------------------------------------------------
HESAP BİLGİLERİ:
Gönderen IBAN: ${senderIban || '-'}
Alıcı IBAN   : ${recipientIban || '-'}
Alıcı Adı    : ${recipientName || '-'}
--------------------------------------------------
TUTAR        : ${isIncoming ? '+' : '-'}${formatCurrency(amount, currency)}
AÇIKLAMA     : ${description || '-'}
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

  const receiptModalFooter = (
    <div className="flex gap-2 justify-end no-print">
      <Button variant="secondary" size="sm" onClick={handlePrint} className="flex items-center gap-1.5">
        <Printer size={14} />
        Yazdır
      </Button>
      <Button variant="secondary" size="sm" onClick={handleDownload} className="flex items-center gap-1.5">
        <Download size={14} />
        Dekont İndir
      </Button>
      <Button variant="secondary" size="sm" onClick={() => dispatch(setSelectedTransaction(null))}>
        Kapat
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      
      {/* Page Title (Hidden during printing) */}
      <div className="no-print">
        <PageHeader 
          title="Hesap Hareketleri" 
          description="Hesaplarınıza ait para transferleri, fatura ödemeleri ve döviz alım/satım işlemlerini arayıp listeleyebilirsiniz."
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 no-print">
        <SearchBox
          value={filters.search}
          onChange={(e) => dispatch(setSearchFilter(e.target.value))}
          placeholder="İşlem açıklaması veya referans no ile arayın..."
        />
        <FilterBar />
      </div>

      {/* Listings Table / Cards */}
      <div className="no-print">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse bg-white/[0.03] border border-white/5 rounded-lg" />
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <EmptyState
            title="Kayıt Bulunmamaktadır"
            description="Filtreleme kriterlerinize veya aramalarınıza uygun bir hesap hareketi kaydı bulunamadı."
            icon={HistoryIcon}
          />
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* Desktop Table View */}
            <div className="hidden md:block glass-panel rounded-xl overflow-hidden border border-white/5">
              <TransactionTable
                transactions={paginatedTransactions}
                onViewReceipt={(tx) => dispatch(setSelectedTransaction(tx))}
              />
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden flex flex-col gap-3">
              {paginatedTransactions.map((tx) => (
                <TransactionCard
                  key={tx.id}
                  transaction={tx}
                  onViewReceipt={(t) => dispatch(setSelectedTransaction(t))}
                />
              ))}
            </div>

            {/* Paging Footer */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={totalPages}
              onPageChange={(page) => dispatch(setCurrentPage(page))}
            />

          </div>
        )}
      </div>

      {/* Receipt Details Modal */}
      {selectedTransaction && (
        <Modal
          isOpen={!!selectedTransaction}
          onClose={() => dispatch(setSelectedTransaction(null))}
          title="Resmi İşlem Dekontu"
          footer={receiptModalFooter}
          size="md"
        >
          <div 
            id="receipt-printable-frame"
            className="p-5 border border-white/5 rounded-xl bg-white/[0.005] flex flex-col gap-3 font-mono text-xs text-brand-textSecondary text-left"
          >
            <div className="flex justify-between font-sans border-b border-white/5 pb-2 text-[10px] uppercase font-bold text-brand-textMuted tracking-wider">
              <span>Astra Dekont</span>
              <span>{selectedTransaction.type}</span>
            </div>

            <div className="flex justify-between">
              <span>Referans No:</span>
              <span className="font-bold text-brand-textPrimary select-all">{selectedTransaction.referenceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>İşlem Tarihi:</span>
              <span className="font-bold text-brand-textPrimary">{new Date(selectedTransaction.date).toLocaleString('tr-TR')}</span>
            </div>
            <div className="flex justify-between">
              <span>Gönderici IBAN:</span>
              <span className="font-bold text-brand-textPrimary">{selectedTransaction.senderIban || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span>Alıcı Unvan:</span>
              <span className="font-bold text-brand-textPrimary">{selectedTransaction.recipientName || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span>Alıcı IBAN:</span>
              <span className="font-bold text-brand-textPrimary">{selectedTransaction.recipientIban || '-'}</span>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-2 text-sm text-brand-primary font-bold font-sans">
              <span>Net Tutar:</span>
              <span>
                {selectedTransaction.type === 'incoming' || selectedTransaction.type === 'deposit' || selectedTransaction.type === 'investment_sell' ? '+' : '-'}
                {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
              </span>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default History;
