import { useMemo } from 'react';
import Link from 'next/link';

import { Button } from '@lidofinance/lido-ui';

import { appPaths } from 'consts/routing';
import { TxLinkEtherscan } from 'shared/components';
import { parseVaultTx } from 'features/create-vault/create-vault-form/utils';
import { MAIN_SETTINGS } from 'features/create-vault/consts';

import {
  SectionContainer,
  FormTitle,
  ConfirmationLabel,
  ConfirmInfoTitle,
  List,
  TextBold,
  ListItemCompact,
  ConfirmAddress,
  ConfirmationEntry,
} from './styles';

import type { TransactionResponse } from 'modules/web3';

type ResultOverviewProps = {
  transactionResult?: TransactionResponse;
};

export const ResultOverview = ({ transactionResult }: ResultOverviewProps) => {
  const { txHash, vaultAddress } = useMemo(() => {
    if (transactionResult) {
      return parseVaultTx(transactionResult);
    }
    return { vaultAddress: null, txHash: null };
  }, [transactionResult]);

  if (!vaultAddress || !txHash) {
    return null;
  }
  return (
    <SectionContainer isShown>
      <FormTitle>New vault has been created</FormTitle>
      <List>
        <ListItemCompact>
          <ConfirmationLabel>Vault address</ConfirmationLabel>
          <ConfirmAddress payload={vaultAddress} />
        </ListItemCompact>
      </List>

      <List>
        <ConfirmInfoTitle>{'Main settings'}</ConfirmInfoTitle>
        {MAIN_SETTINGS.map((item) => {
          return <ConfirmationEntry {...item} key={item.name} />;
        })}
        <ListItemCompact>
          <ConfirmationLabel>Initial supply to stVault</ConfirmationLabel>
          <TextBold>1 ETH</TextBold>
        </ListItemCompact>
      </List>

      <Link href={appPaths.vaults.vault(vaultAddress).overview}>
        <Button fullwidth>Go to vault</Button>
      </Link>
      <TxLinkEtherscan txHash={txHash} />
    </SectionContainer>
  );
};
