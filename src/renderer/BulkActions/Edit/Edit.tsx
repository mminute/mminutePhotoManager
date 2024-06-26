import { CitiesMapType, PlaceType } from 'DataManager/DataManager';
import Person from 'DataManager/PeopleManager/Person';
import Photo from 'DataManager/PhotoManager/Photo';
import { Box, Button, Flex, SegmentedControl } from 'gestalt';
import { useRef, useState } from 'react';
import UserAnnotationPlace from 'DataManager/PhotoManager/UserAnnotationPlace';
import UserAnnotationData from 'DataManager/PhotoManager/UserAnnotationData';
import Annotations, { OnUpdateArgs } from './Annotations';
import AnnotationsAggregator from './AnnotationsAggregator';
import Metadata from './Metadata';
import { defaultMetadata } from '../../../DataManager/PhotoManager/parseExif';
import Modal from '../Modal';
import ModalHeading from '../ModalHeading';

interface Props {
  allTags: string[];
  backToSelect: () => void;
  citiesMap: CitiesMapType;
  onClearBulkSelection: () => void;
  onDismiss: () => void;
  onShowModal: (action: 'create-person') => void;
  people: Person[];
  placesMap: PlaceType[];
  selectedIds: string[];
  selectedPhotos: Photo[];
}

const sections = ['Annotations', 'Metadata'];

export default function Edit({
  allTags,
  backToSelect,
  citiesMap,
  onClearBulkSelection,
  onDismiss,
  onShowModal,
  people,
  placesMap,
  selectedIds,
  selectedPhotos,
}: Props) {
  const submissionData = useRef<OnUpdateArgs | undefined>();
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  return (
    <AnnotationsAggregator selectedPhotos={selectedPhotos}>
      {({
        title,
        description,
        date,
        place,
        remainingPlaces,
        tags,
        remainingTags,
        people: selectedPeople,
        remainingPeople,
        remainingTitles,
        remainingDates,
        remainingDescriptions,
      }) => {
        const aggregatedPhoto = new Photo({
          data: {
            base64: '',
            filePath: '',
            metadata: defaultMetadata,
            relativePath: '',
            userAnnotations: new UserAnnotationData({
              people: selectedPeople,
              title: title ?? '',
              tags,
              date:
                typeof date === 'string'
                  ? date
                  : date?.toISOString().slice(0, 10).replace(/:/g, '/') || '',
              description: description ?? '',
              place:
                place ??
                new UserAnnotationPlace({
                  city: '',
                  country: { label: '', value: null },
                  name: '',
                  stateProvince: { label: '', value: null },
                }),
            }),
          },
          fileHandlers: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            readFileSync: (_filepath: string) => Buffer.from(''),
            writeFileSync: (
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              _filepath: string,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              _fileContents: Buffer
            ) => {},
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          getImageSize: (_input: string) => ({
            width: undefined,
            height: undefined,
          }),
          filename: '',
        });

        const handleUpdate = (rawSubmissiondata: OnUpdateArgs) => {
          submissionData.current = rawSubmissiondata;
        };

        const handleSubmit = () => {
          if (submissionData.current) {
            window.electron.ipcRenderer.bulkEditPhotos(
              selectedIds,
              submissionData.current
            );
          }

          onClearBulkSelection();
          onDismiss();
        };

        return (
          <Modal
            accessibilityModalLabel="Edit photos"
            heading={
              <ModalHeading txt="Edit photos" backToSelect={backToSelect} />
            }
            onDismiss={onDismiss}
            footer={
              <Flex direction="row" justifyContent="between">
                <Button text="Cancel" onClick={onDismiss} />
                {sections[activeSegmentIndex] === 'Annotations' && (
                  <Button color="red" text="Apply" onClick={handleSubmit} />
                )}
              </Flex>
            }
          >
            <Box>
              <SegmentedControl
                items={sections}
                onChange={({ activeIndex }) =>
                  setActiveSegmentIndex(activeIndex)
                }
                selectedItemIndex={activeSegmentIndex}
              />

              {sections[activeSegmentIndex] === 'Annotations' && (
                <Annotations
                  onUpdate={handleUpdate}
                  allTags={allTags}
                  citiesMap={citiesMap}
                  onShowModal={onShowModal}
                  people={people}
                  placesMap={placesMap}
                  photo={aggregatedPhoto}
                  remainingDates={remainingDates}
                  remainingDescriptions={remainingDescriptions}
                  remainingPeople={remainingPeople}
                  remainingPlaces={remainingPlaces}
                  remainingTags={remainingTags}
                  remainingTitles={remainingTitles}
                />
              )}

              {sections[activeSegmentIndex] === 'Metadata' && (
                <Metadata selectedIds={selectedIds} />
              )}
            </Box>
          </Modal>
        );
      }}
    </AnnotationsAggregator>
  );
}
