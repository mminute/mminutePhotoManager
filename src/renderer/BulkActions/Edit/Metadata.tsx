import { Box, Button, Fieldset, Flex, Heading, Text } from 'gestalt';
import { useState } from 'react';
import RadioButton from 'renderer/RadioButton';

interface Props {
  bulkSelections: string[];
}

export type LocationType = 'image-files-only' | 'image-files-and-database';

interface RadioButtonData {
  label: string;
  value: LocationType;
}

export default function Metadata({ bulkSelections }: Props) {
  const [locationsToScrub, setLocationsToScrub] =
    useState<LocationType>('image-files-only');

  const radioButtonData: RadioButtonData[] = [
    { label: 'Image files only', value: 'image-files-only' },
    {
      label: 'Image files and database',
      value: 'image-files-and-database',
    },
  ];

  return (
    <Box padding={8}>
      <Flex direction="column" gap={2} alignItems="center">
        <Heading color="error">Warning</Heading>
        <Text weight="bold" italic>
          This action cannot be undone
        </Text>

        <Box paddingY={4}>
          <Flex direction="column" gap={6} alignItems="center">
            <Text align="center">
              Image files often contain EXIF data. This data may include
              information like camera settings, date, time, and location
              information. Once removed this information cannot be recovered
            </Text>

            <Box paddingY={4}>
              <Fieldset legend="Data locations to scrub">
                <Flex gap={4}>
                  {radioButtonData.map(({ label, value }) => (
                    <RadioButton
                      key={value}
                      checked={locationsToScrub === value}
                      label={label}
                      onChange={() => setLocationsToScrub(value)}
                      value={value}
                    />
                  ))}
                </Flex>
              </Fieldset>
            </Box>

            <Button
              text="Delete EXIF data"
              onClick={() =>
                window.electron.ipcRenderer.scrubExifData(
                  bulkSelections,
                  locationsToScrub
                )
              }
            />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
