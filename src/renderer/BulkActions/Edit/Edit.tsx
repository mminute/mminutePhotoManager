import { CitiesMapType, PlaceType } from 'DataManager/DataManager';
import Person from 'DataManager/PeopleManager/Person';
import Photo from 'DataManager/PhotoManager/Photo';
import { Box, SegmentedControl } from 'gestalt';
import { useState } from 'react';
import UserAnnotationPlace from 'DataManager/PhotoManager/UserAnnotationPlace';
import UserAnnotationData from 'DataManager/PhotoManager/UserAnnotationData';
import Annotations from './Annotations';
import AnnotationsAggregator from './AnnotationsAggregator';
import Metadata from './Metadata';
import { defaultMetadata } from '../../../DataManager/PhotoManager/parseExif';

interface Props {
  allTags: string[];
  citiesMap: CitiesMapType;
  onShowModal: (action: 'create-person') => void;
  people: Person[];
  placesMap: PlaceType[];
  selectedIds: string[];
  selectedPhotos: Photo[];
}

const sections = ['Annotations', 'Metadata'];

export default function Edit({
  allTags,
  citiesMap,
  onShowModal,
  people,
  placesMap,
  selectedIds,
  selectedPhotos,
}: Props) {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  return (
    <Box>
      <SegmentedControl
        items={sections}
        onChange={({ activeIndex }) => setActiveSegmentIndex(activeIndex)}
        selectedItemIndex={activeSegmentIndex}
      />

      {sections[activeSegmentIndex] === 'Annotations' && (
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
                      : date?.toISOString().slice(0, 10).replace(/:/g, '/') ||
                        '',
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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                writeFileSync: (_filepath: string, _fileContents: Buffer) => {},
              },
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              getImageSize: (_input: string) => ({
                width: undefined,
                height: undefined,
              }),
              filename: '',
            });

            return (
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
            );
          }}
        </AnnotationsAggregator>
      )}

      {sections[activeSegmentIndex] === 'Metadata' && (
        <Metadata selectedIds={selectedIds} />
      )}
    </Box>
  );
}
