import { AmountInfo, InfoRow, StEthQuestion, Wrapper } from './styles';

export const FeatureTxInfo = () => {
  // TODO: simulate tx, add tx price, convert ETH to stEth
  // TODO: add question info
  return (
    <Wrapper>
      <InfoRow>
        <span>You will receive</span>
        <AmountInfo>
          <span>{'50 stETH'}</span>
          <StEthQuestion />
        </AmountInfo>
      </InfoRow>
      <InfoRow>
        <span>Transaction cost</span>
        <AmountInfo>{'$99.99'}</AmountInfo>
      </InfoRow>
    </Wrapper>
  );
};
