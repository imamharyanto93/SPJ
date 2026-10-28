import React from 'react';
import { SchoolProfile } from '../../types/procurement';
import { OfficialLogo } from '../OfficialLogo';

interface KopSuratProps {
  school: SchoolProfile;
  variant?: 'full' | 'compact' | 'spmu';
}

export const KopSurat: React.FC<KopSuratProps> = ({ school, variant = 'full' }) => {
  return (
    <div className="w-full mb-4 select-text">
      <div className="flex items-center justify-between gap-4 pb-2">
        {/* Logo kiri */}
        <div className="w-20 flex-shrink-0 flex items-center justify-center">
          <OfficialLogo customLogoUrl={school.logoUrl} className="w-18 h-22" />
        </div>

        {/* Teks Kop Surat */}
        <div className="flex-1 text-center font-sans tracking-wide">
          {variant === 'spmu' ? (
            <>
              <h2 className="text-[15px] font-bold uppercase text-black leading-tight">
                {school.namaInstansiAtas || 'PEMERINTAH KABUPATEN SERANG'}
              </h2>
              <h1 className="text-[17px] font-extrabold uppercase text-black leading-tight mt-0.5">
                {school.namaSekolah}
              </h1>
              <p className="text-[10px] text-black leading-tight mt-1">
                {school.alamatSekolah}
              </p>
              {(school.emailSekolah || school.npsn || school.nss) && (
                <p className="text-[9.5px] text-black leading-tight mt-0.5">
                  {school.emailSekolah && `Email : ${school.emailSekolah} `}
                  {school.npsn && `NPSN : ${school.npsn} `}
                  {school.nss && `NSS : ${school.nss}`}
                </p>
              )}
            </>
          ) : (
            <>
              <h2 className="text-[14px] font-bold uppercase text-black leading-snug">
                {school.namaInstansiAtas || 'PEMERINTAH KABUPATEN SERANG'}
              </h2>
              {school.namaDinas && (
                <h3 className="text-[13px] font-bold uppercase text-black leading-snug">
                  {school.namaDinas}
                </h3>
              )}
              <h1 className="text-[17px] font-extrabold uppercase text-black leading-snug">
                {school.namaSekolah}
              </h1>
              <p className="text-[10px] text-black leading-tight mt-0.5">
                {school.alamatSekolah}
              </p>
            </>
          )}
        </div>

        {/* Spacer kanan agar teks benar-benar di tengah */}
        <div className="w-20 flex-shrink-0"></div>
      </div>

      {/* Garis Ganda Resmi Kop Dinas: Satu tebal, satu tipis */}
      <div className="w-full">
        <div className="h-[2.5px] bg-black w-full"></div>
        <div className="h-[0.8px] bg-black w-full mt-[1.5px]"></div>
      </div>
    </div>
  );
};
