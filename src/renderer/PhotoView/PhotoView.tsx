import { Box, Button, Divider, IconButton, Image, Tabs } from 'gestalt';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShowModalType } from 'renderer/types';
import Person from 'DataManager/PeopleManager/Person';
import Photo from '../../DataManager/PhotoManager/Photo';
import { routePaths } from '../routePaths';
import GpsMetadataDisplay from './GpsMetadataDisplay';
import UserAnnotationDisplay from './UserAnnotationDisplay';
import {
  ImageMetadataDisplay,
  ExifMetadataDisplay,
} from './SimpleMetadataDisplay';
import AnnotationDataManager from './AnnotationDataManager';
import { PhotoUpdateData } from './types';
import { CitiesMapType, PlaceType } from '../../DataManager/DataManager';

interface Props {
  photo: Photo | undefined;
  allTags: string[];
  placesMap: PlaceType[];
  citiesMap: CitiesMapType;
  onShowModal: ShowModalType;
  people: Person[];
}

const tabs = [
  { href: '/', text: 'Annotations' },
  { href: '/', text: 'Image' },
  { href: '/', text: 'GPS' },
  { href: '/', text: 'Exif' },
];

const Comps = [
  UserAnnotationDisplay,
  ImageMetadataDisplay,
  GpsMetadataDisplay,
  ExifMetadataDisplay,
];

function getPanelHeights(dataPanelHeight: number) {
  return { data: dataPanelHeight, image: 100 - dataPanelHeight };
}

export default function PhotoView({
  allTags,
  citiesMap,
  onShowModal,
  people,
  photo,
  placesMap,
}: Props) {
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();

  if (!photo) {
    navigate(routePaths.PHOTOS);
    return null;
  }

  const handleTabChange = ({
    activeTabIndex,
    event,
  }: {
    activeTabIndex: number;
    event: any;
  }) => {
    event.preventDefault();
    setTabIndex(activeTabIndex);
  };

  const handleSave = (annotationData: PhotoUpdateData) => {
    window.electron.ipcRenderer.updatePhotoData(annotationData);
  };

  const { height, width, userAnnotations } = photo;

  const SelectedComp = Comps[tabIndex];

  const panelHeights = getPanelHeights(65);

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
        return (
          <Box height="100vh" overflow="hidden">
            <Box position="absolute" top right padding={4}>
              <IconButton
                accessibilityLabel="Back to gallery"
                iconColor="darkGray"
                icon="cancel"
                onClick={() => navigate(routePaths.PHOTOS)}
              />
            </Box>

            <Box position="absolute" top left padding={4}>
              <Button
                color="blue"
                text="Save and close"
                onClick={() => {
                  handleSave({
                    filepath: photo.filePath,
                    userAnnotations: {
                      title,
                      description,
                      tags,
                      selectedDate,
                      placeName,
                      countrySearchTerm,
                      selectedCountry,
                      stateSearchTerm,
                      selectedState,
                      cityName,
                      selectedCity,
                      selectedPeople,
                    },
                  });

                  navigate(routePaths.PHOTOS);
                }}
              />
            </Box>
            <Box
              height={`${panelHeights.image}%`}
              maxHeight={`${panelHeights.image}%`}
              padding={8}
            >
              <Image
                color="transparent"
                alt={userAnnotations.title || 'Missing title'}
                naturalHeight={height || 500}
                naturalWidth={width || 500}
                src={`data:image/jpg;base64,${photo.base64}`}
                fit="contain"
              />
            </Box>

            <Box height={`${panelHeights.data}%`} paddingX={8} paddingY={4}>
              <Box display="flex" justifyContent="center">
                <Tabs
                  activeTabIndex={tabIndex}
                  onChange={handleTabChange}
                  tabs={tabs}
                />
              </Box>

              <Divider />

              <Box
                height="100%"
                overflow="scrollY"
                marginBottom={2}
                paddingX={1}
              >
                <SelectedComp
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
              </Box>
            </Box>
          </Box>
        );
      }}
    </AnnotationDataManager>
  );
}
