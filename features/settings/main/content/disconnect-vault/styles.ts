import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;
