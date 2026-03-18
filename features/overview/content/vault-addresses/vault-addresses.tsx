import { useMemo } from 'react';

import { useVault } from 'modules/vaults';
import { InlineLoader } from 'shared/components';

import { ContractAddress } from '../../shared';

import { Container, Content, Title, VaultAddressesWrapper } from './styles';

export const VaultAddresses = () => {
  const { activeVault } = useVault();
  const { dashboard, lazyOracle, hub, operatorGrid, isVaultDisconnected } =
    activeVault ?? {};

  const contractInfoList = useMemo(() => {
    return [
      {
        title: 'Dashboard',
        address: dashboard?.address,
      },
      {
        title: 'VaultHub',
        address: hub?.address,
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
  }, [dashboard, lazyOracle, hub, operatorGrid]);

  if (isVaultDisconnected) {
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
