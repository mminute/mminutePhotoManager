import { useState } from 'react';
import { Box, Button, Column, Flex, Modal, SelectList } from 'gestalt';
import Edit from './Edit/Edit';

function Footer({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Flex direction="row" justifyContent="between">
      <Button text="Cancel" onClick={onDismiss} />
    </Flex>
  );
}

function Select({ onSelect }: { onSelect: (action: string) => void }) {
  const placeholderText = 'Select an action';

  return (
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
  );
}

function getHeading(action: string) {
  switch (action) {
    case 'select':
      return 'Select an action';
    case 'edit':
      return 'Edit photos';
    case 'export':
      return 'Export';
    case 'move':
      return 'Move';
    case 'delete':
      return 'Delete';
    default:
      return 'Something went wrong';
  }
}

interface Props {
  bulkSelections: string[];
  onDismiss: () => void;
}

export default function BulkActionsModal({ bulkSelections, onDismiss }: Props) {
  const [action, setAction] = useState('select');

  const headingText = getHeading(action);

  return (
    <Modal
      accessibilityModalLabel={headingText}
      onDismiss={onDismiss}
      heading={headingText}
      footer={<Footer onDismiss={onDismiss} />}
      size="lg"
    >
      <Box paddingX={8} paddingY={4} minHeight="400px">
        {action === 'select' && (
          <Select onSelect={(newAction) => setAction(newAction)} />
        )}

        {action === 'edit' && <Edit bulkSelections={bulkSelections} />}

        {action === 'export' && 'Export here'}

        {action === 'move' && 'Move here'}

        {action === 'delete' && 'Delete here'}
      </Box>
    </Modal>
  );
}
