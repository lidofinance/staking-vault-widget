import { FC, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';

import { getPathWithoutFirstSlash } from 'consts/urls';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { usePrefixedReplace } from 'shared/hooks/use-prefixed-history';

import { MyVaultsPage } from 'features/home';
import { appPaths } from 'consts/routing';
import { AllVaults } from 'features/home/all-vaults';

/**
 * We are using single index.html endpoint
 * with hash-based routing in ipfs build mode.
 * It is necessary because ipfs infrastructure does not support
 * redirects to make dynamic routes workable.
 */

const IPFS_ROUTABLE_PAGES = [
  // AppPaths.main not need here
  getPathWithoutFirstSlash(appPaths.vaults.all),
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
      void replace(appPaths.vaults.all, router.query as Record<string, string>);
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
    case getPathWithoutFirstSlash(appPaths.vaults.all): {
      // TODO: fix and get address in IPFS mode
      spaPage = <AllVaults />;
      break;
    }

    default: {
      spaPage = <MyVaultsPage />;
    }
  }

  // Fix for runtime of `dev:ipfs` (see: package.json scripts)
  return <NoSSRWrapper>{spaPage}</NoSSRWrapper>;
};
