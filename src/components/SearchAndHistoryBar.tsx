import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Filter,
  History,
  RotateCcw,
  Search,
  Tag,
  X,
} from 'lucide-react';

interface SearchAndHistoryBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  searchHistory: string[];
  onSelectHistory: (term: string) => void;
  onClearHistory: () => void;
  totalResults: number;
}

export const SearchAndHistoryBar: React.FC<SearchAndHistoryBarProps> = ({
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  statusFilter,
  onStatusFilterChange,
  searchHistory,
  onSelectHistory,
  onClearHistory,
  totalResults,
}) => {
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  const handleClearSearch = () => {
    onSearchChange('');
  };

  const handleClearAllFilters = () => {
    onSearchChange('');
    onDateFilterChange('');
    onStatusFilterChange('all');
  };

  const hasActiveFilters = searchQuery !== '' || dateFilter !== '' || statusFilter !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Top Search Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input with History */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setShowHistoryDropdown(true)}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nomor surat (SP, BAST, SPMU), tanggal, nama toko, atau nama barang..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search History Dropdown Popover */}
          {showHistoryDropdown && searchHistory.length > 0 && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowHistoryDropdown(false)}
              ></div>
              <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white rounded-xl shadow-xl border border-slate-200 p-2.5">
                <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-indigo-600" />
                    Riwayat Pencarian Dokumen
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearHistory();
                    }}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Hapus Semua
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {searchHistory.map((term, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onSelectHistory(term);
                        setShowHistoryDropdown(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-indigo-50 rounded-lg text-xs text-slate-700 flex items-center justify-between group transition-colors"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Clock className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 flex-shrink-0" />
                        <span className="truncate">{term}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Date Filter */}
        <div className="sm:w-52 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Calendar className="w-4 h-4" />
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700"
            title="Filter dokumen berdasarkan tanggal"
          />
          {dateFilter && (
            <button
              onClick={() => onDateFilterChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="sm:w-44">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700"
          >
            <option value="all">Semua Status</option>
            <option value="Selesai">Selesai (Siap)</option>
            <option value="Dibayar">Dibayar (Lunas)</option>
            <option value="Draf">Draf</option>
          </select>
        </div>
      </div>

      {/* History Chips & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
        {/* Recent Search Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px]">
            <Tag className="w-3 h-3" />
            Pencarian Cepat:
          </span>
          {searchHistory.slice(0, 4).map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectHistory(item)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 rounded-full text-[11px] font-medium transition-colors border border-slate-200/60"
            >
              {item}
            </button>
          ))}
          {searchHistory.length === 0 && (
            <span className="text-[11px] text-slate-400 italic">
              Ketik nomor surat atau tanggal untuk melacak dokumen
            </span>
          )}
        </div>

        {/* Counter and Clear Filter */}
        <div className="flex items-center gap-3 ml-auto text-slate-500 text-[11px]">
          <span>
            Ditemukan <strong className="text-slate-800">{totalResults}</strong> dokumen transaksi
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
