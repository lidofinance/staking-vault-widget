import styled from 'styled-components';

export const RadioSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const RadioSelectorTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.textDark};
  font-weight: 700;
`;
