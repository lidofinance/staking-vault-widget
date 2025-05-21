import styled from 'styled-components';
import { ButtonIcon, Checkbox } from '@lidofinance/lido-ui';

/// CreateVaultInput

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const InputTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text};
  display: inline-flex;
`;

export const InputNotes = styled.p`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.textSecondary};

  & > b {
    color: ${({ theme }) => theme.colors.text};
  }
`;

// AddressInput

export const AddressInputWrapper = styled.div`
  position: relative;
  flex-grow: 1;
`;

export const EtherScanLink = styled.span`
  position: absolute;
  top: 6px;
  right: ${({ theme }) => theme.spaceMap.md}px;
  z-index: 5;
  width: fit-content;

  & > a {
    text-wrap: nowrap;
  }
`;

export const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const AppendButton = styled(ButtonIcon)`
  width: fit-content;
  padding: 0;
  padding-inline: 4px;
  display: inline-flex;
  align-items: center;

  &:hover,
  &:active {
    background: none;
  }

  &::before {
    background: none;
  }
`;

export const AddressInputGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

// ConfirmInput
export const InfoList = styled.span`
  list-style-position: inside;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const StyledCheckbox = styled(Checkbox)<{
  isError?: boolean;
}>`
  align-items: flex-start;
  svg {
    box-shadow: ${({ isError, theme }) =>
      isError ? ` inset 0 0 0 1px ${theme.colors.error} !important` : 'unset'};
  }
`;
