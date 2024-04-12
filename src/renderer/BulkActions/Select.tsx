import { Button, Column, Flex } from 'gestalt';
import Modal from './Modal';
import { Actions } from './BulkActionTypes';

export default function Select({
  onDismiss,
  onSelect,
}: {
  onDismiss: () => void;
  onSelect: (action: Actions) => void;
}) {
  return (
    <Modal
      accessibilityModalLabel="Select an action"
      heading="Select an action"
      onDismiss={onDismiss}
      footer={
        <Flex direction="row" justifyContent="between">
          <Button text="Cancel" onClick={onDismiss} />
        </Flex>
      }
    >
      <Flex direction="row" justifyContent="center">
        <Column span={4}>
          <Flex direction="column" gap={4}>
            {[
              { label: 'Edit', value: 'edit' },
              { label: 'Export', value: 'export' },
              { label: 'Move', value: 'move' },
              { label: 'Delete', value: 'delete' },
            ].map((b) => (
              <Button
                key={b.value}
                color="blue"
                text={b.label}
                onClick={() => {
                  if (b.value === 'export') {
                    window.electron.ipcRenderer.selectExportDirectory();
                  } else {
                    onSelect(b.value);
                  }
                }}
                fullWidth
              />
            ))}
          </Flex>
        </Column>
      </Flex>
    </Modal>
  );
}
