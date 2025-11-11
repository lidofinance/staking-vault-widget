import { useRef } from 'react';
import { Identicon, Text } from '@lidofinance/lido-ui';
import Link from 'next/link';
import { zeroAddress } from 'viem';

import { useVault, VAULT_TOTAL_BASIS_POINTS, vaultTexts } from 'modules/vaults';
import { AddressPopover } from 'shared/components/address-badge/address-popover';
import { formatPercent } from 'utils';

import { useIdenticonSize } from 'features/overview/inner';

import {
  VaultContainer,
  VaultAddress,
  VaultBaseInfo,
  VaultRR,
  VaultAddressAndTier,
  VaultState,
} from './styles';

const { general } = vaultTexts.metrics;

export const Vault = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { activeVault } = useVault();

  const {
    address,
    reserveRatioBP,
    isVaultDisconnected,
    isVaultConnected,
    isPendingDisconnect,
  } = activeVault ?? {};
  const vaultAddress = address ?? zeroAddress;
  const reserveRatio = formatPercent.format(
    reserveRatioBP ?? 0 / VAULT_TOTAL_BASIS_POINTS,
  );
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
          {isVaultDisconnected && <VaultState>Disconnected</VaultState>}
          {isPendingDisconnect && <VaultState>Pending disconnect</VaultState>}
          {!isVaultConnected && !isVaultDisconnected && (
            <VaultState>Not connected</VaultState>
          )}
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
