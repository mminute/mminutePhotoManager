import { ReactElement } from 'react';
import { Box, Column } from 'gestalt';

export default function ButtonsFieldRow({
  buttons,
  field,
}: {
  buttons: ReactElement;
  field: ReactElement | null;
}) {
  return (
    <Box display="flex" direction="row">
      <Column span={2}>{buttons}</Column>

      {field && <Column span={10}>{field}</Column>}
    </Box>
  );
}
