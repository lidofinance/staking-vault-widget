import {
  Text,
  ChartProportion,
  ChartProportionBorderType,
  MarginSize,
  ChartProportionBorderSize,
} from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { Hint, InlineLoader } from 'shared/components';

import { useHealthChart } from 'features/overview/inner';
import { useVaultOverview } from 'features/overview/vault-overview';

import { TextWrapper } from '../../styles';
import { ContentWrapper, ChartContainer, CarrySpreadPercent } from './styles';

vaultTexts;
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
                It reflects the estimated annual return from staking in the
                stVault, after subtracting fees and stETH liability growth from
                rebasing — averaged over the past 7 days.
              </>
            }
          />
          <CarrySpreadPercent
            strong
            size="xxs"
            $percent={values?.carrySpreadAprNumber}
            data-testid="carrySpreadApr"
          >
            {values?.carrySpreadApr ?? '-'}
          </CarrySpreadPercent>
        </TextWrapper>
      </ContentWrapper>
    </InlineLoader>
  );
};
