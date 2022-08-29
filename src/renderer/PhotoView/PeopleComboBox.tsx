import { useEffect, useState } from 'react';
import { Box, ComboBox, IconButton, Tag } from 'gestalt';
import { ShowModalType } from 'renderer/types';
import Person from 'DataManager/PeopleManager/Person';

function makeName(person: Person) {
  return [person.firstName, person.middleName, person.lastName]
    .filter(Boolean)
    .join(' ');
}

interface Props {
  onShowModal: ShowModalType;
  people: Person[];
  selectedPeople: string[];
  setSelectedPeople: (newPeople: string[]) => void;
}

export default function PeopleComboBox({
  onShowModal,
  people,
  setSelectedPeople,
  selectedPeople,
}: Props) {
  const peopleOptions = people.map((person) => ({
    label: makeName(person),
    value: person.id,
  }));

  const [searchTerm, setSearchTerm] = useState('');

  const [suggestedOptions, setSuggestedOptions] = useState(
    peopleOptions.filter((person) => !selectedPeople.includes(person.value))
  );

  // Does this create performance issues?
  useEffect(() => {
    const newSuggested = peopleOptions.filter(
      (person) => !selectedPeople.includes(person.value)
    );
    setSuggestedOptions(newSuggested);
  }, [peopleOptions, setSuggestedOptions, selectedPeople]);

  const filterSuggested = (newPeople: string[]) => {
    setSuggestedOptions(
      peopleOptions.filter((person) => !newPeople.includes(person.value))
    );
  };

  const handleOnBlur = () => setSearchTerm('');

  const handleClear = () => {
    setSelectedPeople([]);
    setSuggestedOptions(peopleOptions);
  };

  const handleOnChange = ({ value }: { value: string }) => {
    setSearchTerm(value);

    const suggested = value
      ? suggestedOptions.filter((item) =>
          item.label.toLowerCase().includes(value.toLowerCase())
        )
      : peopleOptions.filter(
          (person) => !selectedPeople.includes(person.value)
        );

    setSuggestedOptions(suggested);
  };

  const handleOnSelect = ({
    item: { value },
  }: {
    item: { label: string; value: string };
  }) => {
    if (!selectedPeople.includes(value)) {
      const newPeople = [...selectedPeople, value];
      setSelectedPeople(newPeople);
      filterSuggested(newPeople);
      setSearchTerm('');
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
      const newPeople = [...selectedPeople.slice(0, -1)];
      setSelectedPeople(newPeople);
      filterSuggested(newPeople);
    }
  };

  const handleRemoveTag = (removedValue: string) => {
    const newPeople = selectedPeople.filter(
      (personId) => personId !== removedValue
    );
    setSelectedPeople(newPeople);
    filterSuggested(newPeople);
  };

  const selectedPeopleObjects: Person[] = [];
  selectedPeople.forEach((personId) => {
    const personData = people.find((p) => p.id === personId);

    if (personData) {
      selectedPeopleObjects.push(personData);
    }
  });

  const renderedTags = selectedPeopleObjects.map((personData) => {
    const { id: personId } = personData;
    const personName = makeName(personData);

    return (
      <Tag
        key={personId}
        onRemove={() => handleRemoveTag(personId)}
        removeIconAccessibilityLabel={`Remove ${personName}`}
        text={personName}
      />
    );
  });

  return (
    <Box display="flex" direction="row" alignItems="end">
      <Box width="100%" marginEnd={4}>
        <ComboBox
          accessibilityClearButtonLabel="Clear"
          id="peopleSelector"
          inputValue={searchTerm}
          label="People"
          noResultText="No person found"
          onBlur={handleOnBlur}
          onChange={handleOnChange}
          onClear={handleClear}
          onKeyDown={handleOnKeyDown}
          onSelect={handleOnSelect}
          options={suggestedOptions}
          tags={renderedTags}
        />
      </Box>

      <Box marginBottom={1}>
        <IconButton
          accessibilityLabel="Add a new person"
          icon="add"
          iconColor="darkGray"
          onClick={() => onShowModal('create-person')}
        />
      </Box>
    </Box>
  );
}
