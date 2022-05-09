import * as path from 'path';
import fs from 'fs';
import parseExif, { Metadata } from './parseExif';

export interface PhotoData {
  base64: string;
  filePath: string;
  filename: string;
  metadata: Metadata;
}

export default class Photo {
  base64: string | undefined;

  filePath: string | undefined;

  filename: string | undefined;

  metadata: Metadata | undefined;

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

      this.metadata = parseExif(fileContents.toString('binary'));
    }
  }
}
