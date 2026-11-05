import { useEffect } from 'react';
import Link from 'next/link';

import { Button } from '@lidofinance/lido-ui';

import { appPaths } from 'consts/routing';
import { TxLinkEtherscan } from 'shared/components';
import { WarningMessage } from 'shared/components/warning-message';
import type { VaultTxExpected } from 'features/create-vault/create-vault-form/utils';
import { useParsedVaultTx } from 'features/create-vault/create-vault-form/use-parsed-vault-tx';
import { MAIN_SETTINGS } from 'features/create-vault/consts';
import type {
  CreateVaultSchema,
  MainSettingsEntryType,
} from 'features/create-vault/types';
import { vaultTexts } from 'modules/vaults';

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

const texts = vaultTexts.actions.createVault.result;

// submitted values are parsed: numbers are shown as the form strings, so a zero fee isn't hidden
const toSubmittedPayload = (
  values: CreateVaultSchema | null,
  name: MainSettingsEntryType['name'],
) => {
  if (!values || name === 'connectionDeposit') return undefined;
  const value = values[name];
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string' || Array.isArray(value)) return value;
  // e.g. the terms checkbox, which is not shown
  return undefined;
};

type ResultOverviewProps = {
  transactionResult?: TransactionResponse;
  // fixed at submit, so later form resets or chain switches don't change the result
  expected: VaultTxExpected | null;
  // the settings the vault was created with: without a confirmed address they are
  // what the user has to recognize the vault by, so they must not follow form resets
  submittedValues: CreateVaultSchema | null;
};

export const ResultOverview = ({
  transactionResult,
  expected,
  submittedValues,
}: ResultOverviewProps) => {
  const parsed = useParsedVaultTx(transactionResult, expected);

  // logged here only: the page follows every successful submit, the modal may be closed
  useEffect(() => {
    if (parsed?.reason) {
      console.warn('[createVault] created vault address is not confirmed', {
        reason: parsed.reason,
        txHash: parsed.txHash,
      });
    }
  }, [parsed]);

  if (!parsed) return null;

  const { vaultAddress, txHash } = parsed;

  return (
    <SectionContainer isShown>
      <FormTitle>{texts.title}</FormTitle>
      {vaultAddress ? (
        <List>
          <ListItemCompact>
            <ConfirmationLabel>Vault address</ConfirmationLabel>
            <ConfirmAddress payload={vaultAddress} />
          </ListItemCompact>
        </List>
      ) : (
        // the tx succeeded, so the vault exists; no address is guessed, the user is sent to their list
        <WarningMessage data-testid="createVault-result-unconfirmedVault">
          {texts.unconfirmed(!!txHash)}
        </WarningMessage>
      )}

      <List>
        <ConfirmInfoTitle>{'Main settings'}</ConfirmInfoTitle>
        {MAIN_SETTINGS.map((item) => {
          return (
            <ConfirmationEntry
              {...item}
              key={item.name}
              // falls back to the form only if the submit snapshot is missing
              value={toSubmittedPayload(submittedValues, item.name)}
            />
          );
        })}
        <ListItemCompact>
          <ConfirmationLabel>Initial supply to stVault</ConfirmationLabel>
          <TextBold>1 ETH</TextBold>
        </ListItemCompact>
      </List>

      {vaultAddress ? (
        <Link href={appPaths.vaults.vault(vaultAddress).overview}>
          <Button fullwidth>{texts.goToVault}</Button>
        </Link>
      ) : (
        <Link href={appPaths.myVaults}>
          <Button fullwidth>{texts.goToMyVaults}</Button>
        </Link>
      )}
      {txHash && <TxLinkEtherscan txHash={txHash} />}
    </SectionContainer>
  );
};
