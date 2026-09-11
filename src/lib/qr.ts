// Dependency-free QR Code generator (byte mode, auto version, EC level L).
// Produces a boolean matrix (true = dark module) plus the dimension.
// Implements: data encoding, Reed-Solomon ECC, module placement, masking, format info.

const EC_LEVEL_L = 0b01

// Generator polynomials for error correction per ECC level L, indexed by version 1..40
// We compute Reed-Solomon on the fly; here we store capacity (byte mode, L) per version.
const BYTE_CAPACITY_L: number[] = [
  0, 17, 32, 53, 78, 106, 134, 154, 192, 230, 271,
  321, 367, 425, 458, 520, 586, 644, 718, 792, 858,
  929, 1003, 1091, 1171, 1273, 1367, 1465, 1528, 1628, 1732,
  1840, 1952, 2068, 2188, 2303, 2431, 2563, 2691, 2812, 2956,
]

// EC codeword counts + block layout for level L per version (totalDataCodewords, ecPerBlock, numBlocksGroup1, dataPerBlockG1, numBlocksGroup2, dataPerBlockG2)
// Source: QR spec table. We include versions 1..10 (enough for sheet metadata strings).
const EC_BLOCKS_L: Record<number, [number, number, number, number, number, number]> = {
  1: [19, 7, 1, 19, 0, 0],
  2: [34, 10, 1, 34, 0, 0],
  3: [55, 15, 1, 55, 0, 0],
  4: [80, 20, 1, 80, 0, 0],
  5: [107, 26, 1, 107, 0, 0],
  6: [134, 36, 1, 134, 0, 0],
  7: [154, 40, 2, 77, 0, 0],
  8: [192, 48, 2, 96, 0, 0],
  9: [230, 60, 2, 115, 0, 0],
  10: [271, 72, 2, 116, 2, 117],
}

const MAX_VERSION = 10

function buildExpLogTables(primitive: number): { exp: number[]; log: number[] } {
  const exp = new Array(256).fill(0)
  const log = new Array(256).fill(0)
  let x = 1
  for (let i = 0; i < 255; i++) {
    exp[i] = x
    log[x] = i
    x <<= 1
    if (x & 0x100) x ^= primitive
  }
  return { exp, log }
}

const GF_TABLES = buildExpLogTables(0x11d)
const GF_EXP = GF_TABLES.exp
const GF_LOG = GF_TABLES.log

function gfMultiply(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return GF_EXP[(GF_LOG[a] + GF_LOG[b]) % 255]
}

function rsGeneratorPoly(degree: number): number[] {
  let poly = [1]
  for (let i = 0; i < degree; i++) {
    const newPoly = new Array(poly.length + 1).fill(0)
    for (let j = 0; j < poly.length; j++) {
      newPoly[j] ^= poly[j]
      newPoly[j + 1] ^= gfMultiply(poly[j], GF_EXP[i])
    }
    poly = newPoly
  }
  return poly
}

function rsEncode(data: number[], ecLen: number): number[] {
  const gen = rsGeneratorPoly(ecLen)
  const buf = data.concat(new Array(ecLen).fill(0))
  for (let i = 0; i < data.length; i++) {
    const coef = buf[i]
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        buf[i + j] ^= gfMultiply(gen[j], coef)
      }
    }
  }
  return buf.slice(data.length)
}

function selectVersion(byteLen: number): number {
  for (let v = 1; v <= MAX_VERSION; v++) {
    if (byteLen <= BYTE_CAPACITY_L[v]) return v
  }
  return MAX_VERSION
}

function encodeBytes(str: string): number[] {
  const out: number[] = []
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i)
    if (code < 0x80) out.push(code)
    else if (code < 0x800) {
      out.push(0xc0 | (code >> 6))
      out.push(0x80 | (code & 0x3f))
    } else {
      out.push(0xe0 | (code >> 12))
      out.push(0x80 | ((code >> 6) & 0x3f))
      out.push(0x80 | (code & 0x3f))
    }
  }
  return out
}

function buildDataBits(text: string, version: number): number[] {
  const bytes = encodeBytes(text)
  const bits: number[] = []
  const push = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1)
  }
  push(0b0100, 4)
  const charCountBits = version < 10 ? 8 : 16
  push(bytes.length, charCountBits)
  for (const b of bytes) push(b, 8)
  const totalDataCodewords = EC_BLOCKS_L[version][0]
  const totalBits = totalDataCodewords * 8
  push(0, 4)
  while (bits.length % 8 !== 0) bits.push(0)
  let padByte = 0xec
  while (bits.length < totalBits) {
    push(padByte, 8)
    padByte = padByte === 0xec ? 0x11 : 0xec
  }
  return bits
}

function bitsToCodewords(bits: number[]): number[] {
  const out: number[] = []
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]
    out.push(b)
  }
  return out
}

function interleaveCodewords(data: number[], version: number): number[] {
  const [, ecPerBlock, g1, d1, g2, d2] = EC_BLOCKS_L[version]
  const blocks: number[][] = []
  const ecBlocks: number[][] = []
  let idx = 0
  const buildBlock = (count: number, size: number) => {
    for (let b = 0; b < count; b++) {
      const block = data.slice(idx, idx + size)
      idx += size
      blocks.push(block)
      ecBlocks.push(rsEncode(block, ecPerBlock))
    }
  }
  buildBlock(g1, d1)
  if (g2 > 0) buildBlock(g2, d2)
  const maxData = Math.max(...blocks.map((b) => b.length))
  const out: number[] = []
  for (let i = 0; i < maxData; i++) {
    for (const b of blocks) if (i < b.length) out.push(b[i])
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (const b of ecBlocks) if (i < b.length) out.push(b[i])
  }
  return out
}

function placeFinder(m: boolean[][], reserved: boolean[][], r: number, c: number) {
  for (let i = -1; i <= 7; i++) {
    for (let j = -1; j <= 7; j++) {
      const rr = r + i
      const cc = c + j
      if (rr < 0 || cc < 0 || rr >= m.length || cc >= m.length) continue
      const isBorder = i === 0 || i === 6 || j === 0 || j === 6
      const isInner = i >= 2 && i <= 4 && j >= 2 && j <= 4
      const isFrame = (i === -1 || i === 7 || j === -1 || j === 7)
      if (isFrame) reserved[rr][cc] = true
      else {
        reserved[rr][cc] = true
        m[rr][cc] = isBorder || isInner
      }
    }
  }
}

function placeTimingPatterns(m: boolean[][], reserved: boolean[][], size: number) {
  for (let i = 8; i < size - 8; i++) {
    m[6][i] = i % 2 === 0
    m[i][6] = i % 2 === 0
    reserved[6][i] = true
    reserved[i][6] = true
  }
}

function placeAlignmentPatterns(m: boolean[][], reserved: boolean[][], version: number) {
  const centers: number[] = alignmentCenters(version)
  for (const r of centers) {
    for (const c of centers) {
      if ((r === 6 && c === 6) || (r === 6 && c === centers[centers.length - 1]) || (c === 6 && r === centers[centers.length - 1])) continue
      for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
          const rr = r + i
          const cc = c + j
          reserved[rr][cc] = true
          const dist = Math.max(Math.abs(i), Math.abs(j))
          m[rr][cc] = dist !== 1
        }
      }
    }
  }
}

function alignmentCenters(version: number): number[] {
  if (version === 1) return []
  const intervals = Math.floor(version / 7) + 2
  const size = version * 4 + 17
  const first = 6
  const last = size - 7
  const step = (last - first) / (intervals - 1)
  const centers = [first]
  for (let i = 1; i < intervals; i++) {
    centers.push(Math.round(first + step * i))
  }
  return centers
}

function reserveFormatAreas(reserved: boolean[][], size: number) {
  for (let i = 0; i < 9; i++) reserved[8][i] = reserved[i][8] = true
  reserved[8][size - 8] = true
  for (let i = 0; i < 8; i++) reserved[size - 1 - i][8] = true
  if (size >= 45) {
    // dark module
  }
  reserved[size - 8][8] = true
}

function placeData(m: boolean[][], reserved: boolean[][], data: number[], size: number) {
  let bitIdx = 0
  let upward = true
  let col = size - 1
  while (col > 0) {
    if (col === 6) col--
    for (let i = 0; i < size; i++) {
      const r = upward ? size - 1 - i : i
      for (let c of [col, col - 1]) {
        if (!reserved[r][c]) {
          const byteIdx = Math.floor(bitIdx / 8)
          const bitInByte = 7 - (bitIdx % 8)
          const bit = byteIdx < data.length ? ((data[byteIdx] >> bitInByte) & 1) === 1 : false
          m[r][c] = bit
          bitIdx++
        }
      }
    }
    col -= 2
    upward = !upward
  }
}

const MASK_FNS: ((r: number, c: number) => boolean)[] = [
  (r, c) => (r + c) % 2 === 0,
  (r, c) => r % 2 === 0,
  (r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2 + (r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
]

function applyMask(m: boolean[][], reserved: boolean[][], maskIdx: number, size: number): boolean[][] {
  const fn = MASK_FNS[maskIdx]
  const out = m.map((row) => row.slice())
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c] && fn(r, c)) out[r][c] = !out[r][c]
    }
  }
  return out
}

function penalty(m: boolean[][], size: number): number {
  let p = 0
  for (let r = 0; r < size; r++) {
    let run = 1
    for (let c = 1; c < size; c++) {
      if (m[r][c] === m[r][c - 1]) {
        run++
        if (run === 5) p += 3
        else if (run > 5) p++
      } else run = 1
    }
  }
  for (let c = 0; c < size; c++) {
    let run = 1
    for (let r = 1; r < size; r++) {
      if (m[r][c] === m[r - 1][c]) {
        run++
        if (run === 5) p += 3
        else if (run > 5) p++
      } else run = 1
    }
  }
  return p
}

function placeFormatInfo(m: boolean[][], maskIdx: number, size: number) {
  const ec = EC_LEVEL_L
  const format = (ec << 3) | maskIdx
  let bits = format << 10
  const g = 0b10100110111
  for (let i = 14; i >= 10; i--) {
    if ((bits >> i) & 1) bits ^= g << (i - 10)
  }
  const fmt = ((format << 10) | bits) ^ 0b101010000010010
  for (let i = 0; i <= 5; i++) m[8][i] = ((fmt >> i) & 1) === 1
  m[8][7] = ((fmt >> 6) & 1) === 1
  m[8][8] = ((fmt >> 7) & 1) === 1
  m[7][8] = ((fmt >> 8) & 1) === 1
  for (let i = 9; i <= 14; i++) m[size - 15 + i][8] = ((fmt >> i) & 1) === 1
  for (let i = 0; i < 7; i++) m[8][size - 1 - i] = ((fmt >> i) & 1) === 1
  for (let i = 0; i < 8; i++) m[size - 1 - i][8] = ((fmt >> (i + 7)) & 1) === 1
  m[size - 8][8] = true
}

export interface QrResult {
  matrix: boolean[][]
  size: number
  version: number
}

export function encodeQr(text: string): QrResult {
  const version = selectVersion(encodeBytes(text).length)
  const size = version * 4 + 17
  const m: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false))
  const reserved: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false))

  placeFinder(m, reserved, 0, 0)
  placeFinder(m, reserved, 0, size - 7)
  placeFinder(m, reserved, size - 7, 0)
  placeTimingPatterns(m, reserved, size)
  if (version >= 2) placeAlignmentPatterns(m, reserved, version)
  reserveFormatAreas(reserved, size)

  const dataBits = buildDataBits(text, version)
  const dataCodewords = bitsToCodewords(dataBits)
  const interleaved = interleaveCodewords(dataCodewords, version)
  placeData(m, reserved, interleaved, size)

  let bestMask = 0
  let bestPenalty = Infinity
  let bestMatrix = m
  for (let mk = 0; mk < 8; mk++) {
    const candidate = applyMask(m, reserved, mk, size)
    placeFormatInfo(candidate, mk, size)
    const p = penalty(candidate, size)
    if (p < bestPenalty) {
      bestPenalty = p
      bestMask = mk
      bestMatrix = candidate
    }
  }
  placeFormatInfo(bestMatrix, bestMask, size)
  return { matrix: bestMatrix, size, version }
}

export interface SheetMetadata {
  userId?: string
  sheetId?: string
  charList: string[]
}

export function encodeSheetMetadata(meta: SheetMetadata): string {
  return JSON.stringify({
    u: meta.userId ?? 'anon',
    s: meta.sheetId ?? Date.now().toString(36),
    c: meta.charList.join(''),
  })
}
