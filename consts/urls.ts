// TODO: path + basePath
export { ManifestConfigPageEnum as AppPaths } from 'config/external-config';

export const getPathWithoutFirstSlash = (path: string): string => {
  if (path.length === 0 || path[0] !== '/') return path;

  return path.slice(1, path.length);
};
