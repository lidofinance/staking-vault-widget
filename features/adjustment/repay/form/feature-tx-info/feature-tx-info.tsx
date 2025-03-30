import { AmountInfo, InfoRow, Wrapper } from './styles';

export const FeatureTxInfo = () => {
  // TODO: simulate tx, add tx price, convert ETH to stEth
  // TODO: add question info
  return (
    <Wrapper>
      <InfoRow>
        <span>Transaction cost</span>
        <AmountInfo>{'$99.99'}</AmountInfo>
      </InfoRow>
    </Wrapper>
  );
};
