import { useState, useEffect } from 'react';
import { Identicon, Text } from '@lidofinance/lido-ui';
import Link from 'next/link';

import { vaultTexts } from 'modules/vaults';
import { devicesHeaderMedia } from 'styles/global';

import { useVaultOverview } from 'features/overview/contexts';

import {
  VaultContainer,
  VaultAddress,
  VaultBaseInfo,
  VaultRR,
  VaultAddressAndTier,
} from './styles';

const { general } = vaultTexts.metrics;

const matchTabletMedia = () => {
  return window.matchMedia(devicesHeaderMedia.tablet).matches;
};

export const Vault = () => {
  // TODO: add tier level
  const {
    values: { address, reserveRatio, isVaultConnected },
  } = useVaultOverview();

  const [diameter, setDiameter] = useState<number>(() =>
    matchTabletMedia() ? 56 : 72,
  );

  useEffect(() => {
    const resizeListener = () => {
      if (matchTabletMedia()) setDiameter(56);
      else setDiameter(72);
    };

    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

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
