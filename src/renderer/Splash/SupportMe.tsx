import { Box, Link, Text } from 'gestalt';

export default function SupportMe() {
  return (
    <Box
      direction="row"
      display="flex"
      justifyContent="center"
      paddingX={12}
      paddingY={4}
      marginBottom={2}
    >
      <Text size="200">
        Consider supporting Minute Photo Manager. Buy me a{' '}
        <Text inline size="200" weight="bold" color="error">
          <Link
            accessibilityLabel="https://ko-fi.com/mminute"
            href="https://ko-fi.com/mminute"
            inline
            target="blank"
          >
            coffee!
          </Link>
        </Text>
      </Text>
    </Box>
  );
}
