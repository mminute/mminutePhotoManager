import { DirectoryData } from 'renderer/utils/buildFileTree';
import { Box, Flex, Icon, TapArea, Text } from 'gestalt';

interface Props {
  activePath: string;
  data: DirectoryData[];
  parentPath: string;
  updateActivePath: (newPath: string) => void;
}

export default function FileTree({
  activePath,
  data,
  parentPath,
  updateActivePath,
}: Props) {
  return (
    <>
      {data.map((node) => (
        <Box key={node.name} marginTop={2}>
          <TapArea onTap={() => updateActivePath(parentPath + node.name)}>
            <Flex direction="row" gap={1}>
              <Icon
                accessibilityLabel={`${node.name} folder`}
                color={
                  parentPath + node.name === activePath ? 'blue' : 'darkGray'
                }
                icon="folder"
              />
              <Text size="200">{node.name}</Text>
            </Flex>
          </TapArea>

          {node.children.length ? (
            <Box marginStart={4}>
              <FileTree
                activePath={activePath}
                data={node.children}
                parentPath={`${parentPath}${node.name}/`}
                updateActivePath={updateActivePath}
              />
            </Box>
          ) : null}
        </Box>
      ))}
    </>
  );
}
