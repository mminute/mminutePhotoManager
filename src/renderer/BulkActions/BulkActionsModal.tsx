import { useState } from 'react';
import { Box, Button, Column, Flex, Modal, SelectList } from 'gestalt';
import { CitiesMapType, PlaceType } from 'DataManager/DataManager';
import Person from 'DataManager/PeopleManager/Person';
import Edit from './Edit/Edit';
import Photo from 'DataManager/PhotoManager/Photo';

function Footer({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Flex direction="row" justifyContent="between">
      <Button text="Cancel" onClick={onDismiss} />
    </Flex>
  );
}

function Select({ onSelect }: { onSelect: (action: string) => void }) {
  const placeholderText = 'Select an action';

  return (
    <Flex direction="row" justifyContent="center">
      <Column span={4}>
        <SelectList
          id="bulkActionSelector"
          onChange={({ value }) => {
            if (value !== placeholderText) {
              // For some reason `onChange` is getting called a second time
              // with the placeholder string
              onSelect(value);
            }
          }}
          size="lg"
          placeholder={placeholderText}
          label={placeholderText}
          labelDisplay="hidden"
          options={[
            { label: 'Edit', value: 'edit' },
            { label: 'Export', value: 'export' },
            { label: 'Move', value: 'move' },
            { label: 'Delete', value: 'delete' },
          ]}
        />
      </Column>
    </Flex>
  );
}

function getHeading(action: string) {
  switch (action) {
    case 'select':
      return 'Select an action';
    case 'edit':
      return 'Edit photos';
    case 'export':
      return 'Export';
    case 'move':
      return 'Move';
    case 'delete':
      return 'Delete';
    default:
      return 'Something went wrong';
  }
}

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

export default function BulkActionsModal({
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

  const headingText = getHeading(action);

  return (
    <Modal
      accessibilityModalLabel={headingText}
      onDismiss={onDismiss}
      heading={headingText}
      footer={<Footer onDismiss={onDismiss} />}
      size="lg"
    >
      <Box paddingX={8} paddingY={4} minHeight="400px">
        {action === 'select' && (
          <Select onSelect={(newAction) => setAction(newAction)} />
        )}

        {action === 'edit' && (
          <Edit
            allTags={allTags}
            citiesMap={citiesMap}
            onShowModal={onShowModal}
            people={people}
            placesMap={placesMap}
            selectedIds={selectedIds}
            selectedPhotos={selectedPhotos}
          />
        )}

        {action === 'export' && 'Export here'}

        {action === 'move' && 'Move here'}

        {action === 'delete' && 'Delete here'}
      </Box>
    </Modal>
  );
}
