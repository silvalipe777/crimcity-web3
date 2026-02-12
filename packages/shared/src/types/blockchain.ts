export type TokenTxType =
  | 'REWARD_ROBBERY'
  | 'REWARD_ROUND_WIN'
  | 'REWARD_KILL'
  | 'REWARD_RANKING'
  | 'REWARD_STAKING'
  | 'PURCHASE_ITEM'
  | 'PURCHASE_DRUG'
  | 'MARKETPLACE_SALE'
  | 'MARKETPLACE_BUY'
  | 'STAKE'
  | 'UNSTAKE'
  | 'CASINO_WIN'
  | 'CASINO_LOSS';

export type TxStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export interface TokenTransaction {
  id: string;
  playerId: string;
  type: TokenTxType;
  amount: number;
  description: string;
  txSignature: string | null;
  status: TxStatus;
  createdAt: string;
}

export interface StakingInfo {
  amountStaked: number;
  tier: string;
  stakedAt: string | null;
  lastClaimAt: string | null;
  pendingRewards: number;
  bonuses: StakingBonuses;
}

export interface StakingBonuses {
  staminaRecoveryBonus: number;
  robberySuccessBonus: number;
  prisonTimeReduction: number;
  respectBonus: number;
}
