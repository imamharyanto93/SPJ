import React from 'react';
import { TransactionDocument } from '../../types/procurement';
import {
  formatTanggalIndonesia,
  formatTanggalTerbilangBAST,
} from '../../utils/terbilang';
import { KopSurat } from './KopSurat';

interface BastDocProps {
  tx: TransactionDocument;
}

export const BastDoc: React.FC<BastDocProps> = ({ tx }) => {
  const tanggalTerbilang = formatTanggalTerbilangBAST(tx.tanggalBAST || tx.tanggalPesanan);
  const tanggalSpFormat = formatTanggalIndonesia(tx.tanggalPesanan);

  return (
    <div className="doc-font bg-white text-black text-[10.5px] leading-relaxed p-6 md:p-8 max-w-[210mm] mx-auto min-h-[297mm] shadow-md border border-slate-200 print:shadow-none print:border-none print:p-0">
      {/* Kop Surat */}
      <KopSurat school={tx.school} />

      {/* Judul Dokumen */}
      <div className="text-center my-3">
        <h2 className="text-[13px] font-bold tracking-wider underline uppercase text-black inline-block">
          BERITA ACARA SERAH TERIMA
        </h2>
        <div className="text-[11px] font-medium mt-0.5">
          Nomor : {tx.nomorBAST}
        </div>
      </div>

      {/* Kalimat Pembuka BAST */}
      <div className="mb-2.5">
        <p className="text-justify font-normal">{tanggalTerbilang}</p>
      </div>

      {/* Sesuai dengan */}
      <div className="mb-2.5 text-[10px]">
        <div className="font-normal mb-0.5">sesuai dengan :</div>
        <div className="grid grid-cols-[140px_10px_1fr] gap-0.5 pl-1">
          <span>Nomor Surat Pesanan</span>
          <span>:</span>
          <span className="font-semibold">{tx.nomorPesanan}</span>

          <span>Tanggal</span>
          <span>:</span>
          <span>{tanggalSpFormat}</span>

          <span>Nama Pekerjaan</span>
          <span>:</span>
          <span>{tx.paketPesanan}</span>

          <span>Tahun</span>
          <span>:</span>
          <span>{tx.tahunAnggaran || '2026'}</span>
        </div>
      </div>

      {/* Yang bertanda tangan di bawah ini */}
      <div className="mb-2.5 text-[10px]">
        <div className="font-normal mb-1">Yang bertanda tangan di bawah ini :</div>

        {/* Pihak 1: Penyedia */}
        <div className="mb-2">
          <div className="grid grid-cols-[20px_120px_10px_1fr] gap-0.5">
            <span className="font-semibold">1</span>
            <span>Nama</span>
            <span>:</span>
            <span className="font-semibold">{tx.vendor.namaPemilik || '-'}</span>

            <span></span>
            <span>Jabatan</span>
            <span>:</span>
            <span>{tx.vendor.jabatan || 'Pemilik Toko'}</span>

            <span></span>
            <span>Nama Penyedia</span>
            <span>:</span>
            <span className="font-semibold uppercase">{tx.vendor.namaToko}</span>

            <span></span>
            <span>Alamat Penyedia</span>
            <span>:</span>
            <span>{tx.vendor.alamat}</span>

            <span></span>
            <span>No. Telepon</span>
            <span>:</span>
            <span>{tx.vendor.telepon || '-'}</span>
          </div>
          <div className="pl-6 mt-0.5 italic text-black">
            Sebagai pihak yang menyerahkan, selanjutnya disebut <span className="font-bold">PIHAK PERTAMA</span>
          </div>
        </div>

        {/* Pihak 2: Sekolah / Penerima */}
        <div className="mb-2">
          <div className="grid grid-cols-[20px_120px_10px_1fr] gap-0.5">
            <span className="font-semibold">2</span>
            <span>Nama</span>
            <span>:</span>
            <span className="font-semibold">{tx.school.namaKepalaSekolah}</span>

            <span></span>
            <span>Jabatan</span>
            <span>:</span>
            <span>{tx.school.jabatanKepalaSekolah || 'Kepala Sekolah'}</span>

            <span></span>
            <span>Nama Sekolah</span>
            <span>:</span>
            <span className="font-semibold uppercase">{tx.school.namaSekolah}</span>

            <span></span>
            <span>Alamat Sekolah</span>
            <span>:</span>
            <span>{tx.school.kotaKecamatan || tx.school.alamatSekolah}</span>

            <span></span>
            <span>No. Telepon</span>
            <span>:</span>
            <span>{tx.school.teleponSekolah || '-'}</span>
          </div>
          <div className="pl-6 mt-0.5 italic text-black">
            Sebagai pihak yang menerima, selanjutnya disebut <span className="font-bold">PIHAK KEDUA</span>
          </div>
        </div>
      </div>

      {/* Kalimat Penyerahan */}
      <div className="mb-2.5 text-justify text-[10px]">
        <p>
          PIHAK PERTAMA Menyerahkan hasil pekerjaan pengiriman barang atas kegiatan jual beli kepada PIHAK KEDUA, dan PIHAK KEDUA telah menerima hasil pekerjaan tersebut dalam jumlah yang lengkap dan kondisi yang baik sesuai dengan rincian berikut :
        </p>
      </div>

      {/* Tabel Rincian Barang Diserahkan */}
      <table className="w-full border-collapse border border-black mb-3 text-[10px]">
        <thead>
          <tr className="bg-slate-50 text-center font-semibold border-b border-black">
            <th className="border border-black p-1 w-[35px]">No</th>
            <th className="border border-black p-1 text-left">Nama Barang</th>
            <th className="border border-black p-1 w-[120px]">Jumlah Diserahkan</th>
            <th className="border border-black p-1 w-[120px]">Jumlah Diterima</th>
            <th className="border border-black p-1 w-[80px]">Kondisi</th>
          </tr>
        </thead>
        <tbody>
          {tx.items.map((item, idx) => (
            <tr key={item.id || idx} className="border-b border-black">
              <td className="border border-black p-1 text-center">{idx + 1}</td>
              <td className="border border-black p-1 font-medium">{item.uraian}</td>
              <td className="border border-black p-1 text-center">
                {item.qty} {item.satuan}
              </td>
              <td className="border border-black p-1 text-center">
                {item.qty} {item.satuan}
              </td>
              <td className="border border-black p-1 text-center font-medium">
                {item.kondisi || 'Baik'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paragraf Penutup */}
      <div className="mb-4 text-justify text-[10px] space-y-1.5">
        <p>
          Berita Acara Serah terima ini berfungsi sebagai bukti serah terima hasil pekerjaan kepada PIHAK KEDUA, untuk selanjutnya dicatat pada buku penerimaan barang Satuan Pendidikan.
        </p>
        <p>
          Demikian Berita Acara Serah Terima ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana seharusnya.
        </p>
      </div>

      {/* Tanda Tangan 3 Pihak */}
      <div className="grid grid-cols-2 gap-4 mt-4 text-[10px]">
        {/* Pihak Kedua (Sekolah) */}
        <div className="text-left pl-4">
          <div className="font-bold">PIHAK KEDUA</div>
          <div className="h-16"></div>
          <div className="font-bold underline text-[10.5px]">{tx.school.namaKepalaSekolah}</div>
          <div className="mt-0.5">NIP. {tx.school.nipKepalaSekolah}</div>
        </div>

        {/* Pihak Pertama (Penyedia) */}
        <div className="text-right pr-4">
          <div className="font-bold">PIHAK PERTAMA</div>
          <div className="h-16"></div>
          <div className="tracking-widest">....................................</div>
          <div className="mt-1 font-bold">Toko : {tx.vendor.namaToko}</div>
        </div>
      </div>

      {/* Pemeriksa Barang (Tengah Bawah) */}
      <div className="mt-5 text-center text-[10px]">
        <div className="font-bold uppercase tracking-wide">PEMERIKSA BARANG</div>
        <div className="h-16"></div>
        <div className="font-bold underline text-[10.5px] inline-block">
          {tx.school.namaPemeriksa || tx.school.namaPelaksana || tx.school.namaKepalaSekolah}
        </div>
        <div className="mt-0.5">
          NIP. {tx.school.nipPemeriksa || tx.school.nipPelaksana || tx.school.nipKepalaSekolah}
        </div>
      </div>
    </div>
  );
};
