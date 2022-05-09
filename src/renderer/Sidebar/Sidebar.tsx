import './Sidebar.css';
import { Button, Flex } from 'gestalt';

export default function Sidebar() {
  return (
    <div className="sidebar sidebar-transition">
      <Flex direction="column" height="100vh">
        <Button
          color="red"
          text="Save"
          size="sm"
          fullWidth
          onClick={() => {
            window.electron.ipcRenderer.savePhotoManager();
          }}
        />
      </Flex>
    </div>
  );
}
