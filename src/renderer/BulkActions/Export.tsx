import { Button, Flex } from 'gestalt';
import Modal from './Modal';
import ModalHeading from './ModalHeading';

export default function Export({
  backToSelect,
  onDismiss,
}: {
  backToSelect: () => void;
  onDismiss: () => void;
}) {
  return (
    <Modal
      accessibilityModalLabel="Export"
      heading={<ModalHeading txt="Export" backToSelect={backToSelect} />}
      onDismiss={onDismiss}
      footer={
        <Flex direction="row" justifyContent="between">
          <Button text="Cancel" onClick={onDismiss} />
        </Flex>
      }
    >
      <h1>Export</h1>
    </Modal>
  );
}
