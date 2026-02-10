import styled from 'styled-components';
import Link from 'next/link';
import { ArrowBack } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const AllVaults = styled(Link)`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
  color: var(--lido-color-secondary);
  opacity: 0.8;

  svg {
    opacity: 0.9;
  }

  &:visited,
  &:hover {
    color: var(--lido-color-secondary);
  }

  &:hover {
    opacity: 1;

    svg {
      opacity: 1;
    }
  }

  @media ${devicesHeaderMedia.mobile} {
    display: none;
  }
`;

export const ArrowBackStyled = styled(ArrowBack)`
  width: 14px;
  height: 14px;
  margin-right: ${({ theme }) => theme.spaceMap.sm}px;
`;
