import React, { useMemo } from 'react';
import { ISHIHARA_PALETTES, IshiharaPalette } from '../data/ishiharaPlatesData';

interface IshiharaPlateSvgProps {
  number: string;
  paletteId: string;
  seed: number;
  size?: number | string;
  className?: string;
  showSolutionOutline?: boolean; // Highlights numeral dots in educational review
}

interface DotItem {
  x: number;
  y: number;
  r: number;
  color: string;
  isNumeral: boolean;
}

// Seeded PRNG for reproducible dot distributions and colors
function createPrng(seed: number) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Distance to line segment helper for fallback vector digit rendering
function distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / l2));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

// Vector centerline segments fallback for digits 0-9
function getDigitSegments(digit: string, ox: number, oy: number, scale = 1): Array<[number, number, number, number]> {
  const s: Array<[number, number, number, number]> = [];
  const add = (x1: number, y1: number, x2: number, y2: number) => {
    s.push([ox + x1 * scale, oy + y1 * scale, ox + x2 * scale, oy + y2 * scale]);
  };

  switch (digit) {
    case '1':
      add(0, -65, 0, 65);
      add(-24, -42, 0, -65);
      add(-25, 65, 25, 65);
      break;
    case '2':
      add(-36, -45, 0, -68);
      add(0, -68, 36, -45);
      add(36, -45, 28, -15);
      add(28, -15, -36, 65);
      add(-36, 65, 40, 65);
      break;
    case '3':
      add(-32, -65, 28, -65);
      add(28, -65, 0, -8);
      add(0, -8, 32, 25);
      add(32, 25, 0, 65);
      add(0, 65, -32, 52);
      break;
    case '4':
      add(22, -65, 22, 65);
      add(22, -65, -34, 15);
      add(-34, 15, 40, 15);
      break;
    case '5':
      add(32, -65, -28, -65);
      add(-28, -65, -28, -8);
      add(-28, -8, 30, 5);
      add(30, 5, 30, 45);
      add(30, 45, -30, 65);
      break;
    case '6':
      add(22, -58, -30, 5);
      add(-30, 5, -30, 58);
      add(-30, 58, 28, 58);
      add(28, 58, 28, 12);
      add(28, 12, -30, 12);
      break;
    case '7':
      add(-36, -65, 36, -65);
      add(36, -65, -12, 65);
      add(-10, -5, 16, -5);
      break;
    case '8':
      // Top loop
      add(-26, -42, 0, -65);
      add(0, -65, 26, -42);
      add(26, -42, -26, 0);
      // Bottom loop
      add(-30, 32, 0, 65);
      add(0, 65, 30, 32);
      add(30, 32, -30, 0);
      add(-30, 0, 30, 0);
      break;
    case '9':
      add(-28, -12, 30, -12);
      add(30, -12, 30, -58);
      add(30, -58, -30, -58);
      add(-30, -58, -30, -12);
      add(30, -12, -22, 58);
      break;
    case '0':
      add(-30, -38, -30, 38);
      add(30, -38, 30, 38);
      add(-30, -38, 0, -65);
      add(0, -65, 30, -38);
      add(-30, 38, 0, 65);
      add(0, 65, 30, 38);
      break;
    default:
      add(0, -55, 0, 55);
      break;
  }
  return s;
}

// Fallback vector mask tester if canvas is unavailable
function fallbackVectorMask(numStr: string): (x: number, y: number) => boolean {
  const digits = numStr.split('');
  const allSegments: Array<[number, number, number, number]> = [];

  if (digits.length === 1) {
    allSegments.push(...getDigitSegments(digits[0], 200, 200, 1.45));
  } else if (digits.length === 2) {
    allSegments.push(...getDigitSegments(digits[0], 144, 200, 1.25));
    allSegments.push(...getDigitSegments(digits[1], 256, 200, 1.25));
  } else {
    const spacing = 75;
    const startX = 200 - ((digits.length - 1) * spacing) / 2;
    digits.forEach((d, idx) => {
      allSegments.push(...getDigitSegments(d, startX + idx * spacing, 200, 1.0));
    });
  }

  const threshold = digits.length === 1 ? 26 : 21;
  return (x: number, y: number) => {
    for (const [x1, y1, x2, y2] of allSegments) {
      if (distToSegment(x, y, x1, y1, x2, y2) <= threshold) {
        return true;
      }
    }
    return false;
  };
}

// Client-side offscreen canvas mask rasterizer with bold, continuous font rendering
function getNumeralMask(numStr: string): (x: number, y: number) => boolean {
  if (typeof document === 'undefined') {
    return fallbackVectorMask(numStr);
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return fallbackVectorMask(numStr);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 400, 400);

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Clear, solid geometric font stack that guarantees unbroken strokes
    let fontSize = 185;
    let strokeW = 18;
    if (numStr.length === 1) {
      fontSize = 240;
      strokeW = 24;
    } else if (numStr.length === 2) {
      fontSize = 190;
      strokeW = 18;
    } else {
      fontSize = 135;
      strokeW = 14;
    }

    ctx.font = `900 ${fontSize}px "Inter", "Arial Black", "Arial", -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = strokeW;

    const offsetY = 202;

    if (numStr.length === 2) {
      // Optical separation for 2-digit numbers so digits never collide
      const d1 = numStr[0];
      const d2 = numStr[1];
      const spacing = 58;
      ctx.strokeText(d1, 200 - spacing, offsetY);
      ctx.fillText(d1, 200 - spacing, offsetY);
      ctx.strokeText(d2, 200 + spacing, offsetY);
      ctx.fillText(d2, 200 + spacing, offsetY);
    } else {
      ctx.strokeText(numStr, 200, offsetY);
      ctx.fillText(numStr, 200, offsetY);
    }

    const imgData = ctx.getImageData(0, 0, 400, 400).data;

    return (x: number, y: number) => {
      const px = Math.floor(x);
      const py = Math.floor(y);
      if (px < 0 || px >= 400 || py < 0 || py >= 400) return false;
      return imgData[(py * 400 + px) * 4] > 80;
    };
  } catch (err) {
    return fallbackVectorMask(numStr);
  }
}

// Generate the authentic Ishihara dot arrangement with crisp separation
function generatePlateDots(
  number: string,
  palette: IshiharaPalette,
  seed: number
): DotItem[] {
  const rand = createPrng(seed);
  const isInsideNumeral = getNumeralMask(number);

  const cx = 200;
  const cy = 200;
  const maxR = 182; // plate radius
  const dots: DotItem[] = [];

  // Spatial grid for collision avoidance (cell size 16px)
  const cellSize = 16;
  const gridDim = Math.ceil(400 / cellSize);
  const grid: Array<Array<{ x: number; y: number; r: number }>> = Array.from(
    { length: gridDim * gridDim },
    () => []
  );

  function getCell(x: number, y: number): number {
    const gx = Math.floor(x / cellSize);
    const gy = Math.floor(y / cellSize);
    if (gx < 0 || gx >= gridDim || gy < 0 || gy >= gridDim) return -1;
    return gy * gridDim + gx;
  }

  // Concentric / spiral generation with controlled jitter
  const ringStep = 9.4;
  for (let r = 0; r <= maxR; r += ringStep) {
    const circumference = r === 0 ? 1 : 2 * Math.PI * r;
    const dotDistance = 10.4;
    const count = r === 0 ? 1 : Math.max(6, Math.floor(circumference / dotDistance));
    const angleOffset = rand() * Math.PI * 2;

    for (let i = 0; i < count; i++) {
      const angle = r === 0 ? 0 : angleOffset + (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.28;
      const dist = r + (rand() - 0.5) * 3.4;
      if (dist > maxR) continue;

      const x = cx + dist * Math.cos(angle);
      const y = cy + dist * Math.sin(angle);

      // Varying sizes: small (25%), medium (50%), large (25%)
      const roll = rand();
      let radius: number;
      if (roll < 0.25) {
        radius = 2.8 + rand() * 1.0; // small: 2.8 - 3.8px
      } else if (roll < 0.75) {
        radius = 4.4 + rand() * 1.3; // medium: 4.4 - 5.7px
      } else {
        radius = 6.2 + rand() * 1.6; // large: 6.2 - 7.8px
      }

      // Check collision with neighbor cells (using 0.93 to prevent muddy overlap)
      const cellIdx = getCell(x, y);
      if (cellIdx === -1) continue;

      let collision = false;
      const gx = Math.floor(x / cellSize);
      const gy = Math.floor(y / cellSize);

      for (let nx = Math.max(0, gx - 1); nx <= Math.min(gridDim - 1, gx + 1); nx++) {
        for (let ny = Math.max(0, gy - 1); ny <= Math.min(gridDim - 1, gy + 1); ny++) {
          const neighbors = grid[ny * gridDim + nx];
          for (const d of neighbors) {
            const dSq = (x - d.x) ** 2 + (y - d.y) ** 2;
            const minAllowed = (radius + d.r) * 0.93; // Clean individual dot separation
            if (dSq < minAllowed * minAllowed) {
              collision = true;
              break;
            }
          }
          if (collision) break;
        }
        if (collision) break;
      }

      if (collision) continue;

      // Classify dot as numeral or background
      const isNumeral = isInsideNumeral(x, y);

      let color: string;
      if (isNumeral) {
        // Pick from numeral palette
        const cIdx = Math.floor(rand() * palette.numeralColors.length);
        color = palette.numeralColors[cIdx];
      } else {
        // Pick from background palette
        const bgIdx = Math.floor(rand() * palette.backgroundColors.length);
        color = palette.backgroundColors[bgIdx];
      }

      const dot: DotItem = {
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        r: Math.round(radius * 10) / 10,
        color,
        isNumeral
      };

      dots.push(dot);
      grid[cellIdx].push({ x: dot.x, y: dot.y, r: dot.r });
    }
  }

  return dots;
}

export default function IshiharaPlateSvg({
  number,
  paletteId,
  seed,
  size = '100%',
  className = '',
  showSolutionOutline = false
}: IshiharaPlateSvgProps) {
  const palette = useMemo(() => {
    return ISHIHARA_PALETTES[paletteId] || ISHIHARA_PALETTES.orange_on_grey;
  }, [paletteId]);

  // Generate dots deterministically
  const dots = useMemo(() => {
    return generatePlateDots(number, palette, seed);
  }, [number, palette, seed]);

  return (
    <div
      className={`relative inline-block select-none overflow-hidden rounded-full shadow-md border border-slate-200/90 bg-[#FBFBFA] ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        maxWidth: '100%',
        aspectRatio: '1 / 1'
      }}
    >
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full block"
        style={{ shapeRendering: 'geometricPrecision' }}
        role="img"
        aria-label={`Ishihara Plate containing hidden number`}
      >
        <defs>
          {/* Authentic lithographic paper card background */}
          <radialGradient id={`paper-grad-${seed}`} cx="48%" cy="48%" r="62%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#FAF8F5" />
            <stop offset="100%" stopColor="#ECEAE5" />
          </radialGradient>

          {/* Vignette shadow around plate rim */}
          <radialGradient id={`vignette-${seed}`} cx="50%" cy="50%" r="50%">
            <stop offset="86%" stopColor="#000000" stopOpacity="0" />
            <stop offset="97%" stopColor="#000000" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.14" />
          </radialGradient>
        </defs>

        {/* Textured circular plate background card */}
        <circle cx="200" cy="200" r="188" fill={`url(#paper-grad-${seed})`} />

        {/* Hundreds of distinct colored dots with subtle perimeter stroke */}
        <g>
          {dots.map((dot, idx) => {
            const isHighlighted = showSolutionOutline && dot.isNumeral;
            return (
              <circle
                key={idx}
                cx={dot.x}
                cy={dot.y}
                r={dot.r}
                fill={isHighlighted ? '#FFE600' : dot.color}
                stroke={isHighlighted ? '#0F172A' : 'rgba(0, 0, 0, 0.09)'}
                strokeWidth={isHighlighted ? 1.6 : 0.55}
                opacity={0.98}
              />
            );
          })}
        </g>

        {/* Soft edge vignette ring */}
        <circle cx="200" cy="200" r="188" fill={`url(#vignette-${seed})`} pointerEvents="none" />

        {/* Crisp circular rim stroke */}
        <circle
          cx="200"
          cy="200"
          r="187.5"
          fill="none"
          stroke="#D8D8D2"
          strokeWidth="1.2"
          pointerEvents="none"
        />
      </svg>
    </div>
  );
}
