import styled from 'styled-components';
import { ButtonIcon } from '@lidofinance/lido-ui';
import { CheckboxHookForm } from 'shared/hook-form/controls';

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
  gap: 4px;
  display: inline-flex;
  & > svg {
    align-self: center;
  }
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
export const ConfirmWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

export const InfoList = styled.ul`
  display: flex;
  flex-direction: column;
  padding-left: ${({ theme }) => theme.spaceMap.md}px;
  user-select: none;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const StyledCheckboxHookForm = styled(CheckboxHookForm)`
  align-items: flex-start;
`;
