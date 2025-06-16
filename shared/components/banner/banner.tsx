import Link from 'next/link';

import { BannerWrapper, TextWhite } from './styles';

export const MigrationBannerTestnetV2 = () => {
  return (
    <BannerWrapper>
      <TextWhite>
        All Testnet data will not be available via Web UI on 23 Jun 2025 as part
        of migration to the&nbsp;
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.lido.fi/deployed-contracts/hoodi-lidov3"
        >
          stVaults Testnet-2
        </Link>
        &nbsp;contracts. Back up anything important.
      </TextWhite>
    </BannerWrapper>
  );
};
