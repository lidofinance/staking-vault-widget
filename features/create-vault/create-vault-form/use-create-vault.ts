import { useCallback, useMemo, useState } from 'react';
import invariant from 'tiny-invariant';
import { useEstimateGas } from 'wagmi';
import { useFormContext, useFormState } from 'react-hook-form';

import { trackMatomoEvent } from 'utils/track-matomo-event';

import {
  type TransactionEntry,
  useSendTransaction,
  withSuccess,
  useDappStatus,
} from 'modules/web3';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { getContractAddress } from 'config';
import { vaultTexts } from 'modules/vaults';

import { renderModalCTA } from './modal-cta';
import { CreateVaultSchema } from '../types';
import { schemaToTx, type VaultTxExpected } from './utils';

export const useCreateVault = () => {
  const { chainId } = useDappStatus();
  const { sendTX, ...rest } = useSendTransaction();
  // the latest submit, fixed at submit time: the form and chain may change after it
  // (e.g. reset on a wallet or chain switch), the tx result may not
  const [submitted, setSubmitted] = useState<{
    // what the tx is known to create, to find the vault in its receipts
    expected: VaultTxExpected;
    // shown on the result page, also when the vault address can't be confirmed
    values: CreateVaultSchema;
  } | null>(null);

  return {
    createVault: useCallback(
      async (values: CreateVaultSchema) => {
        const vaultFactoryAddress = getContractAddress(chainId, 'vaultFactory');
        invariant(
          vaultFactoryAddress,
          '[useCreateVaultWihDashboard] vaultFactoryAddress is not defined',
        );
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.initiatingCreatingVault);

        const { data, value, defaultAdmin, owners } = schemaToTx(values);
        const expected: VaultTxExpected = {
          factory: vaultFactoryAddress,
          defaultAdmin,
          owners,
        };
        setSubmitted({ expected, values });

        const tx: TransactionEntry = {
          to: vaultFactoryAddress,
          loadingActionText: vaultTexts.actions.createVault.loading,
          data,
          value,
        };

        const result = await withSuccess(
          sendTX({
            transactions: [tx],
            mainActionCompleteText: vaultTexts.actions.createVault.completed,
            mainActionLoadingText: vaultTexts.actions.createVault.loading,
            renderSuccessContent: renderModalCTA(expected),
          }),
        );

        if (result.success) {
          trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.finalisingCreatingVault);
        }

        return result;
      },
      [chainId, sendTX],
    ),
    submitted,
    ...rest,
  };
};

export const useEstimateGasCreateVault = () => {
  const { chainId, address } = useDappStatus();
  const vaultFactoryAddress = getContractAddress(chainId, 'vaultFactory');
  const { getValues } = useFormContext<CreateVaultSchema>();
  const { isValid } = useFormState();

  const txData = useMemo(
    () => (isValid ? schemaToTx(getValues()) : null),
    [getValues, isValid],
  );

  return useEstimateGas({
    to: vaultFactoryAddress,
    data: txData?.data,
    account: address,
    value: txData?.value,
    query: {
      enabled: !!txData,
    },
  });
};
