export type OptionType = { label: string; value: string };
export type MaybeOption = OptionType | undefined;
export type OptionSetter = (newOption: MaybeOption) => void;
export type StringSetter = (str: string) => void;
export interface UserAnnotationUpdates {
  title: string;
  description: string;
  tags: string[];
  selectedDate: Date | undefined;
  placeName: string;
  countrySearchTerm: string;
  selectedCountry: MaybeOption;
  stateSearchTerm: string;
  selectedState: MaybeOption;
  cityName: string;
  selectedCity: MaybeOption;
  selectedPeople: string[];
}
export interface PhotoUpdateData {
  filepath: string;
  userAnnotations: UserAnnotationUpdates;
}
