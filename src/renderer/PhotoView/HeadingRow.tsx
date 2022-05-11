import { Table, Text } from 'gestalt';

export default function HeadingRow({
  children,
  title,
}: {
  // eslint-disable-next-line react/require-default-props
  children?: any;
  title: string;
}) {
  return (
    <Table.Row>
      <Table.Cell>
        <Text weight="bold">{title}</Text>
      </Table.Cell>
      {children ? <Table.Cell>{children}</Table.Cell> : <Table.Cell />}
      <Table.Cell />
    </Table.Row>
  );
}
