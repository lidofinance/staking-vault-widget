import styled, { css } from 'styled-components';

const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

export const Content = styled.div`
  display: contents;
`;

export const Description = styled.div`
  ${flexColumn};
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const Action = styled.div`
  ${flexColumn};
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;
