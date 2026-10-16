import { Identicon } from '@lidofinance/lido-ui';

import { ReportState } from 'shared/components';
import { useVault } from 'modules/vaults';

import { CurrentVaultWrapper, Content, AddressStyled } from './styles';

export const CurrentVault = () => {
  const { vaultAddress } = useVault();

  if (!vaultAddress) {
    return null;
  }

  return (
    <CurrentVaultWrapper>
      <Identicon address={vaultAddress} diameter={40} />
      <Content>
        <AddressStyled address={vaultAddress} symbols={4} />
        <ReportState />
      </Content>
    </CurrentVaultWrapper>
  );
};
