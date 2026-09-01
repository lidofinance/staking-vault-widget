import styled from 'styled-components';

export const HintText = styled.span<{ $strong?: boolean }>`
  color: #fff;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
  font-weight: ${({ $strong }) => ($strong ? 700 : 'normal')};
`;
