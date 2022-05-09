import * as path from 'path';
import fs from 'fs';
import getImageSize from 'image-size';
import parseExif, { defaultMetadata, Metadata } from './parseExif';

interface PhotoData {
  base64: string;
  filePath: string;
  filename: string;
  metadata: Metadata;
}

export default class Photo {
  base64: string;

  filePath: string;

  filename: string;

  metadata: Metadata;

  constructor({ data, filePath }: { data?: PhotoData; filePath?: string }) {
    if (data) {
      this.base64 = data.base64;
      this.filePath = data.filePath;
      this.filename = data.filename;
      this.metadata = data.metadata;
    } else if (filePath) {
      this.filePath = filePath;
      this.filename = path.basename(filePath);

      const fileContents = fs.readFileSync(filePath);

      this.base64 = fileContents.toString('base64');

      const parsedMetadata = parseExif(fileContents.toString('binary'));

      if (
        !(
          parsedMetadata.Exif.PixelXDimension &&
          parsedMetadata.Exif.PixelXDimension
        )
      ) {
        const dims = getImageSize(filePath);

        parsedMetadata.Exif.PixelYDimension = dims.height;
        parsedMetadata.Exif.PixelXDimension = dims.width;
      }

      this.metadata = parsedMetadata;
    } else {
      // Data passed in to constructor is either `data` or `filePath` so we should never get to this case
      this.base64 = '';
      this.filePath = '';
      this.filename = '';
      this.metadata = defaultMetadata;
    }
  }
}
