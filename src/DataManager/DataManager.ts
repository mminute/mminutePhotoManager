import Photo from './PhotoManager/Photo';
import PhotoManager from './PhotoManager/PhotoManager';

interface InitialData {
  photos: Photo[];
}

export default class DataManager {
  // Private class fields
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields

  #initialized = false;

  #photoManager = new PhotoManager();

  initialize({
    data,
    imagePaths,
  }: {
    data: InitialData;
    imagePaths: string[];
  }) {
    // Allow the DataManager to be initialized only once
    if (!this.#initialized) {
      this.#initialized = true;

      const { photos: dataPhotos } = data;

      this.#photoManager.initialize({ data: dataPhotos, imagePaths });
    }
  }

  get photos() {
    return this.#photoManager.photos;
  }

  get state() {
    return { photos: this.photos };
  }
}
