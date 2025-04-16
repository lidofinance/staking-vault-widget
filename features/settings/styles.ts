import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  max-width: 600px;
  width: 100%;
  margin: ${({ theme }) => theme.spaceMap.md}px auto 0;
  padding: 0;
`;

export const FormBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
  width: 100%;
`;
