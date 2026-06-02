import {
  ChartProportion,
  ChartProportionBorderType,
  ChartProportionBorderSize,
  MarginSize,
  Text,
} from '@lidofinance/lido-ui';

import { useHealthChart } from 'shared/hooks';
import { useVaultOverviewData, vaultTexts } from 'modules/vaults';
import { InlineLoader } from 'shared/components';

import { Container, TextContainer } from './styles';

export const HealthFactor = () => {
  const { data, isPending } = useVaultOverviewData();
  const { healthFactorNumber, healthFactor } = data ?? {};
  const { chartData } = useHealthChart(healthFactorNumber);

  // TODO: add old to new if it has diffs
  return (
    <Container>
      <TextContainer>
        <Text size="xxs" as="span">
          {vaultTexts.actions.rebalance.metrics.healthFactor}
        </Text>
        <InlineLoader isLoading={isPending} width={50} height={18}>
          <Text size="xxs" color="secondary" as="span">
            {healthFactor}
          </Text>
        </InlineLoader>
      </TextContainer>
      <ChartProportion
        loading={isPending && !chartData}
        height={8}
        border={ChartProportionBorderType.rounded}
        margin={MarginSize.md}
        borderSize={ChartProportionBorderSize.md}
        data={chartData}
      />
    </Container>
  );
};
