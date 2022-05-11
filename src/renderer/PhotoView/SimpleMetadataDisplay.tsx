import { Table } from 'gestalt';
import GenericTableRow from './GenericTableRow';
import Photo from '../../DataManager/PhotoManager/Photo';

type EntryType = [string, any];

function GenericTable({
  entries,
  title,
}: {
  entries: EntryType[];
  title: string;
}) {
  const dataElements = entries.map(([name, val]) => (
    <GenericTableRow name={name} val={val} key={name} />
  ));

  return (
    <Table accessibilityLabel={title}>
      <Table.Body>{dataElements}</Table.Body>
    </Table>
  );
}

export function ImageMetadataDisplay({ photo }: { photo: Photo }) {
  return (
    <GenericTable
      title="Image metadata"
      entries={Object.entries(photo.metadata.Image)}
    />
  );
}

export function ExifMetadataDisplay({ photo }: { photo: Photo }) {
  return (
    <GenericTable
      title="Exif metadata"
      entries={Object.entries(photo.metadata.Exif)}
    />
  );
}
