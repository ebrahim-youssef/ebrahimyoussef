import markSvg from '../../../assets/brand/monogram.svg?raw';

export interface ShareData {
  score: number;
  total: number;
  seconds: number;
}

const COLORS = {
  bg: '#faf6ef', // --color-bg
  ink: '#2b2118', // --color-text
  terra: '#c05c21', // --color-accent
  terraDeep: '#934312', // --color-accent-700
  gold: '#b68725', // --color-accent-2
};

const SITE_URL = 'ebrahimyoussef.com';
const CARD_SIZE = 1080;

/** Short line shown on-screen (EndScreen headline) and drawn on the share card itself. */
export function headlineText({ score, total, seconds }: ShareData): string {
  return `I named ${score} of ${total} figures in ${seconds}s`;
}

/** Longer line used for the native share sheet / clipboard fallback. */
export function shareMessage({ score, total, seconds }: ShareData): string {
  return `I named ${score} of ${total} Islamic figures in ${seconds}s. Play at ${SITE_URL}`;
}

interface TextClipboard {
  writeText(text: string): Promise<void>;
}

export async function copyShareText(
  clipboard: TextClipboard | undefined,
  text: string,
): Promise<'copied' | 'unavailable'> {
  if (!clipboard) return 'unavailable';
  await clipboard.writeText(text);
  return 'copied';
}

/* The card draws the same EY mark the rest of the site does, read straight from the
   brand asset so a share image can never carry a stale logo. Path2D consumes SVG
   path data as-is, so nothing here needs to know the shape. */
const [, MARK_W, MARK_H] = /viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/.exec(markSvg)!.map(Number);
const MARK_PATHS = [...markSvg.matchAll(/<path fill="([^"]+)" d="([^"]+)"/g)].map(
  ([, fill, d]) => ({ fill, d }),
);

/** Draws the EY mark centred on (cx, cy) at a given rendered width. */
function drawMonogram(ctx: CanvasRenderingContext2D, cx: number, cy: number, width: number) {
  const scale = width / MARK_W;
  ctx.save();
  ctx.translate(cx - width / 2, cy - (MARK_H * scale) / 2);
  ctx.scale(scale, scale);
  for (const { fill, d } of MARK_PATHS) {
    ctx.fillStyle = fill;
    ctx.fill(new Path2D(d));
  }
  ctx.restore();
}

/** Simple 8-point star (octagram) — the card's sole decorative flourish, kept geometric on purpose. */
function drawAccentStar(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  const outer = 24;
  const inner = 10;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI / 8) * i - Math.PI / 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = COLORS.gold;
  ctx.fill();
  ctx.restore();
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Draws the 1080×1080 share card and resolves to a PNG blob (or null if canvas
 * is unavailable — this is browser-only, called from EndScreen's Share button).
 */
export async function drawShareCard(data: ShareData): Promise<Blob | null> {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = CARD_SIZE;
  canvas.height = CARD_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  try {
    await document.fonts?.ready;
  } catch {
    /* best-effort — falls back to system sans-serif below */
  }

  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);

  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, CARD_SIZE - 60, CARD_SIZE - 60);

  drawMonogram(ctx, CARD_SIZE / 2, 210, 205);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = COLORS.terra;
  ctx.font = "400 104px 'Caprasimo', 'Rubik Variable', system-ui, sans-serif";
  ctx.fillText(`${data.score} / ${data.total}`, CARD_SIZE / 2, 460);

  ctx.fillStyle = COLORS.ink;
  ctx.font = "600 44px 'Figtree Variable', 'Rubik Variable', system-ui, sans-serif";
  const lines = wrapLines(ctx, headlineText(data), CARD_SIZE - 220);
  const lineHeight = 58;
  const startY = 580;
  lines.forEach((line, i) => ctx.fillText(line, CARD_SIZE / 2, startY + i * lineHeight));

  drawAccentStar(ctx, CARD_SIZE / 2, startY + lines.length * lineHeight + 60);

  ctx.fillStyle = COLORS.terraDeep;
  ctx.font = "600 38px 'Figtree Variable', 'Rubik Variable', system-ui, sans-serif";
  ctx.fillText(SITE_URL, CARD_SIZE / 2, startY + lines.length * lineHeight + 150);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}
