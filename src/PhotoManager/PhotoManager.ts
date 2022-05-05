import Photo from './Photo';

export default class PhotoManager {
  photos: Photo[] = [];

  initialize(imagePaths: string[]) {
    this.photos = imagePaths.map((path) => new Photo(path));
  }
}
