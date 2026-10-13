import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { Text, Modal, Button } from '@lidofinance/lido-ui';

import { appPaths } from 'consts/routing';
import { vaultTexts } from 'modules/vaults/consts';

import { ModalTitle } from './modal-title';

import { ModalContent } from './styles';

const texts = vaultTexts.common;

export const VaultNotVerified = () => {
  const router = useRouter();
  const navigateToAll = useCallback(() => {
    void router.push(appPaths.vaults.all);
  }, [router]);

  return (
    <Modal title={<ModalTitle />} windowSize="md" open>
      <ModalContent>
        <Text size="xs">
          Detected that StakingVault contract has not been created by Vault
          Factory
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
