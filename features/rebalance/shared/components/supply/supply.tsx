import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { useVaultPermission } from 'modules/vaults';

import { useIsForceRebalance } from 'features/rebalance/hooks';
import type { RebalanceFormFieldValues } from 'features/rebalance/types';

import { Container } from './styles';
import { Description } from './description';
import { SupplyInput } from './supply-input';
import { SupplyToggle } from './supply-toggle';

export const Supply = () => {
  const isForceRebalance = useIsForceRebalance();
  // Supplying ETH requires the FUND_ROLE (supplier) or DEFAULT_ADMIN.
  const { hasPermission: canSupply } = useVaultPermission('supplier');
  const { setValue } = useFormContext<RebalanceFormFieldValues>();

  // Keep the form consistent if the supply option becomes unavailable
  // (e.g. the role is revoked) while it was toggled on.
  useEffect(() => {
    if (!canSupply) {
      setValue('isSupplyEth', false, { shouldValidate: true });
      setValue('supplyEth', null);
    }
  }, [canSupply, setValue]);

  // Supplying ETH alongside a forced rebalance is not allowed
  if (isForceRebalance) return null;

  // Hide the supply option entirely when the account cannot fund the vault.
  if (!canSupply) return null;

  return (
    <Container>
      <SupplyToggle />
      <SupplyInput />
      <Description />
    </Container>
  );
};
