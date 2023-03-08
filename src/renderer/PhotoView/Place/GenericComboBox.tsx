import { ComboBox } from 'gestalt';

interface Props {
  controlledSelect?: boolean;
  disabled?: boolean;
  id: string;
  label: string;
  noResultText: string;
  searchTerm: string;
  setSearchTerm: (newVal: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  selectedOption: { label: string; value: string } | undefined;
  onSelect: (
    newSelection: { label: string; value: string } | undefined
  ) => void;
  errorMessage?: JSX.Element | undefined;
}

export default function GenericComboBox({
  controlledSelect,
  disabled,
  errorMessage,
  id,
  label,
  noResultText,
  onSelect,
  options,
  placeholder,
  searchTerm,
  selectedOption,
  setSearchTerm,
}: Props) {
  const suggestedOptions = searchTerm
    ? options.filter((option) =>
        option.label.toLowerCase().match(searchTerm.toLowerCase().trim())
      )
    : options;

  const handleOnChange = ({ value }: { value: string }) => {
    setSearchTerm(value);
    onSelect(undefined);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSelect(undefined);
  };

  const handleOnSelect = ({
    item,
  }: {
    item: { label: string; value: string };
  }) => {
    onSelect(item);

    if (!controlledSelect) {
      setSearchTerm(item.label);
    }
  };

  return (
    <ComboBox
      accessibilityClearButtonLabel="Clear"
      disabled={disabled}
      id={id}
      inputValue={searchTerm}
      label={label}
      noResultText={noResultText}
      onChange={handleOnChange}
      onClear={handleClear}
      onSelect={handleOnSelect}
      options={suggestedOptions}
      placeholder={placeholder}
      selectedOption={selectedOption}
      errorMessage={errorMessage}
    />
  );
}

GenericComboBox.defaultProps = {
  controlledSelect: false,
  disabled: false,
  errorMessage: null,
};
