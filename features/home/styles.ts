import styled from 'styled-components';

import { Container } from '@lidofinance/lido-ui';

export const PageWrapper = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;
  padding: 0;
`;
