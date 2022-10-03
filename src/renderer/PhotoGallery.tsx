import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, FixedZIndex, Image, Mask, Masonry, TapArea } from 'gestalt';
import Photo from '../DataManager/PhotoManager/Photo';
import GalleryTabs, { GALLERY_TABS_Z_INDEX } from './GalleryTabs';
import routePaths from './routePaths';

interface Props {
  photos: Photo[];
  onSelectPhoto: (id: string) => void;
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

export default function PhotoGallery({ photos, onSelectPhoto }: Props) {
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
    <>
      <Box
        color="white"
        display="flex"
        justifyContent="start"
        paddingX={10}
        position="fixed"
        ref={tabsRef}
        width="100%"
        zIndex={new FixedZIndex(GALLERY_TABS_Z_INDEX)}
      >
        <GalleryTabs activeTab="Photos" />
      </Box>
      {tabsHeight && (
        <Box
          dangerouslySetInlineStyle={{
            __style: { paddingTop: `${tabsHeight}px` },
          }}
        >
          <Masonry comp={PhotoComp} items={photos} />
        </Box>
      )}
    </>
  );
}
