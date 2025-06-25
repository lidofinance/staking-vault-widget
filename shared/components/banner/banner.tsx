import Link from 'next/link';
import { BannerWrapper, TextWhite } from './styles';

const DISABLE_DATE = new Date('2025-07-09T00:00:00Z');

export const MigrationBannerTestnetV2 = () => {
  if (new Date() > DISABLE_DATE) return null;
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
