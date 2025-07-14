import { Identicon, Text } from '@lidofinance/lido-ui';
import Link from 'next/link';

import { vaultTexts } from 'modules/vaults';

import { useIdenticonSize } from 'features/overview/hooks';
import { useVaultOverview } from 'features/overview/contexts';

import {
  VaultContainer,
  VaultAddress,
  VaultBaseInfo,
  VaultRR,
  VaultAddressAndTier,
} from './styles';

const { general } = vaultTexts.metrics;

export const Vault = () => {
  const {
    values: { address, reserveRatio, isVaultConnected },
  } = useVaultOverview();

  const diameter = useIdenticonSize();

  return (
    <VaultContainer>
      <Identicon diameter={diameter} address={address} />
      <VaultBaseInfo>
        <VaultAddressAndTier>
          <VaultAddress symbols={4} address={address} />
        </VaultAddressAndTier>
        {isVaultConnected && (
          <VaultRR>
            <Text size="xxs">
              {reserveRatio} {general.reserveRatio}
            </Text>
            {/* TODO: add appPath when tiers settings will be ready*/}
            <Link href={`/vaults/${address}/settings/tier`}>
              {general.action}
            </Link>
          </VaultRR>
        )}
      </VaultBaseInfo>
    </VaultContainer>
  );
};
