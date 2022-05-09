import { Image, Mask, Masonry } from 'gestalt';
import Photo from '../DataManager/PhotoManager/Photo';

interface Props {
  photos: Photo[];
}

function PhotoRep({
  data,
}: {
  data: Photo;
  // itemIdx: number;
  // isMeasuring: boolean;
}) {
  const { PixelXDimension, PixelYDimension } = data.metadata.Exif;
  // TODO: Set alt text based on user description

  return (
    <Mask rounding={4}>
      <Image
        color="transparent"
        alt="TODO"
        naturalHeight={PixelYDimension || 500}
        naturalWidth={PixelXDimension || 500}
        src={`data:image/jpg;base64,${data.base64}`}
      />
    </Mask>
  );
}

export default function Gallery({ photos }: Props) {
  return <Masonry comp={PhotoRep} items={photos} />;
}
