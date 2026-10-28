/**
 * Utility untuk konversi angka ke terbilang Bahasa Indonesia
 * dan format tanggal resmi dokumen dinas.
 */

const SATUAN = [
  '',
  'satu',
  'dua',
  'tiga',
  'empat',
  'lima',
  'enam',
  'tujuh',
  'delapan',
  'sembilan',
  'sepuluh',
  'sebelas',
];

export function terbilangAngka(nilai: number): string {
  const n = Math.floor(Math.abs(nilai));
  if (n === 0) return 'nol';

  if (n < 12) {
    return SATUAN[n];
  } else if (n < 20) {
    return SATUAN[n - 10] + ' belas';
  } else if (n < 100) {
    const sisa = n % 10;
    return SATUAN[Math.floor(n / 10)] + ' puluh' + (sisa ? ' ' + SATUAN[sisa] : '');
  } else if (n < 200) {
    return 'seratus' + (n - 100 > 0 ? ' ' + terbilangAngka(n - 100) : '');
  } else if (n < 1000) {
    const sisa = n % 100;
    return SATUAN[Math.floor(n / 100)] + ' ratus' + (sisa ? ' ' + terbilangAngka(sisa) : '');
  } else if (n < 2000) {
    return 'seribu' + (n - 1000 > 0 ? ' ' + terbilangAngka(n - 1000) : '');
  } else if (n < 1000000) {
    const sisa = n % 1000;
    return terbilangAngka(Math.floor(n / 1000)) + ' ribu' + (sisa ? ' ' + terbilangAngka(sisa) : '');
  } else if (n < 1000000000) {
    const sisa = n % 1000000;
    return terbilangAngka(Math.floor(n / 1000000)) + ' juta' + (sisa ? ' ' + terbilangAngka(sisa) : '');
  } else if (n < 1000000000000) {
    const sisa = n % 1000000000;
    return terbilangAngka(Math.floor(n / 1000000000)) + ' miliar' + (sisa ? ' ' + terbilangAngka(sisa) : '');
  } else if (n < 1000000000000000) {
    const sisa = n % 1000000000000;
    return terbilangAngka(Math.floor(n / 1000000000000)) + ' triliun' + (sisa ? ' ' + terbilangAngka(sisa) : '');
  }
  return n.toString();
}

/**
 * Format terbilang rupiah: "tujuh ratus sepuluh ribu rupiah"
 */
export function terbilangRupiah(nilai: number, style: 'lowercase' | 'capitalize' | 'uppercase' = 'lowercase'): string {
  const words = terbilangAngka(nilai).trim() + ' rupiah';
  if (style === 'uppercase') {
    return words.toUpperCase();
  }
  if (style === 'capitalize') {
    return words
      .split(' ')
      .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : ''))
      .join(' ');
  }
  return words;
}

export function formatRupiah(nilai: number, withPrefix = false): string {
  if (isNaN(nilai) || nilai === null || nilai === undefined) return withPrefix ? 'Rp 0' : '0';
  const formatted = new Intl.NumberFormat('id-ID').format(nilai);
  return withPrefix ? `Rp ${formatted}` : formatted;
}

const BULAN_INDONESIA = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const HARI_INDONESIA = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

/**
 * Mengubah format date string (YYYY-MM-DD) menjadi format resmi: "06 Februari 2026"
 */
export function formatTanggalIndonesia(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const day = String(date.getDate()).padStart(2, '0');
  const month = BULAN_INDONESIA[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Mengubah format date string (YYYY-MM-DD) menjadi format slash: "06/02/2026"
 */
export function formatTanggalSlash(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Format tanggal terbilang lengkap untuk pembuka BAST:
 * "Pada hari ini [Rabu] Tanggal [dua puluh satu] Bulan [Agustus] Tahun [Dua Ribu Dua Puluh Enam]"
 */
export function formatTanggalTerbilangBAST(dateStr?: string): string {
  if (!dateStr) return 'Pada hari ini ................ Tanggal ................ Bulan ................ Tahun ................';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const hari = HARI_INDONESIA[date.getDay()];
  const tglAngka = date.getDate();
  const tglTerbilang = terbilangAngka(tglAngka);
  const bulan = BULAN_INDONESIA[date.getMonth()];
  const tahunAngka = date.getFullYear();
  const tahunTerbilang = terbilangAngka(tahunAngka)
    .split(' ')
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : ''))
    .join(' ');

  return `Pada hari ini ${hari} Tanggal ${tglTerbilang} Bulan ${bulan} Tahun ${tahunTerbilang}`;
}
