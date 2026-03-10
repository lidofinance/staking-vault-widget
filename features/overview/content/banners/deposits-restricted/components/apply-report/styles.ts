import styled from 'styled-components';

export const ButtonLink = styled.span`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;
