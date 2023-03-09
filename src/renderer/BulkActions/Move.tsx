import { Button, Flex } from 'gestalt';
import Modal from './Modal';

export default function Move({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Modal
      heading="Move"
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
