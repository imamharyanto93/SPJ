import React from 'react';
import {
  Calendar,
  Coins,
  Copy,
  Edit,
  Eye,
  FileCheck,
  FileStack,
  FileText,
  Printer,
  Store,
  Trash2,
} from 'lucide-react';
import { TransactionDocument } from '../types/procurement';
import { formatRupiah, formatTanggalIndonesia } from '../utils/terbilang';

interface TransactionCardProps {
  tx: TransactionDocument;
  onView: (tx: TransactionDocument) => void;
  onEdit: (tx: TransactionDocument) => void;
  onDuplicate: (tx: TransactionDocument) => void;
  onDelete: (id: string, nomor: string) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  tx,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Dibayar':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Selesai':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group">
      {/* Top Header Card */}
      <div className="space-y-3">
        {/* Status & Date */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>{formatTanggalIndonesia(tx.tanggalPesanan)}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400 font-mono text-[11px]">{tx.alokasiAnggaran || 'BOS'}</span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
              tx.status
            )}`}
          >
            {tx.status}
          </span>
        </div>

        {/* Paket Pesanan Title */}
        <div>
          <h3
            onClick={() => onView(tx)}
            className="text-base font-bold text-slate-800 group-hover:text-indigo-600 cursor-pointer transition-colors line-clamp-1"
          >
            {tx.paketPesanan || tx.keperluanSPMU || 'Pengadaan Sekolah'}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
            <Store className="w-3.5 h-3.5 text-slate-400" />
            <strong className="text-slate-700">{tx.vendor.namaToko}</strong>
            {tx.vendor.namaPemilik && <span className="text-slate-400">({tx.vendor.namaPemilik})</span>}
          </p>
        </div>

        {/* 4 Connected Documents Badges */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
          <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
            Dokumen Terhubung:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 truncate text-slate-700" title={`SP: ${tx.nomorPesanan}`}>
              <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span className="truncate">SP: {tx.nomorPesanan}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate text-slate-700" title={`BAST: ${tx.nomorBAST}`}>
              <FileStack className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="truncate">BAST: {tx.nomorBAST}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate text-slate-700" title={`SPMU: ${tx.nomorSPMU}`}>
              <Coins className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
              <span className="truncate">SPMU: {tx.nomorSPMU}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate text-slate-700" title={`Perencanaan: ${tx.school.namaSekolah}`}>
              <FileCheck className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span className="truncate">Perenc: {tx.kategoriBarangJasa || 'Ada'}</span>
            </div>
          </div>
        </div>

        {/* Item Summary */}
        <div className="text-xs text-slate-600 space-y-1">
          <div className="text-[11px] text-slate-400">Rincian Barang / Jasa:</div>
          <div className="line-clamp-2 text-slate-700 font-medium">
            {tx.items.map((it, i) => (
              <span key={it.id || i}>
                {it.uraian} ({it.qty} {it.satuan})
                {i < tx.items.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer & Action Buttons */}
      <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
        {/* Total Price & Terbilang */}
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium text-slate-500">Total Transaksi:</span>
          <span className="text-lg font-bold font-mono text-indigo-700">
            {formatRupiah(tx.totalPembayaran, true)}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-1.5 pt-1">
          {/* Main View 4 Docs Button */}
          <button
            type="button"
            onClick={() => onView(tx)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-indigo-500/20 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Buka 4 Dokumen</span>
          </button>

          {/* Quick Edit */}
          <button
            type="button"
            onClick={() => onEdit(tx)}
            className="p-2 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-600 rounded-xl transition-colors"
            title="Edit Dokumen"
          >
            <Edit className="w-4 h-4" />
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={() => onDuplicate(tx)}
            className="p-2 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-600 rounded-xl transition-colors"
            title="Duplikasi Transaksi"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(tx.id, tx.nomorPesanan)}
            className="p-2 border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-600 rounded-xl transition-colors"
            title="Hapus Transaksi"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
