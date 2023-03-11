import { CitiesMapType, PlaceType } from 'DataManager/DataManager';
import Person from 'DataManager/PeopleManager/Person';
import Photo from 'DataManager/PhotoManager/Photo';
import {
  Box,
  Button,
  IconButton,
  Flex,
  Heading,
  SegmentedControl,
} from 'gestalt';
import { useState } from 'react';
import UserAnnotationPlace from 'DataManager/PhotoManager/UserAnnotationPlace';
import UserAnnotationData from 'DataManager/PhotoManager/UserAnnotationData';
import Annotations from './Annotations';
import AnnotationsAggregator from './AnnotationsAggregator';
import Metadata from './Metadata';
import { defaultMetadata } from '../../../DataManager/PhotoManager/parseExif';
import Modal from '../Modal';
import ModalHeading from '../ModalHeading';

interface Props {
  allTags: string[];
  backToSelect: () => void;
  citiesMap: CitiesMapType;
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
  onDismiss,
  onShowModal,
  people,
  placesMap,
  selectedIds,
  selectedPhotos,
}: Props) {
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
            filename: '',
            metadata: defaultMetadata,
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
                <Button
                  color="red"
                  text="Appy"
                  onClick={() => {
                    console.log('Apply photo updates here');
                    // TODO: clear the selected photos
                    onDismiss();
                  }}
                />
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
