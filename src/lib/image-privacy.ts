/**
 * Detect location data in images before they ship.
 *
 * Phone photos carry the GPS coordinates of where they were taken, often Ben's
 * home, in EXIF or XMP metadata, and format conversions (sips, magick) carry it
 * forward unless it's stripped. script/check-image-privacy.ts runs this over
 * every committed image and fails CI on a hit.
 */

import ExifReader from 'exifreader';

/** Image extensions ExifReader can read metadata from. */
export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.avif', '.tif', '.tiff', '.gif'];

/** Return the coordinates embedded in an image, or undefined if it has none. */
export function findGps(image: Buffer | ArrayBuffer): { latitude: number; longitude: number } | undefined {
  let gps;
  try {
    gps = ExifReader.load(image, { expanded: true }).gps;
  } catch {
    return undefined; // ExifReader throws on files with no metadata it can parse
  }
  if (gps?.Latitude === undefined || gps.Longitude === undefined) return undefined;
  return { latitude: gps.Latitude, longitude: gps.Longitude };
}
