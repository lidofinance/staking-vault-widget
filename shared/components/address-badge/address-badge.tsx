import { FC, MouseEvent } from 'react';
import styled, { css } from 'styled-components';
import { Button, Close, Address, Identicon } from '@lidofinance/lido-ui';

export interface AddressBadgeProps {
  address: string;
  symbols?: number;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const PillContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 6px 12px 6px 6px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background-color: var(--lido-color-shadowLight);
  white-space: nowrap;
  text-wrap: nowrap;
`;

const AddressText = styled(Address)`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 700;
  line-height: 1.7em;
`;

const CloseButton = styled(Button)`
  margin-left: 8px;
  flex-shrink: 0;

  ${({ theme }) => css`
    color: ${theme.colors.text || '#fff'};
    &:hover {
      color: ${theme.colors.accent || '#ccc'};
    }
  `}
`;

export const AddressBadge: FC<AddressBadgeProps> = (props) => {
  const { address, symbols = 6, onClick } = props;
  return (
    <PillContainer>
      <Identicon address={address} />
      <AddressText symbols={symbols} address={address} />

      {onClick && (
        <CloseButton size="xs" onClick={onClick}>
          <Close />
        </CloseButton>
      )}
    </PillContainer>
  );
};
