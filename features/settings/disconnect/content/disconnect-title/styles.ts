import styled from 'styled-components';
import { Heading } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

export const TitleHeading = styled(Heading)`
  font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.text};
`;

export const BadgeWrapper = styled.div`
  width: fit-content;

  @media ${devicesHeaderMedia.mobile} {
    display: none;
  }
`;
