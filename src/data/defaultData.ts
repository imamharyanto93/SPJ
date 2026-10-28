import { SchoolProfile, TransactionDocument } from '../types/procurement';

/**
 * Profil Satuan Pendidikan default (kosong untuk pertama kali dibuka)
 */
export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  namaInstansiAtas: '',
  namaDinas: '',
  namaSekolah: '',
  alamatSekolah: '',
  teleponSekolah: '',
  emailSekolah: '',
  npsn: '',
  nss: '',
  kotaKecamatan: '',
  namaKepalaSekolah: '',
  nipKepalaSekolah: '',
  jabatanKepalaSekolah: '',
  namaPelaksana: '',
  nipPelaksana: '',
  jabatanPelaksana: '',
  namaBendahara: '',
  namaPemeriksa: '',
  nipPemeriksa: '',
};

/**
 * Daftar transaksi awal kosong agar pengguna dapat mengisi langsung data pengadaan sekolah mereka sendiri
 */
export const INITIAL_TRANSACTIONS: TransactionDocument[] = [];
