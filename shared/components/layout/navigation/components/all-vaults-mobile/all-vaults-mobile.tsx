import { useRouter } from 'next/router';

import { BackAllVaults } from '../back-all-vaults';

import { Container } from './styles';

const homePaths = ['/', '/vaults'];

export const AllVaultsMobile = () => {
  const { pathname } = useRouter();

  if (homePaths.includes(pathname)) {
    return null;
  }

  return (
    <Container>
      <BackAllVaults />
    </Container>
  );
};
