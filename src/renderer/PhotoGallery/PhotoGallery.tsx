import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FixedZIndex,
  Flex,
  IconButton,
  Image,
  Mask,
  Masonry,
  TapArea,
  Tooltip,
} from 'gestalt';
import { PlaceType } from 'DataManager/DataManager';
import Person from 'DataManager/PeopleManager/Person';
import ElementUIStateController from 'renderer/PhotoGallery/ElementUIStateController';
import Photo from '../../DataManager/PhotoManager/Photo';
import GalleryTabs, { GALLERY_TABS_Z_INDEX } from '../components/GalleryTabs';
import { routePaths } from '../routePaths';
import PhotoGallerySearchFilter from './PhotoGallerySearchFilter';

type BulkSelectionHandler = (args: {
  action: 'add' | 'clear' | 'remove';
  ids?: string[];
}) => void;

interface Props {
  activePath: string;
  allTags: string[];
  bulkSelections: string[];
  onOpenBulkActions: () => void;
  onSelectPhoto: (id: string) => void;
  onUpdateBulkSelection: BulkSelectionHandler;
  people: Person[];
  photos: Photo[];
  placesMap: PlaceType[];
}

function PhotoRep({
  bulkSelected,
  data,
  onSelect,
  onUpdateBulkSelection,
}: {
  bulkSelected: boolean;
  data: Photo;
  onSelect: (id: string) => void;
  onUpdateBulkSelection: BulkSelectionHandler;
}) {
  const navigate = useNavigate();
  const { height, width } = data;

  const onTap = () => {
    onSelect(data.filePath);
    navigate(routePaths.PHOTO);
  };

  return (
    <Mask rounding={4}>
      <ElementUIStateController>
        {({ active, focused, hovered }) => (
          <>
            {(active || focused || hovered || bulkSelected) && (
              <Box
                padding={2}
                position="absolute"
                right
                top
                zIndex={new FixedZIndex(GALLERY_TABS_Z_INDEX)}
              >
                <input
                  checked={bulkSelected}
                  onClick={() => {
                    const action = bulkSelected ? 'remove' : 'add';

                    onUpdateBulkSelection({ action, ids: [data.filePath] });
                  }}
                  type="checkbox"
                  readOnly
                />
              </Box>
            )}

            <TapArea onTap={onTap}>
              <Image
                color="transparent"
                alt={data.userAnnotations.title}
                naturalHeight={height || 500}
                naturalWidth={width || 500}
                src={`data:image/jpg;base64,${data.base64}`}
              />
            </TapArea>

            <Tooltip text={data.isAnnotated ? 'Annotated' : 'Unannotated'}>
              <Box
                padding={2}
                marginStart={4}
                marginBottom={4}
                position="absolute"
                left
                bottom
                zIndex={new FixedZIndex(GALLERY_TABS_Z_INDEX)}
                rounding="circle"
                color={data.isAnnotated ? 'successWeak' : 'errorBase'}
              />
            </Tooltip>
          </>
        )}
      </ElementUIStateController>
    </Mask>
  );
}

export default function PhotoGallery({
  activePath,
  allTags,
  bulkSelections,
  onOpenBulkActions,
  onSelectPhoto,
  onUpdateBulkSelection,
  people,
  photos,
  placesMap,
}: Props) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [tabsHeight, setTabsHeight] = useState(0);

  useLayoutEffect(() => {
    setTabsHeight(tabsRef.current?.clientHeight || 0);
  }, []);

  // PhotoComp props object: { data, itemIdx, isMeasuring }
  const PhotoComp = ({ data }: { data: Photo }) => (
    <PhotoRep
      bulkSelected={bulkSelections.includes(data.filePath)}
      data={data}
      onSelect={onSelectPhoto}
      onUpdateBulkSelection={onUpdateBulkSelection}
    />
  );

  const activePathPhotos = photos.filter((p) =>
    p.filePath.startsWith(activePath)
  );

  return (
    <PhotoGallerySearchFilter
      allTags={allTags}
      people={people}
      photos={activePathPhotos}
      placesMap={placesMap}
    >
      {({ filteredPhotos, isFiltering, onOpenFilters }) => (
        <>
          <Box
            color="white"
            display="flex"
            paddingX={10}
            position="fixed"
            width="100%"
            ref={tabsRef}
            zIndex={new FixedZIndex(GALLERY_TABS_Z_INDEX)}
          >
            <GalleryTabs activeTab="Photos" />
          </Box>

          <Box
            position="fixed"
            top
            right
            zIndex={new FixedZIndex(GALLERY_TABS_Z_INDEX)}
            paddingX={8}
            paddingY={2}
          >
            <Flex direction="row" gap={2}>
              {!!bulkSelections.length && (
                <Button
                  color="blue"
                  text="Select all"
                  onClick={() =>
                    onUpdateBulkSelection({
                      action: 'add',
                      ids: filteredPhotos.map(
                        (filteredPhoto) => filteredPhoto.filePath
                      ),
                    })
                  }
                />
              )}

              {!!bulkSelections.length && (
                <Button
                  color="blue"
                  text="Deselect all"
                  onClick={() => onUpdateBulkSelection({ action: 'clear' })}
                />
              )}

              {!!bulkSelections.length && (
                <Button
                  color="blue"
                  text="Bulk actions"
                  onClick={() => onOpenBulkActions()}
                />
              )}

              <IconButton
                accessibilityLabel="Search and filter photos"
                icon="filter"
                iconColor={isFiltering ? 'red' : 'darkGray'}
                onClick={onOpenFilters}
                tooltip={
                  isFiltering
                    ? { text: 'Filters applied' }
                    : { text: 'Apply filters' }
                }
              />
            </Flex>
          </Box>
          {tabsHeight && (
            <Box
              dangerouslySetInlineStyle={{
                __style: { paddingTop: `${tabsHeight}px` },
              }}
            >
              <Masonry comp={PhotoComp} items={filteredPhotos} />
            </Box>
          )}
        </>
      )}
    </PhotoGallerySearchFilter>
  );
}
