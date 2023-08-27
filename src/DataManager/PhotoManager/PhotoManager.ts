import * as path from 'path';
import { LocationType } from 'renderer/BulkActions/Edit/Metadata';
import getImageSize from 'image-size';
import fs from 'fs';
import Photo from './Photo';
import { PhotoUpdateData } from '../../renderer/PhotoView/types';

function readFileSync(filePath: string): Buffer {
  return fs.readFileSync(filePath);
}

function writeFileSync(filePath: string, fileBuffer: Buffer) {
  fs.writeFileSync(filePath, fileBuffer);
}

export default class PhotoManager {
  photos: Photo[] = [];

  initialize({ data, imagePaths }: { data: Photo[]; imagePaths: string[] }) {
    const existingPhotoFilepaths = data.map((itm) => itm.filePath);

    const newPhotos = imagePaths.filter(
      (p) => !existingPhotoFilepaths.includes(p)
    );

    const fileHandlers = {
      readFileSync,
      writeFileSync,
    };

    const existingPhotos = data.map(
      (d) =>
        new Photo({
          data: d,
          fileHandlers,
          getImageSize,
          filename: path.basename(d.filePath),
        })
    );

    this.photos = [
      ...existingPhotos,
      ...newPhotos.map(
        (filePath) =>
          new Photo({
            filePath,
            fileHandlers,
            getImageSize,
            filename: path.basename(filePath),
          })
      ),
    ];
  }

  updatePhoto(updateData: PhotoUpdateData) {
    const { filepath } = updateData;

    const targetPhoto = this.photos.find((p) => p.filePath === filepath);

    targetPhoto?.updateAnnotations(updateData.userAnnotations);
  }

  deletePerson(targetId: string) {
    this.photos.forEach((p) => p.deletePerson(targetId));
  }

  scrubExifData(photoIds: string[], locationsToScrub: LocationType) {
    this.photos
      .filter((p) => photoIds.includes(p.filePath))
      .forEach((p) => p.scrubExifData(locationsToScrub));
  }

  deletePhoto(photoId: string) {
    const targetIndex = this.photos.findIndex((p) => p.filePath === photoId);
    // Delete the photo data
    this.photos.splice(targetIndex, 1);
    // Delete the photo file
    fs.unlink(photoId, (err) => {
      if (err) throw err;
      console.log(`${photoId} was deleted`);
    });
  }

  movePhoto(photoId: string, targetDirectory: string) {
    const filename = path.basename(photoId);
    const newFilePath = path.join(targetDirectory, filename);

    const targetPhoto = this.photos.find((p) => p.filePath === photoId);

    if (targetPhoto) {
      targetPhoto.filePath = newFilePath;
      fs.renameSync(photoId, newFilePath);
    }
  }
}
