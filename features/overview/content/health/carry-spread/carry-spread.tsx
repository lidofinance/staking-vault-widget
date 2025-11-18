import {
  Text,
  ChartProportion,
  ChartProportionBorderType,
  MarginSize,
  ChartProportionBorderSize,
} from '@lidofinance/lido-ui';

import { Hint, InlineLoader } from 'shared/components';
import { getCarrySpreadColor } from 'utils';

import { useHealthChart } from 'features/overview/inner';
import { useVaultOverview } from 'features/overview/vault-overview';

import { TextWrapper } from '../../styles';
import { ContentWrapper, ChartContainer } from './styles';

export const CarrySpread = () => {
  const { isLoadingVault, values } = useVaultOverview();
  const { chartData } = useHealthChart(values?.healthFactorNumber);

  return (
    <InlineLoader isLoading={isLoadingVault}>
      <ContentWrapper>
        <ChartContainer data-testid="carrySpreadChart">
          <ChartProportion
            height={8}
            border={ChartProportionBorderType.rounded}
            margin={MarginSize.md}
            borderSize={ChartProportionBorderSize.md}
            data={chartData}
          />
        </ChartContainer>
        <TextWrapper>
          <Text size="xxs" color="secondary" data-testid="carrySpreadLabel">
            Carry Spread
          </Text>
          <Hint
            text={
              <>
                Carry Spread shows how the Health Factor changes over time —
                whether the vault’s position is getting stronger or weaker. A
                positive spread raises the Health Factor, while a negative
                spread lowers it.
                <br />
                It’s calculated as the estimated yearly return from staking in
                the stVault after subtracting fees and stETH liability growth
                from stETH rebasing.
              </>
            }
          />
          <Text
            size="xxs"
            strong
            style={{ color: getCarrySpreadColor(values?.carrySpreadApr) }}
            data-testid="carrySpreadApr"
          >
            {values?.carrySpreadApr ?? '-'}
          </Text>
        </TextWrapper>
      </ContentWrapper>
    </InlineLoader>
  );
};
