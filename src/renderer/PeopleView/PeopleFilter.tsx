import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CompositeZIndex,
  FixedZIndex,
  Flex,
  Layer,
  Modal,
  TextField,
} from 'gestalt';
import Person from 'DataManager/PeopleManager/Person';
import { GALLERY_TABS_Z_INDEX } from '../components/GalleryTabs';
import ButtonsFieldRow from '../components/ButtonsFieldRow';
import VerticalFieldSet from '../components/VerticalFieldset';

interface Props {
  children: (childArgs: {
    isFiltering: boolean;
    onOpenFilters: () => void;
    filteredPeople: Person[];
  }) => JSX.Element;
  people: Person[];
}

export default function PeopleFilter({ children, people }: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchName, setSearchName] = useState(true);
  const [searchDescriptions, setSearchDescriptions] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);

  const handleClear = () => {
    setSearchName(true);
    setSearchDescriptions(true);
    setSearchTerm('');
  };

  const handleFilter = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filtered = people.filter((person) => {
      const name = [person.firstName, person.middleName, person.lastName]
        .join(' ')
        .toLowerCase();

      if (searchName && name.match(lowerCaseSearchTerm)) {
        return true;
      }

      if (
        searchDescriptions &&
        person.description.toLowerCase().match(lowerCaseSearchTerm)
      ) {
        return true;
      }

      return false;
    });

    setFilteredPeople(filtered);
    setFiltersOpen(false);
  };

  return (
    <>
      {children({
        isFiltering: filteredPeople.length !== people.length,
        onOpenFilters: () => setFiltersOpen(true),
        filteredPeople,
      })}

      {filtersOpen && (
        <Layer
          zIndex={new CompositeZIndex([new FixedZIndex(GALLERY_TABS_Z_INDEX)])}
        >
          <Modal
            accessibilityModalLabel="Search and filter people"
            heading="Search and filter photos"
            onDismiss={() => setFiltersOpen(false)}
            size="lg"
            footer={
              <Flex direction="row" justifyContent="between">
                <Button text="Cancel" onClick={() => setFiltersOpen(false)} />

                <Flex direction="row" gap={4} justifyContent="end">
                  <Button text="Clear" onClick={handleClear} />
                  <Button color="red" onClick={handleFilter} text="Apply" />
                </Flex>
              </Flex>
            }
          >
            <Box padding={8}>
              <ButtonsFieldRow
                buttons={
                  <VerticalFieldSet legend="Search in:">
                    <Checkbox
                      id="filter-name"
                      checked={searchName}
                      label="Name"
                      onChange={({ checked }) => setSearchName(checked)}
                      size="sm"
                    />

                    <Checkbox
                      id="filter-description"
                      checked={searchDescriptions}
                      label="Description"
                      onChange={({ checked }) => setSearchDescriptions(checked)}
                      size="sm"
                    />
                  </VerticalFieldSet>
                }
                field={
                  <TextField
                    id="search-filter-text-input"
                    onChange={({ value }) => setSearchTerm(value)}
                    placeholder="Search people for..."
                    value={searchTerm}
                    label="Search for"
                  />
                }
              />
            </Box>
          </Modal>
        </Layer>
      )}
    </>
  );
}
