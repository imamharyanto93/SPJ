import React, { useMemo, useState } from 'react';
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
import { storageService } from '../services/storage';
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

  // Merge latest school profile and uploaded logo so documents immediately display new logo
  const effectiveTx: TransactionDocument = useMemo(() => {
    const activeSchool = storageService.getSchoolProfile();
    return {
      ...tx,
      school: {
        ...tx.school,
        ...activeSchool,
        logoUrl: activeSchool.logoUrl !== undefined ? activeSchool.logoUrl : tx.school?.logoUrl,
      },
    };
  }, [tx]);

  const docTabs: { id: DocumentType; label: string; icon: React.ReactNode; short: string }[] = [
    { id: 'sp', label: '1. Surat Pesanan (SP)', icon: <FileText className="w-4 h-4" />, short: 'Surat Pesanan' },
    { id: 'perencanaan', label: '2. Dok. Perencanaan', icon: <FileCheck className="w-4 h-4" />, short: 'Perencanaan' },
    { id: 'bast', label: '3. BAST (Serah Terima)', icon: <FileStack className="w-4 h-4" />, short: 'BAST' },
    { id: 'spmu', label: '4. SPMU (Keluar Uang)', icon: <Coins className="w-4 h-4" />, short: 'SPMU' },
    { id: 'all', label: '📑 Bundel 4 Dokumen', icon: <Layers className="w-4 h-4" />, short: 'Bundel 4 Dokumen' },
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

  const scrollToDoc = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex flex-col justify-between overflow-hidden animate-in fade-in duration-150 modal-viewer-overlay print:static print:h-auto print:overflow-visible print:bg-white print:p-0 print:m-0">
      {/* Top Navbar Toolbar (Hidden in print) */}
      <div className="no-print bg-[#085070] text-white px-4 py-3 flex flex-wrap items-center justify-between border-b border-[#063D56] gap-3">
        {/* Document Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {docTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDoc(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeDoc === tab.id
                  ? 'bg-[#4480A6] text-white border border-[#92D2F9] shadow-sm'
                  : 'bg-[#063D56] text-[#EBF6FE] hover:bg-[#074765] hover:text-white'
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
          <div className="hidden sm:flex items-center bg-[#063D56] rounded-lg p-0.5 border border-[#4480A6] text-slate-200 text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="p-1 hover:text-white"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] text-[#92D2F9]">{zoomLevel}%</span>
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#063D56] hover:bg-[#4480A6] text-white text-xs font-medium rounded-lg border border-[#4480A6] transition-colors"
          >
            <Edit className="w-3.5 h-3.5 text-[#FDE8B5]" />
            <span>Edit Data</span>
          </button>

          {/* Duplicate button */}
          <button
            onClick={() => onDuplicate(tx)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#063D56] hover:bg-[#4480A6] text-white text-xs font-medium rounded-lg border border-[#4480A6] transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-[#92D2F9]" />
            <span>Duplikasi</span>
          </button>

          {/* Download PDF button (Warm Cream with dark teal text) */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FDE8B5] hover:bg-[#fce19a] text-[#085070] text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-[#085070]" />
            <span>{isExporting ? (exportMessage || 'Proses...') : 'Unduh PDF'}</span>
          </button>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4480A6] hover:bg-[#376d8f] text-white text-xs font-bold rounded-lg shadow-sm border border-[#92D2F9]/50 transition-colors"
            title={`Cetak ${activeDoc === 'all' ? 'Bundel 4 Dokumen Lengkap' : docTabs.find((d) => d.id === activeDoc)?.label || 'Dokumen'} (A4)`}
          >
            <Printer className="w-3.5 h-3.5 text-[#92D2F9]" />
            <span>
              {activeDoc === 'all'
                ? 'Cetak Bundel (4 Dokumen)'
                : `Cetak ${docTabs.find((d) => d.id === activeDoc)?.short || 'Dokumen'}`}
            </span>
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
      <div className="flex-1 overflow-auto bg-slate-700/40 p-4 md:p-8 flex flex-col items-center modal-viewer-viewport print:static print:h-auto print:overflow-visible print:bg-white print:p-0 print:m-0 print:block">
        {/* Bundel Navigation Helper (in Preview only) */}
        {activeDoc === 'all' && (
          <div className="no-print sticky top-0 z-30 mb-6 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-[#92D2F9] flex flex-wrap items-center justify-between gap-3 text-xs max-w-[210mm] w-full animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-[#EBF6FE] text-[#085070] rounded-lg">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <div className="font-bold text-[#085070] flex items-center gap-1.5">
                  <span>Pratinjau Bundel 4 Dokumen Terhubung</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    4 Surat Berurutan (A4)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Kegiatan: <strong className="text-slate-700">{tx.paketPesanan || tx.keperluanSPMU || 'Pengadaan'}</strong>
                </p>
              </div>
            </div>

            {/* Quick jump buttons in preview */}
            <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto py-0.5">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider hidden sm:inline mr-1">
                Lompat ke:
              </span>
              <button
                type="button"
                onClick={() => scrollToDoc('bundel-page-1')}
                className="px-2.5 py-1 bg-[#EBF6FE] hover:bg-[#92D2F9]/40 text-[#085070] font-semibold rounded-md border border-[#92D2F9]/50 transition-colors whitespace-nowrap"
              >
                1. Surat Pesanan
              </button>
              <button
                type="button"
                onClick={() => scrollToDoc('bundel-page-2')}
                className="px-2.5 py-1 bg-[#EBF6FE] hover:bg-[#92D2F9]/40 text-[#085070] font-semibold rounded-md border border-[#92D2F9]/50 transition-colors whitespace-nowrap"
              >
                2. Perencanaan
              </button>
              <button
                type="button"
                onClick={() => scrollToDoc('bundel-page-3')}
                className="px-2.5 py-1 bg-[#EBF6FE] hover:bg-[#92D2F9]/40 text-[#085070] font-semibold rounded-md border border-[#92D2F9]/50 transition-colors whitespace-nowrap"
              >
                3. BAST
              </button>
              <button
                type="button"
                onClick={() => scrollToDoc('bundel-page-4')}
                className="px-2.5 py-1 bg-[#EBF6FE] hover:bg-[#92D2F9]/40 text-[#085070] font-semibold rounded-md border border-[#92D2F9]/50 transition-colors whitespace-nowrap"
              >
                4. SPMU
              </button>
            </div>
          </div>
        )}

        {/* Printable Document Container */}
        <div
          id="printable-document-container"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="w-full max-w-[210mm] transition-transform duration-100 ease-out space-y-12 print:space-y-0 print:max-w-none print:w-full print:m-0 print:p-0"
        >
          {/* 1. Surat Pesanan */}
          {(activeDoc === 'sp' || activeDoc === 'all') && (
            <div id="bundel-page-1" className="print-page scroll-mt-20">
              {activeDoc === 'all' && (
                <div className="no-print mb-2 flex items-center justify-between text-xs text-white bg-[#085070] px-4 py-2 rounded-t-xl border border-[#063D56] shadow-xs">
                  <div className="flex items-center gap-2 font-bold">
                    <FileText className="w-4 h-4 text-[#92D2F9]" />
                    <span>Halaman 1 dari 4: SURAT PESANAN (SP)</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#92D2F9]">
                    No. {tx.nomorPesanan}
                  </div>
                </div>
              )}
              <SuratPesananDoc tx={effectiveTx} />
            </div>
          )}

          {/* 2. Dokumen Perencanaan */}
          {(activeDoc === 'perencanaan' || activeDoc === 'all') && (
            <div id="bundel-page-2" className="print-page scroll-mt-20">
              {activeDoc === 'all' && (
                <div className="no-print mb-2 flex items-center justify-between text-xs text-white bg-[#085070] px-4 py-2 rounded-t-xl border border-[#063D56] shadow-xs">
                  <div className="flex items-center gap-2 font-bold">
                    <FileCheck className="w-4 h-4 text-[#92D2F9]" />
                    <span>Halaman 2 dari 4: DOKUMEN PERENCANAAN</span>
                  </div>
                  <div className="text-[11px] font-medium text-[#FDE8B5] truncate max-w-[280px]">
                    {effectiveTx.kategoriBarangJasa || effectiveTx.items[0]?.uraian || 'Rincian Pengadaan'}
                  </div>
                </div>
              )}
              <DokumenPerencanaanDoc tx={effectiveTx} />
            </div>
          )}

          {/* 3. BAST */}
          {(activeDoc === 'bast' || activeDoc === 'all') && (
            <div id="bundel-page-3" className="print-page scroll-mt-20">
              {activeDoc === 'all' && (
                <div className="no-print mb-2 flex items-center justify-between text-xs text-white bg-[#085070] px-4 py-2 rounded-t-xl border border-[#063D56] shadow-xs">
                  <div className="flex items-center gap-2 font-bold">
                    <FileStack className="w-4 h-4 text-[#92D2F9]" />
                    <span>Halaman 3 dari 4: BERITA ACARA SERAH TERIMA (BAST)</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#92D2F9]">
                    No. {effectiveTx.nomorBAST}
                  </div>
                </div>
              )}
              <BastDoc tx={effectiveTx} />
            </div>
          )}

          {/* 4. SPMU */}
          {(activeDoc === 'spmu' || activeDoc === 'all') && (
            <div id="bundel-page-4" className="print-page scroll-mt-20">
              {activeDoc === 'all' && (
                <div className="no-print mb-2 flex items-center justify-between text-xs text-white bg-[#085070] px-4 py-2 rounded-t-xl border border-[#063D56] shadow-xs">
                  <div className="flex items-center gap-2 font-bold">
                    <Coins className="w-4 h-4 text-[#FDE8B5]" />
                    <span>Halaman 4 dari 4: SURAT PERINTAH MENGELUARKAN UANG (SPMU)</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#FDE8B5]">
                    No. {effectiveTx.nomorSPMU}
                  </div>
                </div>
              )}
              <SpmuDoc tx={effectiveTx} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
