import { StatusChip } from 'features/validators/shared';

import { type ValidatorStatus, VALIDATOR_STATUSES } from 'modules/vaults';

import { StatusesContainer } from './styles';

const fakeData: Array<{ volume: number; status: ValidatorStatus }> = [
  {
    volume: 2,
    status: VALIDATOR_STATUSES.active_ongoing,
  },
  {
    volume: 3,
    status: VALIDATOR_STATUSES.active_exiting,
  },
  {
    volume: 1,
    status: VALIDATOR_STATUSES.active_slashed,
  },
  {
    volume: 4,
    status: VALIDATOR_STATUSES.exited_slashed,
  },
  {
    volume: 5,
    status: VALIDATOR_STATUSES.withdrawal_possible,
  },
  {
    volume: 6,
    status: VALIDATOR_STATUSES.withdrawal_done,
  },
  {
    volume: 7,
    status: VALIDATOR_STATUSES.pending_initialised,
  },
  {
    volume: 8,
    status: VALIDATOR_STATUSES.pending_queued,
  },
  {
    volume: 9,
    status: VALIDATOR_STATUSES.exited_unslashed,
  },
];

export const AggregateStatuses = () => {
  // TODO: use data from context
  return (
    <StatusesContainer>
      {fakeData.map(({ volume, status }) => (
        <StatusChip key={status} volume={volume} status={status} />
      ))}
    </StatusesContainer>
  );
};
