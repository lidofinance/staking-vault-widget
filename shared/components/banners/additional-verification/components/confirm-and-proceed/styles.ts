import styled from 'styled-components';

export const ConfirmContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  margin-block-start: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const ConfirmInputBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
