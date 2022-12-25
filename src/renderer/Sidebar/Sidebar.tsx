import './Sidebar.css';
import { Box, Button, Flex } from 'gestalt';
import { useLocation } from 'react-router-dom';
import FileTree from 'renderer/FileTree/FileTree';
import { DirectoryData } from 'renderer/utils/buildFileTree';
import getParentPath from 'renderer/utils/getParentPath';
import { CollapsedSidebarRoutes } from '../routePaths';

interface Props {
  activePath: string;
  currentDirectory: string;
  fileTree: DirectoryData[];
  updateActivePath: (newPath: string) => void;
}

export default function Sidebar({
  activePath,
  currentDirectory,
  fileTree,
  updateActivePath,
}: Props) {
  const { pathname } = useLocation();
  const left = CollapsedSidebarRoutes.includes(pathname) ? -190 : 0;
  const parentPath = getParentPath(currentDirectory);

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

        <Box marginStart={4}>
          <FileTree
            activePath={activePath}
            data={fileTree}
            parentPath={parentPath}
            updateActivePath={updateActivePath}
          />
        </Box>
      </Flex>
    </div>
  );
}
