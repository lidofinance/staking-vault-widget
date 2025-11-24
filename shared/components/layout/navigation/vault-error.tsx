import { useEffect, useState } from 'react';
import { Modal, Button } from '@lidofinance/lido-ui';

import { DisplayableError, useVault } from 'modules/vaults';
import { vaultTexts } from 'modules/vaults/consts';
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

  let isRetryable = true;
  let errorMessage: string = texts.errors.vault.loadingVault;

  if (error instanceof DisplayableError) {
    isRetryable = error.isRetryable;
    errorMessage = error.message;
  }

  return (
    <Modal title={errorMessage} center open>
      <ErrorModalContent>
        {isRetryable && (
          <Button
            variant="outlined"
            onClick={() =>
              refetch({ cancelRefetch: true, throwOnError: false })
            }
          >
            Try Again
          </Button>
        )}
        <ButtonLink href={appPaths.vaults.all}>
          {texts.links.goToAll}
        </ButtonLink>
      </ErrorModalContent>
    </Modal>
  );
};
