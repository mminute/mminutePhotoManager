import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  FixedZIndex,
  IconButton,
  Image,
  Mask,
  Masonry,
  TapArea,
} from 'gestalt';
import { PlaceType } from 'DataManager/DataManager';
import Person from 'DataManager/PeopleManager/Person';
import Photo from '../../DataManager/PhotoManager/Photo';
import GalleryTabs, { GALLERY_TABS_Z_INDEX } from '../GalleryTabs';
import routePaths from '../routePaths';
import PhotoGallerySearchFilter from './PhotoGallerySearchFilter';

interface Props {
  allTags: string[];
  onSelectPhoto: (id: string) => void;
  people: Person[];
  photos: Photo[];
  placesMap: PlaceType[];
}

function PhotoRep({
  data,
  onSelect,
}: {
  data: Photo;
  onSelect: (id: string) => void;
}) {
  const navigate = useNavigate();
  const { height, width } = data;

  const onTap = () => {
    onSelect(data.filePath);
    navigate(routePaths.PHOTO);
  };

  return (
    <Mask rounding={4}>
      <TapArea onTap={onTap}>
        <Image
          color="transparent"
          alt={data.userAnnotations.title}
          naturalHeight={height || 500}
          naturalWidth={width || 500}
          src={`data:image/jpg;base64,${data.base64}`}
        />
      </TapArea>
    </Mask>
  );
}

export default function PhotoGallery({
  allTags,
  onSelectPhoto,
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
    <PhotoRep data={data} onSelect={onSelectPhoto} />
  );

  return (
    <PhotoGallerySearchFilter
      allTags={allTags}
      people={people}
      photos={photos}
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
