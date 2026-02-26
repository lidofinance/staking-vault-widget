import { useMemo } from 'react';

import { useVault } from 'modules/vaults';
import { InlineLoader } from 'shared/components';

import { ContractAddress } from '../../shared';

import { Container, Content, Title } from './styles';

export const VaultAddresses = () => {
  const { activeVault } = useVault();
  const { dashboard, lazyOracle, hub, operatorGrid } = activeVault ?? {};

  const contractInfoList = useMemo(() => {
    return [
      {
        title: 'Dashboard',
        address: dashboard?.address,
      },
      {
        title: 'VaultHub',
        address: lazyOracle?.address,
      },
      {
        title: 'LazyOracle',
        address: hub?.address,
      },
      {
        title: 'OperatorGrid',
        address: operatorGrid?.address,
      },
    ];
  }, [dashboard, lazyOracle, hub, operatorGrid]);

  return (
    <Container>
      <Title>Vault addresses</Title>
      <Content>
        {contractInfoList.map(({ title, address }) => (
          <InlineLoader
            key={title}
            isLoading={!address}
            height={80}
            width={320}
          >
            <ContractAddress title={title} address={address} />
          </InlineLoader>
        ))}
      </Content>
    </Container>
  );
};
