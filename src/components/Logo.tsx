import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 48,
  showText = false,
  textColor = 'text-slate-800',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG rendition of the 3T Snowflake & Gear Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:rotate-6"
      >
        {/* Background Subtle Radial Glow */}
        <circle cx="60" cy="60" r="56" fill="#f0f9ff" />
        
        {/* Mechanical Gear Ring (Right side & outer rim) - Industrial Navy Blue */}
        <path
          d="M60 10 A50 50 0 0 1 110 60 A50 50 0 0 1 60 110"
          stroke="#0369a1"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="4 8"
        />

        {/* Gear Teeth accents */}
        <g fill="#0284c7">
          <rect x="98" y="32" width="10" height="7" rx="2" transform="rotate(25 103 35.5)" />
          <rect x="108" y="56" width="10" height="8" rx="2" />
          <rect x="98" y="80" width="10" height="7" rx="2" transform="rotate(-25 103 83.5)" />
          <rect x="80" y="99" width="10" height="7" rx="2" transform="rotate(-50 85 102.5)" />
          <rect x="80" y="14" width="10" height="7" rx="2" transform="rotate(50 85 17.5)" />
        </g>

        {/* Snowflake Crystals (Left side - Cooling symbol) */}
        <g stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round">
          {/* Left top branch */}
          <line x1="60" y1="60" x2="20" y2="35" />
          <line x1="32" y1="42" x2="28" y2="28" />
          <line x1="32" y1="42" x2="42" y2="30" />
          <line x1="20" y1="35" x2="14" y2="40" />

          {/* Left center branch */}
          <line x1="60" y1="60" x2="10" y2="60" />
          <line x1="25" y1="60" x2="17" y2="52" />
          <line x1="25" y1="60" x2="17" y2="68" />
          <line x1="10" y1="60" x2="16" y2="60" strokeWidth="6" />

          {/* Left bottom branch */}
          <line x1="60" y1="60" x2="22" y2="85" />
          <line x1="34" y1="77" x2="42" y2="90" />
          <line x1="34" y1="77" x2="28" y2="92" />
        </g>

        {/* Dynamic Warm Orange Accent Arc (Heating / Thermodynamics / Energy) */}
        <path
          d="M40 38 C48 24, 76 25, 82 42 C72 32, 54 36, 44 48 C36 58, 38 78, 48 90 C34 78, 32 54, 40 38 Z"
          fill="#f97316"
        />

        {/* Central Stylized "3" with Integrated Service Wrench Motif */}
        <path
          d="M46 36 L78 36 C86 36, 90 42, 86 48 C82 54, 74 56, 68 56 C78 56, 88 62, 86 74 C83 86, 72 90, 56 90 L44 90 C38 90, 42 84, 48 84 L56 84 C66 84, 72 80, 72 73 C72 66, 64 63, 54 63 L48 63 L48 55 L58 55 C66 55, 72 51, 72 45 C72 39, 66 38, 58 38 L46 38 Z"
          fill="#0369a1"
        />
        {/* Inner wrench cutout */}
        <circle cx="48" cy="63" r="3" fill="#ffffff" />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-lg leading-tight text-sky-800">
              3T INTERCOOL
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
              & SERVICE
            </span>
          </div>
          <span className={`text-[11px] leading-tight font-medium ${textColor} opacity-80`}>
            บจก. 3ต อินเตอร์คูล แอนด์ เซอร์วิส
          </span>
        </div>
      )}
    </div>
  );
};
