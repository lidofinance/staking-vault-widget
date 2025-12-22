import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import {
  type VaultConnection,
  type VaultBaseInfo,
  useVault,
  VAULT_TOTAL_BASIS_POINTS,
  DEFAULT_TIER_ID,
  useVaultTierInfo,
} from 'modules/vaults';
import { formatPercent } from 'utils';

export type VaultTierData = ReturnType<typeof selectAlterTierData>;

type AlterKeys =
  | 'reserveRatio'
  | 'forcedRebalanceThreshold'
  | 'infraFee'
  | 'liquidityFee'
  | 'reservationFee';

// name, prev, new
export type TierChanges = {
  name: AlterKeys;
  prev: string;
  next: string;
};

type AlterTierData = {
  reserveRatioBP: number;
  forcedRebalanceThresholdBP: number;
  infraFeeBP: number;
  liquidityFeeBP: number;
  reservationFeeBP: number;
  id: number;
  tierName: string;
};

type AlterTierInfo = {
  vaultConnection: VaultConnection;
  tier: AlterTierData;
};

const toPercent = (percent: number): string =>
  formatPercent.format(percent / VAULT_TOTAL_BASIS_POINTS);

const formatData = (
  prev: number,
  next: number,
): { prev: string; next: string } => {
  return { prev: toPercent(prev), next: toPercent(next) };
};

const getAlterTierInfo = async (
  vault: VaultBaseInfo,
): Promise<AlterTierInfo> => {
  const { hub, operatorGrid } = vault;

  const vaultConnection = await hub.read.vaultConnection([vault.address]);
  const tier = await operatorGrid.read.vaultTierInfo([vault.address]);

  const [
    _,
    id,
    ___,
    reserveRatioBP,
    forcedRebalanceThresholdBP,
    infraFeeBP,
    liquidityFeeBP,
    reservationFeeBP,
  ] = tier;

  return {
    vaultConnection,
    tier: {
      reserveRatioBP: Number(reserveRatioBP),
      forcedRebalanceThresholdBP: Number(forcedRebalanceThresholdBP),
      infraFeeBP: Number(infraFeeBP),
      liquidityFeeBP: Number(liquidityFeeBP),
      reservationFeeBP: Number(reservationFeeBP),
      id: Number(id),
      tierName: id === DEFAULT_TIER_ID ? 'Default Tier' : `Tier ${Number(id)}`,
    },
  };
};

const selectAlterTierData = ({ vaultConnection, tier }: AlterTierInfo) => {
  const alterTierList: TierChanges[] = [];
  const {
    reserveRatioBP,
    forcedRebalanceThresholdBP,
    infraFeeBP,
    liquidityFeeBP,
    reservationFeeBP,
    tierName,
    id,
  } = tier;

  if (vaultConnection.reserveRatioBP !== reserveRatioBP) {
    alterTierList.push({
      name: 'reserveRatio',
      ...formatData(vaultConnection.reserveRatioBP, reserveRatioBP),
    });
  }

  if (
    vaultConnection.forcedRebalanceThresholdBP !== forcedRebalanceThresholdBP
  ) {
    alterTierList.push({
      name: 'forcedRebalanceThreshold',
      ...formatData(
        vaultConnection.forcedRebalanceThresholdBP,
        forcedRebalanceThresholdBP,
      ),
    });
  }

  if (vaultConnection.infraFeeBP !== infraFeeBP) {
    alterTierList.push({
      name: 'infraFee',
      ...formatData(vaultConnection.infraFeeBP, infraFeeBP),
    });
  }

  if (vaultConnection.liquidityFeeBP !== liquidityFeeBP) {
    alterTierList.push({
      name: 'liquidityFee',
      ...formatData(vaultConnection.liquidityFeeBP, liquidityFeeBP),
    });
  }

  if (vaultConnection.reservationFeeBP !== reservationFeeBP) {
    alterTierList.push({
      name: 'reservationFee',
      ...formatData(vaultConnection.reservationFeeBP, reservationFeeBP),
    });
  }

  const hasChanges = alterTierList.length > 0;

  return { alterTierList, hasChanges, id, tierName };
};

export const useAlterTier = () => {
  const { activeVault, queryKeys } = useVault();
  const { data: vaultTierInfo } = useVaultTierInfo();
  const proposalId = vaultTierInfo?.proposals?.extendLastProposal?._id;

  return useQuery({
    queryKey: [...queryKeys.state, 'alter-tier-info', proposalId],
    enabled: !!activeVault,
    queryFn: async () => {
      invariant(activeVault, '[useAlterTier] activeVault is not defined');
      return await getAlterTierInfo(activeVault);
    },
    select: selectAlterTierData,
  });
};
