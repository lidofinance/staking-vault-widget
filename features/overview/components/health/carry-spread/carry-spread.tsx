import { Text, InlineLoader } from '@lidofinance/lido-ui';

import { useVaultOverview } from 'features/overview/contexts';

import { TextWrapper } from '../../styles';

export const CarrySpread = () => {
  const {
    values: { isLoading, carrySpreadApr },
  } = useVaultOverview();
  // TODO: add heath chart
  return (
    <>
      {isLoading ? (
        <InlineLoader />
      ) : (
        <TextWrapper>
          <Text size="xxs" color="secondary">
            Carry Spread
          </Text>
          <Text size="xxs" strong style={{ color: '#53BA95' }}>
            {carrySpreadApr || '-'}
          </Text>
        </TextWrapper>
      )}
    </>
  );
};
