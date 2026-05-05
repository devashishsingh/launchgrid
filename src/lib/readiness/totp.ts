/**
 * RFC-6238 TOTP, zero deps. Includes:
 *  - base32 secret encode/decode
 *  - HOTP / TOTP code generation with ±1 step skew
 *  - otpauth:// URI builder
 *  - pure-TS QR-code SVG renderer (Reed-Solomon + Version-determined matrix)
 *
 * The QR generator below implements the full QR Code Model 2 byte-mode encoder
 * for versions 1-10, error-correction level M. That covers any otpauth:// URI
 * up to ~213 bytes which is more than enough for our use.
 */
import { createHmac, randomBytes, createHash } from "crypto";

/* ──────────── Base32 ──────────── */

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Encode(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 0x1f];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 0x1f];
  return out;
}

export function base32Decode(s: string): Buffer {
  const clean = s.replace(/=+$/g, "").toUpperCase().replace(/\s+/g, "");
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    const idx = B32.indexOf(ch);
    if (idx < 0) throw new Error("invalid base32 char: " + ch);
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

/* ──────────── TOTP ──────────── */

export function generateSecret(): string {
  return base32Encode(randomBytes(20));
}

function hotp(secret: Buffer, counter: number): string {
  const buf = Buffer.alloc(8);
  // big-endian 64-bit counter
  for (let i = 7; i >= 0; i--) {
    buf[i] = counter & 0xff;
    counter = Math.floor(counter / 256);
  }
  const h = createHmac("sha1", secret).update(buf).digest();
  const offset = h[h.length - 1] & 0xf;
  const code =
    ((h[offset] & 0x7f) << 24) |
    ((h[offset + 1] & 0xff) << 16) |
    ((h[offset + 2] & 0xff) << 8) |
    (h[offset + 3] & 0xff);
  return (code % 1_000_000).toString().padStart(6, "0");
}

export function totpAt(secretBase32: string, time = Date.now()): string {
  const counter = Math.floor(time / 30000);
  return hotp(base32Decode(secretBase32), counter);
}

export function verifyTOTP(secretBase32: string, code: string, skew = 1): boolean {
  const cleaned = code.replace(/\D/g, "");
  if (cleaned.length !== 6) return false;
  const counter = Math.floor(Date.now() / 30000);
  const secret = base32Decode(secretBase32);
  for (let i = -skew; i <= skew; i++) {
    if (hotp(secret, counter + i) === cleaned) return true;
  }
  return false;
}

/* ──────────── otpauth URI ──────────── */

export function otpauthURI(opts: {
  secret: string;
  issuer: string;
  accountName: string;
}): string {
  const label = encodeURIComponent(`${opts.issuer}:${opts.accountName}`);
  const params = new URLSearchParams({
    secret: opts.secret,
    issuer: opts.issuer,
    algorithm: "SHA1",
    digits: "6",
    period: "30",
  });
  return `otpauth://totp/${label}?${params.toString()}`;
}

/* ──────────── Backup codes ──────────── */

export function generateBackupCodes(count = 8): {
  plaintext: string[];
  hashes: string[];
} {
  const plaintext: string[] = [];
  const hashes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code =
      randomBytes(5)
        .toString("hex")
        .toUpperCase()
        .match(/.{1,4}/g)!
        .join("-");
    plaintext.push(code);
    hashes.push(createHash("sha256").update(code).digest("hex"));
  }
  return { plaintext, hashes };
}

export function consumeBackupCode(
  hashes: string[],
  candidate: string
): { ok: boolean; remaining: string[] } {
  const h = createHash("sha256")
    .update(candidate.trim().toUpperCase())
    .digest("hex");
  const idx = hashes.indexOf(h);
  if (idx < 0) return { ok: false, remaining: hashes };
  const remaining = [...hashes];
  remaining.splice(idx, 1);
  return { ok: true, remaining };
}

/* ════════════════════════════════════════════════════════════════════════
   QR CODE — pure TS, byte mode, EC level M, versions 1..10
   Sufficient for any otpauth:// URL in our usage.
   ──────────────────────────────────────────────────────────────────────── */

// GF(256) tables
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(function init() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGeneratorPoly(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    poly = polyMul(poly, [1, GF_EXP[i]]);
  }
  return poly;
}

function polyMul(a: number[], b: number[]): number[] {
  const out = new Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      out[i + j] ^= gfMul(a[i], b[j]);
    }
  }
  return out;
}

function rsEncode(data: number[], ecLen: number): number[] {
  const gen = rsGeneratorPoly(ecLen);
  const buf = data.concat(new Array(ecLen).fill(0));
  for (let i = 0; i < data.length; i++) {
    const coef = buf[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        buf[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return buf.slice(data.length);
}

// Capacity & EC parameters for level M, versions 1..10 (byte mode payloads)
// [version, totalCodewords, ecCodewordsPerBlock, group1Blocks, group1DataPerBlock, group2Blocks, group2DataPerBlock, byteCapacity]
const QR_M_PARAMS: Array<[number, number, number, number, number, number, number, number]> = [
  [1, 26, 10, 1, 16, 0, 0, 14],
  [2, 44, 16, 1, 28, 0, 0, 26],
  [3, 70, 26, 1, 44, 0, 0, 42],
  [4, 100, 18, 2, 32, 0, 0, 62],
  [5, 134, 24, 2, 43, 0, 0, 84],
  [6, 172, 16, 4, 27, 0, 0, 106],
  [7, 196, 18, 4, 31, 0, 0, 122],
  [8, 242, 22, 2, 38, 2, 39, 152],
  [9, 292, 22, 3, 36, 2, 37, 180],
  [10, 346, 26, 4, 43, 1, 44, 213],
];

const ALIGN_POS: number[][] = [
  [],
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

function pickVersion(byteLen: number): (typeof QR_M_PARAMS)[number] {
  for (const p of QR_M_PARAMS) {
    if (byteLen <= p[7]) return p;
  }
  throw new Error(`QR payload too large (${byteLen} bytes)`);
}

function buildBitstream(
  data: Uint8Array,
  version: number,
  totalDataCodewords: number
): Uint8Array {
  // mode indicator (4 bits): byte = 0100
  // char count: 8 bits for v1-9, 16 bits for v10+
  const ccBits = version < 10 ? 8 : 16;
  const totalBits = totalDataCodewords * 8;

  const bits: number[] = [];
  function pushBits(val: number, n: number) {
    for (let i = n - 1; i >= 0; i--) bits.push((val >> i) & 1);
  }
  pushBits(0b0100, 4);
  pushBits(data.length, ccBits);
  for (const b of data) pushBits(b, 8);

  // terminator (up to 4 zero bits)
  const term = Math.min(4, totalBits - bits.length);
  for (let i = 0; i < term; i++) bits.push(0);
  // pad to byte boundary
  while (bits.length % 8 !== 0) bits.push(0);
  // pad bytes 0xEC, 0x11
  const padBytes = [0xec, 0x11];
  let pi = 0;
  while (bits.length < totalBits) {
    pushBits(padBytes[pi % 2], 8);
    pi++;
  }

  const out = new Uint8Array(totalDataCodewords);
  for (let i = 0; i < totalDataCodewords; i++) {
    let v = 0;
    for (let j = 0; j < 8; j++) v = (v << 1) | bits[i * 8 + j];
    out[i] = v;
  }
  return out;
}

function interleaveBlocks(
  dataBytes: Uint8Array,
  params: (typeof QR_M_PARAMS)[number]
): Uint8Array {
  const [, totalCw, ecPerBlock, g1, g1d, g2, g2d] = params;
  const blocks: number[][] = [];
  const ecs: number[][] = [];
  let offset = 0;
  for (let i = 0; i < g1; i++) {
    const block = Array.from(dataBytes.slice(offset, offset + g1d));
    offset += g1d;
    blocks.push(block);
    ecs.push(rsEncode(block, ecPerBlock));
  }
  for (let i = 0; i < g2; i++) {
    const block = Array.from(dataBytes.slice(offset, offset + g2d));
    offset += g2d;
    blocks.push(block);
    ecs.push(rsEncode(block, ecPerBlock));
  }

  const maxData = Math.max(g1d, g2d || 0);
  const out: number[] = [];
  for (let i = 0; i < maxData; i++) {
    for (const b of blocks) {
      if (i < b.length) out.push(b[i]);
    }
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (const e of ecs) out.push(e[i]);
  }
  // Some versions have remainder bits but for v1-10 with level M none are required beyond byte boundary
  // (v2-6 have 7 remainder bits handled by zero-padding of final byte stream)
  // Pad to totalCw
  while (out.length < totalCw) out.push(0);
  return Uint8Array.from(out);
}

function placeModules(
  version: number,
  finalBytes: Uint8Array
): { matrix: Uint8Array[]; reserved: Uint8Array[] } {
  const size = 17 + 4 * version;
  const m: Uint8Array[] = [];
  const r: Uint8Array[] = [];
  for (let i = 0; i < size; i++) {
    m.push(new Uint8Array(size));
    r.push(new Uint8Array(size));
  }

  function setF(x: number, y: number, v: number) {
    m[y][x] = v;
    r[y][x] = 1;
  }

  // finder patterns
  const placeFinder = (cx: number, cy: number) => {
    for (let dy = -1; dy <= 7; dy++) {
      for (let dx = -1; dx <= 7; dx++) {
        const x = cx + dx,
          y = cy + dy;
        if (x < 0 || y < 0 || x >= size || y >= size) continue;
        const inOuter = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
        const onRing = inOuter && (dx === 0 || dx === 6 || dy === 0 || dy === 6);
        const inInner = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        let v = 0;
        if (onRing || inInner) v = 1;
        setF(x, y, v);
      }
    }
  };
  placeFinder(0, 0);
  placeFinder(size - 7, 0);
  placeFinder(0, size - 7);

  // timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (!r[6][i]) setF(i, 6, i % 2 === 0 ? 1 : 0);
    if (!r[i][6]) setF(6, i, i % 2 === 0 ? 1 : 0);
  }

  // alignment patterns
  const positions = ALIGN_POS[version] || [];
  for (const ay of positions) {
    for (const ax of positions) {
      // skip if overlaps finder
      if (
        (ax <= 8 && ay <= 8) ||
        (ax >= size - 9 && ay <= 8) ||
        (ax <= 8 && ay >= size - 9)
      )
        continue;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const x = ax + dx,
            y = ay + dy;
          const onRing = Math.abs(dx) === 2 || Math.abs(dy) === 2;
          const center = dx === 0 && dy === 0;
          setF(x, y, onRing || center ? 1 : 0);
        }
      }
    }
  }

  // dark module
  setF(8, size - 8, 1);

  // reserve format info
  for (let i = 0; i <= 8; i++) {
    if (!r[8][i]) {
      r[8][i] = 1;
    }
    if (!r[i][8]) {
      r[i][8] = 1;
    }
  }
  for (let i = 0; i < 8; i++) {
    r[8][size - 1 - i] = 1;
    r[size - 1 - i][8] = 1;
  }

  // place data: zigzag from bottom-right upward
  let bitIdx = 0;
  let upward = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--; // skip vertical timing
    for (let i = 0; i < size; i++) {
      const y = upward ? size - 1 - i : i;
      for (let dx = 0; dx < 2; dx++) {
        const x = col - dx;
        if (r[y][x]) continue;
        const byte = finalBytes[bitIdx >> 3];
        const bit = byte === undefined ? 0 : (byte >> (7 - (bitIdx & 7))) & 1;
        m[y][x] = bit;
        bitIdx++;
      }
    }
    upward = !upward;
  }

  return { matrix: m, reserved: r };
}

const MASKS: Array<(x: number, y: number) => boolean> = [
  (x, y) => (x + y) % 2 === 0,
  (_, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

function applyMask(
  matrix: Uint8Array[],
  reserved: Uint8Array[],
  maskIdx: number
): Uint8Array[] {
  const size = matrix.length;
  const out = matrix.map((row) => new Uint8Array(row));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (reserved[y][x]) continue;
      if (MASKS[maskIdx](x, y)) out[y][x] ^= 1;
    }
  }
  return out;
}

function penalty(matrix: Uint8Array[]): number {
  const size = matrix.length;
  let p = 0;
  // rule 1: runs of >=5
  for (let y = 0; y < size; y++) {
    let run = 1;
    for (let x = 1; x < size; x++) {
      if (matrix[y][x] === matrix[y][x - 1]) {
        run++;
      } else {
        if (run >= 5) p += run - 2;
        run = 1;
      }
    }
    if (run >= 5) p += run - 2;
  }
  for (let x = 0; x < size; x++) {
    let run = 1;
    for (let y = 1; y < size; y++) {
      if (matrix[y][x] === matrix[y - 1][x]) {
        run++;
      } else {
        if (run >= 5) p += run - 2;
        run = 1;
      }
    }
    if (run >= 5) p += run - 2;
  }
  // rule 2: 2x2 blocks
  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const v = matrix[y][x];
      if (
        matrix[y][x + 1] === v &&
        matrix[y + 1][x] === v &&
        matrix[y + 1][x + 1] === v
      )
        p += 3;
    }
  }
  // rule 4: balance
  let dark = 0;
  for (const row of matrix) for (const v of row) if (v) dark++;
  const ratio = (dark * 100) / (size * size);
  p += Math.floor(Math.abs(ratio - 50) / 5) * 10;
  return p;
}

const FORMAT_BCH_MASK = 0b101010000010010;
function formatBits(maskIdx: number): number {
  // EC level M = 0b00
  const ec = 0b00;
  const data = (ec << 3) | maskIdx;
  let r = data << 10;
  const gen = 0b10100110111;
  for (let i = 14; i >= 10; i--) {
    if ((r >> i) & 1) r ^= gen << (i - 10);
  }
  return ((data << 10) | r) ^ FORMAT_BCH_MASK;
}

function placeFormat(matrix: Uint8Array[], maskIdx: number): Uint8Array[] {
  const size = matrix.length;
  const out = matrix.map((r) => new Uint8Array(r));
  const bits = formatBits(maskIdx);
  for (let i = 0; i < 15; i++) {
    const bit = (bits >> i) & 1;
    // around top-left finder
    if (i < 6) out[8][i] = bit;
    else if (i < 8) out[8][i + 1] = bit;
    else if (i < 9) out[7][8] = bit;
    else out[14 - i][8] = bit;

    if (i < 8) out[size - 1 - i][8] = bit;
    else out[8][size - 15 + i] = bit;
  }
  // dark module
  out[size - 8][8] = 1;
  return out;
}

export function qrMatrix(text: string): Uint8Array[] {
  const data = new TextEncoder().encode(text);
  const params = pickVersion(data.length);
  const [version, totalCw, ecPerBlock, g1, g1d, g2, g2d] = params;
  const totalData = g1 * g1d + g2 * g2d;
  void totalCw;
  void ecPerBlock;
  const stream = buildBitstream(data, version, totalData);
  const finalBytes = interleaveBlocks(stream, params);

  const { matrix: raw, reserved } = placeModules(version, finalBytes);
  let best: Uint8Array[] | null = null;
  let bestP = Infinity;
  let bestMask = 0;
  for (let mi = 0; mi < 8; mi++) {
    const masked = applyMask(raw, reserved, mi);
    const withFmt = placeFormat(masked, mi);
    const p = penalty(withFmt);
    if (p < bestP) {
      bestP = p;
      best = withFmt;
      bestMask = mi;
    }
  }
  void bestMask;
  return best!;
}

export function qrSVG(text: string, scale = 6, margin = 4): string {
  const m = qrMatrix(text);
  const size = m.length;
  const dim = (size + margin * 2) * scale;
  const rects: string[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (m[y][x]) {
        rects.push(
          `<rect x="${(x + margin) * scale}" y="${(y + margin) * scale}" width="${scale}" height="${scale}"/>`
        );
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim} ${dim}" width="${dim}" height="${dim}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#ffffff"/><g fill="#000000">${rects.join("")}</g></svg>`;
}

export function qrAscii(text: string): string {
  const m = qrMatrix(text);
  const size = m.length;
  // pair two rows per line using block chars for compactness
  const lines: string[] = [];
  // top quiet zone
  const quiet = "  ";
  const pad = quiet.repeat(size + 4);
  lines.push(pad);
  lines.push(pad);
  for (let y = 0; y < size; y += 2) {
    let line = "    ";
    for (let x = 0; x < size; x++) {
      const top = m[y][x] === 1;
      const bot = y + 1 < size ? m[y + 1][x] === 1 : false;
      // invert: dark module = filled block on white terminal? we want dark on light bg.
      // Use unicode half-blocks with fg=dark module.
      if (top && bot) line += "██";
      else if (top && !bot) line += "▀▀";
      else if (!top && bot) line += "▄▄";
      else line += "  ";
    }
    line += "    ";
    lines.push(line);
  }
  lines.push(pad);
  lines.push(pad);
  return lines.join("\n");
}
