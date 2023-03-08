import Photo from 'DataManager/PhotoManager/Photo';
import { ReactElement } from 'react';
import UserAnnotationPlace from 'DataManager/PhotoManager/UserAnnotationPlace';

function getIfEntriesAllMatch(
  selectedPhotos: Photo[],
  mapper: (p: Photo) => any
) {
  const uniqueEntries = new Set(selectedPhotos.map(mapper));
  return uniqueEntries.size === 1 ? Array.from(uniqueEntries)[0] : null;
}

interface ChildProps {
  title: string | null;
  remainingTitles: string[];
  description: string | null;
  remainingDescriptions: string[];
  date: Date | null;
  remainingDates: string[];
  place: UserAnnotationPlace | null;
  remainingPlaces: UserAnnotationPlace[];
  tags: string[];
  remainingTags: string[];
  people: string[];
  remainingPeople: string[];
}

interface Props {
  children: (data: ChildProps) => ReactElement;
  selectedPhotos: Photo[];
}

export default function AnnotationsAggregator({
  children,
  selectedPhotos,
}: Props) {
  const getUsingMatcher = (matcher: (p: Photo) => any) =>
    getIfEntriesAllMatch(selectedPhotos, matcher);

  const title = getUsingMatcher((p) => p.userAnnotations.title);
  const description = getUsingMatcher((p) => p.userAnnotations.description);
  const date = getUsingMatcher((p) => p.userAnnotations.date);

  const allPlaces: UserAnnotationPlace[] = [];
  const placesOccurences: Record<string, number> = {};
  const peopleOccurences: Record<string, number> = {};
  const tagOccurences: Record<string, number> = {};

  selectedPhotos.forEach((selectedPhoto) => {
    const {
      place: photoPlace,
      tags: photoTags,
      people: photoPeople,
    } = selectedPhoto.userAnnotations;

    const samePlaceFound = allPlaces.find((place) => {
      return (
        photoPlace.name === place.name &&
        photoPlace.country.value === place.country.value &&
        photoPlace.stateProvince.value === place.stateProvince.value &&
        photoPlace.city === place.city
      );
    });

    if (!samePlaceFound) {
      allPlaces.push(selectedPhoto.userAnnotations.place);
    }

    const tempPlaceId = `${photoPlace.name}-${photoPlace.country.value}-${photoPlace.stateProvince.value}-${photoPlace.city}`;
    placesOccurences[tempPlaceId] = placesOccurences[tempPlaceId]
      ? placesOccurences[tempPlaceId] + 1
      : 1;

    photoTags.forEach((tag) => {
      tagOccurences[tag] = tagOccurences[tag] ? tagOccurences[tag] + 1 : 1;
    });

    photoPeople.forEach((person) => {
      peopleOccurences[person] = peopleOccurences[person]
        ? peopleOccurences[person] + 1
        : 1;
    });
  });

  const uniquePlaceOccurences = Array.from(
    new Set(Object.values(placesOccurences))
  );
  const placeAppliesToAllPhotos =
    uniquePlaceOccurences.length === 1 &&
    uniquePlaceOccurences[0] === selectedPhotos.length;

  const uniqueTagOccurences = Array.from(new Set(Object.values(tagOccurences)));
  const allTagsAppearInAllPhotos =
    uniqueTagOccurences.length === 1 &&
    uniqueTagOccurences[0] === selectedPhotos.length;
  const allTags = Object.keys(tagOccurences);

  const uniquePeopleOccurences = Array.from(
    new Set(Object.values(peopleOccurences))
  );
  const allPeopleAppearInAllPhotos =
    uniquePeopleOccurences.length === 1 &&
    uniquePeopleOccurences[0] === selectedPhotos.length;
  const allPeople = Object.keys(peopleOccurences);

  return children({
    title,
    remainingTitles: title
      ? []
      : selectedPhotos.map((p) => p.userAnnotations.title).filter(Boolean),
    description,
    remainingDescriptions: description
      ? []
      : selectedPhotos
          .map((p) => p.userAnnotations.description)
          .filter(Boolean),
    date,
    remainingDates: date
      ? []
      : selectedPhotos.map((p) => p.userAnnotations.date).filter(Boolean),
    place: placeAppliesToAllPhotos ? allPlaces[0] : null,
    remainingPlaces: placeAppliesToAllPhotos ? [] : allPlaces.filter(Boolean),
    tags: allTagsAppearInAllPhotos ? allTags : [],
    remainingTags: allTagsAppearInAllPhotos ? [] : allTags.filter(Boolean),
    people: allPeopleAppearInAllPhotos ? allPeople : [],
    remainingPeople: allPeopleAppearInAllPhotos
      ? []
      : allPeople.filter(Boolean),
  });
}
