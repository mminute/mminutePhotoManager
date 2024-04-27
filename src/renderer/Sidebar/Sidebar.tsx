import './Sidebar.css';
import { Box, Flex, Text } from 'gestalt';
import { useLocation } from 'react-router-dom';
import FileTree from 'renderer/FileTree/FileTree';
import { DirectoryData } from 'renderer/utils/buildFileTree';
import getParentPath from 'renderer/utils/getParentPath';
import { CollapsedSidebarRoutes } from '../routePaths';

interface Props {
  activePath: string;
  currentDirectory: string;
  fileTree: DirectoryData[];
  lastUpdated: number | null;
  unannotatedCount: number;
  updateActivePath: (newPath: string) => void;
}

export default function Sidebar({
  activePath,
  currentDirectory,
  fileTree,
  lastUpdated,
  unannotatedCount,
  updateActivePath,
}: Props) {
  const { pathname } = useLocation();
  const left = CollapsedSidebarRoutes.includes(pathname) ? -190 : 0;
  const parentPath = getParentPath(currentDirectory);

  return (
    <div className="sidebar sidebar-transition" style={{ left: `${left}px` }}>
      <Flex direction="column" height="100vh">
        {lastUpdated !== null && (
          <Box marginBottom={2} paddingX={2}>
            <Text size="100">Last updated:</Text>
            <Text size="100">{`${new Date(
              lastUpdated
            ).toLocaleString()}`}</Text>
          </Box>
        )}

        {unannotatedCount > 0 && (
          <Box marginBottom={2} paddingX={2}>
            <Text size="100">{`Unannotated: ${unannotatedCount} photos`}</Text>
          </Box>
        )}

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
