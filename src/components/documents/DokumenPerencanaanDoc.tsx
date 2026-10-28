import React from 'react';
import { TransactionDocument } from '../../types/procurement';
import { formatTanggalIndonesia, formatTanggalSlash } from '../../utils/terbilang';

interface DokumenPerencanaanDocProps {
  tx: TransactionDocument;
}

export const DokumenPerencanaanDoc: React.FC<DokumenPerencanaanDocProps> = ({ tx }) => {
  const tanggalFormat = formatTanggalIndonesia(tx.tanggalPesanan);
  const lokasiTtd = tx.school.kotaKecamatan || 'Kragilan';
  const waktuSerahTerima = tx.waktuPenyelesaian || formatTanggalSlash(tx.tanggalBAST || tx.tanggalPesanan);

  return (
    <div className="doc-font bg-white text-black text-[11px] leading-normal p-8 md:p-10 max-w-[210mm] mx-auto min-h-[297mm] shadow-md border border-slate-200 print:shadow-none print:border-none print:p-0">
      {/* Judul Dokumen */}
      <div className="text-center my-6">
        <h1 className="text-[14px] font-bold tracking-wide uppercase text-black inline-block">
          Dokumen Perencanaan
        </h1>
      </div>

      {/* Header Info Satuan Pendidikan */}
      <div className="mb-5 text-[11px] leading-relaxed">
        <div className="grid grid-cols-[160px_12px_1fr] gap-1">
          <span>Nama Satuan Pendidikan</span>
          <span>:</span>
          <span className="font-bold uppercase">{tx.school.namaSekolah}</span>

          <span>Alamat Satuan Pendidikan</span>
          <span>:</span>
          <span>{tx.school.alamatSekolah}</span>

          <span>Category Barang / Jasa</span>
          <span>:</span>
          <span>{tx.kategoriBarangJasa || (tx.items[0]?.uraian ?? '')}</span>
        </div>
      </div>

      {/* Tabel Dokumen Perencanaan */}
      <table className="w-full border-collapse border border-black mb-8 text-[11px]">
        <thead>
          <tr className="border-b border-black text-center font-bold">
            <th className="border border-black p-2 w-[45px]">No</th>
            <th className="border border-black p-2 w-[240px]">Jenis</th>
            <th className="border border-black p-2 text-center">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {/* Row 1: Jumlah Barang / Jasa */}
          <tr className="border-b border-black">
            <td className="border border-black p-2 text-center align-top">1</td>
            <td className="border border-black p-2 align-top">Jumlah Barang / Jasa</td>
            <td className="border border-black p-2 align-top"></td>
          </tr>

          {/* Row 2: Spesifikasi / ruang lingkup barang / jasa */}
          <tr className="border-b border-black">
            <td className="border border-black p-2 text-center align-top">2</td>
            <td className="border border-black p-2 align-top">
              Spesifikasi / ruang lingkup barang / jasa
            </td>
            <td className="border border-black p-0 align-top">
              <table className="w-full border-collapse h-full">
                <tbody>
                  {tx.items.map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      className={idx > 0 ? 'border-t border-black' : ''}
                    >
                      <td className="w-12 p-2 border-r border-black text-center align-middle">
                        {idx + 1}
                      </td>
                      <td className="p-2 align-middle font-medium">
                        {item.uraian}
                        {item.qty > 0 && ` (${item.qty} ${item.satuan})`}
                      </td>
                    </tr>
                  ))}
                  {/* Space filler to match height in screenshot 2 */}
                  <tr className="h-16">
                    <td className="border-r border-black"></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Row 3: Waktu serah terima */}
          <tr className="border-b border-black">
            <td className="border border-black p-2 text-center align-top">3</td>
            <td className="border border-black p-2 align-top">Waktu serah terima</td>
            <td className="border border-black p-2 text-center align-top font-medium">
              {waktuSerahTerima}
            </td>
          </tr>

          {/* Row 4: Lokasi serah terima */}
          <tr className="border-b border-black">
            <td className="border border-black p-2 text-center align-top">4</td>
            <td className="border border-black p-2 align-top">Lokasi serah terima</td>
            <td className="border border-black p-2 text-center align-top">
              {tx.lokasiSerahTerima || tx.school.namaSekolah}
            </td>
          </tr>

          {/* Row 5: Alokasi anggaran */}
          <tr className="border-b border-black">
            <td className="border border-black p-2 text-center align-top">5</td>
            <td className="border border-black p-2 align-top">Alokasi anggaran</td>
            <td className="border border-black p-2 text-center align-top font-medium">
              {tx.alokasiAnggaran || 'BOS Reguler 2026'}
            </td>
          </tr>

          {/* Row 6: Persyaratan Penyedia */}
          <tr>
            <td className="border border-black p-2 text-center align-top">6</td>
            <td className="border border-black p-2 align-top">Persyaratan Penyedia</td>
            <td className="border border-black p-2 align-top whitespace-pre-line text-left leading-relaxed">
              {tx.persyaratanPenyedia ||
                'Perorangan/Badan Usaha Memenuhi syarat sebagai berikut :\na. Identitas Penyedia\nb. NPWP'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Tanda Tangan Pelaksana di Kanan Bawah */}
      <div className="flex justify-end mt-12 text-[10.5px]">
        <div className="text-right w-64 pr-2">
          <div>
            {lokasiTtd}, {tanggalFormat}
          </div>
          <div className="mt-0.5">{tx.school.jabatanPelaksana || 'Pelaksana'}</div>
          <div className="h-20"></div>
          <div className="font-bold underline text-[11px]">{tx.school.namaPelaksana}</div>
          <div className="mt-0.5">NIP. {tx.school.nipPelaksana}</div>
        </div>
      </div>
    </div>
  );
};
