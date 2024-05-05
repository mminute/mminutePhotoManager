import './Sidebar.css';
import { useRef } from 'react';
import { Box, Flex, IconButton, Text } from 'gestalt';
import { useLocation } from 'react-router-dom';
import FileTree from 'renderer/FileTree/FileTree';
import { DirectoryData } from 'renderer/utils/buildFileTree';
import getParentPath from 'renderer/utils/getParentPath';
import { CollapsedSidebarRoutes } from '../routePaths';

interface Props {
  activePath: string;
  collectionNotes: string | null;
  currentDirectory: string;
  fileTree: DirectoryData[];
  lastUpdated: number | null;
  onEditNotes: () => void;
  unannotatedCount: number;
  updateActivePath: (newPath: string) => void;
}

export default function Sidebar({
  activePath,
  collectionNotes,
  currentDirectory,
  fileTree,
  lastUpdated,
  onEditNotes,
  unannotatedCount,
  updateActivePath,
}: Props) {
  const { pathname } = useLocation();
  const anchorRef = useRef(null);
  const left = CollapsedSidebarRoutes.includes(pathname) ? -190 : 0;
  const parentPath = getParentPath(currentDirectory);
  const notesButtonText = collectionNotes ? 'Edit notes' : 'Add notes';

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

        {collectionNotes !== null && (
          <Box marginStart={4}>
            <Flex direction="row" gap={4} alignItems="center">
              <Text size="100" weight="bold">
                {collectionNotes
                  ? `${collectionNotes.slice(0, 12)}...`
                  : 'Add notes'}
              </Text>
              <IconButton
                ref={anchorRef}
                accessibilityLabel={notesButtonText}
                bgColor="lightGray"
                icon={collectionNotes ? 'edit' : 'add'}
                iconColor="darkGray"
                onClick={onEditNotes}
                size="sm"
                tooltip={{
                  idealDirection: 'up',
                  inline: true,
                  text: notesButtonText,
                }}
              />
            </Flex>
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
