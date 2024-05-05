import { LocationType } from 'renderer/BulkActions/Edit/Metadata';
import { OnUpdateArgs } from 'renderer/BulkActions/Edit/Annotations';
import Photo from './PhotoManager/Photo';
import PhotoManager from './PhotoManager/PhotoManager';
import UserAnnotationPlace from './PhotoManager/UserAnnotationPlace';
import { PhotoUpdateData } from '../renderer/PhotoView/types';
import PeopleManager, { NewPersonData } from './PeopleManager/PeopleManager';
import Person from './PeopleManager/Person';
import UserAnnotationData from './PhotoManager/UserAnnotationData';

export type MaybeString = string | null;

export type CitiesMapType = Record<string, Record<string, string[]>>;
export type PlaceType = {
  name: string;
  countryCode: MaybeString;
  stateProvince: MaybeString;
  city: MaybeString;
};

export interface PhotoExport {
  filepath: string;
  relativePath: string;
  height: number | undefined;
  width: number | undefined;
  userAnnotations: UserAnnotationData;
}

export interface ExportData {
  photos: (PhotoExport | null)[];
  people: (Person | undefined)[];
}

function updateCitiesMap(place: UserAnnotationPlace, citiesMap: CitiesMapType) {
  if (place.country.value && place.stateProvince.value && place.city) {
    const objectOfStates = citiesMap[place.country.value] || {};
    const arrOfCities = objectOfStates[place.stateProvince.value] || [];
    const newCities = [...new Set([...arrOfCities, place.city])];

    citiesMap[place.country.value] = objectOfStates;
    citiesMap[place.country.value][place.stateProvince.value] = newCities;
  }
}

function placeFromUserAnnotationPlace(p: UserAnnotationPlace) {
  return {
    name: p.name,
    countryCode: p.country.value,
    stateProvince: p.stateProvince.value,
    city: p.city,
  };
}

function pushUniquePlace(places: PlaceType[], newPlace: PlaceType) {
  if (
    newPlace.name &&
    !places.find(
      (p) =>
        p.name === newPlace.name &&
        p.countryCode === newPlace.countryCode &&
        p.stateProvince === newPlace.stateProvince &&
        p.city === newPlace.city
    )
  ) {
    places.push(newPlace);
  }
}

interface InitialData {
  photos: Photo[];
  people: Person[];
  lastUpdated: number;
  collectionNotes: string;
}

export default class DataManager {
  // Private class fields
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields

  #initialized = false;

  #peopleManager = new PeopleManager();

  #photoManager = new PhotoManager();

  #tags: string[] = [];

  #placesMap: PlaceType[] = [];

  #citiesMap: CitiesMapType = {};

  #lastUpdated: number | null = null;

  #collectionNotes: string = '';

  initialize({
    currentDirectory,
    data,
    imagePaths,
  }: {
    currentDirectory: string;
    data: InitialData;
    imagePaths: string[];
  }) {
    // Allow the DataManager to be initialized only once
    if (!this.#initialized) {
      this.#initialized = true;

      const {
        collectionNotes,
        photos: dataPhotos,
        people: dataPeople,
        lastUpdated,
      } = data;

      this.#lastUpdated = lastUpdated;
      this.#collectionNotes = collectionNotes;

      let tags: string[] = [];
      const places: PlaceType[] = [];
      const citiesMap = {};

      dataPhotos.forEach((photoItem) => {
        const { tags: userTags, place } = photoItem.userAnnotations;
        tags = [...tags, ...userTags];

        const newPlace = placeFromUserAnnotationPlace(place);

        pushUniquePlace(places, newPlace);

        updateCitiesMap(place, citiesMap);
      });

      this.#tags = [...new Set(tags)];
      this.#placesMap = places;
      this.#citiesMap = citiesMap;

      this.#photoManager.initialize({
        currentDirectory,
        data: dataPhotos,
        imagePaths,
      });
      this.#peopleManager.initialize(dataPeople);
    }
  }

  get photos() {
    return this.#photoManager.photos;
  }

  get tags() {
    return this.#tags;
  }

  get placesMap() {
    return this.#placesMap;
  }

  get citiesMap() {
    return this.#citiesMap;
  }

  get people() {
    return this.#peopleManager.people;
  }

  get state() {
    return {
      photos: this.photos,
      people: this.people,
      lastUpdated: this.#lastUpdated,
      collectionNotes: this.#collectionNotes,
    };
  }

  get lastUpdated() {
    return this.#lastUpdated;
  }

  setLastUpdated() {
    this.#lastUpdated = Date.now();
  }

  setCollectionNotes(collectionNotes: string) {
    this.#collectionNotes = collectionNotes;
  }

  get collectionNotes() {
    return this.#collectionNotes;
  }

  updatePhoto(annotationData: PhotoUpdateData) {
    this.#photoManager.updatePhoto(annotationData);

    const updatedPlace = {
      name: annotationData.userAnnotations.placeName,
      country: annotationData.userAnnotations.selectedCountry,
      stateProvince: annotationData.userAnnotations.selectedState,
      city: annotationData.userAnnotations.cityName,
    };

    if (updatedPlace.country?.value && updatedPlace.stateProvince?.value) {
      updateCitiesMap(updatedPlace as UserAnnotationPlace, this.#citiesMap);

      const newPlace = placeFromUserAnnotationPlace(
        updatedPlace as UserAnnotationPlace
      );

      pushUniquePlace(this.#placesMap, newPlace);
    }

    this.#tags = [
      ...new Set([...this.#tags, ...annotationData.userAnnotations.tags]),
    ];
  }

  createPerson(personData: NewPersonData) {
    this.#peopleManager.createPerson(personData);
  }

  deletePerson(targetId: string) {
    this.#photoManager.deletePerson(targetId);
    this.#peopleManager.deletePerson(targetId);
  }

  updatePerson(updateData: NewPersonData) {
    this.#peopleManager.updatePerson(updateData);
  }

  scrubExifData(photoIds: string[], locationsToScrub: LocationType) {
    this.#photoManager.scrubExifData(photoIds, locationsToScrub);
  }

  bulkUpdatePhotos(photoIds: string[], updateData: OnUpdateArgs) {
    photoIds.forEach((photoId) => {
      this.#photoManager.updatePhoto({
        filepath: photoId,
        userAnnotations: {
          ...updateData,
          countrySearchTerm: '',
          stateSearchTerm: '',
          selectedCity: undefined,
        },
      });
    });
  }

  bulkDeletePhotos(photoIds: string[]) {
    photoIds.forEach((photoId) => {
      this.#photoManager.deletePhoto(photoId);
    });
  }

  bulkMovePhotos(photoIds: string[], targetDirectory: string) {
    photoIds.forEach((photoId) => {
      this.#photoManager.movePhoto(photoId, targetDirectory);
    });
  }

  buildExport(photoIds: string[]): ExportData {
    const photosToExport = photoIds.map((photoId) => {
      const photoObject = this.#photoManager.photos.find(
        (p) => p.filePath === photoId
      );

      if (!photoObject) {
        // Shouldn't get here. Could throw an error
        return null;
      }

      return {
        filepath: photoObject.filePath,
        relativePath: photoObject.relativePath,
        height: photoObject.height,
        width: photoObject.width,
        userAnnotations: photoObject.userAnnotations,
      };
    });

    const people = Array.from(
      new Set(
        photosToExport
          .map((photoData) => photoData?.userAnnotations?.people)
          .flat()
      )
    ).map((personId) =>
      this.#peopleManager.people.find((p) => p.id === personId)
    );

    return { photos: photosToExport, people };
  }
}
