import styled from 'styled-components';
import { Link } from '@lidofinance/lido-ui';

export const LinkStyled = styled(Link)`
  display: flex;
  color: currentColor;

  &:visited {
    color: currentColor;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;
