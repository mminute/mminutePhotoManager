import { useState } from 'react';
import { Box, Button, Flex, Modal, TextArea, TextField } from 'gestalt';
import Person from '../DataManager/PeopleManager/Person';

function Footer({
  isSubmittable,
  onDismiss,
  onSubmit,
}: {
  isSubmittable: boolean;
  onDismiss: () => void;
  onSubmit: () => void;
}) {
  return (
    <Flex direction="row" justifyContent="between">
      <Button text="Cancel" onClick={onDismiss} />

      <Button
        color="red"
        disabled={!isSubmittable}
        onClick={onSubmit}
        text="Add"
      />
    </Flex>
  );
}

interface Props {
  existingPeople: Person[];
  onDismiss: () => void;
}

export default function CreatePersonModal({
  existingPeople,
  onDismiss,
}: Props) {
  const [personId, setPersonId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    window.electron.ipcRenderer.createPerson({
      id: personId,
      description,
      firstName,
      middleName,
      lastName,
    });

    onDismiss();
  };

  console.log('CreatePersonModal', existingPeople);

  const invalidId = existingPeople.some((p) => p.id === personId);

  return (
    <Modal
      accessibilityModalLabel="Create a new person"
      onDismiss={onDismiss}
      heading="Create a new person"
      size="md"
      footer={
        <Footer
          isSubmittable={!!(personId && !invalidId && (firstName || lastName))}
          onDismiss={onDismiss}
          onSubmit={handleSubmit}
        />
      }
    >
      <Box paddingX={8} paddingY={4}>
        <Flex direction="column" gap={4}>
          <TextField
            id="personId"
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
  );
}
