import { Modal, Button } from '@lidofinance/lido-ui';

import { useVaultInfo, VaultAddressError, vaultTexts } from 'modules/vaults';
import { ButtonLink } from 'shared/components/button-link';
import { appPaths } from 'consts/routing';

import { ErrorModalContent } from './styles';

const texts = vaultTexts.common;

export const VaultError = () => {
  const { error, refetchVaultInfo } = useVaultInfo();
  if (!error) return null;

  const GoToAll = (
    <ButtonLink href={appPaths.vaults.all}>{texts.links.goToAll}</ButtonLink>
  );

  if (error instanceof VaultAddressError) {
    return (
      <Modal title={texts.errors.vaultAddress} center open>
        {GoToAll}
      </Modal>
    );
  }

  return (
    <Modal title={texts.errors.loadingVault} center open>
      <ErrorModalContent>
        <Button variant="outlined" onClick={() => refetchVaultInfo()}>
          Try Again
        </Button>
        {GoToAll}
      </ErrorModalContent>
    </Modal>
  );
};
