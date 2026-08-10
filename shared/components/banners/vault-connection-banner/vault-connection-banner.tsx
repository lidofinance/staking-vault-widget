import { useVault } from 'modules/vaults';
import { vaultTexts } from 'modules/vaults/consts/texts';

import { NoticeContainer } from '../../notice-container';

import { PendingConnect } from './pending-connect';

const texts = vaultTexts.metrics.banners.vaultConnection;

export const VaultConnectionBanner = () => {
  const { activeVault } = useVault();
  const { isPendingConnect, isPendingDisconnect, isVaultConnected } =
    activeVault ?? {};

  if (!activeVault || (isVaultConnected && !isPendingDisconnect)) {
    return null;
  }

  if (isPendingConnect) {
    return <PendingConnect />;
  }

  const { title, description } = isPendingDisconnect
    ? texts.pendingDisconnect
    : texts.disconnected;

  return (
    <NoticeContainer type="info" title={title} description={description} />
  );
};
