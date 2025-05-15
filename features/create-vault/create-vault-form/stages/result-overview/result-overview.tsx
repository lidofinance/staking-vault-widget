import {
  FormTitle,
  SectionContainer,
} from 'features/create-vault/create-vault-form/styles';
import {
  ConfirmInfoTitle,
  List,
  ListItem,
  ListItemCompact,
  PermissionTitle,
} from '../confirmation/styles';
import { ConfirmationData } from '../confirmation/confirmation-data';
import { MAIN_SETTINGS } from 'features/create-vault/consts';
import { ConfirmAddress } from '../confirmation/confirmation-data/confirmation-data-item';
import { TransactionResponse } from 'modules/web3';
import { useMemo } from 'react';
import { parseVaultTx } from '../../utils';
import { Button } from '@lidofinance/lido-ui';
import Link from 'next/link';
import { appPaths } from 'consts/routing';
import { TxLinkEtherscan } from 'shared/components';

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
          <PermissionTitle>Vault address</PermissionTitle>
          <ConfirmAddress payload={vaultAddress} />
        </ListItemCompact>
      </List>
      <ConfirmInfoTitle>{'Main settings'}</ConfirmInfoTitle>
      <List>
        {MAIN_SETTINGS.map((item) => {
          return (
            <ListItem key={item.name}>
              <PermissionTitle>{item.title}</PermissionTitle>
              <ConfirmationData name={item.name} dataType={item.dataType} />
            </ListItem>
          );
        })}
      </List>
      <Link href={appPaths.vaults.vault(vaultAddress).overview}>
        <Button fullwidth>Go to vault</Button>
      </Link>
      <TxLinkEtherscan txHash={txHash} />
    </SectionContainer>
  );
};
