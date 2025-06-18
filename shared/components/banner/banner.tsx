import { BannerWrapper, TextWhite } from './styles';

export const MigrationBannerTestnetV2 = () => {
  return (
    <BannerWrapper>
      <TextWhite>
        All Testnet data will not be available via Web UI on 25 Jun 2025 as part
        of migration to the stVaults Testnet-2 contracts. Back up anything
        important.
      </TextWhite>
    </BannerWrapper>
  );
};
