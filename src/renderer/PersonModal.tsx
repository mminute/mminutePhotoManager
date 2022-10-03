import { useState } from 'react';
import { Box, Button, Flex, Modal, Text, TextArea, TextField } from 'gestalt';
import Person from '../DataManager/PeopleManager/Person';

function Footer({
  isSubmittable,
  onDelete,
  onDismiss,
  onSubmit,
}: {
  isSubmittable: boolean;
  onDelete: (() => void) | null;
  onDismiss: () => void;
  onSubmit: () => void;
}) {
  return (
    <Flex direction="row" justifyContent="between">
      <Button text="Cancel" onClick={onDismiss} />

      {onDelete && <Button text="Delete" onClick={onDelete} />}

      <Button
        color="red"
        disabled={!isSubmittable}
        onClick={onSubmit}
        text={onDelete ? 'Update' : 'Add'}
      />
    </Flex>
  );
}

interface Props {
  existingPeople: Person[];
  onDismiss: () => void;
  selectedPerson: Person | null | undefined;
}

export default function PersonModal({
  existingPeople,
  onDismiss,
  selectedPerson,
}: Props) {
  const [mode, setMode] = useState('edit');
  const [personId, setPersonId] = useState(selectedPerson?.id || '');
  const [firstName, setFirstName] = useState(selectedPerson?.firstName || '');
  const [middleName, setMiddleName] = useState(
    selectedPerson?.middleName || ''
  );
  const [lastName, setLastName] = useState(selectedPerson?.lastName || '');
  const [description, setDescription] = useState(
    selectedPerson?.description || ''
  );

  const handleSubmit = () => {
    const data = {
      id: personId,
      description,
      firstName,
      middleName,
      lastName,
    };

    const ipcRendererAction = selectedPerson
      ? window.electron.ipcRenderer.updatePerson
      : window.electron.ipcRenderer.createPerson;

    ipcRendererAction(data);

    onDismiss();
  };

  const handleDelete = () => {
    if (selectedPerson) {
      window.electron.ipcRenderer.deletePerson(selectedPerson.id);
    }

    onDismiss();
  };

  const invalidId = selectedPerson
    ? false
    : existingPeople.some((p) => p.id === personId);

  const modalHeading = selectedPerson
    ? `Edit ${selectedPerson.firstName} ${selectedPerson.lastName}`
    : 'Create a new person';

  return (
    <>
      <Modal
        accessibilityModalLabel={modalHeading}
        onDismiss={onDismiss}
        heading={modalHeading}
        size="md"
        footer={
          <Footer
            isSubmittable={
              !!(personId && !invalidId && (firstName || lastName))
            }
            onDelete={selectedPerson ? () => setMode('warn') : null}
            onDismiss={onDismiss}
            onSubmit={handleSubmit}
          />
        }
      >
        <Box paddingX={8} paddingY={4}>
          <Flex direction="column" gap={4}>
            <TextField
              id="personId"
              disabled={!!selectedPerson}
              errorMessage={invalidId ? 'ID already exists' : ''}
              label="ID"
              onChange={({ value }) => setPersonId(value.toLowerCase())}
              placeholder="Enter a unique id"
              value={personId}
            />

            <TextField
              id="firstName"
              label="First name"
              onChange={({ value }) => setFirstName(value)}
              value={firstName}
            />

            <TextField
              id="middleName"
              label="Middle name"
              onChange={({ value }) => setMiddleName(value)}
              value={middleName}
            />

            <TextField
              id="lastName"
              label="Last name"
              onChange={({ value }) => setLastName(value)}
              value={lastName}
            />

            <TextArea
              id="description"
              label="Description"
              onChange={({ value }) => setDescription(value)}
              value={description}
            />
          </Flex>
        </Box>
      </Modal>

      {mode === 'warn' && (
        <Modal
          accessibilityModalLabel="Deleting a person cannot be undone"
          heading="Deleting a person cannot be undone"
          subHeading={`Are you sure that you want to delete ${selectedPerson?.firstName} ${selectedPerson?.lastName}?`}
          onDismiss={() => setMode('edit')}
          footer={
            <Flex direction="row" justifyContent="between">
              <Button text="Cancel" onClick={() => setMode('edit')} />

              <Button color="red" onClick={handleDelete} text="Delete" />
            </Flex>
          }
        >
          <Box paddingX={12}>
            <Text>
              Deleting a person will remove them from any photos in which they
              are tagged as well as deleting their information. This data cannot
              be restored after it has been deleted.
            </Text>
          </Box>
        </Modal>
      )}
    </>
  );
}
