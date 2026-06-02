import { type FC, type ReactNode, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { useDappStatus } from 'modules/web3';
import {
  useVaultPermission,
  useVaultConfirmingRoles,
  useVaultOverviewData,
} from 'modules/vaults';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import { FormController } from 'shared/hook-form/form-controller';
import { useDisableForm } from 'shared/hook-form';

import { useRebalance } from 'features/rebalance/hooks';
import { RebalanceFormResolver } from './validation';
import type {
  RebalanceFormAwaitableValidationContext,
  RebalanceFormFieldValues,
  RebalanceFormValidatedValues,
} from 'features/rebalance/types';
import { FormContent } from './styles';

export const RebalanceFormWrapper: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isDappActive } = useDappStatus();
  const { rebalance, retryEvent } = useRebalance();
  const disabled = useDisableForm();
  const { hasAdmin } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission('rebalancer');
  const { data: overviewData, refetch } = useVaultOverviewData();
  const overviewDataPromise = useAwaiter(overviewData);

  // TODO: add async data for defaultValues
  const formObject = useForm<
    RebalanceFormFieldValues,
    RebalanceFormAwaitableValidationContext,
    RebalanceFormValidatedValues
  >({
    defaultValues: {
      rebalanceAmount: null,
      isSupplyEth: false,
      supplyEth: null,
    },
    mode: 'all',
    disabled: !isDappActive || disabled || (!hasAdmin && !hasPermission),
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
