import styled from 'styled-components';
import { ButtonIcon } from '@lidofinance/lido-ui';

/// CreateVaultInput

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 12px;
`;

export const InputHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InputTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text};
`;

export const InputDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.textSecondary};
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
