import { Button, Flex } from 'gestalt';
import Modal from './Modal';

export default function Delete({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Modal
      heading="Delete"
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
