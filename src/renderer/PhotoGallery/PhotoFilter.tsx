import Photo from 'DataManager/PhotoManager/Photo';
import moment from 'moment';
import { ReactElement } from 'react';
import formatDateString from 'renderer/utils/formatDateString';
import { AnyAll, OnBetween } from './PhotoGallerySearchFilterModal';

function searchTermFilter({
  cleanDescription,
  cleanSearchTerm,
  cleanTitle,
  searchDescriptions,
  searchTitles,
}: {
  cleanDescription: string;
  cleanSearchTerm: string;
  cleanTitle: string;
  searchDescriptions: boolean;
  searchTitles: boolean;
}) {
  if (cleanSearchTerm) {
    if (searchTitles && cleanTitle.match(cleanSearchTerm)) {
      return true;
    }

    if (searchDescriptions && cleanDescription.match(cleanSearchTerm)) {
      return true;
    }

    return false;
  }

  return true;
}

function idsFilter({
  ids,
  selectedIds,
  mode,
}: {
  ids: string[];
  selectedIds: string[];
  mode: AnyAll;
}) {
  if (mode === 'any') {
    return selectedIds.some((id) => ids.includes(id));
  }

  // mode === 'all'
  return selectedIds.every((id) => ids.includes(id));
}

export interface CurrentFilters {
  searchTerm: string;
  searchTitles: boolean;
  searchDescriptions: boolean;
  selectedPlaces: string[];
  selectedTags: string[];
  tagMode: AnyAll;
  selectedPeopleIds: string[];
  peopleMode: AnyAll;
  startDate: Date | undefined;
  endDate: Date | undefined;
  dateMode: OnBetween;
  selectedCountry: string | undefined;
  selectedState: string | undefined;
  selectedCity: string | undefined;
}

interface Props {
  currentFilters: CurrentFilters;
  photos: Photo[];
  children: ({ filteredPhotos }: { filteredPhotos: Photo[] }) => ReactElement;
}

export default function PhotoFilter({
  children,
  currentFilters,
  photos,
}: Props) {
  const {
    dateMode,
    endDate,
    peopleMode,
    searchDescriptions,
    searchTerm,
    searchTitles,
    selectedCity,
    selectedCountry,
    selectedPeopleIds,
    selectedPlaces,
    selectedState,
    selectedTags,
    startDate,
    tagMode,
  } = currentFilters;

  const filteredPhotos = photos.filter((photo) => {
    const {
      date: photoDate,
      description,
      people,
      place,
      tags: photoTags,
      title,
    } = photo.userAnnotations;

    const appliedFilters = [];

    const cleanSearchTerm = searchTerm.trim().toLowerCase();
    if (cleanSearchTerm && (searchTitles || searchDescriptions)) {
      appliedFilters.push(
        searchTermFilter({
          cleanDescription: description.toLowerCase().trim(),
          cleanSearchTerm,
          cleanTitle: title.toLowerCase().trim(),
          searchDescriptions,
          searchTitles,
        })
      );
    }

    if (selectedTags.length) {
      appliedFilters.push(
        idsFilter({
          ids: photoTags,
          selectedIds: selectedTags,
          mode: tagMode,
        })
      );
    }

    if (selectedPeopleIds.length) {
      appliedFilters.push(
        idsFilter({
          ids: people,
          selectedIds: selectedPeopleIds,
          mode: peopleMode,
        })
      );
    }

    if (startDate) {
      if (photoDate) {
        /*
          The photoDate may be of two different formats
          1) YYYY/MM/DD - If set by the user in the user annotation UI
          2) YYYY:MM:DD HH:MM:SS - If the date is pulled from the EXIF data
        */

        const formattedDateString = formatDateString({
          dateString: photoDate,
          delimiter: '-',
        });

        const photoDateMoment = moment(formattedDateString);

        if (dateMode === 'on') {
          appliedFilters.push(photoDateMoment.isSame(startDate, 'day'));
        } else if (dateMode === 'between' && endDate) {
          const isWithin = ![
            photoDateMoment.isSameOrAfter(startDate, 'day'),
            photoDateMoment.isSameOrBefore(endDate, 'day'),
          ].includes(false);

          appliedFilters.push(isWithin);
        }
      } else {
        // If the photo does not have a date it cannot match a date filter
        appliedFilters.push(false);
      }
    }

    if (selectedPlaces.length) {
      // TODO: What if there are multiple places with the same name
      // but in different city/state/countries?
      appliedFilters.push(selectedPlaces.includes(place.name));
    }

    if (selectedCountry) {
      appliedFilters.push(place.country.value === selectedCountry);
    }

    if (selectedState) {
      appliedFilters.push(place.stateProvince.value === selectedState);
    }

    if (selectedCity) {
      appliedFilters.push(place.city === selectedCity);
    }

    return !appliedFilters.some((result) => !result);
  });

  return children({ filteredPhotos });
}
