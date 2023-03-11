import { Button, Flex } from 'gestalt';
import Modal from './Modal';
import ModalHeading from './ModalHeading';

export default function Delete({
  backToSelect,
  onDismiss,
}: {
  backToSelect: () => void;
  onDismiss: () => void;
}) {
  return (
    <Modal
      accessibilityModalLabel="Delete"
      heading={<ModalHeading txt="Delete" backToSelect={backToSelect} />}
      onDismiss={onDismiss}
      footer={
        <Flex direction="row" justifyContent="between">
          <Button text="Cancel" onClick={onDismiss} />
        </Flex>
      }
    >
      <h1>Delete</h1>
    </Modal>
  );
}
