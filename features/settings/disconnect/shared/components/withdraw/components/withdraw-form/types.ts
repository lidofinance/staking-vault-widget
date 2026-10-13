import type { z } from 'zod';

import type { disconnectWithdrawFormSchema } from './validation';

export type DisconnectWithdrawFormValidatedValues = z.infer<
  ReturnType<typeof disconnectWithdrawFormSchema>
>;

export type DisconnectWithdrawFormFieldValues = {
  useOwnerAddress: boolean;
  // the raw field value is looser than the validated one, it can be a partially
  // typed address while the user is filling the input
  recipient: DisconnectWithdrawFormValidatedValues['recipient'] | string;
};
