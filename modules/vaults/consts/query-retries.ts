import { VaultDisconnectedError } from './errors';

export const baseRetry = (failureCount: number, error: unknown) => {
  // retry only if the error is not our custom error
  return failureCount < 3 && !(error instanceof VaultDisconnectedError);
};
