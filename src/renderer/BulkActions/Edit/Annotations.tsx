import { CitiesMapType, PlaceType } from 'DataManager/DataManager';
import Person from 'DataManager/PeopleManager/Person';
import UserAnnotationPlace from 'DataManager/PhotoManager/UserAnnotationPlace';
import AnnotationDataManager from 'renderer/PhotoView/AnnotationDataManager';
import UserAnnotationDisplay from 'renderer/PhotoView/UserAnnotationDisplay';
import Photo from '../../../DataManager/PhotoManager/Photo';

interface Props {
  allTags: string[];
  citiesMap: CitiesMapType;
  onShowModal: (action: 'create-person') => void;
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
      }) => (
        <UserAnnotationDisplay
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
      )}
    </AnnotationDataManager>
  );
}
