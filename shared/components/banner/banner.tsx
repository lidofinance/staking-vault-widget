import Link from 'next/link';
import { BannerWrapper, TextWhite } from './styles';

export const MigrationBannerTestnetV2 = () => {
  return (
    <BannerWrapper>
      <TextWhite>
        ✅ stVaults Testnet-2 is live! The Web UI is now connected to the new
        contracts. Happy testing!{' '}
        <Link
          target="_blank"
          href="https://docs.lido.fi/deployed-contracts/hoodi-lidov3/"
        >
          Deployed contracts
        </Link>
        .
      </TextWhite>
    </BannerWrapper>
  );
};
