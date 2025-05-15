import styled, { css } from 'styled-components';

const textBase = css`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 24px;
  text-wrap: balance;
`;

export const Text = styled.span`
  ${textBase};
`;

export const TextError = styled.span`
  ${textBase};
  color: ${({ theme }) => theme.colors.error};
`;

export const TextBold = styled.span`
  ${textBase};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
