import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { Text, Modal, Button } from '@lidofinance/lido-ui';

import { appPaths } from 'consts/routing';
import { vaultTexts } from 'modules/vaults/consts';

import { ModalTitle } from './modal-title';

import { ModalContent } from './styles';

const texts = vaultTexts.common;

export const NotBelongToVault = () => {
  const router = useRouter();
  const navigateToAll = useCallback(() => {
    void router.push(appPaths.vaults.all);
  }, [router]);

  return (
    <Modal title={<ModalTitle />} windowSize="md" open>
      <ModalContent>
        <Text size="xs">
          Detected that dashboard address not belong to this staking vault
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
