import { Box, Flex, Heading, IconButton } from 'gestalt';

interface Props {
  txt: string;
  backToSelect: () => void;
}

export default function ModalHeading({ txt, backToSelect }: Props) {
  return (
    <Box padding={6}>
      <Flex gap={4} justifyContent="between">
        <Box width={40}>
          <IconButton
            accessibilityLabel="Back"
            icon="arrow-back"
            onClick={backToSelect}
          />
        </Box>
        <Heading size="500">{txt}</Heading>
        <Box width={40} />
      </Flex>
    </Box>
  );
}
