import piexif from 'piexifjs';
import { LocationType } from 'renderer/BulkActions/Edit/Metadata';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';
import parseExif, { defaultMetadata, Metadata } from './parseExif';
import { UserAnnotationUpdates } from '../../renderer/PhotoView/types';
import UserAnnotationData from './UserAnnotationData';

interface PhotoData {
  base64: string;
  filePath: string;
  isAnnotated: boolean;
  lastUpdated: number | undefined;
  metadata: Metadata;
  relativePath: string;
  userAnnotations: UserAnnotationData;
}

interface FileHandlers {
  readFileSync: (filepath: string) => Buffer;
  writeFileSync: (filepath: string, fileContents: Buffer) => void;
}

export default class Photo {
  #binary: string | undefined;

  #fileHandlers: FileHandlers;

  base64: string;

  filePath: string;

  height: number | undefined;

  isAnnotated: boolean;

  lastUpdated: number | undefined;

  metadata: Metadata;

  // `relativePath` could be derived from `this.filePath`
  // but since there is already a lot of logic referencing `this.filePath`
  // I'm being lazy and just adding another field on `Photo`
  // specifically for the purpose of exporting a photo collection
  relativePath: string;

  userAnnotations: UserAnnotationData;

  width: number | undefined;

  constructor({
    currentDirectory,
    data,
    filePath,
    fileHandlers,
    getImageSize,
  }: {
    currentDirectory: string;
    data?: PhotoData;
    filePath?: string;
    fileHandlers: FileHandlers;
    getImageSize: (filepath: string) => ISizeCalculationResult;
  }) {
    this.#fileHandlers = fileHandlers;

    if (data) {
      this.base64 = data.base64;
      this.filePath = data.filePath;
      this.metadata = data.metadata;
      this.relativePath = data.relativePath;
      this.userAnnotations = new UserAnnotationData(data.userAnnotations);
      this.isAnnotated = data.isAnnotated;
      this.lastUpdated = data.lastUpdated;
    } else if (filePath) {
      this.filePath = filePath;
      this.relativePath = filePath.replace(`${currentDirectory}/`, '');

      const fileContents = this.#fileHandlers.readFileSync(filePath);

      this.base64 = fileContents.toString('base64');
      this.#binary = fileContents.toString('binary');

      const parsedMetadata = parseExif(this.#binary);

      if (
        typeof parsedMetadata.Exif.PixelXDimension === 'number' &&
        typeof parsedMetadata.Exif.PixelYDimension === 'number'
      ) {
        this.height = parsedMetadata.Exif.PixelYDimension;
        this.width = parsedMetadata.Exif.PixelXDimension;
      } else {
        const dims = getImageSize(filePath);

        this.height = dims.height;
        this.width = dims.width;
      }

      this.metadata = parsedMetadata;

      this.userAnnotations = new UserAnnotationData({
        date:
          parsedMetadata.Image.DateTime ||
          parsedMetadata.GPS.raw.GPSDateStamp ||
          parsedMetadata.Exif.DateTimeOriginal ||
          '',
        description: '',
        people: [],
        place: {
          name: '',
          country: { value: null, label: '' },
          stateProvince: { value: null, label: '' },
          city: '',
        },
        tags: [],
        title: '',
      });

      this.isAnnotated = false;
      this.lastUpdated = undefined;
    } else {
      // Data passed in to constructor is either `data` or `filePath` so we should never get to this case
      this.base64 = '';
      this.filePath = '';
      this.metadata = defaultMetadata;
      this.relativePath = '';
      this.userAnnotations = new UserAnnotationData({
        date: '',
        description: '',
        people: [],
        place: {
          name: '',
          country: { value: null, label: '' },
          stateProvince: { value: null, label: '' },
          city: '',
        },
        tags: [],
        title: '',
      });

      this.isAnnotated = false;
      this.lastUpdated = undefined;
    }
  }

  updateAnnotations(annotationData: UserAnnotationUpdates) {
    const {
      cityName,
      countrySearchTerm,
      description,
      placeName,
      selectedCountry,
      selectedDate,
      selectedPeople,
      selectedState,
      stateSearchTerm,
      tags,
      title,
    } = annotationData;

    this.userAnnotations = new UserAnnotationData({
      date:
        selectedDate?.toISOString().slice(0, 10).replace(/-/g, '/') ||
        this.userAnnotations.date,
      description,
      people: selectedPeople,
      place: {
        name: placeName,
        country: selectedCountry || { value: null, label: countrySearchTerm },
        stateProvince: selectedState || { value: null, label: stateSearchTerm },
        city: cityName,
      },
      title,
      tags,
    });

    this.isAnnotated = true;
    this.lastUpdated = Date.now();
  }

  deletePerson(targetId: string) {
    this.userAnnotations.deletePerson(targetId);
  }

  scrubExifData(locationsToScrub: LocationType) {
    if (locationsToScrub === 'image-files-and-database') {
      this.metadata = defaultMetadata;
    }
    // https://auth0.com/blog/read-edit-exif-metadata-in-photos-with-javascript/#The--Piexifjs--Library
    const scrubbedData = piexif.remove(this.#binary);
    const fileBuffer = Buffer.from(scrubbedData, 'binary');
    this.#fileHandlers.writeFileSync(this.filePath, fileBuffer);
  }
}
