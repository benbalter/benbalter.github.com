#!/usr/bin/env tsx
/**
 * Fail if any committed image carries GPS coordinates (see
 * src/lib/image-privacy.ts). Checks every tracked image, not just a PR's,
 * since it's fast and a leak anywhere in the repo is public.
 *
 * Fix a hit with `exiftool -all= <file>`, then confirm with
 * `exiftool -a -G1 -ee -gps:all <file>` printing nothing.
 */

import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { findGps, IMAGE_EXTENSIONS } from '../src/lib/image-privacy';

const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf-8' })
  .split('\0')
  .filter((f) => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()));

const leaks = files.filter((f) => findGps(fs.readFileSync(f)));

if (leaks.length > 0) {
  console.error(`❌ ${leaks.length} image(s) carry GPS coordinates:\n`);
  for (const f of leaks) console.error(`   ${f}`);
  console.error('\nStrip them with `exiftool -all= <file>`, then check `exiftool -a -G1 -ee -gps:all <file>` prints nothing.');
  process.exit(1);
}
console.log(`✅ No GPS data in ${files.length} images`);
