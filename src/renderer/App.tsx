import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { CompositeZIndex, FixedZIndex, Layer } from 'gestalt';
import Person from '../DataManager/PeopleManager/Person';
import Splash from './Splash';
import 'gestalt/dist/gestalt.css';
import './App.css';
import { actions } from '../constants';
import { routePaths } from './routePaths';
import PhotoGallery from './PhotoGallery/PhotoGallery';
import Photo from '../DataManager/PhotoManager/Photo';
import Sidebar from './Sidebar/Sidebar';
import PageWrapper from './PageWrapper/PageWrapper';
import PhotoView from './PhotoView/PhotoView';
import { CitiesMapType, PlaceType } from '../DataManager/DataManager';
import PersonModal from './PersonModal';
import PeopleView from './PeopleView';
import { GALLERY_TABS_Z_INDEX } from './GalleryTabs';
import buildFileTree, { DirectoryData } from './utils/buildFileTree';

interface Props {}
interface State {
  activePath: string;
  activePersonId: string | null;
  activePhotoId: string | null;
  citiesMap: CitiesMapType;
  currentDirectory: string;
  currentModal: null | 'create-person' | 'edit-person';
  fileTree: DirectoryData[];
  people: Person[];
  photos: Photo[];
  placesMap: PlaceType[];
  tags: string[];
}
export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activePath: '',
      activePersonId: null,
      activePhotoId: null,
      citiesMap: {},
      currentDirectory: '',
      currentModal: null,
      fileTree: [],
      people: [],
      photos: [],
      placesMap: [],
      tags: [],
    };
  }

  componentDidMount() {
    window.electron.ipcRenderer.on(
      actions.FILEPATHS_OBTAINED,
      this.handleFilepathsObtained
    );

    window.electron.ipcRenderer.on(
      actions.UPDATE_PHOTO_DATA_COMPLETE,
      this.handlePhotosObtained
    );

    window.electron.ipcRenderer.on(
      actions.CREATE_PERSON_SUCCESS,
      this.handlePeopleUpdated
    );

    window.electron.ipcRenderer.on(
      actions.UPDATE_PERSON_SUCCESS,
      this.handlePeopleUpdated
    );

    window.electron.ipcRenderer.on(
      actions.DELETE_PERSON_SUCCESS,
      this.handlePersonDeleted
    );
  }

  componentWillUnmount() {
    window.electron.ipcRenderer.removeListener(
      actions.FILEPATHS_OBTAINED,
      this.handleFilepathsObtained
    );

    window.electron.ipcRenderer.removeListener(
      actions.UPDATE_PHOTO_DATA_COMPLETE,
      this.handlePhotosObtained
    );

    window.electron.ipcRenderer.removeListener(
      actions.CREATE_PERSON_SUCCESS,
      this.handlePeopleUpdated
    );

    window.electron.ipcRenderer.removeListener(
      actions.UPDATE_PERSON_SUCCESS,
      this.handlePeopleUpdated
    );

    window.electron.ipcRenderer.removeListener(
      actions.UPDATE_PERSON_SUCCESS,
      this.handlePeopleUpdated
    );

    window.electron.ipcRenderer.removeListener(
      actions.DELETE_PERSON_SUCCESS,
      this.handlePersonDeleted
    );
  }

  handleFilepathsObtained = (
    photos: Photo[],
    tags: string[],
    placesMap: PlaceType[],
    citiesMap: Record<string, Record<string, string[]>>,
    people: Person[],
    currentDirectory: string
  ) => {
    this.setState({
      activePath: currentDirectory,
      currentDirectory,
      fileTree: buildFileTree(photos, currentDirectory),
    });
    this.handlePhotosObtained(photos, tags, placesMap, citiesMap, people);
  };

  handlePhotosObtained = (
    photos: Photo[],
    tags: string[],
    placesMap: PlaceType[],
    citiesMap: Record<string, Record<string, string[]>>,
    people: Person[]
  ) => {
    this.setState({ photos, tags, placesMap, citiesMap, people });
  };

  handlePeopleUpdated = (people: Person[]) => {
    this.setState({ people });
  };

  handleSelectPhoto = (id: string) => {
    this.setState({ activePhotoId: id });
  };

  handleSelectPerson = (id: string) => {
    this.setState({ activePersonId: id, currentModal: 'edit-person' });
  };

  handlePersonDeleted = (photos: Photo[], people: Person[]) => {
    this.setState({ photos, people });
  };

  render() {
    const {
      activePath,
      activePersonId,
      activePhotoId,
      citiesMap,
      currentDirectory,
      currentModal,
      fileTree,
      people,
      photos,
      placesMap,
      tags,
    } = this.state;

    const activePhoto = photos.find((p) => p.filePath === activePhotoId);

    return (
      <>
        <Router>
          <Sidebar
            activePath={activePath}
            updateActivePath={(newPath: string) =>
              this.setState({ activePath: newPath })
            }
            currentDirectory={currentDirectory}
            fileTree={fileTree}
          />
          <PageWrapper>
            <Routes>
              <Route path={routePaths.SPLASH} element={<Splash />} />
              <Route
                path={routePaths.PHOTOS}
                element={
                  <PhotoGallery
                    activePath={activePath}
                    photos={photos}
                    onSelectPhoto={this.handleSelectPhoto}
                    placesMap={placesMap}
                    allTags={tags}
                    people={people}
                  />
                }
              />
              <Route
                path={routePaths.PHOTO}
                element={
                  <PhotoView
                    allTags={tags}
                    citiesMap={citiesMap}
                    onShowModal={(name) =>
                      this.setState({ currentModal: name })
                    }
                    people={people}
                    photo={activePhoto}
                    placesMap={placesMap}
                  />
                }
              />
              <Route
                path={routePaths.PEOPLE}
                element={
                  <PeopleView
                    people={people}
                    onSelect={this.handleSelectPerson}
                  />
                }
              />
            </Routes>
          </PageWrapper>
        </Router>

        {(currentModal === 'create-person' ||
          currentModal === 'edit-person') && (
          <Layer
            zIndex={
              new CompositeZIndex([new FixedZIndex(GALLERY_TABS_Z_INDEX)])
            }
          >
            <PersonModal
              existingPeople={people}
              onDismiss={() =>
                this.setState({ currentModal: null, activePersonId: null })
              }
              selectedPerson={
                activePersonId
                  ? people.find((p) => p.id === activePersonId)
                  : null
              }
            />
          </Layer>
        )}
      </>
    );
  }
}
