export default function getParentPath(selectedDir: string) {
  const [, parentPath] = selectedDir.match(/(.*\/)[^/]*$/) || [null, ''];
  return parentPath;
}
