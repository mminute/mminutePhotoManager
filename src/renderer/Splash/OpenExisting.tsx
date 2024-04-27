import { Box, Button } from 'gestalt';

export default function OpenExisting() {
  return (
    <Box marginBottom={2}>
      <Button
        text="Open a photo collection"
        color="blue"
        onClick={() => {
          window.electron.ipcRenderer.selectDirectory();
        }}
        fullWidth
      />
    </Box>
  );
}
