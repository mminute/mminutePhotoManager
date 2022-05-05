import * as path from 'path';
import fs from 'fs';

export default class Photo {
  base64: string;

  filePath: string;

  filename: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.filename = path.basename(filePath);
    this.base64 = fs.readFileSync(filePath).toString('base64');
  }
}
