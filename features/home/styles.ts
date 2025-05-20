import styled from 'styled-components';

import { Container } from '@lidofinance/lido-ui';

export const PageWrapper = styled(Container)`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;
  padding: 0;
`;
