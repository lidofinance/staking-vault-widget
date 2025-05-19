import styled, { css } from 'styled-components';

export { SectionContainer } from 'features/create-vault/create-vault-form/styles';

const textBase = css`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 24px;
  text-wrap: balance;
`;

export const TextError = styled.span`
  ${textBase};
  color: ${({ theme }) => theme.colors.error};
`;

export const TextBold = styled.span`
  ${textBase};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  justify-self: end;
`;

export const Wrapper = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  width: 100%;
`;

export const ConfirmInfoTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  list-style: none;
`;

export const ListItem = styled.li`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px;

  padding: ${({ theme }) => theme.spaceMap.sm}px 0px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ListItemCompact = styled.li`
  display: flex;
  align-items: flex-start;
  padding-top: ${({ theme }) => theme.spaceMap.sm}px;
  justify-content: space-between;
`;

export const ConfirmationLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text};
  grid-row: 1 / 2;
  display: inline-flex;
  align-items: center;
`;
