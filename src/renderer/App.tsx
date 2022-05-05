import React from 'react';
import {
  Navigate,
  MemoryRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Splash from './Splash';
import 'gestalt/dist/gestalt.css';
import './App.css';
import { actions } from '../constants';
import routePaths from './routePaths';
import Gallery from './Gallery';
import Photo from '../PhotoManager/Photo';

interface Props {}
interface State {
  photos: Photo[];
}
export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { photos: [] };
  }

  componentDidMount() {
    window.electron.ipcRenderer.on(
      actions.FILEPATHS_OBTAINED,
      this.handlePhotosObtained
    );
  }

  handlePhotosObtained = (photos: Photo[]) => {
    this.setState({ photos });
  };

  render() {
    const { photos } = this.state;

    return (
      <Router>
        <Routes>
          <Route path={routePaths.SPLASH} element={<Splash />} />
          <Route
            path={routePaths.GALLERY}
            element={<Gallery photos={photos} />}
          />
        </Routes>
      </Router>
    );
  }
}
