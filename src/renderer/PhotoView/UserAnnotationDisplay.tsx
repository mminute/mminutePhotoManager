import { Box, Divider, Flex, TextArea, TextField } from 'gestalt';
import DatePicker from 'gestalt-datepicker';
import { ShowModalType } from 'renderer/types';
import Person from 'DataManager/PeopleManager/Person';
import Photo from '../../DataManager/PhotoManager/Photo';
import Tags from './Tags';
import Place from './Place/Place';
import { MaybeOption, OptionSetter, StringSetter } from './types';
import { CitiesMapType, PlaceType } from '../../DataManager/DataManager';
import 'gestalt-datepicker/dist/gestalt-datepicker.css';
import PeopleComboBox from './PeopleComboBox';

export default function UserAnnotationDisplay({
  allTags,
  citiesMap,
  cityName,
  countrySearchTerm,
  description,
  onShowModal,
  people,
  photo,
  placeName,
  placesMap,
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
}: {
  allTags: string[];
  citiesMap: CitiesMapType;
  cityName: string;
  countrySearchTerm: string;
  description: string;
  onShowModal: ShowModalType;
  people: Person[];
  photo: Photo;
  placeName: string;
  placesMap: PlaceType[];
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
}) {
  const options = allTags.map((tagTerm) => ({
    label: tagTerm,
    value: tagTerm,
  }));

  return (
    <Box marginBottom={12}>
      <Flex direction="column" gap={4}>
        <TextField
          id="title"
          onChange={({ value }) => setTitle(value)}
          label="Title"
          value={title}
        />
        <TextArea
          id="description"
          onChange={({ value }) => setDescription(value)}
          label="Description"
          value={description}
        />
        <DatePicker
          id="datepicker"
          onChange={({ value }) => setSelectedDate(value)}
          label="Date"
          value={selectedDate}
        />
        <Tags
          helperText="Search and select from existing tags. Enter text and press tab to add a new tag"
          inputId="tags"
          inputLabel="Tags"
          noResultText="No tags found"
          options={options}
          setTags={setTags}
          tags={tags}
        />

        <PeopleComboBox
          onShowModal={onShowModal}
          people={people}
          selectedPeople={selectedPeople}
          setSelectedPeople={setSelectedPeople}
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
      />
      {/*
        Add some empty space to the bottom so that it feels
        more open when you get to the bottom of the page
      */}
      <Box paddingY={6} />
    </Box>
  );
}
