import React from 'react';

interface AppLogoProps {
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = 'w-9 h-9' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm hover:scale-105 transition-transform duration-200"
      >
        <defs>
          {/* Gradients using the user's exact color palette */}
          <linearGradient id="appLogoBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#085070" />
            <stop offset="100%" stopColor="#052E40" />
          </linearGradient>

          <linearGradient id="appLogoAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#92D2F9" />
            <stop offset="100%" stopColor="#4480A6" />
          </linearGradient>

          <linearGradient id="appLogoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3D6" />
            <stop offset="100%" stopColor="#FDE8B5" />
          </linearGradient>

          <linearGradient id="appLogoPaperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EBF6FE" />
          </linearGradient>

          <filter id="appLogoShadow" x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#085070" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Rounded Squircle / Shield Container */}
        <rect
          x="3"
          y="3"
          width="42"
          height="42"
          rx="12"
          fill="url(#appLogoBaseGrad)"
          stroke="#4480A6"
          strokeWidth="1.2"
        />

        {/* Subtle Inner Border Glow */}
        <rect
          x="4.5"
          y="4.5"
          width="39"
          height="39"
          rx="10.5"
          stroke="#92D2F9"
          strokeWidth="0.8"
          strokeOpacity="0.35"
        />

        {/* Back Stacked Sheet (Document Layer 2) */}
        <rect
          x="16"
          y="10"
          width="20"
          height="26"
          rx="3.5"
          fill="#4480A6"
          fillOpacity="0.6"
          transform="rotate(6 26 23)"
        />

        {/* Main Document Body (Clean white paper with folded top-right corner) */}
        <g filter="url(#appLogoShadow)">
          <path
            d="M13 12C13 10.3431 14.3431 9 16 9H27.5L35 16.5V35C35 36.6569 33.6569 38 32 38H16C14.3431 38 13 36.6569 13 35V12Z"
            fill="url(#appLogoPaperGrad)"
          />

          {/* Folded Corner flap */}
          <path
            d="M27.5 9V14C27.5 15.3807 28.6193 16.5 30 16.5H35L27.5 9Z"
            fill="url(#appLogoAccentGrad)"
          />
        </g>

        {/* Document Content Lines */}
        <rect x="17" y="16.5" width="7" height="2" rx="1" fill="#085070" fillOpacity="0.8" />
        <rect x="17" y="21" width="14" height="2" rx="1" fill="#4480A6" fillOpacity="0.45" />
        <rect x="17" y="25" width="11" height="2" rx="1" fill="#4480A6" fillOpacity="0.45" />

        {/* Official Gold Seal / Verification Stamp Badge */}
        <circle cx="28" cy="30" r="5.5" fill="url(#appLogoGoldGrad)" stroke="#B45309" strokeWidth="0.8" />
        <circle cx="28" cy="30" r="4.2" stroke="#D97706" strokeWidth="0.6" strokeDasharray="1.2 0.8" />

        {/* Checkmark in Gold Seal */}
        <path
          d="M26 30.1L27.4 31.5L30.2 28.5"
          stroke="#085070"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Sparkle Accent Dot top left of document */}
        <circle cx="10" cy="11" r="1.2" fill="#92D2F9" />
        <circle cx="38" cy="37" r="1.5" fill="#FDE8B5" />
      </svg>
    </div>
  );
};
