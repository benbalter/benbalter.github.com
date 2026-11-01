import { describe, it, expect } from 'vitest';
import sharp from 'sharp';
import { findGps } from './image-privacy';

const blank = () => sharp({ create: { width: 2, height: 2, channels: 3, background: '#ffffff' } });
const GPS = { GPSLatitudeRef: 'N', GPSLatitude: '51/1 30/1 0/1', GPSLongitudeRef: 'W', GPSLongitude: '0/1 6/1 0/1' };

describe('findGps', () => {
  for (const format of ['jpeg', 'png', 'webp'] as const) {
    it(`finds GPS coordinates in a ${format}`, async () => {
      const image = await blank().withExif({ IFD3: GPS }).toFormat(format).toBuffer();
      expect(findGps(image)).toEqual({ latitude: 51.5, longitude: -0.1 });
    });

    it(`returns undefined for a ${format} without them`, async () => {
      const image = await blank().withExif({ IFD0: { Copyright: 'Ben Balter' } }).toFormat(format).toBuffer();
      expect(findGps(image)).toBeUndefined();
    });
  }

  it('returns undefined for a file it cannot parse', () => {
    expect(findGps(Buffer.from('not an image'))).toBeUndefined();
  });
});
