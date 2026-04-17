import styled from 'styled-components';
import { Switcher, SwitcherItem } from '@lidofinance/lido-ui';

export const SwitcherStyled = styled(Switcher)`
  width: 100%;
`;

export const SwitcherItemStyled = styled(SwitcherItem)`
  width: 50%;
  padding: 8px 0;
  line-height: 24px;
  text-transform: uppercase;

  & > span {
    font-size: ${({ theme }) => theme.fontSizesMap.xxxs}px;
  }
`;
