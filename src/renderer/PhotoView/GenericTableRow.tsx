import { Table, Text } from 'gestalt';

export default function GenericTableRow({
  name,
  val,
}: {
  name: string;
  val: string | number | any[];
}) {
  return (
    <Table.Row>
      <Table.Cell>
        <Text>{name}</Text>
      </Table.Cell>
      <Table.Cell>
        <Text>{Array.isArray(val) ? val.join(', ') : val}</Text>
      </Table.Cell>
    </Table.Row>
  );
}
