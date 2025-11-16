import { useVault, vaultTexts } from 'modules/vaults';

import { useVaultOverviewData } from 'features/overview/hooks';

import { GeneralInfo, RequestTier, ApproveButton } from './components';
import { Content, Title, Wrapper } from './styles';

const { connectVault } = vaultTexts.metrics;

export const ConnectVault = () => {
  const { activeVault } = useVault();
  const { isLoading } = useVaultOverviewData();
  const { isVaultDisconnected, isVaultConnected } = activeVault ?? {};

  if (!activeVault || isVaultDisconnected || isVaultConnected || isLoading) {
    return null;
  }

  return (
    <Wrapper>
      <Title as="h2" color="text">
        {connectVault.title}
      </Title>
      <Content>
        <GeneralInfo />
        <RequestTier />
      </Content>
      <ApproveButton />
    </Wrapper>
  );
};
