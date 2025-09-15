import styled from 'styled-components';
import { Heading } from '@lidofinance/lido-ui';

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
