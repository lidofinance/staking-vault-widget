import {
  Text,
  InlineLoader,
  ChartProportion,
  ChartProportionBorderType,
  MarginSize,
  ChartProportionBorderSize,
} from '@lidofinance/lido-ui';

import { getCarrySpreadColor } from 'utils';

import { useHealthChart } from 'features/overview/inner';
import { useVaultOverview } from 'features/overview/vault-overview';

import { TextWrapper } from '../../styles';
import { ContentWrapper, ChartContainer } from './styles';

export const CarrySpread = () => {
  const { isLoadingVault, values } = useVaultOverview();
  const { chartData } = useHealthChart(values?.healthFactorNumber);

  if (isLoadingVault) {
    return <InlineLoader />;
  }

  return (
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
  );
};
