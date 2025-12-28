import styled from 'styled-components';
import { Divider } from '@lidofinance/lido-ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px 0;
  padding-top: ${({ theme }) => theme.spaceMap.lg}px;
`;

export const DividerStyled = styled(Divider)`
  width: 100%;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.12;
`;
