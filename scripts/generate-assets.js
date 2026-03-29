#!/usr/bin/env node
/**
 * generate-assets.js
 * Creates all required icon and splash screen PNGs for KidLearnAI
 * using only Node.js built-ins (no extra dependencies needed).
 *
 * Usage: node scripts/generate-assets.js
 */

const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

// ── CRC-32 (required for PNG chunk integrity) ─────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

// ── PNG chunk helper ──────────────────────────────────────────────────────────
function chunk(type, data) {
  const len  = Buffer.alloc(4);  len.writeUInt32BE(data.length);
  const t    = Buffer.from(type, 'ascii');
  const crc  = Buffer.alloc(4);  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

// ── Solid-colour PNG builder ──────────────────────────────────────────────────
/**
 * @param {number} w  Width in pixels
 * @param {number} h  Height in pixels
 * @param {number[]} bg  [R, G, B] background colour (0-255 each)
 * @param {number[]} [dot]  Optional [R,G,B] colour of a centred "icon dot"
 * @param {number} [dotRadius] Fraction of min(w,h) for the dot (default 0.35)
 */
function makePNG(w, h, bg, dot, dotRadius = 0.35) {
  const sig  = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8]  = 8;   // bit depth
  ihdr[9]  = 2;   // colour type: RGB
  ihdr[10] = ihdr[11] = ihdr[12] = 0;

  // Build raw scanlines (filter-byte 0 per row)
  const rowLen = w * 3 + 1;
  const raw    = Buffer.alloc(h * rowLen, 0);

  const cx = w / 2, cy = h / 2;
  const r2 = dot ? Math.pow(Math.min(w, h) * dotRadius, 2) : 0;

  for (let y = 0; y < h; y++) {
    const base = y * rowLen;
    raw[base] = 0; // filter = None
    for (let x = 0; x < w; x++) {
      const off = base + 1 + x * 3;
      let colour = bg;
      if (dot && ((x - cx) ** 2 + (y - cy) ** 2 <= r2)) colour = dot;
      raw[off] = colour[0]; raw[off + 1] = colour[1]; raw[off + 2] = colour[2];
    }
  }

  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// ── Color palette ─────────────────────────────────────────────────────────────
const CORAL  = [255, 107, 107]; // #FF6B6B  primary brand
const BLUE   = [ 96, 165, 250]; // #60A5FA  Sparky's head colour
const YELLOW = [255, 230, 109]; // #FFE66D  accent / antenna

// ── Output paths ─────────────────────────────────────────────────────────────
const OUT = path.join(__dirname, '..', 'assets', 'images');
fs.mkdirSync(OUT, { recursive: true });

const files = [
  // [filename,  width, height,  bg,    dot,   dotRadius]
  ['icon.png',            1024, 1024, CORAL,  BLUE,   0.38],
  ['adaptive-icon.png',   1024, 1024, CORAL,  BLUE,   0.38],
  ['splash.png',          1284, 2778, CORAL,  YELLOW, 0.12],
  ['favicon.png',           48,   48, CORAL,  BLUE,   0.38],
];

for (const [name, w, h, bg, dot, r] of files) {
  const buf  = makePNG(w, h, bg, dot, r);
  const dest = path.join(OUT, name);
  fs.writeFileSync(dest, buf);
  const kb = (buf.length / 1024).toFixed(1);
  console.log(`✓  ${name.padEnd(22)}  ${String(w).padStart(5)}×${String(h).padEnd(5)}  ${kb} KB`);
}

console.log('\n✅  All assets generated in assets/images/');
console.log('   Run  npx expo start  then scan the QR code with Expo Go.\n');
