import styled from 'styled-components';

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

export const Link = styled.a`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: fit-content;
  color: var(--lido-color-primary);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.3px;
  text-decoration: none;

  &:hover {
    color: var(--lido-color-primary);
    opacity: 0.8;
  }

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }
`;
