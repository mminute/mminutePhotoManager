import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './Splash';
import 'gestalt/dist/gestalt.css';
import './App.css';
import { actions } from '../constants';
import { routePaths } from './routePaths';
import Gallery from './Gallery';
import Photo from '../DataManager/PhotoManager/Photo';
import Sidebar from './Sidebar/Sidebar';
import PageWrapper from './PageWrapper/PageWrapper';
import PhotoView from './PhotoView/PhotoView';
import { PlaceType } from '../DataManager/DataManager';

interface Props {}
interface State {
  activePhotoId: string | null;
  photos: Photo[];
  tags: string[];
  placesMap: PlaceType[];
  citiesMap: Record<string, Record<string, string[]>>;
}
export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activePhotoId: null,
      photos: [],
      tags: [],
      placesMap: [],
      citiesMap: {},
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
  }

  handlePhotosObtained = (
    photos: Photo[],
    tags: string[],
    placesMap: PlaceType[],
    citiesMap: Record<string, Record<string, string[]>>
  ) => {
    this.setState({ photos, tags, placesMap, citiesMap });
  };

  handleSelectPhoto = (id: string) => {
    this.setState({ activePhotoId: id });
  };

  render() {
    const { activePhotoId, photos, tags, placesMap, citiesMap } = this.state;
    const activePhoto = photos.find((p) => p.filePath === activePhotoId);

    return (
      <Router>
        <Sidebar />
        <PageWrapper>
          <Routes>
            <Route path={routePaths.SPLASH} element={<Splash />} />
            <Route
              path={routePaths.GALLERY}
              element={
                <Gallery
                  photos={photos}
                  onSelectPhoto={this.handleSelectPhoto}
                />
              }
            />
            <Route
              path={routePaths.PHOTO}
              element={
                <PhotoView
                  photo={activePhoto}
                  allTags={tags}
                  placesMap={placesMap}
                  citiesMap={citiesMap}
                />
              }
            />
          </Routes>
        </PageWrapper>
      </Router>
    );
  }
}
