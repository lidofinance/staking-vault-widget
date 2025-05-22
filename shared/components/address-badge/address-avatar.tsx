import { useState } from 'react';
import { zeroAddress } from 'viem';
import { useEnsAvatar } from 'wagmi';
import { Identicon } from '@lidofinance/lido-ui';

import { useMainnetOnlyWagmi } from 'modules/web3';

import { AddressAvatarLoader, AddressAvatarImage } from './styles';

type AddressAvatarProps = {
  address?: string;
  ensName?: string | null;
};

export const AddressAvatar = ({ address, ensName }: AddressAvatarProps) => {
  const [isBrokenImage, setIsBrokenImage] = useState(false);
  const [isNativeImageLoading, setIsNativeImageLoading] = useState(false);
  const { mainnetConfig } = useMainnetOnlyWagmi();
  const {
    data: ensAvatar,
    isError: isEnsAvatarError,
    isLoading,
  } = useEnsAvatar({
    config: mainnetConfig,
    name: ensName ?? undefined,
  });

  if (isNativeImageLoading || isLoading) {
    return <AddressAvatarLoader />;
  }

  if (isBrokenImage || isEnsAvatarError || !ensName || !ensAvatar) {
    return <Identicon address={address ?? zeroAddress} />;
  }

  return (
    <AddressAvatarImage
      src={ensAvatar}
      alt={`${ensName} avatar`}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onLoadStart={() => {
        setIsNativeImageLoading(true);
      }}
      onLoad={() => {
        setIsNativeImageLoading(false);
      }}
      onError={() => {
        setIsNativeImageLoading(false);
        setIsBrokenImage(true);
      }}
    />
  );
};
