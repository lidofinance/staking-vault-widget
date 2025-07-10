import {
  Text,
  InlineLoader,
  ChartProportion,
  ChartProportionBorderType,
  MarginSize,
  ChartProportionBorderSize,
} from '@lidofinance/lido-ui';

import { getUtilizationRatioColor } from 'utils';

import { useVaultOverview } from 'features/overview/contexts';
import { useHealthChart } from 'features/overview/hooks';

import { TextWrapper } from '../../styles';
import { ContentWrapper } from './styles';

export const CarrySpread = () => {
  const {
    isLoadingVault,
    values: { carrySpreadApr, healthFactorNumber },
  } = useVaultOverview();
  const { chartData } = useHealthChart(healthFactorNumber);

  if (isLoadingVault) {
    return <InlineLoader />;
  }

  return (
    <ContentWrapper>
      <ChartProportion
        height={8}
        border={ChartProportionBorderType.rounded}
        margin={MarginSize.md}
        borderSize={ChartProportionBorderSize.md}
        data={chartData}
      />
      <TextWrapper>
        <Text size="xxs" color="secondary">
          Carry Spread
        </Text>
        <Text
          size="xxs"
          strong
          style={{ color: getUtilizationRatioColor(carrySpreadApr) }}
        >
          {carrySpreadApr ?? '-'}
        </Text>
      </TextWrapper>
    </ContentWrapper>
  );
};
