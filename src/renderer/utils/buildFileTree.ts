import Photo from 'DataManager/PhotoManager/Photo';
import getParentPath from './getParentPath';

export interface DirectoryData {
  name: string;
  children: DirectoryData[];
}

export default function buildFileTree(
  photos: Photo[],
  currentPath: string
): DirectoryData[] {
  const toReplace = getParentPath(currentPath);

  const filepaths = photos.map((photo) => {
    const pathParts = photo.filePath.replace(`${toReplace}`, '').split('/');

    pathParts.pop(); // Remove the filename portion of the filepath

    return pathParts.join('/');
  });

  const uniquePaths = Array.from(new Set(filepaths.filter(Boolean)));

  const result: DirectoryData[] = [];
  const level = { result };

  uniquePaths.forEach((path) => {
    path.split('/').reduce((r, name) => {
      if (!r[name]) {
        r[name] = { result: [] };
        r.result.push({ name, children: r[name].result });
      }

      return r[name];
    }, level);
  });

  return result;
}
