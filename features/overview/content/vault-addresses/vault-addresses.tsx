import { useMemo } from 'react';

import { useVault } from 'modules/vaults';
import { InlineLoader } from 'shared/components';

import { ContractAddress } from '../../shared';

import { Container, Content, Title, VaultAddressesWrapper } from './styles';

export const VaultAddresses = () => {
  const { activeVault, vaultAddress } = useVault();
  const {
    dashboard,
    lazyOracle,
    hub,
    operatorGrid,
    predepositGuarantee,
    isVaultDisconnected,
    isPendingConnect,
  } = activeVault ?? {};

  const contractInfoList = useMemo(() => {
    return [
      {
        title: 'StakingVault',
        address: vaultAddress,
      },
      {
        title: 'Dashboard',
        address: dashboard?.address,
      },
      {
        title: 'VaultHub',
        address: hub?.address,
      },
      {
        title: 'Predeposit Guarantee',
        address: predepositGuarantee?.address,
      },
      {
        title: 'LazyOracle',
        address: lazyOracle?.address,
      },
      {
        title: 'OperatorGrid',
        address: operatorGrid?.address,
      },
    ];
  }, [
    dashboard,
    lazyOracle,
    hub,
    operatorGrid,
    vaultAddress,
    predepositGuarantee,
  ]);

  if (isVaultDisconnected || isPendingConnect) {
    return null;
  }

  return (
    <VaultAddressesWrapper>
      <Container>
        <Title>Vault addresses</Title>
        <Content>
          {contractInfoList.map(({ title, address }) => (
            <InlineLoader
              key={title}
              isLoading={!address}
              height={80}
              width={240}
            >
              <ContractAddress title={title} address={address} />
            </InlineLoader>
          ))}
        </Content>
      </Container>
    </VaultAddressesWrapper>
  );
};
