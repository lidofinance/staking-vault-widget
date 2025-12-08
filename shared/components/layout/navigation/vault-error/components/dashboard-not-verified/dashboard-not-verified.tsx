import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Text, Modal, Button } from '@lidofinance/lido-ui';

import { appPaths } from 'consts/routing';
import { vaultTexts } from 'modules/vaults/consts';

import { ModalTitle } from './modal-title';

import { ModalContent } from './styles';

const texts = vaultTexts.common;
const cliLink = 'https://github.com/lidofinance/lido-staking-vault-cli';
{
  /* TODO: replace to releases page */
}
const uiLink = 'https://github.com/lidofinance/staking-vault-widget';

export const DashboardNotVerified = () => {
  const router = useRouter();
  const navigateToAll = useCallback(() => {
    void router.push(appPaths.vaults.all);
  }, [router]);

  return (
    <Modal title={<ModalTitle />} windowSize="md" open>
      <ModalContent>
        <Text size="xs">
          The contract that owns StakingVault has bytecode different from the
          latest verified Dashboard contract implementation. This may be caused
          by a contract upgrade or a contract replacement. Please verify the
          owner address manually, use{' '}
          <Link target="_blank" rel="noopener noreferrer" href={cliLink}>
            the CLI
          </Link>
          , or run a previously verified version of the frontend locally from{' '}
          <Link target="_blank" rel="noopener noreferrer" href={uiLink}>
            the repository
          </Link>
          .
        </Text>
        <Text size="xxs">
          <Button fullwidth size="sm" onClick={navigateToAll}>
            {texts.links.goToAll}
          </Button>
        </Text>
      </ModalContent>
    </Modal>
  );
};
