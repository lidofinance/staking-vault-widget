import { Text } from '@lidofinance/lido-ui';

import { ButtonStyled, TextContainer, Wrapper } from './styles';

export const ReceiveReserveRatio = () => {
  return (
    <Wrapper>
      <TextContainer>
        <Text size="xs" strong>
          Receive competitive reserve ratios for your vaults!
        </Text>
        <Text size="xxs">
          Become an known Node Operator by applying on the Lido Research Forum
          to get tiers with competitive stETH minting terms.
        </Text>
      </TextContainer>
      <ButtonStyled size="xs" variant="outlined">
        Apply
      </ButtonStyled>
    </Wrapper>
  );
};
