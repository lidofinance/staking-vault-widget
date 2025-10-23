import Link from 'next/link';
import { BannerWrapper, TextWhite } from './styles';

export const MigrationBannerPublicNetV3 = () => {
  return (
    <BannerWrapper>
      <TextWhite>
        ✅ stVaults Testnet UI is now live at a permanent address:{' '}
        <Link target="_blank" href="https://stvaults-hoodi.testnet.fi">
          https://stvaults-hoodi.testnet.fi
        </Link>
        . Happy testing!
      </TextWhite>
    </BannerWrapper>
  );
};
