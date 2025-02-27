import { FC, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';

import { getPathWithoutFirstSlash, AppPaths } from 'consts/urls';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { usePrefixedReplace } from 'shared/hooks/use-prefixed-history';

import { HomePage } from 'features/home';
import SettingsPage from 'pages/settings';

/**
 * We are using single index.html endpoint
 * with hash-based routing in ipfs build mode.
 * It is necessary because ipfs infrastructure does not support
 * redirects to make dynamic routes workable.
 */

const IPFS_ROUTABLE_PAGES = [
  // AppPaths.HOME not need here
  getPathWithoutFirstSlash(AppPaths.SETTINGS),
];

export const HomePageIpfs: FC = () => {
  const router = useRouter();
  const { asPath } = router;

  const replace = usePrefixedReplace();

  const parsedPath = useMemo(() => {
    const hashPath = asPath.split('#')[1];
    if (!hashPath) return [];
    return hashPath.split('/').splice(1);
  }, [asPath]);

  useEffect(() => {
    if (parsedPath[0] && !IPFS_ROUTABLE_PAGES.includes(parsedPath[0])) {
      void replace(AppPaths.HOME, router.query as Record<string, string>);
    }
  }, [replace, parsedPath, router.query]);

  /**
   * TODO:
   * We can upgrade this routing algorithm with a `match` method
   * and router config if we will need more functionality
   * Example: https://v5.reactrouter.com/web/api/match
   */
  let spaPage;
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (parsedPath[0]) {
    case getPathWithoutFirstSlash(AppPaths.SETTINGS): {
      spaPage = <SettingsPage />;
      break;
    }

    default: {
      spaPage = <HomePage />;
    }
  }

  // Fix for runtime of `dev:ipfs` (see: package.json scripts)
  return <NoSSRWrapper>{spaPage}</NoSSRWrapper>;
};
