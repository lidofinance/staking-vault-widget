import { useRouter } from 'next/router';

import { BackAllVaults } from '../back-all-vaults';
import { Report } from './components';

import { Container } from './styles';
import type { ParsedUrlQuery } from 'querystring';

const homePaths = ['/', '/vaults'];

const checkQueryMode = (query: ParsedUrlQuery) => {
  if (query && 'mode' in query) {
    return query.mode === 'disconnect';
  }

  return false;
};

export const AllVaultsMobile = () => {
  const { pathname, query } = useRouter();

  if (homePaths.includes(pathname) || checkQueryMode(query)) {
    return null;
  }

  return (
    <Container>
      <BackAllVaults />
      <Report tooltipPlacement="leftTop" />
    </Container>
  );
};
