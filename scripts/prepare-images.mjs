/**
 * Prepares the site photography.
 *
 * Sources are the supplied Srimithra Construction photo pack. Originals live in
 * `.cache/photo-pack` (gitignored); point `PHOTO_PACK` at another directory to
 * re-import a new delivery, then re-run:
 *
 *   node scripts/prepare-images.mjs
 *
 * Processed output and a provenance note land in `public/images`. Frames are
 * written close to their native size and cropped in CSS by each placement, so
 * `next/image` can serve exactly what a given viewport needs.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const PACK = process.env.PHOTO_PACK ?? path.join(ROOT, '.cache', 'photo-pack');
const OUT = path.join(ROOT, 'public', 'images');

/** Tonal treatments. Light-handed: the pack is already graded. */
const TREATMENTS = {
  /** Unifies the set without draining the greens and skies. */
  photo: (p) => p.modulate({ brightness: 1.02, saturation: 0.9 }).linear(0.97, 4),
  /** Quieter and deeper, for the full-bleed band that carries light type. */
  deep: (p) => p.modulate({ brightness: 0.94, saturation: 0.82 }).linear(0.95, -2),
};

/**
 * Output set — one entry per picture the page actually places. `name` says
 * where it appears, so a component's `src` reads as its own documentation.
 * Unused frames from the pack are listed at the foot of this file.
 */
const OUTPUTS = [
  // The approved SM lockup, used exactly as supplied — only its transparent
  // padding is trimmed so the mark can be set to an exact optical height on the
  // grid. Nothing is cropped, recoloured or reproportioned; the navy footer
  // knocks the same file out to white in CSS.
  { name: 'srimithra-lockup', src: 'srimithra-logo.png', local: true, trim: true, w: 1120, alpha: true },

  { name: 'hero-erection', src: '03_pole_line_erection.jpg', treat: 'photo' },
  { name: 'project-transformer', src: '07_distribution_transformer.jpg', treat: 'photo' },
  { name: 'project-detail', src: '10_transformer_detail.jpg', treat: 'photo' },
  { name: 'project-erection', src: '11_site_erection.jpg', treat: 'photo' },
  { name: 'band-landscape', src: '09_infrastructure_landscape.jpg', treat: 'deep' },
  { name: 'safety-engineer', src: '06_field_engineer.jpg', treat: 'photo' },
  { name: 'vision-corridor', src: '01_hero_distribution.jpg', treat: 'photo' },
];

/** Frames in the pack the page does not currently place. */
const UNPLACED = [
  '02_distribution_line.jpg',
  '04_testing_field.jpg',
  '05_line_components.jpg',
  '08_testing_commissioning.jpg',
  '12_safety_tools.jpg',
];

async function build() {
  if (!fs.existsSync(PACK)) {
    throw new Error(`Photo pack not found at ${PACK} — set PHOTO_PACK to the delivery directory.`);
  }
  fs.mkdirSync(OUT, { recursive: true });

  for (const job of OUTPUTS) {
    const file = job.local ? path.join(OUT, job.src) : path.join(PACK, job.src);
    if (!fs.existsSync(file)) throw new Error(`Missing source: ${file}`);

    const pipeline = sharp(file, { limitInputPixels: false }).rotate();
    // `trim` drops surrounding transparency; the height then follows from the
    // artwork's own proportions rather than being forced by a resize.
    if (job.trim) pipeline.trim({ threshold: 1 });
    if (job.w) pipeline.resize({ width: job.w, withoutEnlargement: true });

    const target = path.join(OUT, `${job.name}.${job.alpha ? 'png' : 'jpg'}`);
    if (job.alpha) {
      // Artwork, not photography: no tonal treatment, transparency preserved.
      await pipeline.png({ compressionLevel: 9 }).toFile(target);
    } else {
      TREATMENTS[job.treat](pipeline);
      await pipeline.jpeg({ quality: 80, mozjpeg: true }).toFile(target);
    }

    const { width, height } = await sharp(target).metadata();
    console.log(`  ${path.basename(target)}  ${width}x${height}  ${(fs.statSync(target).size / 1024).toFixed(0)}kb`);
  }

  const credits = [
    '# Photography',
    '',
    'Supplied by Srimithra Construction as `SRIMITHRA_CONSTRUCTION_HD_PHOTO_PACK`.',
    'Originals are held in `.cache/photo-pack` (gitignored); the files below are',
    'produced from them by `scripts/prepare-images.mjs`.',
    '',
    'Frames are written close to their native size and cropped by each placement',
    'in CSS, so `next/image` can serve exactly what a viewport needs. To swap in a',
    'new delivery, point `PHOTO_PACK` at it and re-run the script.',
    '',
    '## Placed',
    '',
    ...OUTPUTS.filter((o) => !o.local).map((o) => `- \`${o.name}.jpg\` — ${o.src}`),
    '',
    '## In the pack, not currently placed',
    '',
    ...UNPLACED.map((f) => `- ${f}`),
    '',
    '## Logo',
    '',
    'The approved SM lockup is used as supplied. `srimithra-lockup.png` is the same',
    'artwork with its transparent padding trimmed so it can be set to an exact',
    'optical height; nothing is cropped, recoloured or reproportioned.',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(OUT, 'CREDITS.md'), credits);
  console.log('  CREDITS.md');
}

build().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
