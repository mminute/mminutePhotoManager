import piexif from 'piexifjs';
import parseGPS from './parseGPS';
import { ExifMetadata } from './types/ExifMetadata';
import { ImageMetadata } from './types/ImageMetadata';
import { GpsMetadata } from './types/GpsMetadata';

/**
 * TOP LEVEL PIEXIFJS KEYS
 * See: https://auth0.com/blog/read-edit-exif-metadata-in-photos-with-javascript/#The--Piexifjs--Library
 * KEYS: 0th, Exif, GPS, Interop, 1st, thumbnail
 * =============================================
 * 0th:
 * - An object containing the properties of IFD0, the “zeroth” Image File Directory.
 * These properties contain the most basic metadata about the main image,
 * including information about the device used to take the picture,
 * the date and time the picture was taken,
 * the orientation of the device when the picture was taken,
 * and some basic information about the image itself, such as its pixel density.
 *
 * - For smartphone photos, the most useful information from this object will be
 * the smartphone’s make, model, and operating system version, and possibly its orientation.
 *
 * Exif:
 * - An object containing the properties of ExifIFD, an Image File Directory
 * that holds metadata that is specific to the Exif format.
 * This contains more detailed information about the image,
 * including camera settings such as shutter speed, aperture,and focal length,
 * which flash mode was used, the camera lens,
 * vendor-specific metadata, and additional date/time data.
 *
 * - For smartphone photos, the most useful information from this object
 * will be the image’s dimensions, the various camera settings,
 * a more accurate timestamp of when the photo was taken, and the Exif version used.
 *
 * GPS:
 * - An object containing the properties of the GPS tags,
 * an Image File Directory that contains information reported
 * by the device’s global position system when the photo was taken.
 *
 * - For smartphone photos, the most useful information from this object will be the
 * geographic coordinates and altitude reported by the device when the photo was taken.
 * Higher-end smartphones may also include the direction the camera was facing
 * and the speed at which the device was moving.
 *
 * Interop:
 * - An object containing the properties of InteropIFD (Interoperability IFD),
 * an Image File Directory that contains data to ensure interoperability
 * between different image file formats.
 *
 * - Smartphones tend not to write any information in InteropIFD,
 * and the Interop property for Piexifjs objects created from smartphone photos
 * is usually an empty object. Other devices and some image-editing software
 * will read and write data from this IFD.
 *
 * 1st:
 * - An object containing the properties of IFD1, the “first” Image File Directory.
 * These properties contain the most basic metadata about the thumbnail image.
 * - Smartphones tend not to write any information in IFD1,
 * and the 1st property for Piexifjs objects created from
 * smartphone photos is usually an empty object.
 * Other devices and some image-editing software will read and write data from this IFD.
 *
 * thumbnail:
 * - The data for the photo’s thumbnail, a scaled-down version
 * of the main image typically used for previews.
 * - Smartphones tend not to write any thumbnail data into the photos they take,
 * and the thumbnail property for Piexifjs objects created from smartphone photos is usually null.
 * Other devices and some image-editing software will read and write thumbnail image data.
 */

interface RawPiexif {
  '0th': Record<string, Record<string, any>>;
  Exif: Record<string, Record<string, any>>;
  GPS: Record<string, Record<string, any>>;
  Interop: Record<string, Record<string, any>>;
  '1st': Record<string, Record<string, any>>;
  thumbnail: Record<string, Record<string, any>>;
}
export interface Metadata {
  Image: ImageMetadata;
  GPS: GpsMetadata;
  Exif: ExifMetadata | Record<string, never>; // Record<string, never> -> empty object
}

export const defaultMetadata = {
  Image: {},
  GPS: {
    parsed: {
      latitude: null,
      longitude: null,
      altitude: null,
      direction: null,
      speed: null,
    },
    raw: {},
  },
  Exif: {},
};

export default function parseExif(binaryFileContent: string): Metadata {
  const rawExifData: RawPiexif = piexif.load(binaryFileContent);

  const output = { ...defaultMetadata };

  Object.entries(rawExifData).forEach((topLevelData) => {
    const topLevelAttr = topLevelData[0];
    const topLevelVal = topLevelData[1];

    if (['0th', 'GPS', 'Exif'].includes(topLevelAttr)) {
      const outputKey = topLevelAttr === '0th' ? 'Image' : topLevelAttr;
      let valAtKey = {};

      if (topLevelAttr === 'GPS') {
        valAtKey = parseGPS(topLevelVal);
      } else {
        Object.entries(topLevelVal).forEach((nestedObj) => {
          const [nestedKey, nestedVal] = nestedObj;

          valAtKey[piexif.TAGS[topLevelAttr][nestedKey].name] = nestedVal;
        });
      }

      output[outputKey] = valAtKey;
    }
  });

  return output;
}
