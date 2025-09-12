import { useRef } from 'react';
import { Identicon, Text } from '@lidofinance/lido-ui';
import Link from 'next/link';
import { zeroAddress } from 'viem';

import { vaultTexts } from 'modules/vaults';
import { AddressPopover } from 'shared/components/address-badge/address-popover';

import { useIdenticonSize } from 'features/overview/inner';
import { useVaultOverview } from 'features/overview/vault-overview';

import {
  VaultContainer,
  VaultAddress,
  VaultBaseInfo,
  VaultRR,
  VaultAddressAndTier,
} from './styles';

const { general } = vaultTexts.metrics;

export const Vault = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { values } = useVaultOverview();

  const { address, reserveRatio, isVaultConnected } = values || {};
  const vaultAddress = address ?? zeroAddress;

  const diameter = useIdenticonSize();

  return (
    <VaultContainer data-testid="vaultInfo">
      <Identicon
        diameter={diameter}
        address={vaultAddress}
        data-testid="vaultIcon"
      />
      <VaultBaseInfo>
        <VaultAddressAndTier>
          <AddressPopover
            address={vaultAddress}
            anchorRef={ref}
            placement="topLeft"
            mode="hover"
            isOpen
          >
            <VaultAddress
              ref={ref}
              symbols={4}
              address={vaultAddress}
              data-testid="vaultAddress"
            />
          </AddressPopover>
        </VaultAddressAndTier>
        {isVaultConnected && (
          <VaultRR>
            <Text size="xxs" color="secondary" data-testid="RR">
              {reserveRatio} {general.reserveRatio}
            </Text>
            <Link href={`/vaults/${address}/settings/tier`}>
              {general.action}
            </Link>
          </VaultRR>
        )}
      </VaultBaseInfo>
    </VaultContainer>
  );
};
