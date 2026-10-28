import React, { useState } from 'react';
import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Plus,
  Receipt,
  Store,
  Trash2,
  X,
} from 'lucide-react';
import { storageService } from '../services/storage';
import { OrderItem, TransactionDocument } from '../types/procurement';
import { formatRupiah, terbilangRupiah } from '../utils/terbilang';

interface TransactionEditorModalProps {
  initialData?: TransactionDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: TransactionDocument) => void;
}

export const TransactionEditorModal: React.FC<TransactionEditorModalProps> = ({
  initialData,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const defaultSchool = storageService.getSchoolProfile();

  // Initial state setup
  const [formData, setFormData] = useState<TransactionDocument>(() => {
    if (initialData) return JSON.parse(JSON.stringify(initialData));

    const todayStr = new Date().toISOString().split('T')[0];
    const slashDate = `${todayStr.slice(8, 10)}/${todayStr.slice(5, 7)}/${todayStr.slice(0, 4)}`;

    return {
      id: 'tx-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nomorPesanan: `044/SD.24/SP/II/${new Date().getFullYear()}`,
      nomorBAST: `045/SD.24/SP/II/${new Date().getFullYear()}`,
      nomorSPMU: `900.1.3.6 / 09 / SDN. 24 / ${new Date().getFullYear()}`,
      nomorPerencanaan: `043/SD.24/DOK-REN/II/${new Date().getFullYear()}`,
      tanggalPesanan: todayStr,
      tanggalNegosiasi: todayStr,
      waktuPengerjaan: slashDate,
      waktuPemrosesan: slashDate,
      waktuPenyelesaian: slashDate,
      tanggalBAST: todayStr,
      tanggalSPMU: todayStr,
      paketPesanan: 'Kegiatan Jual Beli Melalui Toko',
      kategoriBarangJasa: '',
      alokasiAnggaran: 'BOS Reguler 2026',
      lokasiSerahTerima: defaultSchool.namaSekolah,
      persyaratanPenyedia:
        'Perorangan/Badan Usaha Memenuhi syarat sebagai berikut :\na. Identitas Penyedia\nb. NPWP',
      keperluanSPMU: '',
      tujuanBendaharaSpmu: defaultSchool.namaBendahara || 'Bendahara BOSP',
      tahunAnggaran: String(new Date().getFullYear()),
      items: [
        {
          id: 'item-' + Date.now(),
          uraian: '',
          qty: 1,
          satuan: 'Paket',
          hargaSatuan: 0,
          jumlahHarga: 0,
          kondisi: 'Baik',
        },
      ],
      totalSebelumPpn: 0,
      dppPpn: 0,
      ppnRate: 0,
      ppnNominal: 0,
      pphRate: 0,
      pphNominal: 0,
      totalPembayaran: 0,
      terbilangCustom: '',
      vendor: {
        namaToko: '',
        namaPemilik: '',
        jabatan: 'Pemilik Toko',
        alamat: '',
        telepon: '',
        npwp: 'Ada',
      },
      school: { ...defaultSchool },
      status: 'Selesai',
      catatan: '',
    };
  });

  const [activeTab, setActiveTab] = useState<'info' | 'vendor' | 'items' | 'officers'>('info');

  // Recalculate totals helper
  const updateCalculations = (
    items: OrderItem[],
    ppnRate: number = formData.ppnRate,
    pphRate: number = formData.pphRate,
    dppPpn?: number,
    manualPpnNominal?: number,
    manualPphNominal?: number
  ) => {
    const totalSebelum = items.reduce((sum, item) => sum + (Number(item.jumlahHarga) || 0), 0);
    const effectiveDpp = dppPpn !== undefined ? dppPpn : (formData.dppPpn || 0);

    const baseForPpn = effectiveDpp > 0 ? effectiveDpp : totalSebelum;
    const ppnNominal =
      manualPpnNominal !== undefined
        ? manualPpnNominal
        : ppnRate > 0
        ? Math.round(baseForPpn * (ppnRate / 100))
        : 0;

    const pphNominal =
      manualPphNominal !== undefined
        ? manualPphNominal
        : pphRate > 0
        ? Math.round(totalSebelum * (pphRate / 100))
        : 0;

    const totalBayar = totalSebelum + ppnNominal;

    setFormData((prev) => ({
      ...prev,
      items,
      totalSebelumPpn: totalSebelum,
      dppPpn: effectiveDpp,
      ppnRate,
      ppnNominal,
      pphRate,
      pphNominal,
      totalPembayaran: totalBayar,
      terbilangCustom: terbilangRupiah(totalBayar, 'lowercase'),
    }));
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const updated = [...formData.items];
    const item = { ...updated[index], [field]: value };

    if (field === 'qty' || field === 'hargaSatuan') {
      const q = field === 'qty' ? Number(value) : item.qty;
      const h = field === 'hargaSatuan' ? Number(value) : item.hargaSatuan;
      item.jumlahHarga = (q || 0) * (h || 0);
    }

    updated[index] = item;
    updateCalculations(updated);
  };

  const addItem = () => {
    const newItem: OrderItem = {
      id: 'item-' + Date.now(),
      uraian: '',
      qty: 1,
      satuan: 'Paket',
      hargaSatuan: 0,
      jumlahHarga: 0,
      kondisi: 'Baik',
    };
    const updated = [...formData.items, newItem];
    updateCalculations(updated);
  };

  const removeItem = (index: number) => {
    if (formData.items.length <= 1) return;
    const updated = formData.items.filter((_, i) => i !== index);
    updateCalculations(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomorPesanan) {
      alert('Mohon isi Nomor Pesanan!');
      return;
    }
    if (!formData.vendor.namaToko) {
      alert('Mohon isi Nama Toko / Penyedia!');
      return;
    }

    // Auto set kategori if empty
    let finalTx = { ...formData };
    if (!finalTx.kategoriBarangJasa && finalTx.items[0]?.uraian) {
      finalTx.kategoriBarangJasa = finalTx.items[0].uraian;
    }
    if (!finalTx.keperluanSPMU) {
      finalTx.keperluanSPMU = `Pembayaran ${finalTx.paketPesanan || finalTx.items[0]?.uraian || 'Barang/Jasa'}`;
    }

    onSave(finalTx);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#085070]" />
              {initialData ? 'Edit Dokumen Transaksi' : 'Buat Transaksi Pengadaan Baru'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              1 Form terpadu otomatis menghasilkan & menghubungkan 4 surat: SP, Perencanaan, BAST, dan SPMU
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 bg-white flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'info'
                ? 'border-[#085070] text-[#085070]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-[#4480A6]" />
            1. Nomor & Tanggal Surat
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('items')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'items'
                ? 'border-[#085070] text-[#085070]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4 text-[#4480A6]" />
            2. Rincian Belanja & Harga ({formData.items.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vendor')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'vendor'
                ? 'border-[#085070] text-[#085070]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Store className="w-4 h-4 text-[#4480A6]" />
            3. Data Rekanan / Toko
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('officers')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'officers'
                ? 'border-[#085070] text-[#085070]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#4480A6]" />
            4. Satuan Pendidikan & Pejabat TTD
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Nomor Surat & Tanggal */}
          {activeTab === 'info' && (
            <div className="space-y-5 animate-in fade-in duration-100">
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-950">
                  <span className="font-bold">Konektivitas 4 Surat:</span> Nomor surat di bawah ini saling tersinkronisasi. BAST akan merujuk Nomor SP, Dokumen Perencanaan merujuk spesifikasi, dan SPMU menerbitkan perintah pencairan ke bendahara.
                </div>
              </div>

              {/* Nomor-nomor surat */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Surat Pesanan (SP) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nomorPesanan}
                    onChange={(e) => setFormData({ ...formData, nomorPesanan: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="042/SD.24/SP/II/2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor BAST (Serah Terima) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nomorBAST}
                    onChange={(e) => setFormData({ ...formData, nomorBAST: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="043/SD.24/SP/II/2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor SPMU (Pengeluaran Uang) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nomorSPMU}
                    onChange={(e) => setFormData({ ...formData, nomorSPMU: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="900.1.3.6 / 22 / SDN. 153 / 2026"
                  />
                </div>
              </div>

              {/* Detail Pekerjaan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Paket Pesanan / Nama Pekerjaan
                  </label>
                  <input
                    type="text"
                    value={formData.paketPesanan}
                    onChange={(e) => setFormData({ ...formData, paketPesanan: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Kegiatan Jual Beli Melalui Toko"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category Barang / Jasa (Dok. Perencanaan)
                  </label>
                  <input
                    type="text"
                    value={formData.kategoriBarangJasa}
                    onChange={(e) => setFormData({ ...formData, kategoriBarangJasa: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Internet 20Mbps / ATK / Buku"
                  />
                </div>
              </div>

              {/* Anggaran & Keperluan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sumber / Alokasi Anggaran
                  </label>
                  <input
                    type="text"
                    value={formData.alokasiAnggaran}
                    onChange={(e) => setFormData({ ...formData, alokasiAnggaran: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="BOS Reguler 2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tahun Anggaran
                  </label>
                  <input
                    type="text"
                    value={formData.tahunAnggaran}
                    onChange={(e) => setFormData({ ...formData, tahunAnggaran: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Dokumen
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Draf">Draf</option>
                    <option value="Selesai">Selesai (Siap Cetak)</option>
                    <option value="Dibayar">Dibayar (Lunas)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Untuk Keperluan (Tercetak di SPMU)
                  </label>
                  <input
                    type="text"
                    value={formData.keperluanSPMU}
                    onChange={(e) => setFormData({ ...formData, keperluanSPMU: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4480A6]"
                    placeholder="Pembayaran Jasa Internet 20Mbps / Pembelian Buku"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Teks Penerima SPMU (Untuk : ...) *
                    </label>
                    <span className="text-[10px] text-[#4480A6] font-semibold">Tercetak di SPMU</span>
                  </div>
                  <input
                    type="text"
                    value={formData.tujuanBendaharaSpmu ?? 'Bendahara BOSP'}
                    onChange={(e) => setFormData({ ...formData, tujuanBendaharaSpmu: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4480A6] font-medium"
                    placeholder="Bendahara BOSP"
                  />
                  {/* Quick pills */}
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400">Pilihan cepat:</span>
                    {['Bendahara BOSP', 'Bendahara BOS Reguler', 'Bendahara Sekolah'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormData({ ...formData, tujuanBendaharaSpmu: option })}
                        className="px-2 py-0.5 text-[10px] bg-[#EBF6FE] hover:bg-[#92D2F9]/40 text-[#085070] rounded border border-[#92D2F9] font-medium transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tanggal-tanggal */}
              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Tanggal & Jadwal Pelaksanaan Dokumen
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Tanggal Surat Pesanan (SP)
                    </label>
                    <input
                      type="date"
                      value={formData.tanggalPesanan}
                      onChange={(e) => {
                        const val = e.target.value;
                        const slash = val ? `${val.slice(8, 10)}/${val.slice(5, 7)}/${val.slice(0, 4)}` : '';
                        setFormData({
                          ...formData,
                          tanggalPesanan: val,
                          tanggalBAST: formData.tanggalBAST || val,
                          tanggalSPMU: formData.tanggalSPMU || val,
                          waktuPengerjaan: formData.waktuPengerjaan || slash,
                          waktuPemrosesan: formData.waktuPemrosesan || slash,
                          waktuPenyelesaian: formData.waktuPenyelesaian || slash,
                        });
                      }}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Tanggal BAST (Serah Terima)
                    </label>
                    <input
                      type="date"
                      value={formData.tanggalBAST}
                      onChange={(e) => setFormData({ ...formData, tanggalBAST: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Tanggal SPMU (Pencairan)
                    </label>
                    <input
                      type="date"
                      value={formData.tanggalSPMU}
                      onChange={(e) => setFormData({ ...formData, tanggalSPMU: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Waktu Pengerjaan (SP)
                    </label>
                    <input
                      type="text"
                      value={formData.waktuPengerjaan}
                      onChange={(e) => setFormData({ ...formData, waktuPengerjaan: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                      placeholder="06/02/2026"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Waktu Pemrosesan (SP)
                    </label>
                    <input
                      type="text"
                      value={formData.waktuPemrosesan}
                      onChange={(e) => setFormData({ ...formData, waktuPemrosesan: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                      placeholder="06/02/2026"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Waktu Penyelesaian (SP & Perencanaan)
                    </label>
                    <input
                      type="text"
                      value={formData.waktuPenyelesaian}
                      onChange={(e) => setFormData({ ...formData, waktuPenyelesaian: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                      placeholder="06/02/2026"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Items & Harga */}
          {activeTab === 'items' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Daftar Rincian Barang / Jasa</h3>
                  <p className="text-[11px] text-slate-500">
                    Otomatis tercatat pada Surat Pesanan, Dokumen Perencanaan, dan Berita Acara Serah Terima
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold rounded-lg transition-colors border border-indigo-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Baris Barang/Jasa
                </button>
              </div>

              {/* Table of items */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5 w-10 text-center">No</th>
                      <th className="p-2.5">Uraian Barang/Jasa</th>
                      <th className="p-2.5 w-24 text-center">Jumlah (Qty)</th>
                      <th className="p-2.5 w-28">Satuan</th>
                      <th className="p-2.5 w-36 text-right">Harga Satuan (Rp)</th>
                      <th className="p-2.5 w-36 text-right">Jumlah Harga (Rp)</th>
                      <th className="p-2.5 w-12 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {formData.items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="p-2 text-center font-medium text-slate-500">{idx + 1}</td>
                        <td className="p-2">
                          <input
                            type="text"
                            required
                            value={item.uraian}
                            onChange={(e) => handleItemChange(idx, 'uraian', e.target.value)}
                            placeholder="Contoh: Internet 20 MBps / Kertas HVS A4"
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="number"
                            min="1"
                            step="any"
                            value={item.qty}
                            onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                            className="w-full text-xs px-2 py-1.5 text-center border border-slate-200 rounded-md"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.satuan}
                            onChange={(e) => handleItemChange(idx, 'satuan', e.target.value)}
                            placeholder="Mbps, Rim, Pcs"
                            className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-md"
                          />
                        </td>
                        <td className="p-2 text-right">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.hargaSatuan}
                            onChange={(e) => handleItemChange(idx, 'hargaSatuan', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 text-right border border-slate-200 rounded-md font-mono"
                          />
                        </td>
                        <td className="p-2 text-right font-mono font-semibold text-slate-700">
                          {formatRupiah(item.jumlahHarga)}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            disabled={formData.items.length <= 1}
                            onClick={() => removeItem(idx)}
                            className={`p-1.5 rounded-md ${
                              formData.items.length <= 1
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-red-500 hover:bg-red-50 hover:text-red-700'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pajak & Ringkasan Perhitungan */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700">Pengaturan Pajak (PPN & PPh)</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Input Manual Persentase & DPP</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Tarif PPN (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={formData.ppnRate || ''}
                          onChange={(e) => {
                            const rate = e.target.value === '' ? 0 : Number(e.target.value);
                            updateCalculations(formData.items, rate, formData.pphRate);
                          }}
                          placeholder="0"
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white pr-7 font-mono"
                        />
                        <span className="absolute right-2.5 top-1.5 text-xs text-slate-400 font-semibold">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Tarif PPh (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={formData.pphRate || ''}
                          onChange={(e) => {
                            const rate = e.target.value === '' ? 0 : Number(e.target.value);
                            updateCalculations(formData.items, formData.ppnRate, rate);
                          }}
                          placeholder="0"
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white pr-7 font-mono"
                        />
                        <span className="absolute right-2.5 top-1.5 text-xs text-slate-400 font-semibold">%</span>
                      </div>
                    </div>
                  </div>

                  {/* DPP PPN (Terhubung ke Surat Pesanan) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-medium text-slate-600">
                        DPP PPN (Rp) <span className="text-indigo-600 font-semibold">(Tercetak di Surat Pesanan)</span>
                      </label>
                      {formData.totalSebelumPpn > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            updateCalculations(
                              formData.items,
                              formData.ppnRate,
                              formData.pphRate,
                              formData.totalSebelumPpn
                            );
                          }}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium underline"
                        >
                          Isi Otomatis dari Total Belanja
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-semibold">Rp</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={formData.dppPpn ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          updateCalculations(
                            formData.items,
                            formData.ppnRate,
                            formData.pphRate,
                            val
                          );
                        }}
                        placeholder="Contoh: 710000"
                        className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Nilai DPP PPN ini otomatis tercetak pada baris DPP PPN di Surat Pesanan.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Kondisi Fisik Barang (untuk BAST)
                    </label>
                    <input
                      type="text"
                      value={formData.items[0]?.kondisi || 'Baik'}
                      onChange={(e) => {
                        const val = e.target.value;
                        const updated = formData.items.map((it) => ({ ...it, kondisi: val }));
                        setFormData({ ...formData, items: updated });
                      }}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      placeholder="Baik, Lengkap, Berfungsi normal"
                    />
                  </div>
                </div>

                {/* Subtotal summary card */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Sebelum PPN:</span>
                    <span className="font-mono font-semibold">{formatRupiah(formData.totalSebelumPpn, true)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>DPP PPN:</span>
                    <span className="font-mono text-slate-700">
                      {formData.dppPpn ? formatRupiah(formData.dppPpn, true) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>PPN ({formData.ppnRate}%):</span>
                    <div className="flex items-center gap-1 font-mono">
                      <span>Rp</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.ppnNominal || ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          updateCalculations(
                            formData.items,
                            formData.ppnRate,
                            formData.pphRate,
                            formData.dppPpn,
                            val,
                            formData.pphNominal
                          );
                        }}
                        placeholder="0"
                        className="w-24 text-right px-1.5 py-0.5 border border-slate-200 rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-amber-700">
                    <span>PPh ({formData.pphRate}%):</span>
                    <div className="flex items-center gap-1 font-mono">
                      <span>Rp</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.pphNominal || ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          updateCalculations(
                            formData.items,
                            formData.ppnRate,
                            formData.pphRate,
                            formData.dppPpn,
                            formData.ppnNominal,
                            val
                          );
                        }}
                        placeholder="0"
                        className="w-24 text-right px-1.5 py-0.5 border border-slate-200 rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                    <span>Total Pembayaran:</span>
                    <span className="text-indigo-600 font-mono">{formatRupiah(formData.totalPembayaran, true)}</span>
                  </div>

                  {/* Terbilang live preview */}
                  <div className="pt-2 border-t border-dashed border-slate-200">
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                      Terbilang Otomatis (Rupiah):
                    </label>
                    <input
                      type="text"
                      value={formData.terbilangCustom || terbilangRupiah(formData.totalPembayaran, 'lowercase')}
                      onChange={(e) => setFormData({ ...formData, terbilangCustom: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded italic text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Rekanan / Toko */}
          {activeTab === 'vendor' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3">
                <Store className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold">Informasi Pihak Pertama (Penyedia/Rekanan):</span> Tercatat pada tanda tangan Surat Pesanan, Pihak Pertama pada BAST, dan nama penerima di SPMU ("Kepada : [Nama Toko]").
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Toko / Perusahaan / Badan Usaha *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vendor.namaToko}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vendor: { ...formData.vendor, namaToko: e.target.value },
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-semibold"
                    placeholder="Contoh: Annis Net / Pabelan Cerdas"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Pemilik / Direktur / Penanggung Jawab
                  </label>
                  <input
                    type="text"
                    value={formData.vendor.namaPemilik}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vendor: { ...formData.vendor, namaPemilik: e.target.value },
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Contoh: M. Naja / H. Suherman"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jabatan Penyedia
                  </label>
                  <input
                    type="text"
                    value={formData.vendor.jabatan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vendor: { ...formData.vendor, jabatan: e.target.value },
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Pemilik Toko / Direktur"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.vendor.telepon}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vendor: { ...formData.vendor, telepon: e.target.value },
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="0878-7155-5593"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Lengkap Toko / Penyedia
                  </label>
                  <textarea
                    rows={2}
                    value={formData.vendor.alamat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vendor: { ...formData.vendor, alamat: e.target.value },
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Contoh: Silebu / Jl. Raya Kragilan No. 12"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NPWP Penyedia
                  </label>
                  <input
                    type="text"
                    value={formData.vendor.npwp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vendor: { ...formData.vendor, npwp: e.target.value },
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="Ada / 31.425.678.9-412.000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Satuan Pendidikan & Pejabat */}
          {activeTab === 'officers' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-start gap-3">
                <Building2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900">
                  <span className="font-bold">Kop Surat & Pejabat Sekolah:</span> Data ini menentukan teks pada Kop Surat dan tanda tangan Kepala Sekolah, Pelaksana Kegiatan, dan Pemeriksa Barang.
                </div>
              </div>

              {/* Data Satuan Pendidikan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Satuan Pendidikan / Sekolah *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.school.namaSekolah}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        school: { ...formData.school, namaSekolah: e.target.value },
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-bold"
                    placeholder="SD NEGERI SILEBU 4"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kecamatan / Kota Tanda Tangan
                  </label>
                  <input
                    type="text"
                    value={formData.school.kotaKecamatan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        school: { ...formData.school, kotaKecamatan: e.target.value },
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Kragilan / Lebak Wangi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Satuan Pendidikan
                </label>
                <textarea
                  rows={2}
                  value={formData.school.alamatSekolah}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      school: { ...formData.school, alamatSekolah: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Kp. Silebu Tegal Ds. Silebu Kec. Kragilan Kab. Serang Kode POS. 42184"
                />
              </div>

              {/* Pejabat Tanda Tangan */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-xs font-bold text-slate-800 mb-3">Pejabat yang Bertanda Tangan</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Kepala Sekolah */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      Kepala Sekolah (SPMU & BAST Pihak Kedua)
                    </span>
                    <input
                      type="text"
                      value={formData.school.namaKepalaSekolah}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          school: { ...formData.school, namaKepalaSekolah: e.target.value },
                        })
                      }
                      placeholder="Nama Lengkap & Gelar (Mohamad Yusup, S.Pd)"
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                    <input
                      type="text"
                      value={formData.school.nipKepalaSekolah}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          school: { ...formData.school, nipKepalaSekolah: e.target.value },
                        })
                      }
                      placeholder="NIP: 19681212 199704 1 003"
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>

                  {/* Pelaksana Kegiatan */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      Pelaksana Kegiatan (Surat Pesanan & Dok. Perencanaan)
                    </span>
                    <input
                      type="text"
                      value={formData.school.namaPelaksana}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          school: { ...formData.school, namaPelaksana: e.target.value },
                        })
                      }
                      placeholder="Nama Lengkap & Gelar (Mohamad Yusup, S.Pd)"
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                    <input
                      type="text"
                      value={formData.school.nipPelaksana}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          school: { ...formData.school, nipPelaksana: e.target.value },
                        })
                      }
                      placeholder="NIP: 19681212 199704 1 003"
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  {/* Bendahara */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama / Sebutan Bendahara (Penerima Perintah SPMU)
                    </label>
                    <input
                      type="text"
                      value={formData.school.namaBendahara}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          school: { ...formData.school, namaBendahara: e.target.value },
                        })
                      }
                      placeholder="Bendahara BOSP"
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>

                  {/* Pemeriksa Barang */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Pemeriksa Barang (Tanda Tangan BAST Bawah)
                    </label>
                    <input
                      type="text"
                      value={formData.school.namaPemeriksa}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          school: { ...formData.school, namaPemeriksa: e.target.value },
                        })
                      }
                      placeholder="Mohamad Yusup, S.Pd"
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Semua 4 dokumen akan tersimpan dan saling terhubung.
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 bg-[#085070] hover:bg-[#063D56] text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-[#085070]/20 transition-all"
              >
                <Check className="w-4 h-4 text-[#92D2F9]" />
                Simpan Transaksi & 4 Dokumen
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
