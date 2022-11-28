import { CitiesMapType, PlaceType } from 'DataManager/DataManager';
import Person from 'DataManager/PeopleManager/Person';
import Photo from 'DataManager/PhotoManager/Photo';
import { Tag } from 'gestalt';
import { ReactElement, useRef, useState } from 'react';
import makePersonName from '../utils/makePersonName';
import 'gestalt-datepicker/dist/gestalt-datepicker.css';
import PhotoGallerySearchFilterModal, {
  AnyAll,
  OnBetween,
} from './PhotoGallerySearchFilterModal';
import PhotoFilter, { CurrentFilters } from './PhotoFilter';

const DEFAULT_FILTER_STATE = {
  searchTerm: '',
  searchTitles: true,
  searchDescriptions: true,
  selectedPlaces: [],
  selectedTags: [],
  tagMode: 'any',
  selectedPeopleIds: [],
  peopleMode: 'any',
  startDate: undefined,
  endDate: undefined,
  dateMode: 'on',
  selectedCountry: undefined,
  selectedState: undefined,
  selectedCity: undefined,
};

function getIsFiltering(filters: CurrentFilters) {
  return (
    filters.searchTerm !== DEFAULT_FILTER_STATE.searchTerm ||
    !!filters.selectedPlaces.length ||
    !!filters.selectedTags.length ||
    !!filters.selectedPeopleIds.length ||
    filters.startDate !== DEFAULT_FILTER_STATE.startDate ||
    !!filters.selectedCountry // State and city selection requires a country to be selected
  );
}

function makeLabel(txt: string) {
  return { label: txt, value: txt };
}

interface Props {
  children: ({
    filteredPhotos,
    isFiltering,
    onOpenFilters,
  }: {
    filteredPhotos: Photo[];
    isFiltering: boolean;
    onOpenFilters: () => void;
  }) => ReactElement;
  allTags: string[];
  people: Person[];
  photos: Photo[];
  placesMap: PlaceType[];
}

export default function PhotoGallerySearchFilter({
  allTags,
  children,
  people,
  photos,
  placesMap,
}: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTitles, setSearchTitles] = useState(true);
  const [searchDescriptions, setSearchDescriptions] = useState(true);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  // Tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagMode, setTagMode] = useState<AnyAll>('any');
  // People
  const [selectedPeopleIds, setSelectedPeopleIds] = useState<string[]>([]);
  const [peopleMode, setPeopleMode] = useState<AnyAll>('any');
  // Date
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [dateMode, setDateMode] = useState<OnBetween>('on');
  // Place
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
  const [selectedState, setSelectedState] = useState<string | undefined>();
  const [selectedCity, setSelectedCity] = useState<string | undefined>();

  // Ref to shadow the applied filters
  const filterStateRef = useRef(DEFAULT_FILTER_STATE);
  const updateFilterStateRef = (newState) => {
    filterStateRef.current = newState;
  };

  const countryStateCityMap: Record<
    string,
    { label: string; statesProvinces: Record<string, string[]> }
  > = {};

  photos.forEach((photo) => {
    const countryObj = photo.userAnnotations.place.country;
    const stateObj = photo.userAnnotations.place.stateProvince;
    const cityString = photo.userAnnotations.place.city;

    if (
      countryObj.value &&
      !Object.keys(countryStateCityMap).includes(countryObj.value)
    ) {
      countryStateCityMap[countryObj.value] = {
        label: countryObj.label,
        statesProvinces: {},
      };
    }

    if (countryObj.value && stateObj.value) {
      const countryStates =
        countryStateCityMap[countryObj.value].statesProvinces;
      if (
        !Object.keys(countryStates).find(
          (stateProvinceId) => stateProvinceId === stateObj.value
        )
      ) {
        countryStates[stateObj.value] = [];
      }
    }

    if (countryObj.value && stateObj.value && cityString) {
      const stateCities =
        countryStateCityMap[countryObj.value].statesProvinces[stateObj.value];

      if (!stateCities.includes(cityString)) {
        stateCities.push(cityString);
      }
    }
  });

  const countryOptions = Object.keys(countryStateCityMap).map((value) => {
    const { label } = countryStateCityMap[value];
    return { label, value };
  });

  const stateOptions = Object.keys(
    (countryStateCityMap[selectedCountry || ''] || { statesProvinces: {} })
      .statesProvinces
  ).map(makeLabel);

  const cityOptions = (
    (countryStateCityMap[selectedCountry || ''] || { statesProvinces: {} })
      .statesProvinces[selectedState || ''] || []
  ).map(makeLabel);

  const tagsWithLabels = allTags
    .filter((t) => !selectedTags.includes(t))
    .map((t) => ({ label: t, value: t }));

  const peopleWithLabels = people
    .filter((p) => !selectedPeopleIds.includes(p.id))
    .map((p) => ({ label: makePersonName(p), value: p.id }));

  const placesWithLabels = placesMap
    .filter((p) => !selectedPlaces.includes(p.name))
    .map((p) => {
      const label = [p.name, p.countryCode, p.stateProvince, p.city]
        .filter(Boolean)
        .join(' - ');

      return {
        ...p,
        label,
        value: p.name,
      };
    });

  const handleClear = () => {
    // Reset filter values
    setSearchTerm('');
    setSearchTitles(true);
    setSearchDescriptions(true);
    setSelectedPlaces([]);
    setSelectedTags([]);
    setTagMode('any');
    setSelectedPeopleIds([]);
    setPeopleMode('any');
    setStartDate(undefined);
    setEndDate(undefined);
    setDateMode('on');
    setSelectedCountry(undefined);
    setSelectedState(undefined);
    setSelectedCity(undefined);
  };

  const handleDismiss = () => {
    setFiltersOpen(false);

    const currentRef = filterStateRef.current;

    setSearchTerm(currentRef.searchTerm);
    setSearchTitles(currentRef.searchTitles);
    setSearchDescriptions(currentRef.searchDescriptions);
    setSelectedPlaces(currentRef.selectedPlaces);
    setSelectedTags(currentRef.selectedTags);
    setTagMode(currentRef.tagMode);
    setSelectedPeopleIds(currentRef.selectedPeopleIds);
    setPeopleMode(currentRef.peopleMode);
    setStartDate(currentRef.startDate);
    setEndDate(currentRef.endDate);
    setDateMode(currentRef.dateMode);
    setSelectedCountry(currentRef.selectedCountry);
    setSelectedState(currentRef.selectedState);
    setSelectedCity(currentRef.selectedCity);
  };

  const handleFilter = () => {
    updateFilterStateRef({
      searchTerm,
      searchTitles,
      searchDescriptions,
      selectedPlaces,
      selectedTags,
      tagMode,
      selectedPeopleIds,
      peopleMode,
      startDate,
      endDate,
      dateMode,
      selectedCountry,
      selectedState,
      selectedCity,
    });

    setFiltersOpen(false);
  };

  const renderedTagTags = selectedTags.map((tagText) => (
    <Tag
      key={`tag-${tagText}`}
      onRemove={() =>
        setSelectedTags((prevState) =>
          prevState.filter((txt) => tagText !== txt)
        )
      }
      removeIconAccessibilityLabel={`Remove ${tagText}`}
      text={tagText}
    />
  ));

  const selectedPeople: Person[] = [];
  selectedPeopleIds.forEach((personId) => {
    const selectedPerson = people.find((p) => p.id === personId);
    if (selectedPerson) {
      selectedPeople.push(selectedPerson);
    }
  });

  const renderedPeopleTags = selectedPeople.map((personData) => {
    const personName = makePersonName(personData);

    return (
      <Tag
        key={`tag-${personName}`}
        onRemove={() =>
          setSelectedPeopleIds((prevState) =>
            prevState.filter((id) => id !== personData.id)
          )
        }
        removeIconAccessibilityLabel={`Remove ${personName}`}
        text={personName}
      />
    );
  });

  const renderedPlaceTags = selectedPlaces.map((placeName) => (
    <Tag
      key={`tag-${placeName}`}
      onRemove={() =>
        setSelectedPlaces((prevState) =>
          prevState.filter((name) => placeName !== name)
        )
      }
      removeIconAccessibilityLabel={`Remove ${placeName}`}
      text={placeName}
    />
  ));

  return (
    <>
      <PhotoFilter currentFilters={filterStateRef.current} photos={photos}>
        {({ filteredPhotos }) =>
          children({
            filteredPhotos,
            onOpenFilters: () => setFiltersOpen(true),
            isFiltering: getIsFiltering(filterStateRef.current),
          })
        }
      </PhotoFilter>

      {filtersOpen && (
        <PhotoGallerySearchFilterModal
          cityOptions={cityOptions}
          countryOptions={countryOptions}
          dateMode={dateMode}
          endDate={endDate}
          handleClear={handleClear}
          handleDismiss={handleDismiss}
          handleFilter={handleFilter}
          peopleMode={peopleMode}
          peopleWithLabels={peopleWithLabels}
          placesWithLabels={placesWithLabels}
          renderedPeopleTags={renderedPeopleTags}
          renderedPlaceTags={renderedPlaceTags}
          renderedTagTags={renderedTagTags}
          searchDescriptions={searchDescriptions}
          searchTerm={searchTerm}
          searchTitles={searchTitles}
          selectedCity={selectedCity}
          selectedCountry={selectedCountry}
          selectedState={selectedState}
          setDateMode={setDateMode}
          setEndDate={setEndDate}
          setFiltersOpen={setFiltersOpen}
          setPeopleMode={setPeopleMode}
          setSearchDescriptions={setSearchDescriptions}
          setSearchTerm={setSearchTerm}
          setSearchTitles={setSearchTitles}
          setSelectedCity={setSelectedCity}
          setSelectedCountry={setSelectedCountry}
          setSelectedPeopleIds={setSelectedPeopleIds}
          setSelectedPlaces={setSelectedPlaces}
          setSelectedState={setSelectedState}
          setSelectedTags={setSelectedTags}
          setStartDate={setStartDate}
          setTagMode={setTagMode}
          startDate={startDate}
          tagMode={tagMode}
          tagsWithLabels={tagsWithLabels}
          stateOptions={stateOptions}
        />
      )}
    </>
  );
}
