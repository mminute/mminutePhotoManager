export type MaybeOption = undefined | { label: string; value: string };
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
}
export interface PhotoUpdateData {
  filepath: string;
  userAnnotations: UserAnnotationUpdates;
}
