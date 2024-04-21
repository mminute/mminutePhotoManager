import { ReactElement } from 'react';
import { Fieldset, Flex } from 'gestalt';

interface Props {
  children: ReactElement[];
  legend: string;
}

export default function VerticalFieldSet({ children, legend }: Props) {
  return (
    <Fieldset legend={legend}>
      <Flex direction="column" gap={4}>
        {children}
      </Flex>
    </Fieldset>
  );
}
