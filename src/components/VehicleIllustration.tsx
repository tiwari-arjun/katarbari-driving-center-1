import React from 'react';

interface VehicleIllustrationProps {
  type: 'scooter' | 'motorbike' | 'car';
  className?: string;
}

export const VehicleIllustration: React.FC<VehicleIllustrationProps> = ({ type, className = "w-full h-44" }) => {
  if (type === 'scooter') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 240 160" className="w-full h-full drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ground shadow */}
          <ellipse cx="120" cy="142" rx="75" ry="7" fill="#0f172a" fillOpacity="0.12" />

          {/* Rear Wheel */}
          <circle cx="60" cy="115" r="24" fill="#1e293b" />
          <circle cx="60" cy="115" r="16" fill="#64748b" />
          <circle cx="60" cy="115" r="8" fill="#cbd5e1" />
          <circle cx="60" cy="115" r="3" fill="#0f172a" />
          {/* Rear wheel spokes */}
          <line x1="60" y1="99" x2="60" y2="131" stroke="#475569" strokeWidth="2" />
          <line x1="44" y1="115" x2="76" y2="115" stroke="#475569" strokeWidth="2" />

          {/* Front Wheel */}
          <circle cx="180" cy="115" r="24" fill="#1e293b" />
          <circle cx="180" cy="115" r="16" fill="#64748b" />
          <circle cx="180" cy="115" r="8" fill="#cbd5e1" />
          <circle cx="180" cy="115" r="3" fill="#0f172a" />
          <line x1="180" y1="99" x2="180" y2="131" stroke="#475569" strokeWidth="2" />
          <line x1="164" y1="115" x2="196" y2="115" stroke="#475569" strokeWidth="2" />

          {/* Front Fork & Mudguard */}
          <path d="M172 110L160 68" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
          <path d="M156 94C164 88 178 88 188 96" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />

          {/* Main Scooter Body - Gradient Blue */}
          <defs>
            <linearGradient id="scooterGrad" x1="40" y1="50" x2="180" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284c7" />
              <stop offset="1" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Floorboard */}
          <path d="M96 116H138L145 95H110L96 116Z" fill="#334155" />

          {/* Rear Fairing */}
          <path d="M46 110C44 85 64 68 96 68C110 68 116 80 112 108C108 116 88 120 70 120C55 120 47 118 46 110Z" fill="url(#scooterGrad)" />
          {/* Side accent stripe */}
          <path d="M58 84C72 76 92 78 106 85" stroke="#bae6fd" strokeWidth="3" strokeLinecap="round" />

          {/* Seat Cushion */}
          <path d="M52 68C52 62 62 58 82 58C104 58 116 62 114 68C110 70 56 72 52 68Z" fill="#0f172a" />
          <rect x="56" y="66" width="54" height="3" rx="1.5" fill="#e2e8f0" opacity="0.3" />

          {/* Front Apron / Leg Shield */}
          <path d="M140 98L160 52C162 48 168 45 174 46L170 85L150 102H138L140 98Z" fill="url(#scooterGrad)" />
          
          {/* Front Headlight & Handlebars */}
          <path d="M162 48L158 38C156 34 162 30 168 30C174 30 180 34 178 38L174 48H162Z" fill="#1e40af" />
          <circle cx="168" cy="38" r="5" fill="#fef08a" />
          <path d="M150 36L186 36" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
          {/* Grips */}
          <rect x="146" y="34" width="6" height="4" rx="1" fill="#475569" />
          <rect x="184" y="34" width="6" height="4" rx="1" fill="#475569" />
          {/* Mirror */}
          <circle cx="152" cy="24" r="3.5" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" />
          <line x1="152" y1="28" x2="152" y2="34" stroke="#334155" strokeWidth="1.5" />

          {/* Category Tag badge */}
          <rect x="74" y="90" width="22" height="11" rx="3" fill="#ffffff" />
          <text x="85" y="98" fill="#0369a1" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">CAT K</text>
        </svg>
      </div>
    );
  }

  if (type === 'motorbike') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 240 160" className="w-full h-full drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ground shadow */}
          <ellipse cx="120" cy="142" rx="80" ry="7" fill="#0f172a" fillOpacity="0.12" />

          {/* Gradients */}
          <defs>
            <linearGradient id="bikeRedGrad" x1="60" y1="40" x2="160" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#dc143c" />
              <stop offset="1" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="engineGrad" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#475569" />
              <stop offset="1" stopColor="#1e293b" />
            </linearGradient>
          </defs>

          {/* Rear Wheel (Alloy Sport) */}
          <circle cx="55" cy="112" r="26" fill="#0f172a" />
          <circle cx="55" cy="112" r="18" fill="#475569" />
          <circle cx="55" cy="112" r="10" fill="#cbd5e1" />
          <circle cx="55" cy="112" r="4" fill="#0f172a" />
          {/* Spoke Tri-Star */}
          <line x1="55" y1="94" x2="55" y2="130" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="39" y1="121" x2="71" y2="103" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="39" y1="103" x2="71" y2="121" stroke="#94a3b8" strokeWidth="2.5" />

          {/* Front Wheel */}
          <circle cx="185" cy="112" r="26" fill="#0f172a" />
          <circle cx="185" cy="112" r="18" fill="#475569" />
          <circle cx="185" cy="112" r="10" fill="#cbd5e1" />
          <circle cx="185" cy="112" r="4" fill="#0f172a" />
          <line x1="185" y1="94" x2="185" y2="130" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="169" y1="121" x2="201" y2="103" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="169" y1="103" x2="201" y2="121" stroke="#94a3b8" strokeWidth="2.5" />

          {/* Front Fork Suspension (Telescopic Gold/Silver) */}
          <line x1="185" y1="112" x2="158" y2="44" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round" />
          <line x1="180" y1="98" x2="164" y2="56" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />

          {/* Exhaust Pipe Chrome */}
          <path d="M100 115H130L150 120H70L60 112" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
          <rect x="65" y="108" width="45" height="9" rx="4" fill="#334155" stroke="#cbd5e1" strokeWidth="1" />

          {/* Engine Block */}
          <rect x="92" y="92" width="34" height="26" rx="4" fill="url(#engineGrad)" />
          {/* Cooling fins */}
          <line x1="94" y1="97" x2="124" y2="97" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="94" y1="103" x2="124" y2="103" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="94" y1="109" x2="124" y2="109" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Chassis Frame Trellis */}
          <path d="M55 112L105 78L156 50L126 95L95 95L55 112" stroke="#0f172a" strokeWidth="4" strokeLinejoin="round" fill="none" />

          {/* Fuel Tank (Muscular Red with White Crest) */}
          <path d="M112 58C116 48 135 44 152 48C158 50 160 56 156 64C148 74 125 76 112 68L112 58Z" fill="url(#bikeRedGrad)" />
          <path d="M125 53C135 50 148 52 153 58" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

          {/* Stepped Seat */}
          <path d="M68 66C76 66 88 70 102 70L114 62C116 66 110 74 100 76C82 78 70 76 68 66Z" fill="#0f172a" />
          <path d="M52 74L68 66L72 74L56 80L52 74Z" fill="url(#bikeRedGrad)" />

          {/* Handlebars & Headlamp */}
          <path d="M152 42L166 40" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
          <path d="M166 48L174 46L172 56L164 54Z" fill="#1e293b" />
          <path d="M174 48L178 50L174 54Z" fill="#fef08a" />
          {/* Mirror */}
          <circle cx="156" cy="30" r="3.5" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.5" />
          <line x1="156" y1="34" x2="156" y2="40" stroke="#0f172a" strokeWidth="1.5" />

          {/* Category Tag badge */}
          <rect x="98" y="78" width="22" height="11" rx="3" fill="#ffffff" />
          <text x="109" y="86" fill="#b91c1c" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">CAT A</text>
        </svg>
      </div>
    );
  }

  // Car Illustration
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 240 160" className="w-full h-full drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ground shadow */}
        <ellipse cx="120" cy="142" rx="95" ry="7" fill="#0f172a" fillOpacity="0.14" />

        <defs>
          <linearGradient id="carBodyGrad" x1="30" y1="50" x2="210" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e40af" />
            <stop offset="0.5" stopColor="#1d4ed8" />
            <stop offset="1" stopColor="#172554" />
          </linearGradient>
          <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#e0f2fe" />
            <stop offset="1" stopColor="#bae6fd" />
          </linearGradient>
        </defs>

        {/* Rear Wheel */}
        <circle cx="64" cy="116" r="22" fill="#0f172a" />
        <circle cx="64" cy="116" r="14" fill="#64748b" />
        <circle cx="64" cy="116" r="7" fill="#f8fafc" />
        <circle cx="64" cy="116" r="3" fill="#0f172a" />
        {/* 5-spoke alloy */}
        <line x1="64" y1="102" x2="64" y2="130" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="50" y1="116" x2="78" y2="116" stroke="#cbd5e1" strokeWidth="2" />

        {/* Front Wheel */}
        <circle cx="176" cy="116" r="22" fill="#0f172a" />
        <circle cx="176" cy="116" r="14" fill="#64748b" />
        <circle cx="176" cy="116" r="7" fill="#f8fafc" />
        <circle cx="176" cy="116" r="3" fill="#0f172a" />
        <line x1="176" y1="102" x2="176" y2="130" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="162" y1="116" x2="190" y2="116" stroke="#cbd5e1" strokeWidth="2" />

        {/* Wheel Arches & Underbody */}
        <path d="M42 118H44C44 105 53 96 64 96C75 96 84 105 84 118H156C156 105 165 96 176 96C187 96 196 105 196 118H208L210 110L206 96L196 90H42L36 100L42 118Z" fill="#0f172a" />

        {/* Main Car Body Profile */}
        <path d="M30 102C30 96 34 92 40 92L52 92L72 58C76 52 82 48 90 48H150C158 48 166 54 172 62L190 90L208 92C216 93 222 98 222 106L220 114H200C198 102 188 94 176 94C164 94 154 102 152 114H88C86 102 76 94 64 94C52 94 42 102 40 114H32C28 114 26 108 30 102Z" fill="url(#carBodyGrad)" />

        {/* Side windows with pillars */}
        <path d="M76 60L92 52H120V86H60L76 60Z" fill="url(#glassGrad)" stroke="#1e3a8a" strokeWidth="1.5" />
        <path d="M124 52H148C154 52 160 56 164 62L182 86H124V52Z" fill="url(#glassGrad)" stroke="#1e3a8a" strokeWidth="1.5" />

        {/* Rearview Side Mirror */}
        <path d="M166 74H158C156 74 155 76 156 78L160 82H168C170 82 171 80 170 78L166 74Z" fill="#0f172a" />

        {/* Door Lines and Door Handle */}
        <line x1="122" y1="52" x2="122" y2="108" stroke="#1e3a8a" strokeWidth="1.5" />
        <rect x="102" y="88" width="10" height="2.5" rx="1" fill="#cbd5e1" />
        <rect x="134" y="88" width="10" height="2.5" rx="1" fill="#cbd5e1" />

        {/* Front Headlight (Crisp LED) */}
        <path d="M204 92L218 94C220 95 221 98 219 100L208 103L204 92Z" fill="#fef08a" stroke="#facc15" strokeWidth="1" />
        {/* Tail Light Red */}
        <path d="M30 96L38 96L36 104L29 102C28 100 28 98 30 96Z" fill="#ef4444" />

        {/* Driving School "L" Roof Plate Sign */}
        <rect x="100" y="32" width="36" height="17" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        <text x="118" y="45" fill="#dc143c" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">L</text>

        {/* Category Tag badge */}
        <rect x="94" y="96" width="22" height="11" rx="3" fill="#ffffff" />
        <text x="105" y="104" fill="#1e40af" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">CAT B</text>
      </svg>
    </div>
  );
};
