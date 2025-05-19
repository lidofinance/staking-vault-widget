import { useCallback, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { useEstimateGas } from 'wagmi';
import { useFormContext, useFormState } from 'react-hook-form';

import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
  useDappStatus,
} from 'modules/web3';
import { ESTIMATE_ACCOUNT } from 'config/groups/web3';
import { getContractAddress } from 'config';

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

        const { data, value } = schemaToTx(values);

        const tx: TransactionEntry = {
          to: vaultFactoryAddress,
          loadingActionText: 'Creating vault',
          data,
          value,
        };

        const result = await withSuccess(
          sendTX({
            transactions: [tx],
            mainActionCompleteText: 'Vault created',
            mainActionLoadingText: 'Creating vault',
            renderSuccessContent: ModalCTA,
          }),
        );

        return result;
      },
      [chainId, sendTX],
    ),
    ...rest,
  };
};

export const useEstimateGasCreateVault = () => {
  const { chainId } = useDappStatus();
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
    account: ESTIMATE_ACCOUNT,
    value: txData?.value,
    query: {
      enabled: !!txData,
    },
  });
};
