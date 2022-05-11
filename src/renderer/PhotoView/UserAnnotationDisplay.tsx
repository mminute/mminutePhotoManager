import { useState } from 'react';
import {
  Box,
  Button,
  ComboBox,
  Divider,
  Flex,
  Heading,
  TextArea,
  TextField,
} from 'gestalt';
import DatePicker from 'gestalt-datepicker';
import Photo from '../../DataManager/PhotoManager/Photo';
import Tags from './Tags';
import Place from './Place/Place';
import { MaybeOption, OptionSetter, StringSetter } from './types';
import { PlaceType } from '../../DataManager/DataManager';
import 'gestalt-datepicker/dist/gestalt-datepicker.css';

export default function UserAnnotationDisplay({
  photo,
  allTags,
  placesMap,
  citiesMap,
  title,
  setTitle,
  description,
  setDescription,
  tags,
  setTags,
  selectedDate,
  setSelectedDate,
  placeName,
  setPlaceName,
  countrySearchTerm,
  setCountrySearchTerm,
  selectedCountry,
  setSelectedCountry,
  stateSearchTerm,
  setStateSearchTerm,
  selectedState,
  setSelectedState,
  cityName,
  setCityName,
  selectedCity,
  setSelectedCity,
}: {
  photo: Photo;
  allTags: string[];
  placesMap: PlaceType[];
  citiesMap: Record<string, Record<string, string[]>>;
  title: string;
  setTitle: StringSetter;
  description: string;
  setDescription: StringSetter;
  tags: string[];
  setTags: (newTags: string[]) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (newVal: Date) => void;
  placeName: string;
  setPlaceName: StringSetter;
  countrySearchTerm: string;
  setCountrySearchTerm: StringSetter;
  selectedCountry: MaybeOption;
  setSelectedCountry: OptionSetter;
  stateSearchTerm: string;
  setStateSearchTerm: StringSetter;
  selectedState: MaybeOption;
  setSelectedState: OptionSetter;
  cityName: string;
  setCityName: StringSetter;
  selectedCity: MaybeOption;
  setSelectedCity: OptionSetter;
}) {
  const options = allTags.map((tagTerm) => ({
    label: tagTerm,
    value: tagTerm,
  }));

  const [tagSearchTerm, setTagSearchTerm] = useState('');

  return (
    <Box marginBottom={12}>
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
        options={options}
        searchTerm={tagSearchTerm}
        setSearchTerm={setTagSearchTerm}
        tags={tags}
        setTags={setTags}
      />
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
