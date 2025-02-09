import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> },
) {
  const path = (await params).path;

  if (!path) {
    return new NextResponse('Path is required', { status: 400 });
  }

  const gradient = getGradientByPath(path);

  const svg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
          ${gradient}
      </defs>
      <rect width="100" height="100" fill="url(#grad1)" />
      <rect width="100" height="100" fill="url(#grad2)" />
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
}

function getGradientByPath(path: string): string {
  const [color1, color2] = generateRandomGradientStops(path);
  return `
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="80%" style="stop-color:${color1};stop-opacity:0.05" />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="20%" style="stop-color:${color2};stop-opacity:0.05" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
  `;
}

function generateRandomGradientStops(seed: string): string[] {
  const rng = seedRandom(seed); // Seeded random number generator
  const color1 = `#${Math.floor(rng() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;
  const color2 = `#${Math.floor(rng() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;
  return [color1, color2];
}

function seedRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return function () {
    h = (Math.imul(31, h) + 1) | 0;
    return (h >>> 0) / 4294967296;
  };
}
