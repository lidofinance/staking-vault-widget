import { type FC, type ReactNode, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { useDappStatus, useEthereumBalance } from 'modules/web3';
import { useVault, useVaultOverviewData } from 'modules/vaults';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import { FormController } from 'shared/hook-form/form-controller';
import { useDisableForm } from 'shared/hook-form';
import {
  verificationConfirmDefaultValues,
  useDisableFormByVerification,
  useVerificationBannerDefender,
} from 'shared/components/banners/additional-verification';

import {
  useRebalance,
  useRebalanceAvailability,
} from 'features/rebalance/hooks';

import { RebalanceFormResolver } from './validation';

import type {
  RebalanceFormAwaitableValidationContext,
  RebalanceFormFieldValues,
  RebalanceFormValidatedValues,
} from 'features/rebalance/types';

import { FormContent } from './styles';

export const FormWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const { isDappActive } = useDappStatus();
  const { invalidateVaultState } = useVault();

  const disabled = useDisableForm();
  const isDisabledByVerification = useDisableFormByVerification('rebalance');
  const { isFormDisabled } = useRebalanceAvailability();

  const { data: overviewData, refetch: refetchOverviewData } =
    useVaultOverviewData();
  const { data: ethBalance } = useEthereumBalance();
  const { isReady: isVerificationReady, confirmationRequired } =
    useVerificationBannerDefender('rebalance');

  const { rebalance, retryEvent } = useRebalance();

  const combinedContext =
    overviewData !== undefined &&
    ethBalance !== undefined &&
    isVerificationReady
      ? {
          overviewData,
          ethBalance,
          additionalVerification: confirmationRequired,
        }
      : undefined;

  const overviewDataPromise = useAwaiter(combinedContext);

  const formObject = useForm<
    RebalanceFormFieldValues,
    RebalanceFormAwaitableValidationContext,
    RebalanceFormValidatedValues
  >({
    defaultValues: async () => {
      await overviewDataPromise.awaiter;
      return {
        rebalanceAmount: null,
        isSupplyEth: false,
        supplyEth: null,
        ...verificationConfirmDefaultValues,
      };
    },
    mode: 'onChange',
    disabled:
      !isDappActive || disabled || isDisabledByVerification || isFormDisabled,
    context: overviewDataPromise.awaiter,
    resolver: RebalanceFormResolver,
  });

  const onSubmit = useCallback(
    async (values: RebalanceFormValidatedValues) => {
      const result = await rebalance(values);
      await Promise.all([
        refetchOverviewData({ cancelRefetch: true, throwOnError: false }),
        invalidateVaultState(),
      ]);

      return result;
    },
    [invalidateVaultState, rebalance, refetchOverviewData],
  );

  return (
    <FormController
      formObject={formObject}
      onSubmit={onSubmit}
      retryEvent={retryEvent}
      data-testid="rebalanceForm"
    >
      <FormContent>{children}</FormContent>
    </FormController>
  );
};
