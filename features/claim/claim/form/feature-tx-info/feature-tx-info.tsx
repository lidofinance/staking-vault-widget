import { Text } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';

export const FeatureTxInfo = () => {
  // TODO: simulate tx, add tx price, convert ETH to stEth
  // TODO: add question info
  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          Transaction cost
        </Text>
        <AmountInfo>{'$99.99'}</AmountInfo>
      </InfoRow>
    </Wrapper>
  );
};
