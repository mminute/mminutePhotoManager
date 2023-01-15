import { Box, SegmentedControl } from 'gestalt';
import { useState } from 'react';
import Annotations from './Annotations';
import Metadata from './Metadata';

interface Props {
  bulkSelections: string[];
}

const sections = ['Annotations', 'Metadata'];

export default function Edit({ bulkSelections }: Props) {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  return (
    <Box>
      <SegmentedControl
        items={sections}
        onChange={({ activeIndex }) => setActiveSegmentIndex(activeIndex)}
        selectedItemIndex={activeSegmentIndex}
      />

      {sections[activeSegmentIndex] === 'Annotations' && <Annotations />}

      {sections[activeSegmentIndex] === 'Metadata' && (
        <Metadata bulkSelections={bulkSelections} />
      )}
    </Box>
  );
}
