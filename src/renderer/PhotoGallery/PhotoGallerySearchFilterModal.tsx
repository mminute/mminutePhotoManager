import { ReactElement } from 'react';
import DatePicker from 'gestalt-datepicker';
import {
  Box,
  Button,
  Checkbox,
  Column,
  ComboBox,
  CompositeZIndex,
  Divider,
  FixedZIndex,
  Flex,
  Layer,
  Modal,
  SelectList,
  TextField,
} from 'gestalt';
import { MaybeString } from 'DataManager/DataManager';
import { GALLERY_TABS_Z_INDEX } from '../GalleryTabs';
import VerticalFieldSet from './VerticalFieldset';
import RadioButton from '../RadioButton';

/*
  Note on <ComboBox />:
  It looks like <ComboBox />'s input value does not do anything,
  but without it the options list does not update correctly
  after an option is selected
*/

const NoneLabel = { label: 'None', value: '' };

function ButtonsFieldRow({
  buttons,
  field,
}: {
  buttons: ReactElement;
  field: ReactElement | null;
}) {
  return (
    <Box display="flex" direction="row">
      <Column span={2}>{buttons}</Column>

      {field && <Column span={10}>{field}</Column>}
    </Box>
  );
}

function PaddedDivider() {
  return (
    <Box paddingY={6}>
      <Divider />
    </Box>
  );
}

export type AnyAll = 'any' | 'all';
export type OnBetween = 'on' | 'between';
type Labels = { label: string; value: string };
type PlaceLabel = {
  label: string;
  value: string;
  name: string;
  countryCode: MaybeString;
  stateProvince: MaybeString;
  city: MaybeString;
};
export type AnnotationStatus = 'all' | 'annotated' | 'unannotated';

interface Props {
  annotationStatus: AnnotationStatus;
  cityOptions: Labels[];
  countryOptions: Labels[];
  dateMode: OnBetween;
  endDate: Date | undefined;
  handleClear: () => void;
  handleDismiss: () => void;
  handleFilter: () => void;
  peopleMode: AnyAll;
  peopleWithLabels: Labels[];
  placesWithLabels: PlaceLabel[];
  renderedPeopleTags: JSX.Element[];
  renderedPlaceTags: JSX.Element[];
  renderedTagTags: JSX.Element[];
  searchDescriptions: boolean;
  searchTerm: string;
  searchTitles: boolean;
  selectedCity: string | undefined;
  selectedCountry: string | undefined;
  selectedState: string | undefined;
  setAnnotationStatus: (status: AnnotationStatus) => void;
  setDateMode: (mode: OnBetween) => void;
  setEndDate: (value: React.SetStateAction<Date | undefined>) => void;
  setFiltersOpen: (open: boolean) => void;
  setPeopleMode: (mode: AnyAll) => void;
  setSearchDescriptions: (searchDescriptions: boolean) => void;
  setSearchTerm: (searchTerm: string) => void;
  setSearchTitles: (searchTitles: boolean) => void;
  setSelectedCity: (value: React.SetStateAction<string | undefined>) => void;
  setSelectedCountry: (value: React.SetStateAction<string | undefined>) => void;
  setSelectedPeopleIds: (value: React.SetStateAction<string[]>) => void;
  setSelectedPlaces: (value: React.SetStateAction<string[]>) => void;
  setSelectedState: (value: React.SetStateAction<string | undefined>) => void;
  setSelectedTags: (value: React.SetStateAction<string[]>) => void;
  setStartDate: (value: React.SetStateAction<Date | undefined>) => void;
  setTagMode: (mode: AnyAll) => void;
  startDate: Date | undefined;
  stateOptions: Labels[];
  tagMode: AnyAll;
  tagsWithLabels: Labels[];
}

export default function PhotoGallerySearchFilterModal({
  annotationStatus,
  cityOptions,
  countryOptions,
  dateMode,
  endDate,
  handleClear,
  handleDismiss,
  handleFilter,
  peopleMode,
  peopleWithLabels,
  placesWithLabels,
  renderedPeopleTags,
  renderedPlaceTags,
  renderedTagTags,
  searchDescriptions,
  searchTerm,
  searchTitles,
  selectedCity,
  selectedCountry,
  selectedState,
  setAnnotationStatus,
  setDateMode,
  setEndDate,
  setFiltersOpen,
  setPeopleMode,
  setSearchDescriptions,
  setSearchTerm,
  setSearchTitles,
  setSelectedCity,
  setSelectedCountry,
  setSelectedPeopleIds,
  setSelectedPlaces,
  setSelectedState,
  setSelectedTags,
  setStartDate,
  setTagMode,
  startDate,
  stateOptions,
  tagMode,
  tagsWithLabels,
}: Props) {
  const disableCountryStateCity = !!renderedPlaceTags.length;

  return (
    <Layer
      zIndex={new CompositeZIndex([new FixedZIndex(GALLERY_TABS_Z_INDEX)])}
    >
      <Modal
        accessibilityModalLabel="Search and filter photos"
        heading="Search and filter photos"
        onDismiss={() => setFiltersOpen(false)}
        size="lg"
        footer={
          <Flex direction="row" justifyContent="between">
            <Button text="Cancel" onClick={handleDismiss} />

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
              <VerticalFieldSet legend="Annotation status:">
                <RadioButton
                  checked={annotationStatus === 'all'}
                  label="All"
                  onChange={() => setAnnotationStatus('all')}
                  value="all"
                />

                <RadioButton
                  checked={annotationStatus === 'unannotated'}
                  label="Unannotated"
                  onChange={() => setAnnotationStatus('unannotated')}
                  value="unannotated"
                />

                <RadioButton
                  checked={annotationStatus === 'annotated'}
                  label="Annotated"
                  onChange={() => setAnnotationStatus('annotated')}
                  value="annotated"
                />
              </VerticalFieldSet>
            }
            field={null}
          />

          <PaddedDivider />

          <ButtonsFieldRow
            buttons={
              <VerticalFieldSet legend="Search in:">
                <Checkbox
                  id="filter-title"
                  checked={searchTitles}
                  label="Title"
                  onChange={({ checked }) => setSearchTitles(checked)}
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
                placeholder="Search photos for..."
                value={searchTerm}
                label="Search for"
              />
            }
          />

          <PaddedDivider />

          <ButtonsFieldRow
            buttons={
              <VerticalFieldSet legend="Includes:">
                <RadioButton
                  checked={tagMode === 'any'}
                  label="Any"
                  onChange={() => setTagMode('any')}
                  value="tags-any"
                />

                <RadioButton
                  checked={tagMode === 'all'}
                  label="All"
                  onChange={() => setTagMode('all')}
                  value="tags-all"
                />
              </VerticalFieldSet>
            }
            field={
              <ComboBox
                accessibilityClearButtonLabel="Clear"
                id="tags-filter-selector"
                label="Tags"
                noResultText="No tag found"
                onClear={() => setSelectedTags([])}
                onSelect={({ item }) =>
                  setSelectedTags((prevState) => [...prevState, item.value])
                }
                options={tagsWithLabels}
                tags={renderedTagTags}
                inputValue=""
              />
            }
          />

          <PaddedDivider />

          <ButtonsFieldRow
            buttons={
              <VerticalFieldSet legend="Includes:">
                <RadioButton
                  checked={peopleMode === 'any'}
                  label="Any"
                  onChange={() => setPeopleMode('any')}
                  value="people-any"
                />

                <RadioButton
                  checked={peopleMode === 'all'}
                  label="All"
                  onChange={() => setPeopleMode('all')}
                  value="people-all"
                />
              </VerticalFieldSet>
            }
            field={
              <ComboBox
                accessibilityClearButtonLabel="Clear"
                id="people-filter-selector"
                label="People"
                noResultText="No person found"
                onClear={() => setSelectedPeopleIds([])}
                onSelect={({ item }) =>
                  setSelectedPeopleIds((prevState) => [
                    ...prevState,
                    item.value,
                  ])
                }
                options={peopleWithLabels}
                tags={renderedPeopleTags}
                inputValue=""
              />
            }
          />

          <PaddedDivider />

          <ButtonsFieldRow
            buttons={
              <VerticalFieldSet legend="Date:">
                <RadioButton
                  checked={dateMode === 'on'}
                  label="On"
                  onChange={() => setDateMode('on')}
                  value="date-on"
                />

                <RadioButton
                  checked={dateMode === 'between'}
                  label="Between"
                  onChange={() => setDateMode('between')}
                  value="date-between"
                />
              </VerticalFieldSet>
            }
            field={
              <Flex direction="row" gap={12}>
                <DatePicker
                  id="startDate"
                  onChange={({ value }) => setStartDate(value)}
                  label={
                    dateMode === 'between' ? 'Start date' : 'Selected date'
                  }
                  value={startDate}
                />

                {dateMode === 'between' && (
                  <DatePicker
                    id="endDate"
                    onChange={({ value }) => setEndDate(value)}
                    label="End date"
                    value={endDate}
                  />
                )}
              </Flex>
            }
          />

          <PaddedDivider />

          <ComboBox
            accessibilityClearButtonLabel="Clear"
            id="place-filter-selector"
            label="Places"
            noResultText="No place found"
            onClear={() => setSelectedPlaces([])}
            onSelect={({ item }) => {
              setSelectedPlaces((prevState) => [...prevState, item.value]);
              setSelectedCountry(undefined);
              setSelectedState(undefined);
              setSelectedCity(undefined);
            }}
            options={placesWithLabels}
            tags={renderedPlaceTags}
            inputValue=""
          />

          <Box paddingY={4}>
            <Box display="flex" direction="row">
              <Column span={4}>
                <Box paddingX={1}>
                  <SelectList
                    id="country-select-list"
                    disabled={disableCountryStateCity}
                    label="Country"
                    onChange={({ value }) => setSelectedCountry(value)}
                    options={[NoneLabel, ...countryOptions]}
                    placeholder="Select a country"
                    value={selectedCountry}
                  />
                </Box>
              </Column>

              <Column span={4}>
                <Box paddingX={1}>
                  <SelectList
                    id="state-select-list"
                    label="State"
                    disabled={disableCountryStateCity || !stateOptions.length}
                    placeholder="Select a state/province"
                    onChange={({ value }) => setSelectedState(value)}
                    options={
                      stateOptions.length ? [NoneLabel, ...stateOptions] : []
                    }
                    value={selectedState}
                  />
                </Box>
              </Column>

              <Column span={4}>
                <Box paddingX={1}>
                  <SelectList
                    id="city-select-list"
                    label="City"
                    disabled={disableCountryStateCity || !cityOptions.length}
                    placeholder="Select a city"
                    onChange={({ value }) => setSelectedCity(value)}
                    options={[NoneLabel, ...cityOptions]}
                    value={selectedCity}
                  />
                </Box>
              </Column>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Layer>
  );
}
