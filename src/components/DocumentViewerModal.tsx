import React, { useState } from 'react';
import {
  Coins,
  Copy,
  Download,
  Edit,
  Eye,
  FileCheck,
  FileStack,
  FileText,
  Layers,
  Printer,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { DocumentType, TransactionDocument } from '../types/procurement';
import { downloadElementAsPdf, printDocument } from '../utils/pdfExport';
import { BastDoc } from './documents/BastDoc';
import { DokumenPerencanaanDoc } from './documents/DokumenPerencanaanDoc';
import { SpmuDoc } from './documents/SpmuDoc';
import { SuratPesananDoc } from './documents/SuratPesananDoc';

interface DocumentViewerModalProps {
  tx: TransactionDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (tx: TransactionDocument) => void;
  onDuplicate: (tx: TransactionDocument) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  tx,
  isOpen,
  onClose,
  onEdit,
  onDuplicate,
}) => {
  if (!isOpen || !tx) return null;

  const [activeDoc, setActiveDoc] = useState<DocumentType>('sp');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string>('');

  const docTabs: { id: DocumentType; label: string; icon: React.ReactNode; short: string }[] = [
    { id: 'sp', label: '1. Surat Pesanan (SP)', icon: <FileText className="w-4 h-4" />, short: 'Surat Pesanan' },
    { id: 'perencanaan', label: '2. Dok. Perencanaan', icon: <FileCheck className="w-4 h-4" />, short: 'Perencanaan' },
    { id: 'bast', label: '3. BAST (Serah Terima)', icon: <FileStack className="w-4 h-4" />, short: 'BAST' },
    { id: 'spmu', label: '4. SPMU (Keluar Uang)', icon: <Coins className="w-4 h-4" />, short: 'SPMU' },
    { id: 'all', label: '📑 Bundel 4 Dokumen', icon: <Layers className="w-4 h-4" />, short: 'Bundel Semua' },
  ];

  const handlePrint = () => {
    printDocument();
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      const sanitizedNo = (tx.nomorPesanan || 'Dokumen').replace(/[/\\?%*:|"<>]/g, '_');
      const filename =
        activeDoc === 'sp'
          ? `Surat_Pesanan_${sanitizedNo}`
          : activeDoc === 'perencanaan'
          ? `Dokumen_Perencanaan_${sanitizedNo}`
          : activeDoc === 'bast'
          ? `BAST_${sanitizedNo}`
          : activeDoc === 'spmu'
          ? `SPMU_${sanitizedNo}`
          : `Bundel_Lengkap_4_Dokumen_${sanitizedNo}`;

      await downloadElementAsPdf('printable-document-container', filename, (msg) => {
        setExportMessage(msg);
      });
    } catch (err) {
      console.error(err);
      alert('Gagal mengekspor PDF. Anda dapat menggunakan tombol "Cetak / Print" untuk menyimpan sebagai PDF melalui browser.');
    } finally {
      setIsExporting(false);
      setExportMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex flex-col justify-between overflow-hidden animate-in fade-in duration-150">
      {/* Top Navbar Toolbar */}
      <div className="no-print bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between border-b border-slate-800 gap-3">
        {/* Document Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {docTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDoc(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeDoc === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-slate-300 text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="p-1 hover:text-white"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px]">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
              className="p-1 hover:text-white"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Edit button */}
          <button
            onClick={() => onEdit(tx)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors"
          >
            <Edit className="w-3.5 h-3.5 text-amber-400" />
            <span>Edit Data</span>
          </button>

          {/* Duplicate button */}
          <button
            onClick={() => onDuplicate(tx)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-blue-400" />
            <span>Duplikasi</span>
          </button>

          {/* Download PDF button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? (exportMessage || 'Proses...') : 'Unduh PDF'}</span>
          </button>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak (A4)</span>
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Document Viewport Area */}
      <div className="flex-1 overflow-auto bg-slate-700/40 p-4 md:p-8 flex justify-center">
        <div
          id="printable-document-container"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-100 ease-out space-y-12"
        >
          {/* Surat Pesanan */}
          {(activeDoc === 'sp' || activeDoc === 'all') && (
            <div className="print-page">
              <SuratPesananDoc tx={tx} />
            </div>
          )}

          {/* Dokumen Perencanaan */}
          {(activeDoc === 'perencanaan' || activeDoc === 'all') && (
            <div className="print-page">
              <DokumenPerencanaanDoc tx={tx} />
            </div>
          )}

          {/* BAST */}
          {(activeDoc === 'bast' || activeDoc === 'all') && (
            <div className="print-page">
              <BastDoc tx={tx} />
            </div>
          )}

          {/* SPMU */}
          {(activeDoc === 'spmu' || activeDoc === 'all') && (
            <div className="print-page">
              <SpmuDoc tx={tx} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
