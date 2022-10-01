import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from 'gestalt';
import Person from '../DataManager/PeopleManager/Person';
import Splash from './Splash';
import 'gestalt/dist/gestalt.css';
import './App.css';
import { actions } from '../constants';
import { routePaths } from './routePaths';
import PhotoGallery from './PhotoGallery';
import Photo from '../DataManager/PhotoManager/Photo';
import Sidebar from './Sidebar/Sidebar';
import PageWrapper from './PageWrapper/PageWrapper';
import PhotoView from './PhotoView/PhotoView';
import { PlaceType } from '../DataManager/DataManager';
import CreatePersonModal from './CreatePersonModal';
import PeopleView from './PeopleView';

interface Props {}
interface State {
  activePhotoId: string | null;
  citiesMap: Record<string, Record<string, string[]>>;
  currentModal: null | 'create-person';
  people: Person[];
  photos: Photo[];
  placesMap: PlaceType[];
  tags: string[];
}
export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activePhotoId: null,
      citiesMap: {},
      currentModal: null,
      people: [],
      photos: [],
      placesMap: [],
      tags: [],
    };
  }

  componentDidMount() {
    window.electron.ipcRenderer.on(
      actions.FILEPATHS_OBTAINED,
      this.handlePhotosObtained
    );

    window.electron.ipcRenderer.on(
      actions.UPDATE_PHOTO_DATA_COMPLETE,
      this.handlePhotosObtained
    );

    window.electron.ipcRenderer.on(
      actions.CREATE_PERSON_SUCCESS,
      this.handlePersonCreated
    );
  }

  componentWillUnmount() {
    window.electron.ipcRenderer.removeListener(
      actions.FILEPATHS_OBTAINED,
      this.handlePhotosObtained
    );

    window.electron.ipcRenderer.removeListener(
      actions.UPDATE_PHOTO_DATA_COMPLETE,
      this.handlePhotosObtained
    );

    window.electron.ipcRenderer.removeListener(
      actions.CREATE_PERSON_SUCCESS,
      this.handlePersonCreated
    );
  }

  handlePhotosObtained = (
    photos: Photo[],
    tags: string[],
    placesMap: PlaceType[],
    citiesMap: Record<string, Record<string, string[]>>,
    people: Person[]
  ) => {
    this.setState({ photos, tags, placesMap, citiesMap, people });
  };

  handlePersonCreated = (people: Person[]) => {
    this.setState({ people });
  };

  handleSelectPhoto = (id: string) => {
    this.setState({ activePhotoId: id });
  };

  render() {
    const {
      activePhotoId,
      citiesMap,
      currentModal,
      people,
      photos,
      placesMap,
      tags,
    } = this.state;

    const activePhoto = photos.find((p) => p.filePath === activePhotoId);

    return (
      <>
        <Router>
          <Sidebar />
          <PageWrapper>
            <Routes>
              <Route path={routePaths.SPLASH} element={<Splash />} />
              <Route
                path={routePaths.PHOTOS}
                element={
                  <PhotoGallery
                    photos={photos}
                    onSelectPhoto={this.handleSelectPhoto}
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
                element={<PeopleView people={people} />}
              />
            </Routes>
          </PageWrapper>
        </Router>

        {currentModal === 'create-person' && (
          <CreatePersonModal
            existingPeople={people}
            onDismiss={() => this.setState({ currentModal: null })}
          />
        )}
      </>
    );
  }
}
