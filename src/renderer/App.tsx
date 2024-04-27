import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CompositeZIndex, FixedZIndex, Flex, Layer, Toast } from 'gestalt';
import Person from '../DataManager/PeopleManager/Person';
import Splash from './Splash/Splash';
import 'gestalt/dist/gestalt.css';
import './App.css';
import './Toast.css';
import { actions } from '../constants';
import { routePaths } from './routePaths';
import PhotoGallery from './PhotoGallery/PhotoGallery';
import Photo from '../DataManager/PhotoManager/Photo';
import Sidebar from './Sidebar/Sidebar';
import PageWrapper from './PageWrapper/PageWrapper';
import PhotoView from './PhotoView/PhotoView';
import { CitiesMapType, PlaceType } from '../DataManager/DataManager';
import PersonModal from './PersonModal';
import PeopleView from './PeopleView/PeopleView';
import { GALLERY_TABS_Z_INDEX } from './components/GalleryTabs';
import buildFileTree, { DirectoryData } from './utils/buildFileTree';
import BulkActions from './BulkActions/BulkActions';

interface Props {}
interface State {
  activePath: string;
  activePersonId: string | null;
  activePhotoId: string | null;
  bulkSelections: string[];
  citiesMap: CitiesMapType;
  currentDirectory: string;
  currentModal: null | 'create-person' | 'edit-person' | 'bulk-actions';
  fileTree: DirectoryData[];
  people: Person[];
  photos: Photo[];
  placesMap: PlaceType[];
  recentDirectories: string[];
  tags: string[];
  toastText: string | null;
}
export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activePath: '',
      activePersonId: null,
      activePhotoId: null,
      bulkSelections: [],
      citiesMap: {},
      currentDirectory: '',
      currentModal: null,
      fileTree: [],
      people: [],
      photos: [],
      placesMap: [],
      recentDirectories: [],
      tags: [],
      toastText: null,
    };
  }

  componentDidMount() {
    window.electron.ipcRenderer.on(
      actions.INITIALIZE_PHOTO_MANAGER,
      this.handleInventoryInitialized
    );

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

    window.electron.ipcRenderer.on(
      actions.SCRUB_EXIF_DATA_SUCCES,
      this.handleExifDataScrubbed
    );

    window.electron.ipcRenderer.on(
      actions.BULK_EDIT_PHOTOS_SUCCESS,
      this.handlePhotosObtained
    );

    window.electron.ipcRenderer.on(
      actions.BULK_DELETE_PHOTOS_SUCCESS,
      this.handlePhotosObtained
    );

    window.electron.ipcRenderer.on(
      actions.MOVE_FILES_SUCCESS,
      this.handlePhotosObtained
    );

    window.electron.ipcRenderer.on(
      actions.EXPORT_PHOTOS_SUCCESS,
      this.handleExportSuccess
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
      actions.DELETE_PERSON_SUCCESS,
      this.handlePersonDeleted
    );

    window.electron.ipcRenderer.removeListener(
      actions.SCRUB_EXIF_DATA_SUCCES,
      this.handleExifDataScrubbed
    );

    window.electron.ipcRenderer.removeListener(
      actions.BULK_EDIT_PHOTOS_SUCCESS,
      this.handlePhotosObtained
    );

    window.electron.ipcRenderer.removeListener(
      actions.MOVE_FILES_SUCCESS,
      this.handlePhotosObtained
    );

    window.electron.ipcRenderer.removeListener(
      actions.EXPORT_PHOTOS_SUCCESS,
      this.handleExportSuccess
    );
  }

  handleInventoryInitialized = (recentDirectories: string[]) => {
    this.setState({ recentDirectories });
  };

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

  handleExifDataScrubbed = (photos: Photo[]) => {
    this.setState({
      photos,
      toastText: 'EXIF data deleted!',
    });

    setTimeout(() => this.setState({ toastText: null }), 1100);
  };

  handleExportSuccess = () => {
    this.setState({
      toastText: 'Photos exported!',
    });

    setTimeout(() => this.setState({ toastText: null }), 1100);
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

  handleUpdateBulkSelection = ({
    action,
    ids,
  }: {
    action: 'add' | 'clear' | 'remove';
    ids?: string[];
  }) => {
    const { bulkSelections } = this.state;

    let updatedData = bulkSelections;

    if (action === 'add' && ids?.length) {
      updatedData = [...updatedData, ...ids];
    } else if (action === 'remove' && ids?.length) {
      updatedData = bulkSelections.filter(
        (selected) => !ids.includes(selected)
      );
    } else if (action === 'clear') {
      updatedData = [];
    }

    this.setState({ bulkSelections: updatedData });
  };

  render() {
    const {
      activePath,
      activePersonId,
      activePhotoId,
      bulkSelections,
      citiesMap,
      currentDirectory,
      currentModal,
      fileTree,
      people,
      photos,
      placesMap,
      recentDirectories,
      tags,
      toastText,
    } = this.state;

    const activePhoto = photos.find((p) => p.filePath === activePhotoId);

    const unannotatedCount = photos.reduce((prevValue, photo) => {
      if (!photo.isAnnotated) {
        return prevValue + 1;
      }

      return prevValue;
    }, 0);

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
            unannotatedCount={unannotatedCount}
          />
          <PageWrapper>
            <Routes>
              <Route
                path={routePaths.SPLASH}
                element={<Splash recentDirectories={recentDirectories} />}
              />
              <Route
                path={routePaths.PHOTOS}
                element={
                  <PhotoGallery
                    activePath={activePath}
                    bulkSelections={bulkSelections}
                    photos={photos}
                    onOpenBulkActions={() =>
                      this.setState({ currentModal: 'bulk-actions' })
                    }
                    onSelectPhoto={this.handleSelectPhoto}
                    onUpdateBulkSelection={this.handleUpdateBulkSelection}
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

        {/*
          TODO: Since you can have the create-person modal
          over the bulk-actions modal
          'currentModal' should be replaced with a stack of some sort
        */}
        {currentModal && (
          <Layer
            zIndex={
              new CompositeZIndex([new FixedZIndex(GALLERY_TABS_Z_INDEX)])
            }
          >
            {(currentModal === 'create-person' ||
              currentModal === 'edit-person') && (
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
            )}

            {currentModal === 'bulk-actions' && (
              <BulkActions
                allTags={tags}
                citiesMap={citiesMap}
                onClearBulkSelection={() =>
                  this.handleUpdateBulkSelection({ action: 'clear' })
                }
                onDismiss={() => this.setState({ currentModal: null })}
                onShowModal={(name) => this.setState({ currentModal: name })}
                people={people}
                placesMap={placesMap}
                selectedIds={bulkSelections}
                selectedPhotos={photos.filter((p) =>
                  bulkSelections.includes(p.filePath)
                )}
              />
            )}
          </Layer>
        )}

        {toastText && (
          <Layer
            zIndex={
              new CompositeZIndex([new FixedZIndex(GALLERY_TABS_Z_INDEX)])
            }
          >
            <Box position="fixed" bottom left right marginBottom={8}>
              <div
                className="toast-slide"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: window.innerHeight / 2 - 72,
                }}
              >
                <Toast text={toastText} />
              </div>
            </Box>
          </Layer>
        )}
      </>
    );
  }
}
