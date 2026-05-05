import { z } from 'zod';

import { ANTI_SCAM_CONFIRM_FIELD_NAMES } from './types';
import type {
  AntiScamBannerState,
  AntiScamConfirmationFlags,
  AntiScamConfirmFieldName,
  AntiScamConfirmFieldValues,
} from './types';

const CONFIRMATION_REQUIRED_MESSAGE =
  'Confirm the risk acknowledgement to proceed';

export const antiScamConfirmDefaultValues: AntiScamConfirmFieldValues = {
  notOwner: false,
  multipleOwners: false,
  unguaranteedDeposits: false,
};

export const getAntiScamValidationContext = ({
  isNotOwnerWarningVisible,
  isMultipleOwnersWarningVisible,
  isUnguaranteedDepositsWarningVisible,
}: Pick<
  AntiScamBannerState,
  | 'isNotOwnerWarningVisible'
  | 'isMultipleOwnersWarningVisible'
  | 'isUnguaranteedDepositsWarningVisible'
>): AntiScamConfirmationFlags => ({
  notOwner: isNotOwnerWarningVisible,
  multipleOwners: isMultipleOwnersWarningVisible,
  unguaranteedDeposits: isUnguaranteedDepositsWarningVisible,
});

const addConfirmationIssue = (
  ctx: z.RefinementCtx,
  path: AntiScamConfirmFieldName,
) => {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: CONFIRMATION_REQUIRED_MESSAGE,
    path: [path],
  });
};

export const antiScamConfirmSchema = (
  confirmationRequired: AntiScamConfirmationFlags,
) =>
  z
    .object({
      notOwner: z.boolean(),
      multipleOwners: z.boolean(),
      unguaranteedDeposits: z.boolean(),
    })
    .superRefine((values, ctx) => {
      if (
        confirmationRequired[ANTI_SCAM_CONFIRM_FIELD_NAMES.notOwner] &&
        values.notOwner !== true
      ) {
        addConfirmationIssue(ctx, ANTI_SCAM_CONFIRM_FIELD_NAMES.notOwner);
      }

      if (
        confirmationRequired[ANTI_SCAM_CONFIRM_FIELD_NAMES.multipleOwners] &&
        values.multipleOwners !== true
      ) {
        addConfirmationIssue(ctx, ANTI_SCAM_CONFIRM_FIELD_NAMES.multipleOwners);
      }

      if (
        confirmationRequired[
          ANTI_SCAM_CONFIRM_FIELD_NAMES.unguaranteedDeposits
        ] &&
        values.unguaranteedDeposits !== true
      ) {
        addConfirmationIssue(
          ctx,
          ANTI_SCAM_CONFIRM_FIELD_NAMES.unguaranteedDeposits,
        );
      }
    });
