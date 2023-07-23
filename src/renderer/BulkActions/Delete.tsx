import { Box, Button, Flex, Heading, Text } from 'gestalt';
import Modal from './Modal';
import ModalHeading from './ModalHeading';

export default function Delete({
  backToSelect,
  onDismiss,
  selectedIds,
  onClearBulkSelection,
}: {
  backToSelect: () => void;
  onDismiss: () => void;
  selectedIds: string[];
  onClearBulkSelection: () => void;
}) {
  const handleDelete = () => {
    window.electron.ipcRenderer.deletePhotos(selectedIds);
    onClearBulkSelection();
    onDismiss();
  };

  return (
    <Modal
      accessibilityModalLabel="Delete"
      heading={<ModalHeading txt="Delete" backToSelect={backToSelect} />}
      onDismiss={onDismiss}
      footer={
        <Flex direction="row" justifyContent="between">
          <Button text="Cancel" onClick={onDismiss} />
          <Button color="red" text="Delete" onClick={handleDelete} />
        </Flex>
      }
    >
      <Box padding={8}>
        <Flex direction="column" gap={2} alignItems="center">
          <Heading color="error">Warning</Heading>
          <Text weight="bold" italic>
            This action cannot be undone
          </Text>
        </Flex>
      </Box>
    </Modal>
  );
}
