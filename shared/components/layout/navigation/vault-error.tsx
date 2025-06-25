import { useEffect, useState } from 'react';
import { Modal, Button } from '@lidofinance/lido-ui';

import { useVault, VaultAddressError, vaultTexts } from 'modules/vaults';
import { ButtonLink } from 'shared/components/button-link';
import { appPaths } from 'consts/routing';

import { ErrorModalContent } from './styles';

const texts = vaultTexts.common;

export const VaultError = () => {
  const { error, refetch } = useVault();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // TODO: fix lido-ui, modal opened in SSR causes error on server
  if (!isMounted || !error) return null;

  const goToAll = (
    <ButtonLink href={appPaths.vaults.all}>{texts.links.goToAll}</ButtonLink>
  );

  if (error instanceof VaultAddressError) {
    return (
      <Modal title={texts.errors.vaultAddress} center open>
        {goToAll}
      </Modal>
    );
  }

  return (
    <Modal title={texts.errors.loadingVault} center open>
      <ErrorModalContent>
        <Button
          variant="outlined"
          onClick={() => refetch({ cancelRefetch: true, throwOnError: false })}
        >
          Try Again
        </Button>
        {goToAll}
      </ErrorModalContent>
    </Modal>
  );
};
