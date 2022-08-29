import * as path from 'path';
import fs from 'fs';
import getImageSize from 'image-size';
import parseExif, { defaultMetadata, Metadata } from './parseExif';
import { UserAnnotationUpdates } from '../../renderer/PhotoView/types';
import UserAnnotationData from './UserAnnotationData';

interface PhotoData {
  base64: string;
  filePath: string;
  filename: string;
  metadata: Metadata;
  userAnnotations: UserAnnotationData;
}

export default class Photo {
  base64: string;

  filePath: string;

  filename: string;

  metadata: Metadata;

  height: number | undefined;

  width: number | undefined;

  userAnnotations: UserAnnotationData;

  constructor({ data, filePath }: { data?: PhotoData; filePath?: string }) {
    if (data) {
      this.base64 = data.base64;
      this.filePath = data.filePath;
      this.filename = data.filename;
      this.metadata = data.metadata;
      this.userAnnotations = data.userAnnotations;
    } else if (filePath) {
      this.filePath = filePath;
      this.filename = path.basename(filePath);

      const fileContents = fs.readFileSync(filePath);

      this.base64 = fileContents.toString('base64');

      const parsedMetadata = parseExif(fileContents.toString('binary'));

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
    } else {
      // Data passed in to constructor is either `data` or `filePath` so we should never get to this case
      this.base64 = '';
      this.filePath = '';
      this.filename = '';
      this.metadata = defaultMetadata;
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
  }
}
