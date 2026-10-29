import React, { useEffect, useState } from 'react';

interface OfficialLogoProps {
  customLogoUrl?: string;
  className?: string;
}

export const OfficialLogo: React.FC<OfficialLogoProps> = ({
  customLogoUrl,
  className = 'w-16 h-20',
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [customLogoUrl]);

  // If a valid custom logo is uploaded, render it with error handling
  if (
    customLogoUrl &&
    typeof customLogoUrl === 'string' &&
    customLogoUrl.trim() !== '' &&
    customLogoUrl !== 'undefined' &&
    customLogoUrl !== 'null' &&
    !hasError
  ) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <img
          src={customLogoUrl}
          alt="Logo Satuan Pendidikan / Pemda"
          onError={() => setHasError(true)}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  }

  // Official Lambang Kabupaten Serang crisp SVG representation (Default)
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Shield background */}
        <path
          d="M10 12 C10 12 50 8 50 8 C50 8 90 12 90 12 C90 60 85 96 50 114 C15 96 10 60 10 12 Z"
          fill="#1E40AF"
          stroke="#F59E0B"
          strokeWidth="3.5"
        />

        {/* Inner border */}
        <path
          d="M14 15 C14 15 50 11 50 11 C50 11 86 15 86 15 C86 58 81 92 50 109 C19 92 14 58 14 15 Z"
          fill="#2563EB"
          stroke="#FEF08A"
          strokeWidth="1.2"
        />

        {/* Green land base */}
        <path
          d="M16 70 C30 68 70 68 84 70 C80 88 65 100 50 106 C35 100 20 88 16 70 Z"
          fill="#15803D"
        />

        {/* Blue Sea Waves */}
        <path
          d="M18 78 C25 76 35 80 50 77 C65 74 75 80 82 78 C79 88 65 99 50 103 C35 99 21 88 18 78 Z"
          fill="#0284C7"
        />
        <path
          d="M22 83 C30 81 40 84 50 82 C60 80 70 83 78 82 C74 89 62 97 50 100 C38 97 26 89 22 83 Z"
          fill="#38BDF8"
          opacity="0.8"
        />

        {/* White Tower of Banten (Menara Banten) */}
        {/* Tower Base & Steps */}
        <rect x="41" y="60" width="18" height="6" fill="#F8FAFC" stroke="#0F172A" strokeWidth="0.8" />
        <rect x="43" y="55" width="14" height="5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="0.8" />
        {/* Tower Body */}
        <polygon points="44,55 45,30 55,30 56,55" fill="#FFFFFF" stroke="#0F172A" strokeWidth="0.9" />
        {/* Tower Windows / Bands */}
        <rect x="47.5" y="36" width="5" height="7" rx="2.5" fill="#1E293B" />
        <rect x="47.5" y="47" width="5" height="5" rx="1" fill="#1E293B" />
        <line x1="44.5" y1="42" x2="55.5" y2="42" stroke="#CBD5E1" strokeWidth="0.8" />
        {/* Tower Balcony / Crown */}
        <rect x="43" y="27" width="14" height="3" fill="#F8FAFC" stroke="#0F172A" strokeWidth="0.8" />
        <polygon points="45,27 50,19 55,27" fill="#F59E0B" stroke="#0F172A" strokeWidth="0.8" />
        {/* Spire */}
        <line x1="50" y1="19" x2="50" y2="15" stroke="#F59E0B" strokeWidth="1.2" />
        <circle cx="50" cy="14" r="1.5" fill="#F59E0B" />

        {/* Yellow Star at top */}
        <polygon
          points="50,4 51.5,8 55.5,8.5 52.5,11 53.5,15 50,13 46.5,15 47.5,11 44.5,8.5 48.5,8"
          fill="#FBBF24"
          stroke="#B45309"
          strokeWidth="0.5"
        />

        {/* Rice and Cotton elements flanking the tower */}
        <g stroke="#FDE047" strokeWidth="1" fill="#FACC15">
          <circle cx="28" cy="35" r="1.5" />
          <circle cx="26" cy="42" r="1.5" />
          <circle cx="27" cy="49" r="1.5" />
          <circle cx="30" cy="56" r="1.5" />
          <circle cx="35" cy="62" r="1.5" />
        </g>
        <g stroke="#FDE047" strokeWidth="1" fill="#FACC15">
          <circle cx="72" cy="35" r="1.5" />
          <circle cx="74" cy="42" r="1.5" />
          <circle cx="73" cy="49" r="1.5" />
          <circle cx="70" cy="56" r="1.5" />
          <circle cx="65" cy="62" r="1.5" />
        </g>

        {/* Yellow Ribbon at Bottom */}
        <path
          d="M20 102 C32 108 68 108 80 102 C74 110 50 116 50 116 C50 116 26 110 20 102 Z"
          fill="#FBBF24"
          stroke="#B45309"
          strokeWidth="0.8"
        />
        {/* Ribbon banner fold */}
        <path d="M18 99 L24 104 L18 107 Z" fill="#D97706" />
        <path d="M82 99 L76 104 L82 107 Z" fill="#D97706" />
      </svg>
    </div>
  );
};
