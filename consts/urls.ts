// TODO: path + basePath
export enum AppPaths {
  HOME = '/',
  SETTINGS = '/settings',
  CREATE_VAULT = '/settings/create',
}

export const getPathWithoutFirstSlash = (path: string): string => {
  if (path.length === 0 || path[0] !== '/') return path;

  return path.slice(1, path.length);
};
