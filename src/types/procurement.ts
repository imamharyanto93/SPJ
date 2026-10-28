export interface SchoolProfile {
  namaInstansiAtas: string; // e.g. "PEMERINTAH KABUPATEN SERANG"
  namaDinas: string; // e.g. "DINAS PENDIDIKAN DAN KEBUDAYAAN KABUPATEN SERANG"
  namaSekolah: string; // e.g. "SD NEGERI SILEBU 4"
  alamatSekolah: string; // e.g. "Kp. Silebu Tegal Ds. Silebu Kec. Kragilan Kab. Serang Kode POS. 42184"
  teleponSekolah: string; // e.g. "0838-1276-1308"
  emailSekolah?: string; // e.g. "sdnsilebu4@gmail.com"
  npsn?: string; // e.g. "20605263"
  nss?: string; // e.g. "1012101280411020"
  kotaKecamatan: string; // e.g. "Kragilan" (untuk lokasi ttd)
  namaKepalaSekolah: string; // e.g. "Mohamad Yusup, S.Pd"
  nipKepalaSekolah: string; // e.g. "19681212 199704 1 003"
  jabatanKepalaSekolah: string; // e.g. "Kepala Sekolah"
  namaPelaksana: string; // e.g. "Mohamad Yusup, S.Pd"
  nipPelaksana: string; // e.g. "19681212 199704 1 003"
  jabatanPelaksana: string; // e.g. "Pelaksana"
  namaBendahara: string; // e.g. "Bendahara BOSP"
  namaPemeriksa: string; // e.g. "Mohamad Yusup, S.Pd"
  nipPemeriksa: string; // e.g. "19681212 199704 1 003"
  logoUrl?: string; // Logo custom or default
}

export interface VendorProfile {
  namaToko: string; // e.g. "Annis Net"
  namaPemilik: string; // e.g. "M. Naja"
  jabatan: string; // e.g. "Pemilik Toko"
  alamat: string; // e.g. "Silebu"
  telepon: string; // e.g. "0878-7155-5593"
  npwp?: string; // e.g. "Ada / Terlampir"
}

export interface OrderItem {
  id: string;
  uraian: string;
  qty: number;
  satuan: string; // e.g. "Mbps", "Rim", "Paket", "Pcs", "Bulan"
  hargaSatuan: number;
  jumlahHarga: number;
  kondisi?: string; // "Baik"
}

export interface TransactionDocument {
  id: string;
  createdAt: string;
  updatedAt: string;

  // Nomor-nomor surat yang saling terhubung dalam transaksi
  nomorPesanan: string; // e.g. "042/SD.24/SP/II/2026"
  nomorBAST: string; // e.g. "043/SD.24/SP/II/2026"
  nomorSPMU: string; // e.g. "900.1.3.6 / 22 / SDN. 153 / 2026"
  nomorPerencanaan?: string; // opsional nomor perenc

  // Tanggal-tanggal pelaksanaan
  tanggalPesanan: string; // "2026-02-06"
  tanggalNegosiasi?: string; // "2026-02-06"
  waktuPengerjaan?: string; // "06/02/2024" or "06/02/2026"
  waktuPemrosesan?: string; // "06/02/2024" or "06/02/2026"
  waktuPenyelesaian?: string; // "06/02/2024" or "06/02/2026"
  tanggalBAST: string; // "2026-02-06"
  tanggalSPMU: string; // "2026-02-25"

  // Informasi Pekerjaan / Pengadaan
  paketPesanan: string; // e.g. "Kegiatan Jual Beli Melalui Toko"
  kategoriBarangJasa: string; // e.g. "Internet 20Mbps"
  alokasiAnggaran: string; // e.g. "BOS Reguler 2026"
  lokasiSerahTerima: string; // e.g. "SD Negeri Silebu 4"
  persyaratanPenyedia: string; // e.g. "Perorangan/Badan Usaha Memenuhi syarat sebagai berikut :\na. Identitas Penyedia\nb. NPWP"
  keperluanSPMU: string; // e.g. "Pembayaran Jasa Internet 20Mbps" atau "Pembelian Buku Administrasi Kelas"
  tahunAnggaran: string; // e.g. "2026"

  // Pajak & Rincian Pembayaran
  items: OrderItem[];
  totalSebelumPpn: number;
  dppPpn?: number;
  ppnRate: number; // e.g. 0 or 11
  ppnNominal: number;
  pphRate: number; // e.g. 0, 1.5, 2
  pphNominal: number;
  totalPembayaran: number;
  terbilangCustom?: string;

  // Data Rekanan & Sekolah
  vendor: VendorProfile;
  school: SchoolProfile;

  // Status & Catatan
  status: 'Draf' | 'Selesai' | 'Dibayar';
  catatan?: string;
}

export type DocumentType = 'sp' | 'perencanaan' | 'bast' | 'spmu' | 'all';
