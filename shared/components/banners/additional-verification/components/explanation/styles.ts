import styled from 'styled-components';

export const ExplanationList = styled.ol`
  list-style-position: inside;
`;

export const ExplanationDescription = styled.li`
  color: ${({ theme }) => theme.colors.text};
`;
