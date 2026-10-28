import React, { useState } from 'react';
import { Building2, Check, RefreshCw, Upload, X } from 'lucide-react';
import { storageService } from '../services/storage';
import { SchoolProfile } from '../types/procurement';
import { OfficialLogo } from './OfficialLogo';

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (profile: SchoolProfile) => void;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  if (!isOpen) return null;

  const [profile, setProfile] = useState<SchoolProfile>(() => storageService.getSchoolProfile());

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prev) => ({ ...prev, logoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    setProfile((prev) => ({ ...prev, logoUrl: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSchoolProfile(profile);
    onSaved(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-[#085070]" />
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Pengaturan Profil Satuan Pendidikan & Kop Surat
              </h2>
              <p className="text-xs text-slate-500">
                Profil ini menjadi nilai default otomatis saat membuat transaksi pengadaan baru
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Logo Section */}
          <div className="flex items-center gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-1 overflow-hidden shadow-xs">
              <OfficialLogo customLogoUrl={profile.logoUrl} className="w-12 h-14" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="font-bold text-slate-800">
                Logo Kop Surat (Default: Lambang Kabupaten Serang)
              </div>
              <p className="text-[11px] text-slate-500">
                Gunakan logo bawaan resmi atau unggah logo kustom sekolah Anda (PNG/JPG).
              </p>
              <div className="flex items-center gap-2 pt-1">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-md shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                {profile.logoUrl && (
                  <button
                    type="button"
                    onClick={handleResetLogo}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset ke Logo Pemkab
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Instansi & Sekolah */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Instansi Atas (Baris 1 Kop)
              </label>
              <input
                type="text"
                required
                value={profile.namaInstansiAtas}
                onChange={(e) => setProfile({ ...profile, namaInstansiAtas: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="PEMERINTAH KABUPATEN SERANG"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Dinas (Baris 2 Kop)
              </label>
              <input
                type="text"
                value={profile.namaDinas}
                onChange={(e) => setProfile({ ...profile, namaDinas: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="DINAS PENDIDIKAN DAN KEBUDAYAAN KABUPATEN SERANG"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Satuan Pendidikan / Sekolah *
              </label>
              <input
                type="text"
                required
                value={profile.namaSekolah}
                onChange={(e) => setProfile({ ...profile, namaSekolah: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                placeholder="SD NEGERI SILEBU 4"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kecamatan / Lokasi TTD Dokumen
              </label>
              <input
                type="text"
                value={profile.kotaKecamatan}
                onChange={(e) => setProfile({ ...profile, kotaKecamatan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="Kragilan"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Alamat Lengkap Satuan Pendidikan
            </label>
            <textarea
              rows={2}
              value={profile.alamatSekolah}
              onChange={(e) => setProfile({ ...profile, alamatSekolah: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              placeholder="Kp. Silebu Tegal Ds. Silebu Kec. Kragilan Kab. Serang Kode POS. 42184"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">NPSN</label>
              <input
                type="text"
                value={profile.npsn || ''}
                onChange={(e) => setProfile({ ...profile, npsn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                placeholder="20605263"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NSS</label>
              <input
                type="text"
                value={profile.nss || ''}
                onChange={(e) => setProfile({ ...profile, nss: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                placeholder="1012101280411020"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">No. Telepon Sekolah</label>
              <input
                type="text"
                value={profile.teleponSekolah || ''}
                onChange={(e) => setProfile({ ...profile, teleponSekolah: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="0838-1276-1308"
              />
            </div>
          </div>

          {/* Pejabat Penandatangan */}
          <div className="border-t border-slate-200 pt-3 space-y-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
              Pejabat Penandatangan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nama Kepala Sekolah & Gelar
                </label>
                <input
                  type="text"
                  value={profile.namaKepalaSekolah}
                  onChange={(e) => setProfile({ ...profile, namaKepalaSekolah: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                  placeholder="Mohamad Yusup, S.Pd"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  NIP Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={profile.nipKepalaSekolah}
                  onChange={(e) => setProfile({ ...profile, nipKepalaSekolah: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  placeholder="19681212 199704 1 003"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nama Pelaksana Pengadaan
                </label>
                <input
                  type="text"
                  value={profile.namaPelaksana}
                  onChange={(e) => setProfile({ ...profile, namaPelaksana: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Mohamad Yusup, S.Pd"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  NIP Pelaksana Pengadaan
                </label>
                <input
                  type="text"
                  value={profile.nipPelaksana}
                  onChange={(e) => setProfile({ ...profile, nipPelaksana: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  placeholder="19681212 199704 1 003"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Sebutan Bendahara (SPMU)
                </label>
                <input
                  type="text"
                  value={profile.namaBendahara}
                  onChange={(e) => setProfile({ ...profile, namaBendahara: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Bendahara BOSP"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Pemeriksa Barang (BAST)
                </label>
                <input
                  type="text"
                  value={profile.namaPemeriksa}
                  onChange={(e) => setProfile({ ...profile, namaPemeriksa: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Mohamad Yusup, S.Pd"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-[#085070] hover:bg-[#063D56] text-white font-bold rounded-lg shadow-sm hover:shadow-[#085070]/20 transition-all"
            >
              <Check className="w-4 h-4 text-[#92D2F9]" />
              Simpan Profil Sekolah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
