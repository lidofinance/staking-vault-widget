import { useRouter } from 'next/router';

import { config } from 'config';
import { appPaths } from 'consts/routing';

export const useRouterPath = () => {
  const router = useRouter();

  if (config.ipfsMode) {
    if (!config.isClientSide) return appPaths.myVaults;
    return location.hash.replace('#', '') || appPaths.myVaults;
  }

  // TODO: fix description
  // We can't' use `router.pathname` and `router.route` 'cause it's a mapping with file structure
  // example:
  // - /wrap                  --->  /wrap/[[...mode]]
  // - /supply/mint/  --->  /supply/[mode]
  // also we need to remove last character because `router.asPath` contain `/` as last character
  // example:
  // - /wrap                  ---> - /wrap/
  // - <empty>                ---> - /
  if (router.asPath.length > 1 && router.asPath.slice(-1) === '/')
    return router.asPath.slice(0, -1);
  // Fix for index page - '/'
  else return router.asPath;
};
