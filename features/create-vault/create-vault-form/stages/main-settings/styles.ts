import { Checkbox } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const Wrapper = styled.article`
  display: flex;
  align-items: start;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

export const InfoList = styled.ul`
  list-style-position: inside;
`;

export const StyledCheckbox = styled(Checkbox)<{
  isError?: boolean;
}>`
  align-items: flex-start;
  svg {
    box-shadow: ${({ isError, theme }) =>
      isError ? ` inset 0 0 0 1px ${theme.colors.error} !important` : 'unset'};
  }
`;
