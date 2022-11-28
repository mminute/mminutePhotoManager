import Photo from './PhotoManager/Photo';
import PhotoManager from './PhotoManager/PhotoManager';
import UserAnnotationPlace from './PhotoManager/UserAnnotationPlace';
import { PhotoUpdateData } from '../renderer/PhotoView/types';
import PeopleManager, { NewPersonData } from './PeopleManager/PeopleManager';
import Person from './PeopleManager/Person';

export type MaybeString = string | null;

export type CitiesMapType = Record<string, Record<string, string[]>>;
export type PlaceType = {
  name: string;
  countryCode: MaybeString;
  stateProvince: MaybeString;
  city: MaybeString;
};

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

      const { photos: dataPhotos, people: dataPeople } = data;

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

      this.#photoManager.initialize({ data: dataPhotos, imagePaths });
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
    return { photos: this.photos, people: this.people };
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
}
