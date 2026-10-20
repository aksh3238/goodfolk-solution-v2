import React from 'react';

interface LogoProps {
  variant?: 'full' | 'emblem' | 'white';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  customLogoUrl?: string;
  logoText?: string;
  logoSubtitle?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
  customLogoUrl,
  logoText = 'GOOD FOLK',
  logoSubtitle = 'SOLUTION'
}) => {
  // Sizing matrix with increased rendered presence for header and footer visibility
  const markDimensions = {
    sm: 'w-9 h-9 sm:w-10 sm:h-10',
    md: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
    xl: 'w-20 h-20'
  };

  const imageHeights = {
    sm: 'max-h-10 sm:max-h-11',
    md: 'max-h-13 sm:max-h-15',
    lg: 'max-h-16 sm:max-h-18',
    xl: 'max-h-24'
  };

  const isWhite = variant === 'white';
  const navyColor = isWhite ? '#FFFFFF' : '#173B75';
  const brightBlueColor = isWhite ? '#E8F1FC' : '#2458A6';
  const orangeColor = '#F07822';
  const orangeSparkColor = '#F07822';

  // If a custom uploaded logo exists and isn't empty, render it with generous scale and fit
  if (customLogoUrl && customLogoUrl.trim().length > 0) {
    return (
      <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
        <img
          src={customLogoUrl}
          alt={logoText || 'Good Folk Solution'}
          className={`${imageHeights[size]} w-auto max-w-[240px] object-contain shrink-0 drop-shadow-xs`}
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {variant !== 'emblem' && (
          <div className="flex flex-col justify-center leading-none">
            <span
              className="font-extrabold tracking-wide uppercase"
              style={{
                color: navyColor,
                fontFamily: "'Poppins', sans-serif",
                fontSize: size === 'sm' ? '1.2rem' : size === 'lg' ? '1.85rem' : size === 'xl' ? '2.35rem' : '1.55rem',
                letterSpacing: '0.04em'
              }}
            >
              {logoText}
            </span>
            <span
              className="font-medium tracking-[0.28em] uppercase mt-1"
              style={{
                color: orangeColor,
                fontFamily: "'Poppins', sans-serif",
                fontSize: size === 'sm' ? '0.62rem' : size === 'lg' ? '0.88rem' : size === 'xl' ? '1.1rem' : '0.78rem'
              }}
            >
              {logoSubtitle}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Monogram SVG: Stylized folded ribbon / infinity monogram mark
  // using Navy (#173B75), Bright Blue (#2458A6), and Warm Orange accent dot/spark (#F07822)
  const MonogramSvg = ({ svgClass }: { svgClass: string }) => (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${svgClass} shrink-0`}
      aria-label="Good Folk Solution Monogram"
    >
      <defs>
        <linearGradient id={isWhite ? 'ribbonNavyW' : 'ribbonNavy'} x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={navyColor} />
          <stop offset="100%" stopColor={isWhite ? '#F0F4F8' : '#0F264D'} />
        </linearGradient>
        <linearGradient id={isWhite ? 'ribbonBlueW' : 'ribbonBlue'} x1="100" y1="20" x2="20" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={brightBlueColor} />
          <stop offset="100%" stopColor={isWhite ? '#FFFFFF' : '#173B75'} />
        </linearGradient>
      </defs>

      {/* Folded Ribbon / Infinity Monogram Loop 1 (Navy Loop) */}
      <path
        d="M 38 34 C 20 34 16 52 16 60 C 16 74 26 86 42 86 C 58 86 68 70 78 54 C 86 42 94 34 104 34 C 114 34 118 42 118 50 C 118 44 114 30 100 30 C 88 30 78 42 68 58 C 58 74 48 82 38 82 C 26 82 22 72 22 60 C 22 48 28 38 38 38 Z"
        fill={`url(#${isWhite ? 'ribbonNavyW' : 'ribbonNavy'})`}
      />

      {/* Folded Ribbon / Infinity Monogram Loop 2 (Bright Blue Interlocking Overfold) */}
      <path
        d="M 82 86 C 100 86 104 68 104 60 C 104 46 94 34 78 34 C 62 34 52 50 42 66 C 34 78 26 86 16 86 C 6 86 2 78 2 70 C 2 76 6 90 20 90 C 32 90 42 78 52 62 C 62 46 72 38 82 38 C 94 38 98 48 98 60 C 98 72 92 82 82 82 Z"
        fill={`url(#${isWhite ? 'ribbonBlueW' : 'ribbonBlue'})`}
      />

      {/* Intersecting central ribbon bridge fold */}
      <path
        d="M 52 52 C 56 46 64 46 68 52 C 72 58 68 64 60 68 C 54 66 50 58 52 52 Z"
        fill={brightBlueColor}
        opacity={isWhite ? 0.9 : 0.85}
      />

      {/* Warm Orange Accent Dot / Spark (#F07822) */}
      <circle cx="98" cy="24" r="7" fill={orangeSparkColor} />
      <path
        d="M 98 12 L 100 18 L 106 20 L 100 22 L 98 28 L 96 22 L 90 20 L 96 18 Z"
        fill={orangeSparkColor}
      />
    </svg>
  );

  if (variant === 'emblem') {
    return <MonogramSvg svgClass={`${markDimensions[size]} ${className}`} />;
  }

  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* Monogram */}
      <MonogramSvg svgClass={markDimensions[size]} />

      {/* Typography Lockup */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center">
          <span
            className="font-extrabold tracking-wide uppercase"
            style={{
              color: navyColor,
              fontFamily: "'Poppins', sans-serif",
              fontSize: size === 'sm' ? '1.2rem' : size === 'lg' ? '1.85rem' : size === 'xl' ? '2.35rem' : '1.55rem',
              letterSpacing: '0.04em'
            }}
          >
            {logoText}
          </span>
          {/* Subtle Warm Orange Spark Dot Accent */}
          <span
            className="inline-block w-2.5 h-2.5 rounded-full ml-1 mb-3 shadow-xs shrink-0"
            style={{ backgroundColor: orangeColor }}
          />
        </div>
        <span
          className="font-medium tracking-[0.28em] uppercase mt-1"
          style={{
            color: orangeColor,
            fontFamily: "'Poppins', sans-serif",
            fontSize: size === 'sm' ? '0.62rem' : size === 'lg' ? '0.88rem' : size === 'xl' ? '1.1rem' : '0.78rem'
          }}
        >
          {logoSubtitle}
        </span>
      </div>
    </div>
  );
};
