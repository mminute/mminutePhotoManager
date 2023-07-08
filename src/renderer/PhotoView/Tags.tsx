import { ReactElement, useState } from 'react';
import { ComboBox, Tag } from 'gestalt';
import FieldErrorIndicator from './FieldErrorIndicator';

interface Props {
  helperText: string;
  inputId: string;
  inputLabel: string;
  noResultText: string;
  options: { label: string; value: string }[];
  setTagsError: (newTagError: string[]) => void;
  setTags: (newTags: string[]) => void;
  tagsError: string[];
  tags: string[];
  resetTagsError: () => void;
}

export default function Tags({
  helperText,
  inputId,
  inputLabel,
  noResultText,
  options,
  setTagsError,
  setTags,
  tagsError,
  tags,
  resetTagsError,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const [suggestedOptions, setSuggestedOptions] = useState(
    options.filter((tagTerm) => !tags.includes(tagTerm.value))
  );

  const filterSuggested = (newTags: string[]) => {
    setSuggestedOptions(
      options.filter((tagTerm) => !newTags.includes(tagTerm.label))
    );
  };

  const handleOnBlur = () => setSearchTerm('');

  const handleClear = () => {
    setTags([]);
    setSuggestedOptions(options);
    resetTagsError();
  };

  const handleOnChange = ({ value }: { value: string }) => {
    setSearchTerm(value);

    const suggested = value
      ? suggestedOptions.filter((item) =>
          item.label.toLowerCase().includes(value.toLowerCase())
        )
      : options.filter((option) => !tags.includes(option.value));

    setSuggestedOptions(suggested);
  };

  const handleOnSelect = ({
    item: { label },
  }: {
    item: { label: string; value: string };
  }) => {
    if (!tags.includes(label)) {
      const newTags = [...tags, label];
      setTags(newTags);
      filterSuggested(newTags);
      setSearchTerm('');
      setTagsError([]);
    }
  };

  const handleOnKeyDown = ({
    event: {
      keyCode,
      target: { selectionEnd },
    },
  }: {
    event: any;
  }) => {
    if (keyCode === 8 /* Backspace */ && selectionEnd === 0) {
      // Remove tag on backspace if the cursor is at the beginning of the field
      const newTags = [...tags.slice(0, -1)];
      setTags(newTags);
      filterSuggested(newTags);

      if (!newTags.length) {
        resetTagsError();
      }
    } else if (keyCode === 9) {
      // Tab
      if (searchTerm && !tags.includes(searchTerm)) {
        const newTags = [...tags, searchTerm];
        setTags(newTags);
        filterSuggested(newTags);
        setTagsError([]);
      }
    }
  };

  const handleRemoveTag = (removedValue: string) => {
    const newTags = tags.filter((tagValue) => tagValue !== removedValue);
    setTags(newTags);
    filterSuggested(newTags);

    if (!newTags.length) {
      resetTagsError();
    }
  };

  const renderedTags = tags.map((tagTerm) => (
    <Tag
      key={tagTerm}
      onRemove={() => handleRemoveTag(tagTerm)}
      removeIconAccessibilityLabel={`Remove ${tagTerm}`}
      text={tagTerm}
    />
  ));

  const errorMessage = tagsError.length ? (
    <FieldErrorIndicator
      detailText={`Tags found: ${tagsError.join(', ')}`}
      errorText="Incompatible tag lists found"
    />
  ) : undefined;

  return (
    <ComboBox
      accessibilityClearButtonLabel="Clear"
      helperText={helperText}
      id={inputId}
      inputValue={searchTerm}
      label={inputLabel}
      noResultText={noResultText}
      onBlur={handleOnBlur}
      onChange={handleOnChange}
      onClear={handleClear}
      onKeyDown={handleOnKeyDown}
      onSelect={handleOnSelect}
      options={suggestedOptions}
      tags={renderedTags}
      errorMessage={errorMessage}
    />
  );
}
