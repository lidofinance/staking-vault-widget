import styled from 'styled-components';

export const Wrapper = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const VaultInfoTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
`;
