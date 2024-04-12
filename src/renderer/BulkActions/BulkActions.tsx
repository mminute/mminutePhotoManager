import React from 'react';
import { CitiesMapType, PlaceType } from 'DataManager/DataManager';
import Person from 'DataManager/PeopleManager/Person';
import Photo from 'DataManager/PhotoManager/Photo';
import Edit from './Edit/Edit';
import Select from './Select';
import Delete from './Delete';
import Move from './Move';
import Export from './Export';
import { Actions } from './BulkActionTypes';
import { actions } from '../../constants';

interface Props {
  allTags: string[];
  citiesMap: CitiesMapType;
  onClearBulkSelection: () => void;
  onDismiss: () => void;
  onShowModal: (action: 'create-person') => void;
  people: Person[];
  placesMap: PlaceType[];
  selectedIds: string[];
  selectedPhotos: Photo[];
}

interface State {
  action: Actions;
  exportDestination: string;
}

export default class BulkActions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      action: 'select',
      exportDestination: '',
    };
  }

  componentDidMount() {
    window.electron.ipcRenderer.on(
      actions.SELECT_EXPORT_DIRECTORY_SUCCESS,
      this.onExportPathSelected
    );
  }

  componentWillUnmount() {
    window.electron.ipcRenderer.removeListener(
      actions.SELECT_EXPORT_DIRECTORY_SUCCESS,
      this.onExportPathSelected
    );
  }

  onExportPathSelected = (destination: string) => {
    this.setState({ action: 'export', exportDestination: destination });
  };

  backToSelect = () => this.setState({ action: 'select' });

  render() {
    const { action, exportDestination } = this.state;
    const {
      allTags,
      citiesMap,
      onClearBulkSelection,
      onDismiss,
      onShowModal,
      people,
      placesMap,
      selectedIds,
      selectedPhotos,
    } = this.props;

    switch (action) {
      case 'select':
        return (
          <Select
            onDismiss={onDismiss}
            onSelect={(newAction) => this.setState({ action: newAction })}
          />
        );
      case 'edit':
        return (
          <Edit
            allTags={allTags}
            backToSelect={this.backToSelect}
            citiesMap={citiesMap}
            onClearBulkSelection={onClearBulkSelection}
            onDismiss={onDismiss}
            onShowModal={onShowModal}
            people={people}
            placesMap={placesMap}
            selectedIds={selectedIds}
            selectedPhotos={selectedPhotos}
          />
        );
      case 'export':
        return (
          <Export
            backToSelect={this.backToSelect}
            destination={exportDestination}
            onClearBulkSelection={onClearBulkSelection}
            onDismiss={onDismiss}
            selectedIds={selectedIds}
          />
        );
      case 'move':
        return (
          <Move
            backToSelect={this.backToSelect}
            onClearBulkSelection={onClearBulkSelection}
            onDismiss={onDismiss}
            selectedIds={selectedIds}
          />
        );
      case 'delete':
        return (
          <Delete
            backToSelect={this.backToSelect}
            onDismiss={onDismiss}
            selectedIds={selectedIds}
            onClearBulkSelection={onClearBulkSelection}
          />
        );
      default:
        return null;
    }
  }
}
