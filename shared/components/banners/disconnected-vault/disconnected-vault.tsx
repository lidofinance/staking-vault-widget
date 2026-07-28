import { Text } from '@lidofinance/lido-ui';

import { ReactComponent as WarningTriangle } from 'assets/icons/warning-triangle.svg';
import { useVault } from 'modules/vaults';
import { vaultTexts } from 'modules/vaults/consts/texts';

import { Title, Wrapper } from './styles';

const texts = vaultTexts.metrics.banners.disconnectedVault;

export const DisconnectedVault = () => {
  const { activeVault } = useVault();
  const { isPendingDisconnect, isVaultConnected } = activeVault ?? {};

  if (!activeVault || (isVaultConnected && !isPendingDisconnect)) {
    return null;
  }

  const { title, description } = isPendingDisconnect
    ? texts.pendingDisconnect
    : texts.disconnected;

  return (
    <Wrapper>
      <Title>
        <WarningTriangle />
        <Text size="xs" as="h3" strong>
          {title}
        </Text>
      </Title>

      <Text size="xxs">{description}</Text>
    </Wrapper>
  );
};
