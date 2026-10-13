import styled from 'styled-components';
import { Divider, Link } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const OverviewSection = styled.section`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  @media ${devicesHeaderMedia.mobile} {
    flex-direction: column;
  }
`;

export const SectionDivider = styled(Divider)`
  border-top-width: 2px;
`;

export const NestedSections = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  margin-top: ${({ theme }) => theme.spaceMap.md}px;
`;

export const HintText = styled.span<{ $strong?: boolean }>`
  color: #fff;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
  font-weight: ${({ $strong }) => ($strong ? 700 : 'normal')};
`;

export const HintLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
`;
