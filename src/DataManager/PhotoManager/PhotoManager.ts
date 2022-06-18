import Photo from './Photo';
import { PhotoUpdateData } from '../../renderer/PhotoView/types';

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
    // This is only called once!!!!
    const { filepath } = updateData;

    const targetPhoto = this.photos.find((p) => p.filePath === filepath);

    // console.log('PhotoManager.updatePhoto', targetPhoto);

    targetPhoto?.updateAnnotations(updateData.userAnnotations);
  }
}
