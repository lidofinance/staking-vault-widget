import { Identicon } from '@lidofinance/lido-ui';

import { InlineLoader, ReportState } from 'shared/components';
import { useVault } from 'modules/vaults';

import { useVaultNavLoading } from '../../hooks';

import { CurrentVaultWrapper, Content, AddressStyled } from './styles';

export const CurrentVault = () => {
  const { vaultAddress } = useVault();
  const isLoading = useVaultNavLoading();

  if (!vaultAddress) {
    return null;
  }

  return (
    <CurrentVaultWrapper>
      <Identicon address={vaultAddress} diameter={40} />
      <Content>
        <AddressStyled address={vaultAddress} symbols={4} />
        <InlineLoader isLoading={isLoading} width={140} height={20}>
          <ReportState />
        </InlineLoader>
      </Content>
    </CurrentVaultWrapper>
  );
};
