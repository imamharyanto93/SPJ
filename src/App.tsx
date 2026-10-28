import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FilePlus,
  FileSpreadsheet,
  FileStack,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { OfficialLogo } from './components/OfficialLogo';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { SearchAndHistoryBar } from './components/SearchAndHistoryBar';
import { TransactionCard } from './components/TransactionCard';
import { TransactionEditorModal } from './components/TransactionEditorModal';
import { storageService } from './services/storage';
import { SchoolProfile, TransactionDocument } from './types/procurement';
import { formatRupiah } from './utils/terbilang';

export default function App() {
  const [transactions, setTransactions] = useState<TransactionDocument[]>(() =>
    storageService.getTransactions()
  );
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() =>
    storageService.getSchoolProfile()
  );
  const [searchHistory, setSearchHistory] = useState<string[]>(() =>
    storageService.getSearchHistory()
  );

  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingTx, setEditingTx] = useState<TransactionDocument | null>(null);

  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [viewingTx, setViewingTx] = useState<TransactionDocument | null>(null);

  const [isSchoolSettingsOpen, setIsSchoolSettingsOpen] = useState<boolean>(false);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; nomor: string } | null>(null);

  // Sync state to storage
  const reloadData = () => {
    setTransactions(storageService.getTransactions());
    setSchoolProfile(storageService.getSchoolProfile());
    setSearchHistory(storageService.getSearchHistory());
  };

  const handleSaveTransaction = (tx: TransactionDocument) => {
    storageService.upsertTransaction(tx);
    reloadData();
    setIsEditorOpen(false);
    setEditingTx(null);

    // Save to search history if there was a number
    if (tx.nomorPesanan) {
      storageService.addSearchHistory(tx.nomorPesanan);
      setSearchHistory(storageService.getSearchHistory());
    }
  };

  const handleDeleteTransaction = () => {
    if (!deleteTarget) return;
    storageService.deleteTransaction(deleteTarget.id);
    reloadData();
    setDeleteTarget(null);
    if (viewingTx?.id === deleteTarget.id) {
      setIsViewerOpen(false);
      setViewingTx(null);
    }
  };

  const handleDuplicateTransaction = (tx: TransactionDocument) => {
    const duplicated: TransactionDocument = {
      ...JSON.parse(JSON.stringify(tx)),
      id: 'tx-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nomorPesanan: `${tx.nomorPesanan}-COPY`,
      nomorBAST: `${tx.nomorBAST}-COPY`,
      nomorSPMU: `${tx.nomorSPMU}-COPY`,
      status: 'Draf',
    };
    storageService.upsertTransaction(duplicated);
    reloadData();
  };

  const handleSelectHistory = (term: string) => {
    setSearchQuery(term);
    storageService.addSearchHistory(term);
    setSearchHistory(storageService.getSearchHistory());
  };

  const handleClearHistory = () => {
    storageService.clearSearchHistory();
    setSearchHistory([]);
  };

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin memuat ulang data contoh bawaan?')) {
      storageService.resetToDefault();
      reloadData();
    }
  };

  const handleExportBackup = () => {
    const jsonStr = storageService.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Dokumen_Sekolah_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storageService.importBackup(content);
      if (success) {
        reloadData();
        alert('Data berhasil diimpor!');
      } else {
        alert('Gagal mengimpor file backup.');
      }
    };
    reader.readAsText(file);
  };

  // Filtered transactions list
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Status filter
      if (statusFilter !== 'all' && tx.status !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateFilter) {
        const matchesDate =
          tx.tanggalPesanan === dateFilter ||
          tx.tanggalBAST === dateFilter ||
          tx.tanggalSPMU === dateFilter;
        if (!matchesDate) return false;
      }

      // Query filter (Nomor surat, Toko, Barang, Keperluan, Alokasi)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          tx.nomorPesanan?.toLowerCase().includes(q) ||
          tx.nomorBAST?.toLowerCase().includes(q) ||
          tx.nomorSPMU?.toLowerCase().includes(q) ||
          tx.vendor?.namaToko?.toLowerCase().includes(q) ||
          tx.vendor?.namaPemilik?.toLowerCase().includes(q) ||
          tx.paketPesanan?.toLowerCase().includes(q) ||
          tx.keperluanSPMU?.toLowerCase().includes(q) ||
          tx.alokasiAnggaran?.toLowerCase().includes(q) ||
          tx.items?.some((it) => it.uraian?.toLowerCase().includes(q));

        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [transactions, searchQuery, dateFilter, statusFilter]);

  // Statistics
  const totalNominal = useMemo(() => {
    return transactions.reduce((acc, curr) => acc + (curr.totalPembayaran || 0), 0);
  }, [transactions]);

  // Track search query to history after debounce
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timeout = setTimeout(() => {
      if (searchQuery.trim().length >= 3) {
        storageService.addSearchHistory(searchQuery.trim());
        setSearchHistory(storageService.getSearchHistory());
      }
    }, 1200);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Main Navigation Bar */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-12 flex-shrink-0 flex items-center justify-center">
              <OfficialLogo customLogoUrl={schoolProfile.logoUrl} className="w-9 h-11" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  Aplikasi Dokumen Pengadaan Sekolah
                </h1>
                <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  SP • Dok. Perencanaan • BAST • SPMU
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[280px] sm:max-w-md">
                {schoolProfile.namaSekolah} • {schoolProfile.kotaKecamatan || 'Kabupaten Serang'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSchoolSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-2xs"
              title="Pengaturan Kop Surat & Pejabat Sekolah"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Profil Sekolah</span>
            </button>

            <button
              onClick={() => {
                setEditingTx(null);
                setIsEditorOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Transaksi Baru</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Banner / Overview Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Transaksi
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              {transactions.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Tersambung ke 4 surat
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Nilai Belanja
            </div>
            <div className="text-xl sm:text-2xl font-black text-indigo-600 font-mono mt-1">
              {formatRupiah(totalNominal, true)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Akumulasi anggaran BOSP
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Dokumen Terbit
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              {transactions.length * 4} <span className="text-xs font-normal text-slate-400">Surat</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              SP, Ren, BAST & SPMU
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Status Lunas / Selesai
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
              {transactions.filter((t) => t.status !== 'Draf').length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Siap dipertanggungjawabkan
            </div>
          </div>
        </div>

        {/* Search, Filter & History Section */}
        <SearchAndHistoryBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchHistory={searchHistory}
          onSelectHistory={handleSelectHistory}
          onClearHistory={handleClearHistory}
          totalResults={filteredTransactions.length}
        />

        {/* Document Cards Grid */}
        {filteredTransactions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTransactions.map((tx) => (
              <TransactionCard
                key={tx.id}
                tx={tx}
                onView={(item) => {
                  setViewingTx(item);
                  setIsViewerOpen(true);
                }}
                onEdit={(item) => {
                  setEditingTx(item);
                  setIsEditorOpen(true);
                }}
                onDuplicate={handleDuplicateTransaction}
                onDelete={(id, nomor) => setDeleteTarget({ id, nomor })}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Tidak Ada Dokumen Transaksi Ditemukan
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {searchQuery || dateFilter || statusFilter !== 'all'
                ? 'Tidak ada transaksi yang cocok dengan kata kunci atau filter tanggal yang dipilih. Silakan reset filter pencarian.'
                : 'Mulai dengan menambahkan transaksi pengadaan baru untuk mencetak Surat Pesanan, Dokumen Perencanaan, BAST, dan SPMU.'}
            </p>
            <div className="pt-2 flex justify-center gap-2">
              {searchQuery || dateFilter || statusFilter !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setDateFilter('');
                    setStatusFilter('all');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Reset Filter Pencarian
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditingTx(null);
                    setIsEditorOpen(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  + Tambah Transaksi Pertama
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bottom Utility Bar: Backup, Import, Reset */}
        <div className="no-print pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <button
              onClick={handleExportBackup}
              className="flex items-center gap-1.5 hover:text-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Backup JSON</span>
            </button>
            <label className="cursor-pointer flex items-center gap-1.5 hover:text-slate-800 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Impor Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 hover:text-amber-600 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data Contoh</span>
            </button>
          </div>
          <div className="text-[11px] text-slate-400">
            Format sesuai standar Surat Pesanan, Perencanaan, BAST & SPMU Sekolah Dinas Pendidikan
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-100">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Hapus Dokumen Transaksi?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Seluruh 4 dokumen (SP, Dok. Perencanaan, BAST, dan SPMU) untuk pesanan nomor{' '}
                <strong className="text-slate-800 font-mono">{deleteTarget.nomor}</strong> akan dihapus permanen.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteTransaction}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Hapus Dokumen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <TransactionEditorModal
        isOpen={isEditorOpen}
        initialData={editingTx}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingTx(null);
        }}
        onSave={handleSaveTransaction}
      />

      <DocumentViewerModal
        isOpen={isViewerOpen}
        tx={viewingTx}
        onClose={() => {
          setIsViewerOpen(false);
          setViewingTx(null);
        }}
        onEdit={(tx) => {
          setIsViewerOpen(false);
          setEditingTx(tx);
          setIsEditorOpen(true);
        }}
        onDuplicate={handleDuplicateTransaction}
      />

      <SchoolSettingsModal
        isOpen={isSchoolSettingsOpen}
        onClose={() => setIsSchoolSettingsOpen(false)}
        onSaved={(profile) => {
          setSchoolProfile(profile);
          reloadData();
        }}
      />
    </div>
  );
}
