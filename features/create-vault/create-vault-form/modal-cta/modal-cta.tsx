import { useRef } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { Button } from '@lidofinance/lido-ui';

import { ModalRenderSuccessContent } from 'shared/components/transaction-modal';
import { WarningMessage } from 'shared/components/warning-message';
import { appPaths } from 'consts/routing';
import { vaultTexts } from 'modules/vaults';
import type { VaultTxExpected } from '../utils';
import { useParsedVaultTx } from '../use-parsed-vault-tx';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

const texts = vaultTexts.actions.createVault.result;

type ModalCTAProps = Parameters<ModalRenderSuccessContent>[0] & {
  expected: VaultTxExpected;
};

export const ModalCTA = ({ result, closeModal, expected }: ModalCTAProps) => {
  const isRouting = useRef<boolean>(false);
  const router = useRouter();
  const parsed = useParsedVaultTx(result, expected);

  if (!parsed) return <></>;

  const { vaultAddress } = parsed;
  // without a confirmed address the user is sent to their vault list, never to a guessed vault
  const path = vaultAddress
    ? appPaths.vaults.vault(vaultAddress).overview
    : appPaths.myVaults;

  const handleNavigate = async () => {
    if (isRouting.current) return;

    try {
      isRouting.current = true;
      await router.push(path);
      closeModal();
    } finally {
      isRouting.current = false;
    }
  };

  if (vaultAddress) {
    return (
      <Button onClick={handleNavigate} fullwidth>
        {texts.goToVault}
      </Button>
    );
  }

  return (
    <Content>
      <WarningMessage data-testid="createVault-modal-unconfirmedVault">
        {texts.unconfirmed(!!parsed.txHash)}
      </WarningMessage>
      <Button onClick={handleNavigate} fullwidth>
        {texts.goToMyVaults}
      </Button>
    </Content>
  );
};

// binds the success content to the submitted tx, so only its vault is offered
export const renderModalCTA =
  (expected: VaultTxExpected): ModalRenderSuccessContent =>
  (props) => <ModalCTA {...props} expected={expected} />;
