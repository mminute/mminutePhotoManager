import { useRef, useState } from 'react';
import { Box, Flex, IconButton, Popover, Text } from 'gestalt';

export default function FieldErrorIndicator({
  detailText,
  errorText,
}: {
  detailText: string;
  errorText: string;
}) {
  const [open, setOpen] = useState(false);
  const iconRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  return (
    <>
      <Flex direction="row" alignItems="center" gap={1}>
        <Text color="error">{errorText}</Text>

        <IconButton
          ref={iconRef}
          iconColor="white"
          bgColor="red"
          accessibilityLabel={errorText}
          icon="question-mark"
          size="xs"
          onClick={() => setOpen(!open)}
        />
      </Flex>

      {open && iconRef.current && (
        <Popover
          anchor={iconRef.current}
          color="red"
          onDismiss={() => setOpen(false)}
          size="lg"
          showCaret
        >
          <Box padding={4}>
            <Text color="light">{detailText}</Text>
          </Box>
        </Popover>
      )}
    </>
  );
}
