import Photo from './Photo';
import { PhotoUpdateData } from '../../renderer/PhotoView/types';
import { LocationType } from 'renderer/BulkActions/Edit/Metadata';

export default class PhotoManager {
  photos: Photo[] = [];

  initialize({ data, imagePaths }: { data: Photo[]; imagePaths: string[] }) {
    const existingPhotoFilepaths = data.map((itm) => itm.filePath);

    const newPhotos = imagePaths.filter(
      (p) => !existingPhotoFilepaths.includes(p)
    );

    const existingPhotos = data.map((d) => new Photo({ data: d }));

    this.photos = [
      ...existingPhotos,
      ...newPhotos.map((path) => new Photo({ filePath: path })),
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
}
