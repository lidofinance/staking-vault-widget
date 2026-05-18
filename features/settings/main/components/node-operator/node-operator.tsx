import { type FC, useMemo } from 'react';
import { useFormState } from 'react-hook-form';
import { Text, Link } from '@lidofinance/lido-ui';

import { useVaultRiskStatus, useVault, vaultTexts } from 'modules/vaults';
import {
  AddressBadge,
  BannerWithoutTitle,
  InlineLoader,
  NO_IDENTIFICATION_LINK,
} from 'shared/components';
import { isBoolean } from 'utils';

import { Skeleton } from 'features/settings/main/styles';

import { WarningIcon } from './warning-icon';
import { Wrapper } from './styles';

const texts = vaultTexts.actions.settings.fields.nodeOperator;

const NotVerifiedOperatorBanner = ({
  isNodeOperatorVerified,
  isLoading,
}: {
  isNodeOperatorVerified: boolean | undefined;
  isLoading: boolean;
}) => {
  return (
    <>
      {!isLoading && !isNodeOperatorVerified && (
        <BannerWithoutTitle>
          <Text size="xxs" color="warning">
            Operator has not passed the identification process.
          </Text>
          <Link href={NO_IDENTIFICATION_LINK}>Learn more</Link>
        </BannerWithoutTitle>
      )}
    </>
  );
};

export const NodeOperator: FC = () => {
  const { isLoading } = useFormState();
  const { activeVault } = useVault();
  const { isNodeOperatorVerified, isLoading: isDataLoading } =
    useVaultRiskStatus();
  const warningIcon = useMemo(
    () =>
      isBoolean(isNodeOperatorVerified) && !isNodeOperatorVerified ? (
        <WarningIcon />
      ) : null,
    [isNodeOperatorVerified],
  );

  return (
    <Wrapper>
      <Text size="xs" strong data-testid="nodeOperator-title">
        {texts.title}
      </Text>
      <InlineLoader isLoading={isLoading} loader={<Skeleton />}>
        <AddressBadge
          popoverContentChildren={
            <NotVerifiedOperatorBanner
              isNodeOperatorVerified={isNodeOperatorVerified}
              isLoading={isDataLoading}
            />
          }
          weight={400}
          address={activeVault?.nodeOperator}
          rightDecorator={warningIcon}
          symbols={21}
          dataTestId="nodeOperator"
          showWarning
          showPopover
        />
      </InlineLoader>
    </Wrapper>
  );
};
