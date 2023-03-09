import { Button, Flex } from 'gestalt';
import Modal from './Modal';

export default function Export({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Modal
      heading="Export"
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
