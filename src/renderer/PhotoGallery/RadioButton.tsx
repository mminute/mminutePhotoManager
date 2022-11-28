import { RadioButton as GestaltRadioButton } from 'gestalt';

interface Props {
  checked: boolean;
  label: string;
  onChange: () => void;
  value: string;
}

export default function RadioButton({
  checked,
  label,
  onChange,
  value,
}: Props) {
  return (
    <GestaltRadioButton
      id={value}
      checked={checked}
      label={label}
      onChange={onChange}
      size="sm"
      value={value}
    />
  );
}
