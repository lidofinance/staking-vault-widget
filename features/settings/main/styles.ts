import styled from 'styled-components';
import { Heading, InlineLoader } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  width: 100%;
`;

export const Skeleton = styled(InlineLoader)`
  height: 36px;
  max-width: 50%;

  @media ${devicesHeaderMedia.mobile} {
    max-width: 100%;
  }
`;

export const GroupWrapper = styled.article`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const GroupHeading = styled(Heading)`
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  line-height: 24x;
  color: ${({ theme }) => theme.colors.text};
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: ${({ theme }) => theme.spaceMap.md}px;
  border-left: 2px solid ${({ theme }) => theme.colors.border};
`;
