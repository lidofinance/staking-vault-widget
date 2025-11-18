import styled from 'styled-components';

export const GeneralInfoContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
`;

export const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const List = styled.ol`
  display: flex;
  flex-direction: column;
  padding-left: ${({ theme }) => theme.spaceMap.lg}px;
`;

export const ListItem = styled.li`
  &::marker {
    font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
    line-height: 24px;
    color: ${({ theme }) => theme.colors.text};
  }
`;
