import { type FC, useMemo } from 'react';
import { useMitigateRisks, useVault, vaultTexts } from 'modules/vaults';
import { useFormState } from 'react-hook-form';
import { Text } from '@lidofinance/lido-ui';

import { AddressBadge, InlineLoader } from 'shared/components';

import { Skeleton } from 'features/settings/main/styles';

import { WarningIcon } from './warning-icon';
import { Wrapper } from './styles';

const texts = vaultTexts.actions.settings.fields.nodeOperator;

export const NodeOperator: FC = () => {
  const { isLoading } = useFormState();
  const { activeVault } = useVault();
  const { isNodeOperatorVerified } = useMitigateRisks();
  const warningIcon = useMemo(
    () => (isNodeOperatorVerified === false ? <WarningIcon /> : null),
    [isNodeOperatorVerified],
  );

  return (
    <Wrapper>
      <Text size="xs" strong data-testid="nodeOperator-title">
        {texts.title}
      </Text>
      <InlineLoader isLoading={isLoading} loader={<Skeleton />}>
        <AddressBadge
          weight={400}
          address={activeVault?.nodeOperator}
          rightDecorator={warningIcon}
          symbols={21}
          dataTestId="nodeOperator"
          showPopover
        />
      </InlineLoader>
    </Wrapper>
  );
};
