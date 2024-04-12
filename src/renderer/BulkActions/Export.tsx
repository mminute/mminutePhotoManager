import { Box, Button, Flex, Heading, Text } from 'gestalt';
import Modal from './Modal';
import ModalHeading from './ModalHeading';

export default function Export({
  backToSelect,
  destination,
  onDismiss,
  onClearBulkSelection,
  selectedIds,
}: {
  backToSelect: () => void;
  destination: string;
  onDismiss: () => void;
  onClearBulkSelection: () => void;
  selectedIds: string[];
}) {
  return (
    <Modal
      accessibilityModalLabel="Export"
      heading={<ModalHeading txt="Export" backToSelect={backToSelect} />}
      onDismiss={onDismiss}
      footer={
        <Flex direction="row" justifyContent="between">
          <Button text="Cancel" onClick={onDismiss} />
          <Button
            color="red"
            text="Export"
            onClick={() => {
              window.electron.ipcRenderer.exportPhotos(
                selectedIds,
                destination
              );

              onClearBulkSelection();
              onDismiss();
            }}
          />
        </Flex>
      }
    >
      <Box padding={8}>
        <Flex direction="column" gap={8}>
          <Heading size="500">Exporting {selectedIds.length} photos</Heading>

          <Box>
            <Heading size="400">Export destination:</Heading>
            <Text>{destination}</Text>
          </Box>
        </Flex>
      </Box>
    </Modal>
  );
}
