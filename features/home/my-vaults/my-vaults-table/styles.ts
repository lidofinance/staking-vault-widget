import styled from 'styled-components';

export { AddVaultButton } from '../styles';

export const MyVaultsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;
