import { useRef, type FC } from 'react';
import { Identicon } from '@lidofinance/lido-ui';
import type { Address } from 'viem';

import { AddressPopover } from 'shared/components/address-badge/address-popover';
import { isBoolean } from 'utils';

import { VerifiedOperator } from '../verified-operator';
import { UnverifiedOperator } from '../unverified-operator';
import {
  Container,
  NodeOperatorAddress,
  NodeOperatorAddressWrapper,
} from './styles';

type OperatorAddressProps = {
  address: Address;
  isNodeOperatorVerified: boolean | undefined;
};

export const OperatorAddress: FC<OperatorAddressProps> = ({
  address,
  isNodeOperatorVerified,
}) => {
  const ref = useRef(null);

  return (
    <Container>
      <AddressPopover
        address={address}
        anchorRef={ref}
        placement="topLeft"
        mode="hover"
        isOpen
      >
        <NodeOperatorAddressWrapper>
          <Identicon diameter={16} address={address} data-testid="noIcon" />
          <NodeOperatorAddress
            ref={ref}
            symbols={4}
            address={address}
            data-testid="noAddress"
          />
        </NodeOperatorAddressWrapper>
      </AddressPopover>
      {isBoolean(isNodeOperatorVerified) && (
        <>
          {isNodeOperatorVerified ? (
            <VerifiedOperator />
          ) : (
            <UnverifiedOperator />
          )}
        </>
      )}
    </Container>
  );
};
