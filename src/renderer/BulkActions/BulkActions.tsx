import { useState } from 'react';
import { CitiesMapType, PlaceType } from 'DataManager/DataManager';
import Person from 'DataManager/PeopleManager/Person';
import Photo from 'DataManager/PhotoManager/Photo';
import Edit from './Edit/Edit';
import Select from './Select';
import Delete from './Delete';
import Move from './Move';
import Export from './Export';

interface Props {
  allTags: string[];
  citiesMap: CitiesMapType;
  onDismiss: () => void;
  onShowModal: (action: 'create-person') => void;
  people: Person[];
  placesMap: PlaceType[];
  selectedIds: string[];
  selectedPhotos: Photo[];
}

export default function BulkActions({
  allTags,
  citiesMap,
  onDismiss,
  onShowModal,
  people,
  placesMap,
  selectedIds,
  selectedPhotos,
}: Props) {
  const [action, setAction] = useState('select');
  const backToSelect = () => setAction('select');

  switch (action) {
    case 'select':
      return (
        <Select
          onDismiss={onDismiss}
          onSelect={(newAction) => setAction(newAction)}
        />
      );
    case 'edit':
      return (
        <Edit
          backToSelect={backToSelect}
          onDismiss={onDismiss}
          allTags={allTags}
          citiesMap={citiesMap}
          onShowModal={onShowModal}
          people={people}
          placesMap={placesMap}
          selectedIds={selectedIds}
          selectedPhotos={selectedPhotos}
        />
      );
    case 'export':
      return <Export backToSelect={backToSelect} onDismiss={onDismiss} />;
    case 'move':
      return <Move backToSelect={backToSelect} onDismiss={onDismiss} />;
    case 'delete':
      return <Delete backToSelect={backToSelect} onDismiss={onDismiss} />;
    default:
      return null;
  }
}
