import { Identicon, Text } from '@lidofinance/lido-ui';
import Link from 'next/link';

import { vaultTexts } from 'modules/vaults';

import { useVaultOverview } from 'features/overview/contexts';

import {
  VaultContainer,
  Tier,
  VaultAddress,
  VaultBaseInfo,
  VaultRR,
  VaultAddressAndTier,
  TierNotConnected,
} from './styles';

const { general } = vaultTexts.metrics;

export const Vault = () => {
  // TODO: add tier level
  const {
    values: { address, reserveRatio, isVaultConnected },
  } = useVaultOverview();

  return (
    <VaultContainer>
      <Identicon diameter={72} address={address} />
      <VaultBaseInfo>
        <VaultAddressAndTier>
          <VaultAddress symbols={4} address={address} />
          {isVaultConnected ? (
            <Tier>
              {general.tier.connected} {1}
            </Tier>
          ) : (
            <TierNotConnected>{general.tier.notConnected}</TierNotConnected>
          )}
        </VaultAddressAndTier>
        {isVaultConnected && (
          <VaultRR>
            <Text size="xxs">
              {reserveRatio} {general.reserveRatio}
            </Text>
            <Link href="#">{general.action}</Link>
          </VaultRR>
        )}
      </VaultBaseInfo>
    </VaultContainer>
  );
};
