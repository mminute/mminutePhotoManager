import { Box } from 'gestalt';
import AnnotationDataManager from 'renderer/PhotoView/AnnotationDataManager';
import Photo from '../../../DataManager/PhotoManager/Photo';

const defaultPhoto = new Photo({
  fileHandlers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    readFileSync: (_filepath: string) => Buffer.from(''),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    writeFileSync: (_filepath: string, _fileContents: Buffer) => {},
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getImageSize: (_input: string) => ({ width: undefined, height: undefined }),
  filename: '',
});

export default function Annotations() {
  return (
    <AnnotationDataManager photo={defaultPhoto}>
      {() => <Box>helloworld</Box>}
    </AnnotationDataManager>
  );
}
