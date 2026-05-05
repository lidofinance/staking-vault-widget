import styled from 'styled-components';

export const List = styled.ol`
  list-style-position: inside;
`;

export const Description = styled.li`
  color: ${({ theme }) => theme.colors.text};
`;
