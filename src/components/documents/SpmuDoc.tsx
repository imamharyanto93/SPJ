import React from 'react';
import { TransactionDocument } from '../../types/procurement';
import { formatRupiah, formatTanggalIndonesia, terbilangRupiah } from '../../utils/terbilang';
import { KopSurat } from './KopSurat';

interface SpmuDocProps {
  tx: TransactionDocument;
}

export const SpmuDoc: React.FC<SpmuDocProps> = ({ tx }) => {
  const tanggalFormat = formatTanggalIndonesia(tx.tanggalSPMU || tx.tanggalPesanan);
  const lokasiTtd = tx.school.kotaKecamatan || 'Lebak Wangi';
  const terbilangText = tx.terbilangCustom || terbilangRupiah(tx.totalPembayaran, 'capitalize');

  return (
    <div className="doc-font bg-white text-black text-[12px] leading-relaxed p-8 md:p-12 max-w-[210mm] mx-auto min-h-[297mm] shadow-md border border-slate-200 print:shadow-none print:border-none print:p-0 print:min-h-0 print:h-auto print:max-w-none print:w-full print:m-0">
      {/* Kop Surat (Identik dengan BAST & Surat Pesanan) */}
      <KopSurat school={tx.school} />

      {/* Judul Dokumen */}
      <div className="text-center my-6">
        <h2 className="text-[14px] font-bold tracking-wider uppercase text-black leading-tight">
          SURAT PERINTAH
        </h2>
        <h2 className="text-[14px] font-bold tracking-wider uppercase text-black leading-tight">
          MENGELUARKAN UANG (SPMU)
        </h2>
        <div className="text-[12px] font-medium mt-1">
          Nomor : {tx.nomorSPMU}
        </div>
      </div>

      {/* Identitas Pemberi & Penerima Perintah */}
      <div className="my-6 space-y-1.5 text-[12px]">
        <div className="grid grid-cols-[80px_15px_1fr] gap-1 items-baseline">
          <span className="font-medium">Dari</span>
          <span>:</span>
          <span className="font-semibold">
            Kepala Sekolah {tx.school.namaSekolah}
          </span>
        </div>
        <div className="grid grid-cols-[80px_15px_1fr] gap-1 items-baseline">
          <span className="font-medium">Untuk</span>
          <span>:</span>
          <span className="font-semibold">{tx.tujuanBendaharaSpmu || tx.school.namaBendahara || 'Bendahara BOSP'}</span>
        </div>
      </div>

      {/* Dana Sebesar */}
      <div className="my-8 space-y-4 text-[12px]">
        <div className="grid grid-cols-[200px_15px_60px_1fr] gap-1 items-baseline">
          <span className="font-medium">Berikan/ keluarkan dana sebesar</span>
          <span>:</span>
          <span className="font-bold text-[15px] italic">Rp</span>
          <span className="font-bold text-[15px] tracking-wide">
            {formatRupiah(tx.totalPembayaran)}
          </span>
        </div>

        {/* Terbilang */}
        <div className="grid grid-cols-[200px_15px_1fr] gap-1 items-baseline">
          <span className="font-medium">Terbilang</span>
          <span>:</span>
          <span className="font-bold italic text-[13px] leading-relaxed">
            {terbilangText}
          </span>
        </div>
      </div>

      {/* Kepada Toko / Penyedia */}
      <div className="my-10 text-center">
        <div className="text-[12px] font-normal mb-2">Kepada :</div>
        <div className="inline-block min-w-[360px] max-w-full pb-1 border-b-2 border-black">
          <span className="text-[17px] font-extrabold uppercase tracking-wide">
            {tx.vendor.namaToko}
          </span>
        </div>
      </div>

      {/* Untuk Keperluan */}
      <div className="my-8 text-[12px]">
        <div className="grid grid-cols-[140px_15px_1fr] gap-1 items-baseline">
          <span className="font-medium">Untuk Keperluan</span>
          <span>:</span>
          <span className="font-bold text-[13px] leading-normal">
            {tx.keperluanSPMU || tx.paketPesanan || `Pembelian ${tx.items[0]?.uraian || 'Barang/Jasa'}`}
          </span>
        </div>
      </div>

      {/* Tanda Tangan Kanan Bawah */}
      <div className="flex justify-end mt-16 text-[12px]">
        <div className="text-left w-72 pr-2">
          <div>
            {lokasiTtd}, {tanggalFormat}
          </div>
          <div>Kepala Sekolah</div>
          <div className="font-semibold uppercase">{tx.school.namaSekolah}</div>
          <div className="h-24"></div>
          <div className="font-bold underline text-[13px] inline-block">
            {tx.school.namaKepalaSekolah}
          </div>
          <div className="mt-0.5">NIP. {tx.school.nipKepalaSekolah}</div>
        </div>
      </div>
    </div>
  );
};
