import styled, { css } from 'styled-components';
import { Check } from '@lidofinance/lido-ui';

export const CheckStyled = styled(Check)`
  display: none;
  fill: ${({ theme }) => theme.colors.background};
  width: 24px;
  height: 24px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.text};
`;

const tierSelectorStyles = css`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.foreground};
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Selector = styled.div`
  ${tierSelectorStyles};
`;

export const SelectorLabel = styled.label`
  ${tierSelectorStyles};

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  }

  &:has(input[type='radio']:checked) {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};

    & > svg {
      display: inline-flex;
    }
  }

  & > input[type='radio'] {
    display: none;
  }
`;
