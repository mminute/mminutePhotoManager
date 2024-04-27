import { Box, Button, Divider, Flex, SelectList } from 'gestalt';

const PATH_CHARACTER_LIMIT = 36;

function makeSelectListOptions(filepaths: Array<string>) {
  return filepaths.map((filepath) => {
    // TODO: Handle both linux and Windows filepaths
    const pathParts = filepath.split(/\//).filter(Boolean);

    let label = '';
    for (let i = pathParts.length - 1; i >= 0; i -= 1) {
      const newSegment = `/${pathParts[i]}`;
      if (label.length + newSegment.length < PATH_CHARACTER_LIMIT) {
        label = newSegment + label;
      } else {
        label = `...${label}`;
        break;
      }
    }

    return { label, value: filepath };
  });
}

interface Props {
  onSelect: (filepath: string) => void;
  recentDirectories: string[];
  selectedRecentDirectory: string;
}

export default function OpenExisting({
  onSelect,
  recentDirectories,
  selectedRecentDirectory,
}: Props) {
  const list =
    recentDirectories.length > 0 ? (
      <Box display="flex" direction="row" alignItems="end">
        <Box width="100%">
          <SelectList
            id="recent-directories"
            label="Recently opened"
            options={makeSelectListOptions(recentDirectories)}
            onChange={({ value }) => onSelect(value)}
            value={selectedRecentDirectory}
          />
        </Box>

        <Box marginStart={4}>
          <Button
            text="Open"
            color="blue"
            onClick={() =>
              window.electron.ipcRenderer.openRecentDirectory(
                selectedRecentDirectory || recentDirectories[0]
              )
            }
          />
        </Box>
      </Box>
    ) : null;

  return (
    <Flex direction="column" gap={4}>
      {list}
      {list && <Divider />}
    </Flex>
  );
}
