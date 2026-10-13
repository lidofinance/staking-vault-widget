import styled from 'styled-components';

export const ExplanationList = styled.ol`
  list-style-position: inside;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
`;

export const ExplanationDescription = styled.li`
  color: ${({ theme }) => theme.colors.text};
`;
