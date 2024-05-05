import { Box, Button, Flex, Modal, Text, TextArea, TextField } from 'gestalt';
import { useState } from 'react';

interface Props {
  currentNotes: string;
  onDismiss: () => void;
}

const HEADING = 'Collection Notes';

export default function CollectionNotesModal({
  currentNotes,
  onDismiss,
}: Props) {
  const [notes, setNotes] = useState(currentNotes);

  const handleSave = () => {
    window.electron.ipcRenderer.updateCollectionNote(notes);
    onDismiss();
  };

  return (
    <Modal
      accessibilityModalLabel={HEADING}
      onDismiss={onDismiss}
      heading={HEADING}
      size="md"
      footer={
        <Flex direction="row" justifyContent="between">
          <Button text="Cancel" onClick={onDismiss} />
          <Button color="red" onClick={handleSave} text="Save" />
        </Flex>
      }
    >
      <Box paddingX={8} paddingY={4}>
        <TextArea
          id="collection-notes"
          label="Collection Notes"
          onChange={(e) => setNotes(e.value)}
          placeholder="Notes about your photo collection"
          value={notes}
        />
      </Box>
    </Modal>
  );
}
