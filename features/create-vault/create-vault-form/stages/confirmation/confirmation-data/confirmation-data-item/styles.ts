import { AddressBadge } from 'shared/components';
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
  justify-self: end;
`;

export const ConfirmationAddressBadge = styled(AddressBadge)`
  grid-column: 2;
  justify-self: end;
`;
