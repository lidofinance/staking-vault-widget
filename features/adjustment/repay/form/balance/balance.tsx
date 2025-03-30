import { AmountInfo, InfoRow, Wrapper } from './styles';

export const Balance = () => {
  // todo use wallet account
  return (
    <Wrapper>
      <InfoRow>
        <span>Available to repay</span>
        <AmountInfo>{'400.3415 stETH'}</AmountInfo>
      </InfoRow>
    </Wrapper>
  );
};
