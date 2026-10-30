import {
  Text,
  ChartProportion,
  ChartProportionBorderType,
  MarginSize,
  ChartProportionBorderSize,
} from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { Hint, InlineLoader } from 'shared/components';
import { useHealthChart } from 'shared/hooks';

import { useVaultOverview } from 'features/overview/vault-overview';

import { TextWrapper } from '../../styles';
import { ContentWrapper, ChartContainer, CarrySpreadPercent } from './styles';

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
            text={vaultTexts.metrics.modals.health.carrySpread.description}
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
