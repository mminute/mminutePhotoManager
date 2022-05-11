import './Sidebar.css';
import { Button, Flex } from 'gestalt';
import { useLocation } from 'react-router-dom';
import { CollapsedSidebarRoutes } from '../routePaths';

export default function Sidebar() {
  const { pathname } = useLocation();
  const left = CollapsedSidebarRoutes.includes(pathname) ? -190 : 0;

  return (
    <div className="sidebar sidebar-transition" style={{ left: `${left}px` }}>
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
