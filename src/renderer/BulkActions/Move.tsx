import { Button, Flex } from 'gestalt';
import Modal from './Modal';
import ModalHeading from './ModalHeading';

export default function Move({
  backToSelect,
  onDismiss,
}: {
  backToSelect: () => void;
  onDismiss: () => void;
}) {
  return (
    <Modal
      accessibilityModalLabel="Move"
      heading={<ModalHeading txt="Move" backToSelect={backToSelect} />}
      onDismiss={onDismiss}
      footer={
        <Flex direction="row" justifyContent="between">
          <Button text="Cancel" onClick={onDismiss} />
        </Flex>
      }
    >
      <h1>Move</h1>
    </Modal>
  );
}
