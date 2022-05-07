import * as path from 'path';
import fs from 'fs';
import parseExif, { Metadata } from './parseExif';

export default class Photo {
  base64: string;

  filePath: string;

  filename: string;

  metadata: Metadata;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.filename = path.basename(filePath);

    const fileContents = fs.readFileSync(filePath);

    this.base64 = fileContents.toString('base64');

    this.metadata = parseExif(fileContents.toString('binary'));
  }
}
