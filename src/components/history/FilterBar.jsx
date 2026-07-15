import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTypeFilter, setCurrencyFilter, setDateRangeFilter, resetFilters } from '../../store/slices/transactionSlice';
import Select from '../ui/Select';
import Button from '../ui/Button';

const FilterBar = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.transaction);

  return (
    <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-4 items-end">
      
      {/* Type Filter */}
      <div className="w-full md:w-auto flex-1">
        <Select
          label="İşlem Türü"
          value={filters.type}
          onChange={(e) => dispatch(setTypeFilter(e.target.value))}
          options={[
            { value: 'ALL', label: 'Tüm İşlemler' },
            { value: 'INCOMING', label: 'Gelen Transferler' },
            { value: 'OUTGOING', label: 'Giden Transferler' },
            { value: 'BILL', label: 'Fatura Ödemeleri' },
            { value: 'INVESTMENT', label: 'Yatırım İşlemleri' },
          ]}
        />
      </div>

      {/* Currency Filter */}
      <div className="w-full md:w-auto flex-1">
        <Select
          label="Para Birimi"
          value={filters.currency}
          onChange={(e) => dispatch(setCurrencyFilter(e.target.value))}
          options={[
            { value: 'ALL', label: 'Tüm Dövizler' },
            { value: 'TRY', label: 'TRY - Türk Lirası' },
            { value: 'USD', label: 'USD - Dolar' },
            { value: 'EUR', label: 'EUR - Euro' },
            { value: 'GOLD', label: 'GOLD - Altın' },
          ]}
        />
      </div>

      {/* Date Range Filter */}
      <div className="w-full md:w-auto flex-1">
        <Select
          label="Zaman Aralığı"
          value={filters.dateRange}
          onChange={(e) => dispatch(setDateRangeFilter(e.target.value))}
          options={[
            { value: 'ALL', label: 'Tüm Zamanlar' },
            { value: 'WEEK', label: 'Son 7 Gün' },
            { value: 'MONTH', label: 'Son 30 Gün' },
          ]}
        />
      </div>

      {/* Reset Button */}
      <Button 
        variant="secondary" 
        size="md" 
        onClick={() => dispatch(resetFilters())}
        className="w-full md:w-auto py-2.5 px-4 shrink-0 font-bold"
      >
        Temizle
      </Button>

    </div>
  );
};

export default FilterBar;
