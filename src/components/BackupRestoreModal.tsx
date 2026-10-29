import React, { useState } from 'react';
import {
  Download,
  Upload,
  ShieldCheck,
  AlertTriangle,
  FileJson,
  CheckCircle2,
  HardDrive,
  Info,
  X,
  Database,
  Cloud
} from 'lucide-react';
import { storageService } from '../services/storage';
import { SchoolProfile, TransactionDocument } from '../types/procurement';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: TransactionDocument[];
  schoolProfile: SchoolProfile;
  onDataRestored: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  transactions,
  schoolProfile,
  onDataRestored,
}) => {
  const [restoreStatus, setRestoreStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      const jsonStr = storageService.exportBackup();
      const schoolNameClean = (schoolProfile.namaSekolah || 'Sekolah')
        .replace(/[^a-zA-Z0-9]/g, '_');
      const today = new Date().toISOString().split('T')[0];
      const filename = `Backup_Pengadaan_${schoolNameClean}_${today}.json`;

      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setRestoreStatus({
        type: 'success',
        message: `File backup "${filename}" berhasil diunduh ke komputer Anda. Simpan file ini di folder yang aman atau flashdisk.`,
      });
    } catch {
      setRestoreStatus({
        type: 'error',
        message: 'Gagal membuat file backup. Silakan coba lagi.',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        
        if (!parsed.transactions && !parsed.schoolProfile) {
          throw new Error('Format file cadangan tidak sesuai.');
        }

        const count = parsed.transactions?.length ?? 0;
        const success = storageService.importBackup(content);
        
        if (success) {
          onDataRestored();
          setRestoreStatus({
            type: 'success',
            message: `Berhasil memulihkan ${count} transaksi dan profil sekolah dari file cadangan!`,
          });
        } else {
          throw new Error('Gagal menyimpan data ke sistem.');
        }
      } catch (err: any) {
        setRestoreStatus({
          type: 'error',
          message: err?.message || 'File cadangan tidak valid atau rusak.',
        });
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#085070] to-[#4480A6] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <ShieldCheck className="w-5 h-5 text-[#92D2F9]" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                Pencadangan & Pengamanan Data Transaksi
              </h2>
              <p className="text-xs text-white/80">
                Solusi agar data dokumen tidak hilang saat membersihkan peramban
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 text-slate-700 text-sm">
          {/* Notification Message */}
          {restoreStatus.type !== 'idle' && (
            <div
              className={`p-4 rounded-xl flex items-start gap-3 border ${
                restoreStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {restoreStatus.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-xs leading-relaxed font-medium">
                {restoreStatus.message}
              </div>
            </div>
          )}

          {/* Current Local Stats */}
          <div className="bg-[#EBF6FE] border border-[#92D2F9] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#085070] shadow-xs">
                <HardDrive className="w-5 h-5 text-[#4480A6]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#085070]">
                  Data Tersimpan di Komputer Ini:
                </p>
                <p className="text-xs text-slate-600">
                  <span className="font-bold text-[#085070]">{transactions.length} Transaksi</span> ({transactions.length * 4} berkas surat) • Profil: {schoolProfile.namaSekolah || 'SD NEGERI SILEBU 4'}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FDE8B5] text-[#8C6A1D]">
              <Database className="w-3.5 h-3.5" /> Memori Lokal Browser
            </span>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Ekspor Backup */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between hover:border-[#4480A6] transition-colors">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#085070] font-bold text-sm">
                  <Download className="w-4 h-4 text-[#4480A6]" />
                  <span>1. Cadangkan / Ekspor (JSON)</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Unduh seluruh transaksi, rincian belanja, dan profil sekolah menjadi file cadangan (.json) ke laptop/flashdisk Anda.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExport}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#085070] hover:bg-[#063D56] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File Cadangan (.json)</span>
              </button>
            </div>

            {/* Card 2: Pulihkan Data */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between hover:border-[#4480A6] transition-colors">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#085070] font-bold text-sm">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>2. Pulihkan Data (Import)</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Masukkan kembali file backup jika histori browser terlanjur dibersihkan atau ingin pindah ke komputer lain.
                </p>
              </div>
              <label className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:border-[#4480A6] hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs">
                <FileJson className="w-4 h-4 text-[#4480A6]" />
                <span>Pilih File Backup (.json)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Cara Aman Menghapus Histori Browser */}
          <div className="border border-amber-200 bg-amber-50/60 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Tips: Cara Bersihkan Histori Browser Tanpa Menghilangkan Data</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Data transaksi Anda disimpan pada memori lokal peramban (Local Storage). Saat membersihkan histori browser di Chrome / Edge (tekan <kbd className="px-1.5 py-0.5 bg-white rounded border border-amber-300 font-mono text-[10px]">Ctrl + Shift + Del</kbd>):
            </p>
            <ul className="text-xs text-amber-900 list-disc list-inside space-y-1 pl-1">
              <li>
                <strong>Centang:</strong> <em>Browsing history</em> (Riwayat penjelajahan) & <em>Cached images and files</em> (Gambar dalam cache).
              </li>
              <li>
                <strong className="text-red-700">JANGAN CENTANG:</strong> <em>"Cookies and other site data"</em> (Cookie dan data situs lain), karena opsi inilah yang menghapus data transaksi aplikasi.
              </li>
            </ul>
          </div>

          {/* Opsi Cloud Database */}
          <div className="border border-slate-200 rounded-xl p-4 bg-gradient-to-r from-slate-50 to-[#EBF6FE]/40 space-y-2">
            <div className="flex items-center gap-2 text-[#085070] font-bold text-xs">
              <Cloud className="w-4 h-4 text-[#4480A6]" />
              <span>Solusi Permanen Otomatis: Database Cloud (Firebase)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jika Anda ingin data otomatis tersimpan di server cloud (tanpa takut hilang meskipun semua riwayat browser dibersihkan atau ganti laptop), kita dapat menghubungkan aplikasi ke <strong>Database Cloud Firebase</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors shadow-2xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
