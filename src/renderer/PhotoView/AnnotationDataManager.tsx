import { useState, ReactElement } from 'react';
import Photo from '../../DataManager/PhotoManager/Photo';
import { MaybeOption, OptionSetter, StringSetter } from './types';

function makeMaybeOption(option: {
  value: string | null;
  label: string;
}): MaybeOption {
  if (option.value && option.label) {
    return { value: option.value, label: option.label };
  }

  return undefined;
}

interface Props {
  children: (childProps: {
    title: string;
    setTitle: StringSetter;
    description: string;
    setDescription: StringSetter;
    tags: string[];
    setTags: (newTags: string[]) => void;
    selectedDate: Date | undefined;
    setSelectedDate: (newDate: Date) => void;
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
    selectedPeople: string[];
    setSelectedPeople: (newPeople: string[]) => void;
  }) => ReactElement;
  photo: Photo;
}

export default function AnnotationDataManager({ children, photo }: Props) {
  const { name, country, stateProvince, city } = photo.userAnnotations.place;

  const [title, setTitle] = useState(photo.userAnnotations.title);

  const [description, setDescription] = useState(
    photo.userAnnotations.description
  );

  const [tags, setTags] = useState(photo.userAnnotations.tags);

  const dateString = photo.userAnnotations.date.slice(0, 10).replace(/:/g, '/');

  const [selectedDate, setSelectedDate] = useState(
    dateString ? new Date(dateString) : undefined
  );

  const [selectedPeople, setSelectedPeople] = useState<string[]>(
    photo.userAnnotations.people
  );

  // Place
  const [placeName, setPlaceName] = useState(name);

  const [countrySearchTerm, setCountrySearchTerm] = useState(country.label);

  const [selectedCountry, setSelectedCountry] = useState<MaybeOption>(
    makeMaybeOption(country)
  );

  const [stateSearchTerm, setStateSearchTerm] = useState(stateProvince.label);

  const [selectedState, setSelectedState] = useState<MaybeOption>(
    makeMaybeOption(stateProvince)
  );

  const [cityName, setCityName] = useState(city);

  const [selectedCity, setSelectedCity] = useState<MaybeOption>(undefined);

  return children({
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
    selectedPeople,
    setSelectedPeople,
  });
}
