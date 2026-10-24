import React from 'react';

interface TrafficSignVisualProps {
  symbol?: string;
  signType?: 'prohibitory' | 'warning' | 'mandatory' | 'informative';
  className?: string;
}

export const TrafficSignVisual: React.FC<TrafficSignVisualProps> = ({
  symbol,
  signType = 'prohibitory',
  className = "w-28 h-28"
}) => {
  if (!symbol) return null;

  switch (symbol) {
    case 'no_entry':
      return (
        <div className={`inline-flex items-center justify-center ${className}`} title="No Entry Sign">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#DC143C" stroke="#B91C1C" strokeWidth="2" />
            <rect x="18" y="42" width="64" height="16" rx="3" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case 'give_way':
      return (
        <div className={`inline-flex items-center justify-center ${className}`} title="Give Way / Yield">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Inverted triangle */}
            <polygon points="50,92 10,16 90,16" fill="#DC143C" />
            <polygon points="50,78 20,24 80,24" fill="#FFFFFF" />
            <text x="50" y="48" textAnchor="middle" fill="#DC143C" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              GIVE
            </text>
            <text x="50" y="60" textAnchor="middle" fill="#DC143C" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              WAY
            </text>
          </svg>
        </div>
      );

    case 'no_horn':
      return (
        <div className={`inline-flex items-center justify-center ${className}`} title="No Horn">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#FFFFFF" stroke="#DC143C" strokeWidth="8" />
            {/* Horn symbol */}
            <path d="M35 44 L48 38 L48 62 L35 56 Z" fill="#1F2937" />
            <rect x="25" y="45" width="10" height="10" rx="2" fill="#1F2937" />
            {/* Sound waves */}
            <path d="M54 44 Q58 50 54 56" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M60 40 Q66 50 60 60" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Red diagonal strike */}
            <line x1="20" y1="20" x2="80" y2="80" stroke="#DC143C" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'steep_hill':
      return (
        <div className={`inline-flex items-center justify-center ${className}`} title="Steep Hill">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Warning equilateral triangle */}
            <polygon points="50,10 92,86 8,86" fill="#DC143C" />
            <polygon points="50,22 82,80 18,80" fill="#FFFFFF" />
            {/* Incline ramp and car */}
            <polygon points="26,76 74,48 74,76" fill="#374151" />
            <text x="50" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">
              10%
            </text>
          </svg>
        </div>
      );

    default:
      return null;
  }
};
