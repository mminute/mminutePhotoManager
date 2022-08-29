import { useState } from 'react';
import { ComboBox } from 'gestalt';

interface Props {
  controlledSelect?: boolean;
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
}

export default function GenericComboBox({
  controlledSelect,
  id,
  label,
  noResultText,
  searchTerm,
  setSearchTerm,
  options,
  placeholder,
  selectedOption,
  onSelect,
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
      placeholder={placeholder}
      id={id}
      inputValue={searchTerm}
      label={label}
      noResultText={noResultText}
      onChange={handleOnChange}
      onClear={handleClear}
      onSelect={handleOnSelect}
      options={suggestedOptions}
      selectedOption={selectedOption}
    />
  );
}

GenericComboBox.defaultProps = { controlledSelect: false };
