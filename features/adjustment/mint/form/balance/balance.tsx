import { AmountInfo, InfoRow, Wrapper } from './styles';

export const Balance = () => {
  // todo use wallet account
  return (
    <Wrapper>
      <InfoRow>
        <span>Available to Supply</span>
        <AmountInfo>{'400.3415 ETH'}</AmountInfo>
      </InfoRow>
    </Wrapper>
  );
};
