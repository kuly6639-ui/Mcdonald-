import React from 'react';

interface McDonaldsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  neon?: boolean;
}

export const McDonaldsLogo: React.FC<McDonaldsLogoProps> = ({
  className = '',
  size = 'md',
  neon = true,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  const containerSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${containerSize} ${className}`}
      aria-label="McDonald's Golden Arches Logo"
    >
      {/* Outer crimson rounded emblem shield */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-b from-[#bd1815] to-[#800d0b] border-2 border-[#ffba00]/60 flex items-center justify-center overflow-hidden transition-all ${
          neon ? 'shadow-[0_0_25px_rgba(255,186,0,0.45)]' : 'shadow-lg'
        }`}
      >
        {/* Subtle retro shine */}
        <div className="absolute top-0 inset-x-0 h-1/2 bg-white/10 rounded-t-xl pointer-events-none" />

        {/* Authentic Golden Arches SVG (The iconic McDonald's 'M') */}
        <svg
          viewBox="0 0 100 85"
          className="w-[84%] h-[84%] overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="arch-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ffba00" floodOpacity="0.8" />
            </filter>
            <linearGradient id="gold-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff385" />
              <stop offset="40%" stopColor="#ffc72c" />
              <stop offset="100%" stopColor="#d48f00" />
            </linearGradient>
          </defs>

          {/* Golden Arches Path */}
          <path
            d="M 12 80 
               V 38 
               C 12 16, 26 6, 37 6 
               C 47 6, 50 18, 50 28 
               C 50 18, 53 6, 63 6 
               C 74 6, 88 16, 88 38 
               V 80 
               H 76 
               V 40 
               C 76 25, 71 18, 63 18 
               C 55 18, 54 28, 54 44 
               V 80 
               H 46 
               V 44 
               C 46 28, 45 18, 37 18 
               C 29 18, 24 25, 24 40 
               V 80 
               Z"
            fill="url(#gold-grad)"
            filter={neon ? 'url(#arch-glow)' : undefined}
          />
        </svg>
      </div>

      {/* Atmospheric neon ambient flicker ring */}
      {neon && (
        <div className="absolute -inset-1 rounded-2xl border border-amber-400/20 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};
