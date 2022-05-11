import { useNavigate } from 'react-router-dom';
import { Image, Mask, Masonry, TapArea } from 'gestalt';
import Photo from '../DataManager/PhotoManager/Photo';
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

export default function Gallery({ photos, onSelectPhoto }: Props) {
  // PhotoComp props object: { data, itemIdx, isMeasuring }
  const PhotoComp = ({ data }: { data: Photo }) => (
    <PhotoRep data={data} onSelect={onSelectPhoto} />
  );

  return <Masonry comp={PhotoComp} items={photos} />;
}
