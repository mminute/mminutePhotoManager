import Photo, { PhotoData } from './Photo';

export default class PhotoManager {
  photos: Photo[] = [];

  initialize({
    data,
    imagePaths,
  }: {
    data: PhotoData[];
    imagePaths: string[];
  }) {
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
}
