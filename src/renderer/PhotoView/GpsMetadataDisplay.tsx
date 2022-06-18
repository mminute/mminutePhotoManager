import { useState } from 'react';
import { Button, Flex, Icon, Link, Table, Text } from 'gestalt';
import Photo from '../../DataManager/PhotoManager/Photo';
import { Speeds } from '../../DataManager/PhotoManager/types/GpsMetadata';
import HeadingRow from './HeadingRow';
import GenericTableRow from './GenericTableRow';

function speedAbbrevToText(abbrev: Speeds) {
  switch (abbrev) {
    case 'K':
      return 'kph';
    case 'M':
      return 'mph';
    case 'N':
      return 'kph';
    default:
      return 'kt';
  }
}

function getGoogleMapsUrl({
  decimalLatitude,
  decimalLongitude,
}: {
  decimalLatitude: number;
  decimalLongitude: number;
}): string {
  return `https://www.google.com/maps?q=${decimalLatitude},${decimalLongitude}`;
}

export default function GpsMetadataDisplay({ photo }: { photo: Photo }) {
  const { parsed, raw } = photo.metadata.GPS;
  const [expanded, setExpanded] = useState(false);

  const hasSomeParsedData = Object.keys(parsed)
    .map((k) => parsed[k] !== null)
    .includes(true);

  return (
    <Table accessibilityLabel="GPS metadata">
      <Table.Body>
        {hasSomeParsedData && (
          <HeadingRow title="Parsed GPS data">
            {parsed.latitude !== null && parsed.longitude !== null && (
              <Link
                href={getGoogleMapsUrl({
                  decimalLatitude: parsed.latitude,
                  decimalLongitude: parsed.longitude,
                })}
                target="blank"
                rel="nofollow"
              >
                <Flex direction="row" gap={2} alignItems="center">
                  <Text inline>Google maps</Text>

                  <Icon
                    accessibilityLabel="visit"
                    icon="visit"
                    color="darkGray"
                  />
                </Flex>
              </Link>
            )}
          </HeadingRow>
        )}

        {parsed.latitude !== null && (
          <GenericTableRow name="Latitude (N+/S-)" val={parsed.latitude} />
        )}

        {parsed.longitude !== null && (
          <GenericTableRow name="Longitude (E+/W-)" val={parsed.longitude} />
        )}

        {parsed.altitude !== null && (
          <GenericTableRow name="Altitude (m)" val={parsed.altitude} />
        )}

        {parsed.direction !== null && (
          <>
            {parsed.direction.cardinal && (
              <GenericTableRow
                name="Cardinal direction"
                val={parsed.direction.cardinal}
              />
            )}

            {parsed.direction.degrees && (
              <GenericTableRow name="Heading" val={parsed.direction.degrees} />
            )}

            {parsed.direction.reference && (
              <GenericTableRow
                name="Reference"
                val={parsed.direction.reference}
              />
            )}
          </>
        )}

        {parsed.speed && (
          <GenericTableRow
            name="Speed"
            val={`${parsed.speed.speed.toFixed(2)} ${speedAbbrevToText(
              parsed.speed.units
            )}`}
          />
        )}

        {Object.keys(raw).length && (
          <HeadingRow title="Raw GPS data">
            {!expanded && (
              <Button text="Show" onClick={() => setExpanded(true)} />
            )}
          </HeadingRow>
        )}

        {expanded &&
          Object.entries(raw).map(([name, val]) => (
            <GenericTableRow name={name} val={val} key={name} />
          ))}
      </Table.Body>
    </Table>
  );
}
