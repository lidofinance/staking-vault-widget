import { Identicon, Text } from '@lidofinance/lido-ui';
import Link from 'next/link';
import { zeroAddress } from 'viem';

import { vaultTexts } from 'modules/vaults';

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
  const { values } = useVaultOverview();

  const { address, reserveRatio, isVaultConnected } = values || {};

  const diameter = useIdenticonSize();

  return (
    <VaultContainer data-testid="vaultInfo">
      <Identicon
        diameter={diameter}
        address={address ?? zeroAddress}
        data-testid="vaultIcon"
      />
      <VaultBaseInfo>
        <VaultAddressAndTier>
          <VaultAddress
            symbols={4}
            address={address ?? zeroAddress}
            data-testid="vaultAddress"
          />
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
