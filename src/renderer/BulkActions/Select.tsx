import { Button, Column, Flex, SelectList } from 'gestalt';
import Modal from './Modal';

export default function Select({
  onDismiss,
  onSelect,
}: {
  onDismiss: () => void;
  onSelect: (action: string) => void;
}) {
  const placeholderText = 'Select an action';

  return (
    <Modal
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
          <SelectList
            id="bulkActionSelector"
            onChange={({ value }) => {
              if (value !== placeholderText) {
                // For some reason `onChange` is getting called a second time
                // with the placeholder string
                onSelect(value);
              }
            }}
            size="lg"
            placeholder={placeholderText}
            label={placeholderText}
            labelDisplay="hidden"
            options={[
              { label: 'Edit', value: 'edit' },
              { label: 'Export', value: 'export' },
              { label: 'Move', value: 'move' },
              { label: 'Delete', value: 'delete' },
            ]}
          />
        </Column>
      </Flex>
    </Modal>
  );
}
