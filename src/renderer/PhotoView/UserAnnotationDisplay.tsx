import { useState } from 'react';
import { Box, Divider, Flex, Text, TextArea, TextField } from 'gestalt';
import DatePicker from 'gestalt-datepicker';
import { ShowModalType } from 'renderer/types';
import Person from 'DataManager/PeopleManager/Person';
import UserAnnotationPlace from 'DataManager/PhotoManager/UserAnnotationPlace';
import Photo from '../../DataManager/PhotoManager/Photo';
import Tags from './Tags';
import Place from './Place/Place';
import { MaybeOption, OptionSetter, StringSetter } from './types';
import { CitiesMapType, PlaceType } from '../../DataManager/DataManager';
import 'gestalt-datepicker/dist/gestalt-datepicker.css';
import PeopleComboBox from './PeopleComboBox';
import FieldErrorIndicator from './FieldErrorIndicator';
import makeQuotedList from './makeQuotedList';

export interface OnUpdateArgs {
  hasDateError: boolean;
  hasDescriptionError: boolean;
  hasPeopleError: boolean;
  hasPlaceError: boolean;
  hasTagsError: boolean;
  hasTitleError: boolean;
}

interface Props {
  allTags: string[];
  citiesMap: CitiesMapType;
  cityName: string;
  countrySearchTerm: string;
  description: string;
  lastUpdated: number | undefined;
  onShowModal: ShowModalType;
  onUpdate: (hasErrors: OnUpdateArgs) => void;
  people: Person[];
  photo: Photo;
  placeName: string;
  placesMap: PlaceType[];
  remainingDates?: string[];
  remainingDescriptions?: string[];
  remainingPeople?: string[];
  remainingPlaces?: UserAnnotationPlace[];
  remainingTags?: string[];
  remainingTitles?: string[];
  selectedCity: MaybeOption;
  selectedCountry: MaybeOption;
  selectedDate: Date | undefined;
  selectedPeople: string[];
  selectedState: MaybeOption;
  setCityName: StringSetter;
  setCountrySearchTerm: StringSetter;
  setDescription: StringSetter;
  setPlaceName: StringSetter;
  setSelectedCity: OptionSetter;
  setSelectedCountry: OptionSetter;
  setSelectedDate: (newVal: Date) => void;
  setSelectedPeople: (newPeople: string[]) => void;
  setSelectedState: OptionSetter;
  setStateSearchTerm: StringSetter;
  setTags: (newTags: string[]) => void;
  setTitle: StringSetter;
  stateSearchTerm: string;
  tags: string[];
  title: string;
}

export default function UserAnnotationDisplay({
  allTags,
  citiesMap,
  cityName,
  countrySearchTerm,
  description,
  lastUpdated,
  onShowModal,
  people,
  photo,
  placeName,
  placesMap,
  remainingDates,
  remainingDescriptions,
  remainingPeople,
  remainingPlaces,
  remainingTags,
  remainingTitles,
  selectedCity,
  selectedCountry,
  selectedDate,
  selectedPeople,
  selectedState,
  setCityName,
  setCountrySearchTerm,
  setDescription,
  setPlaceName,
  setSelectedCity,
  setSelectedCountry,
  setSelectedDate,
  setSelectedPeople,
  setSelectedState,
  setStateSearchTerm,
  setTags,
  setTitle,
  stateSearchTerm,
  tags,
  title,
  onUpdate,
}: Props) {
  const [dateError, setDateError] = useState(remainingDates || []);
  const [descriptionError, setDescriptionError] = useState(
    remainingDescriptions || []
  );
  const [peopleError, setPeopleError] = useState(remainingPeople || []);
  const [placeError, setPlaceError] = useState(remainingPlaces || []);
  const [tagsError, setTagsError] = useState(remainingTags || []);
  const [titleError, setTitleError] = useState(remainingTitles || []);

  // For live error checking when inputting bulk actions data
  onUpdate({
    hasDateError: !!dateError.length,
    hasDescriptionError: !!descriptionError.length,
    hasPeopleError: !!peopleError.length,
    hasPlaceError: !!placeError.length,
    hasTagsError: !!tagsError.length,
    hasTitleError: !!titleError.length,
  });

  const options = allTags.map((tagTerm) => ({
    label: tagTerm,
    value: tagTerm,
  }));

  const titleErrorMessage = titleError.length ? (
    <FieldErrorIndicator
      detailText={`Titles found: ${makeQuotedList(titleError)}`}
      errorText="Incompatible titles found"
    />
  ) : null;

  const descriptionErrorMessage = descriptionError.length ? (
    <FieldErrorIndicator
      detailText={`Descriptions found: ${makeQuotedList(descriptionError)}`}
      errorText="Incompatible descriptions found"
    />
  ) : null;

  const dateErrorMessage = dateError.length ? (
    <FieldErrorIndicator
      detailText={`Dates found: ${makeQuotedList(dateError)}`}
      errorText="Incompatible dates found"
    />
  ) : undefined;

  return (
    <Box marginBottom={12} marginTop={4}>
      <Flex direction="column" gap={4}>
        {lastUpdated && (
          <Text size="100">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </Text>
        )}

        <TextField
          id="title"
          onChange={({ value }) => {
            const errors = value ? [] : remainingTitles;
            setTitleError(errors || []);
            setTitle(value);
          }}
          label="Title"
          value={title}
          errorMessage={titleErrorMessage}
        />
        <TextArea
          id="description"
          onChange={({ value }) => {
            const errors = value ? [] : remainingDescriptions;
            setDescriptionError(errors || []);
            setDescription(value);
          }}
          label="Description"
          value={description}
          errorMessage={descriptionErrorMessage}
        />
        <DatePicker
          id="datepicker"
          onChange={({ value }) => {
            const errors = value ? [] : remainingDates || [];
            setDateError(errors);
            setSelectedDate(value);
          }}
          label="Date"
          value={selectedDate}
          errorMessage={dateErrorMessage}
        />
        <Tags
          helperText="Search and select from existing tags. Enter text and press tab to add a new tag"
          inputId="tags"
          inputLabel="Tags"
          noResultText="No tags found"
          options={options}
          setTags={setTags}
          tags={tags}
          setTagsError={setTagsError}
          tagsError={tagsError}
          resetTagsError={() => setTagsError(remainingTags || [])}
        />

        <PeopleComboBox
          onShowModal={onShowModal}
          people={people}
          selectedPeople={selectedPeople}
          setSelectedPeople={setSelectedPeople}
          peopleError={peopleError}
          setPeopleError={setPeopleError}
          resetPeopleError={() => setPeopleError(remainingPeople || [])}
        />
      </Flex>

      <Box marginTop={8}>
        <Divider />
      </Box>
      <Place
        latitude={photo.metadata.GPS.parsed.latitude}
        longitude={photo.metadata.GPS.parsed.longitude}
        countrySearchTerm={countrySearchTerm}
        setCountrySearchTerm={setCountrySearchTerm}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        stateSearchTerm={stateSearchTerm}
        setStateSearchTerm={setStateSearchTerm}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        placesMap={placesMap}
        placeName={placeName}
        setPlaceName={setPlaceName}
        cityName={cityName}
        setCityName={setCityName}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        citiesMap={citiesMap}
        placeError={placeError}
        clearPlaceError={() => setPlaceError([])}
        resetPlaceError={() => setPlaceError(remainingPlaces || [])}
      />
      {/*
        Add some empty space to the bottom so that it feels
        more open when you get to the bottom of the page
      */}
      <Box paddingY={6} />
    </Box>
  );
}

UserAnnotationDisplay.defaultProps = {
  remainingDates: [],
  remainingDescriptions: [],
  remainingPeople: [],
  remainingPlaces: [],
  remainingTags: [],
  remainingTitles: [],
};
