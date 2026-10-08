import { ONE_ETHER } from 'consts/tx';
import type { ValidatorStatus } from 'modules/vaults';

export enum VALIDATOR_MODALS {
  withdrawalToVault = 'withdrawalToVault',
  topUpValidator = 'topUpValidator',
}

export const BEACONCHA_LINK_BY_NETWORK: Record<1 | 560048, string> = {
  [1]: 'https://beaconcha.in',
  [560048]: 'https://hoodi.beaconcha.in',
};

export const numberRegex = /^\d+$/;

export const VALIDATOR_PUBKEY_LENGTH = 98;
export const MIN_ACTIVATION_BALANCE = ONE_ETHER * 32n;

// The API has a single `in_queue` status covering two cases — a PDG pre-deposit
// and an off-book deposit — told apart by the `isPdg` flag. The UI shows them as
// separate statuses, so the view layer has two keys the API never sends.
export type ValidatorViewStatus =
  | ValidatorStatus
  | 'deposited'
  | 'pre_deposited';

// Written out by hand on purpose: this module and `fetch-validators.ts` import
// each other, so spreading the `VALIDATOR_STATUSES` enum here read an
// uninitialized binding and silently produced a map with only the keys written
// below it. Keep the keys explicit — do not "simplify" this back to a spread.
// The `Record<ValidatorViewStatus, string>` annotation still fails compilation
// if the API enum gains a status.
export const VALIDATORS_VIEW_STATUSES: Record<ValidatorViewStatus, string> = {
  active_ongoing: 'active_ongoing',
  active_exiting: 'active_exiting',
  active_slashed: 'active_slashed',
  exited_slashed: 'exited_slashed',
  exited_unslashed: 'exited_unslashed',
  withdrawal_possible: 'withdrawal_possible',
  withdrawal_done: 'withdrawal_done',
  pending_initialized: 'pending_initialized',
  pending_queued: 'pending_queued',
  // `in_queue` is the fallback wherever `isPdg` is unknown: aggregated counters
  // and the filter
  in_queue: 'in queue',
  deposited: 'deposited',
  pre_deposited: 'pre-deposited',
};
