import { type FC, type ReactNode, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { useDappStatus, useEthereumBalance } from 'modules/web3';
import { useVaultOverviewData } from 'modules/vaults';
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
  const { rebalance, retryEvent } = useRebalance();
  const disabled = useDisableForm();
  const isDisabledByVerification = useDisableFormByVerification('rebalance');
  const { isFormDisabled } = useRebalanceAvailability();
  const { data: overviewData, refetch } = useVaultOverviewData();
  const { data: ethBalance } = useEthereumBalance();
  const { isReady: isVerificationReady, confirmationRequired } =
    useVerificationBannerDefender('rebalance');

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
    defaultValues: {
      rebalanceAmount: null,
      isSupplyEth: false,
      supplyEth: null,
      ...verificationConfirmDefaultValues,
    },
    mode: 'all',
    disabled:
      !isDappActive || disabled || isDisabledByVerification || isFormDisabled,
    context: overviewDataPromise.awaiter,
    resolver: RebalanceFormResolver,
  });

  const onSubmit = useCallback(
    async (values: RebalanceFormValidatedValues) => {
      const result = await rebalance(values);
      await refetch({ cancelRefetch: true, throwOnError: false });
      return result;
    },
    [refetch, rebalance],
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
