import styled from 'styled-components';

export const RequestWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.foreground};
`;

export const HeadingSection = styled.section`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spaceMap.xxl}px;
  padding-bottom: ${({ theme }) => theme.spaceMap.lg}px;
`;

export const ExpiresContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;
