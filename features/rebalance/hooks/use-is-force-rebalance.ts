import { useRebalanceMode } from './use-rebalance-mode';

export const useIsForceRebalance = () => useRebalanceMode() === 'force';
