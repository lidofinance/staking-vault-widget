import styled from 'styled-components';
import { Check } from '@lidofinance/lido-ui';

export const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.text};
  cursor: pointer;

  & > input[type='radio'] {
    display: none;
  }

  &:has(input[type='radio']:checked) {
    background-color: ${({ theme }) => theme.colors.text};

    & > svg {
      display: inline-flex;
    }
  }
`;

export const CheckStyled = styled(Check)`
  display: none;
  fill: ${({ theme }) => theme.colors.background};
`;
