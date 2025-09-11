import { NoticeContainer } from 'features/overview/shared';

export const CapitalQuarantined = () => {
  return (
    <NoticeContainer
      title="Part of the capital is quarantined"
      description="98.9636 ETH increase in Total Value is pending due to a sudden jump in the value reported by the oracle. The amount will be unlocked gradually until 2025-09-12."
      actions={[]}
    />
  );
};
