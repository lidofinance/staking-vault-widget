import { Text } from '@lidofinance/lido-ui';

import {
  ArrowForward,
  ContentRow,
  ContentWrapper,
  Minted,
  Valuation,
  ValuationMetric,
  ChipWrapper,
} from './styles';
import { Chip } from 'shared/components/chip';

export const VaultImpactValuation = () => {
  return (
    <ContentWrapper>
      <ContentRow>
        <Text size="xxs" color="secondary">
          Valuation:
        </Text>
        <Valuation>
          {!!1 && (
            <>
              <Text size="xxs" color="secondary" strong>
                {'100.0000 ETH'}
              </Text>
              <ArrowForward width={20} height={20} />
            </>
          )}

          <Text size="xxs" strong>
            {'100.0000 ETH'}
          </Text>
        </Valuation>
      </ContentRow>
      <ContentRow>
        <Text size="xxs" color="secondary">
          Minted stETH:
        </Text>
        <Minted>
          <Text size="xxs" strong>
            {'65.0000'}
          </Text>
          <Text size="xxs" color="secondary" strong>
            /{'80.0000'}
          </Text>
          <ChipWrapper>
            <Chip>{'81.25%'}</Chip>
          </ChipWrapper>
        </Minted>
      </ContentRow>
      <ContentRow>
        {/* TODO: replace by real svg component */}
        <ValuationMetric />
      </ContentRow>
    </ContentWrapper>
  );
};
