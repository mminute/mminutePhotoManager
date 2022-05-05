import { Box, Image } from 'gestalt';
import Photo from '../PhotoManager/Photo';

interface Props {
  photos: Photo[];
}

export default function Gallery({ photos }: Props) {
  return (
    <Box color="red" height="100vh">
      <Image
        color="transparent"
        alt="TODO"
        naturalHeight={500}
        naturalWidth={500}
        src={`data:image/jpg;base64,${photos[0].base64}`}
      />
    </Box>
  );
}
