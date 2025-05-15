import { ButtonIcon } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const InputTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text};
`;

export const InputNotes = styled.p`
  margin-top: 8px;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.text};
`;

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
