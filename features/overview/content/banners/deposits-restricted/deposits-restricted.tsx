import { NoticeContainer } from 'features/overview/shared';

export const DepositsRestricted = () => {
  return (
    <NoticeContainer
      title="Deposits from stVault Balance to validators are temporarily restricted"
      description="Node Operator cannot deposit ETH from the stVault Balance to validators. Сonsolidations remain allowed. The Vault Owner has paused deposits from stVault Balance to validators, and the restriction is currently enforced by Lido Core."
    />
  );
};
