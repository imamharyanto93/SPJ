import React from 'react';
import { TransactionDocument } from '../../types/procurement';
import { formatRupiah, formatTanggalIndonesia, terbilangRupiah } from '../../utils/terbilang';
import { KopSurat } from './KopSurat';

interface SuratPesananDocProps {
  tx: TransactionDocument;
}

export const SuratPesananDoc: React.FC<SuratPesananDocProps> = ({ tx }) => {
  const terbilangText = tx.terbilangCustom || terbilangRupiah(tx.totalPembayaran, 'lowercase');
  const tanggalFormat = formatTanggalIndonesia(tx.tanggalPesanan);
  const lokasiTtd = tx.school.kotaKecamatan || 'Kragilan';

  return (
    <div className="doc-font bg-white text-black text-[11px] leading-normal p-6 md:p-8 max-w-[210mm] mx-auto min-h-[297mm] shadow-md border border-slate-200 print:shadow-none print:border-none print:p-0 print:min-h-0 print:h-auto print:max-w-none print:w-full print:m-0">
      {/* Kop Surat */}
      <KopSurat school={tx.school} />

      {/* Judul Dokumen */}
      <div className="text-center my-3">
        <h2 className="text-[13px] font-bold tracking-wider underline uppercase text-black inline-block">
          SURAT PESANAN
        </h2>
      </div>

      {/* Kotak Informasi Pesanan (Table Border) */}
      <div className="border border-black mb-3 text-[10.5px]">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b border-black">
              {/* Kolom Kiri: Paket Pesanan */}
              <td className="w-1/2 p-1.5 align-top border-r border-black">
                <div className="font-medium text-black">Paket Pesanan :</div>
                <div className="mt-0.5 font-normal">{tx.paketPesanan}</div>
              </td>
              {/* Kolom Kanan: Nama Satuan Pendidikan, No Pesanan, Tanggal */}
              <td className="w-1/2 p-1.5 align-top">
                <div className="grid grid-cols-[145px_10px_1fr] gap-0.5">
                  <span>Nama Satuan Pendidikan</span>
                  <span>:</span>
                  <span className="font-semibold uppercase">{tx.school.namaSekolah}</span>

                  <span>Nomor Pesanan</span>
                  <span>:</span>
                  <span className="font-semibold">{tx.nomorPesanan}</span>

                  <span>Tanggal Pesanan</span>
                  <span>:</span>
                  <span>{tanggalFormat}</span>
                </div>
              </td>
            </tr>

            {/* Baris Tanggal Negosiasi */}
            <tr className="border-b border-black">
              <td className="p-1 border-r border-black"></td>
              <td className="p-1.5">
                <div className="grid grid-cols-[145px_10px_1fr] gap-0.5">
                  <span>Tanggal Negosiasi</span>
                  <span>:</span>
                  <span>{tx.tanggalNegosiasi ? formatTanggalIndonesia(tx.tanggalNegosiasi) : ''}</span>
                </div>
              </td>
            </tr>

            {/* Baris Waktu Pengerjaan / Pemrosesan / Penyelesaian */}
            <tr>
              <td className="p-1.5 align-top border-r border-black">
                <div className="grid grid-cols-[165px_10px_1fr] gap-0.5">
                  <span>Waktu Pengerjaan Pesanan</span>
                  <span>:</span>
                  <span>{tx.waktuPengerjaan || tx.tanggalPesanan}</span>

                  <span>Waktu Pemrosesan Pesanan</span>
                  <span>:</span>
                  <span>{tx.waktuPemrosesan || tx.tanggalPesanan}</span>

                  <span>Waktu Penyelesaian Pesanan</span>
                  <span>:</span>
                  <span>{tx.waktuPenyelesaian || tx.tanggalPesanan}</span>
                </div>
              </td>
              <td className="p-1.5 align-top"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tabel Rincian Pekerjaan */}
      <table className="w-full border-collapse border border-black mb-3 text-[10.5px]">
        <thead>
          <tr>
            <th
              colSpan={6}
              className="border border-black bg-slate-200 py-1 text-center font-bold tracking-wider text-[11px]"
            >
              RINCIAN PEKERJAAN
            </th>
          </tr>
          <tr className="bg-white text-center font-semibold border-b border-black">
            <th className="border border-black p-1 w-[35px]">No</th>
            <th className="border border-black p-1 text-left">Uraian Barang/Jasa</th>
            <th className="border border-black p-1 w-[90px]">Jumlah ( QTY )</th>
            <th className="border border-black p-1 w-[85px]">Satuan Ukuran</th>
            <th className="border border-black p-1 w-[100px] text-right">Harga Satuan</th>
            <th className="border border-black p-1 w-[105px] text-right">Jumlah Harga</th>
          </tr>
        </thead>
        <tbody>
          {tx.items.map((item, idx) => (
            <tr key={item.id || idx} className="align-top border-b border-black">
              <td className="border border-black p-1 text-center">{idx + 1}</td>
              <td className="border border-black p-1 font-medium">{item.uraian}</td>
              <td className="border border-black p-1 text-center">{item.qty}</td>
              <td className="border border-black p-1 text-center">{item.satuan}</td>
              <td className="border border-black p-1 text-right">{formatRupiah(item.hargaSatuan)}</td>
              <td className="border border-black p-1 text-right">{formatRupiah(item.jumlahHarga)}</td>
            </tr>
          ))}

          {/* Spacer row jika item sedikit */}
          {tx.items.length === 1 && (
            <tr className="h-6 border-b border-black">
              <td className="border border-black"></td>
              <td className="border border-black"></td>
              <td className="border border-black"></td>
              <td className="border border-black"></td>
              <td className="border border-black"></td>
              <td className="border border-black"></td>
            </tr>
          )}

          {/* Subtotal & Ringkasan Pajak */}
          <tr className="border-t border-black font-semibold">
            <td colSpan={4} className="border-none"></td>
            <td className="border border-black p-1 text-right font-medium">Total Sebelum PPN ( Rp )</td>
            <td className="border border-black p-1 text-right font-bold">{formatRupiah(tx.totalSebelumPpn)}</td>
          </tr>
          <tr>
            <td colSpan={4} className="border-none"></td>
            <td className="border border-black p-1 text-right">DPP PPN ( Rp )</td>
            <td className="border border-black p-1 text-right">
              {tx.dppPpn ? formatRupiah(tx.dppPpn) : ''}
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="border-none"></td>
            <td className="border border-black p-1 text-right">PPN ( Rp )</td>
            <td className="border border-black p-1 text-right">
              {tx.ppnNominal > 0 ? formatRupiah(tx.ppnNominal) : ''}
            </td>
          </tr>
          <tr className="font-semibold">
            <td colSpan={4} className="border-none"></td>
            <td className="border border-black p-1 text-right font-medium">Total Pembayaran ( Rp )</td>
            <td className="border border-black p-1 text-right font-bold">{formatRupiah(tx.totalPembayaran)}</td>
          </tr>
          <tr>
            <td colSpan={4} className="border-none"></td>
            <td className="border border-black p-1 text-right">PPh ( Rp )</td>
            <td className="border border-black p-1 text-right">
              {tx.pphNominal > 0 ? formatRupiah(tx.pphNominal) : ''}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Terbilang Box */}
      <div className="border border-black p-1.5 mb-2 font-medium">
        <span className="font-bold italic">Terbilang : </span>
        <span className="italic">{terbilangText}</span>
      </div>

      {/* Instruksi ke Penyedia dan Satuan Pendidikan */}
      <div className="border border-black p-2 text-[9.5px] leading-tight mb-4">
        <div className="font-bold underline mb-1">Instruksi ke Penyedia dan Satuan Pendidikan</div>
        <ol className="list-decimal pl-4 space-y-0.5">
          <li>
            Penyedia berkewajiban untuk menyediakan barang/jasa sesuai dengan surat pesanan dan dalam jangka waktu transaksi yang berlaku
          </li>
          <li>
            Penyedia berhak memintakan pembayaran sesuai total pembayaran setelah penyelesaian pekerjaan yang dimintakan pada Surat Pesanan ini dan dibuktikan dengan Berita Acara Serah Terima.
          </li>
          <li>
            Pelaksana dalam kapasitas mewakili Satuan Pendidikan berhak untuk mendapatkan barang atau jasa sesuai Surat Pesanan ini.
          </li>
          <li>Pelaksana berhak menolak barang/jasa yang tidak sesuai dengan surat pesanan</li>
          <li>
            Pelaksana dalam kapasitas mewakili Satuan Pendidikan berkewajiban untuk menyelesaikan pembayaran sesuai dengan mekanisme pembayaran yang berlaku pada sistem.
          </li>
          <li>
            Segala perselisihan yang timbul dari Surat Pesanan ini diselesaikan antara para pihak sesuai ketentuan yang berlaku
          </li>
        </ol>
      </div>

      {/* Tanda Tangan */}
      <div className="grid grid-cols-2 gap-4 mt-6 text-[10.5px]">
        {/* Pihak Penyedia */}
        <div className="text-left pl-2">
          <div>Penyedia</div>
          <div className="h-16"></div>
          <div className="font-bold underline text-[11px]">
            {tx.vendor.namaPemilik || '....................................'}
          </div>
          <div className="mt-0.5 font-medium">Toko: {tx.vendor.namaToko}</div>
        </div>

        {/* Pihak Pelaksana */}
        <div className="text-right pr-2">
          <div>
            {lokasiTtd}, {tanggalFormat}
          </div>
          <div className="mt-0.5">{tx.school.jabatanPelaksana || 'Pelaksana'}</div>
          <div className="h-16"></div>
          <div className="font-bold underline text-[11px]">{tx.school.namaPelaksana}</div>
          <div className="mt-0.5">NIP. {tx.school.nipPelaksana}</div>
        </div>
      </div>
    </div>
  );
};
