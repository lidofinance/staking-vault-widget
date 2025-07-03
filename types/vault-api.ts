export interface VaultApiMetrics {
  rebaseReward: bigint;
  grossStakingRewards: bigint;
  nodeOperatorRewards: bigint;
  dailyLidoFees: bigint;
  netStakingRewards: bigint;
  grossStakingAPR: number;
  grossStakingAprBps: number;
  grossStakingAprPercent: number;
  netStakingAPR: number;
  netStakingAprBps: number;
  netStakingAprPercent: number;
  bottomLine: bigint;
  carrySpreadAPR: number;
  carrySpreadAprBps: number;
  carrySpreadAprPercent: number;
  updatedAt: Date;
}
