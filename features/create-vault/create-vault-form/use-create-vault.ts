import { useCallback, useMemo } from 'react';
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

import { ModalCTA } from './modal-cta';
import { CreateVaultSchema } from '../types';
import { schemaToTx } from './utils';

export const useCreateVault = () => {
  const { chainId } = useDappStatus();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    createVault: useCallback(
      async (values: CreateVaultSchema) => {
        const vaultFactoryAddress = getContractAddress(chainId, 'vaultFactory');
        invariant(
          vaultFactoryAddress,
          '[useCreateVaultWihDashboard] vaultFactoryAddress is not defined',
        );
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.initiatingCreatingVault);

        const { data, value } = schemaToTx(values);

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
            renderSuccessContent: ModalCTA,
          }),
        );

        if (result.success) {
          trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.finalisingCreatingVault);
        }

        return result;
      },
      [chainId, sendTX],
    ),
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
