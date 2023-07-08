import { CitiesMapType, PlaceType } from 'DataManager/DataManager';
import Person from 'DataManager/PeopleManager/Person';
import UserAnnotationPlace from 'DataManager/PhotoManager/UserAnnotationPlace';
import AnnotationDataManager from 'renderer/PhotoView/AnnotationDataManager';
import { MaybeOption } from 'renderer/PhotoView/types';
import UserAnnotationDisplay, {
  OnUpdateArgs as ChildOnUpdateArgs,
} from 'renderer/PhotoView/UserAnnotationDisplay';
import Photo from '../../../DataManager/PhotoManager/Photo';

export interface OnUpdateArgs extends ChildOnUpdateArgs {
  title: string;
  description: string;
  tags: string[];
  selectedDate: Date | undefined;
  placeName: string;
  selectedCountry: MaybeOption;
  selectedState: MaybeOption;
  cityName: string;
  selectedPeople: string[];
}

interface Props {
  allTags: string[];
  citiesMap: CitiesMapType;
  onShowModal: (action: 'create-person') => void;
  onUpdate: (data: OnUpdateArgs) => void;
  people: Person[];
  photo: Photo;
  placesMap: PlaceType[];
  remainingDates: string[];
  remainingDescriptions: string[];
  remainingPeople: string[];
  remainingPlaces: UserAnnotationPlace[];
  remainingTags: string[];
  remainingTitles: string[];
}

export default function Annotations({
  allTags,
  citiesMap,
  onShowModal,
  onUpdate,
  people,
  photo,
  placesMap,
  remainingDates,
  remainingDescriptions,
  remainingPeople,
  remainingPlaces,
  remainingTags,
  remainingTitles,
}: Props) {
  return (
    <AnnotationDataManager photo={photo}>
      {({
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
      }) => {
        const handleUpdate = (hasErrors: ChildOnUpdateArgs) => {
          onUpdate({
            title,
            description,
            tags,
            selectedDate,
            placeName,
            selectedCountry,
            selectedState,
            cityName: selectedCity?.label || cityName,
            selectedPeople,
            ...hasErrors,
          });
        };

        return (
          <UserAnnotationDisplay
            onUpdate={handleUpdate}
            allTags={allTags}
            citiesMap={citiesMap}
            cityName={cityName}
            countrySearchTerm={countrySearchTerm}
            description={description}
            onShowModal={onShowModal}
            people={people}
            photo={photo}
            placeName={placeName}
            placesMap={placesMap}
            remainingDates={remainingDates}
            remainingDescriptions={remainingDescriptions}
            remainingPeople={remainingPeople}
            remainingPlaces={remainingPlaces}
            remainingTags={remainingTags}
            remainingTitles={remainingTitles}
            selectedCity={selectedCity}
            selectedCountry={selectedCountry}
            selectedDate={selectedDate}
            selectedPeople={selectedPeople}
            selectedState={selectedState}
            setCityName={setCityName}
            setCountrySearchTerm={setCountrySearchTerm}
            setDescription={setDescription}
            setPlaceName={setPlaceName}
            setSelectedCity={setSelectedCity}
            setSelectedCountry={setSelectedCountry}
            setSelectedDate={setSelectedDate}
            setSelectedPeople={setSelectedPeople}
            setSelectedState={setSelectedState}
            setStateSearchTerm={setStateSearchTerm}
            setTags={setTags}
            setTitle={setTitle}
            stateSearchTerm={stateSearchTerm}
            tags={tags}
            title={title}
          />
        );
      }}
    </AnnotationDataManager>
  );
}
