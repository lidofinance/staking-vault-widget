import { z } from 'zod';

import { VERIFICATION_CONFIRM_FIELD_NAMES } from './types';
import type {
  VerificationBannerState,
  VerificationConfirmationFlags,
  VerificationConfirmFieldName,
  VerificationConfirmFieldValues,
} from './types';

const CONFIRMATION_REQUIRED_MESSAGE =
  'Confirm the risk acknowledgement to proceed';

export const verificationConfirmDefaultValues: VerificationConfirmFieldValues =
  {
    notOwner: false,
    multipleOwners: false,
    unguaranteedDeposits: false,
  };

export const getVerificationValidationContext = ({
  isNotOwnerWarningVisible,
  isMultipleOwnersWarningVisible,
  isUnguaranteedDepositsWarningVisible,
}: Pick<
  VerificationBannerState,
  | 'isNotOwnerWarningVisible'
  | 'isMultipleOwnersWarningVisible'
  | 'isUnguaranteedDepositsWarningVisible'
>): VerificationConfirmationFlags => ({
  notOwner: isNotOwnerWarningVisible,
  multipleOwners: isMultipleOwnersWarningVisible,
  unguaranteedDeposits: isUnguaranteedDepositsWarningVisible,
});

const addConfirmationIssue = (
  ctx: z.RefinementCtx,
  path: VerificationConfirmFieldName,
) => {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: CONFIRMATION_REQUIRED_MESSAGE,
    path: [path],
  });
};

export const verificationConfirmSchema = (
  confirmationRequired: VerificationConfirmationFlags,
) =>
  z
    .object({
      notOwner: z.boolean(),
      multipleOwners: z.boolean(),
      unguaranteedDeposits: z.boolean(),
    })
    .superRefine((values, ctx) => {
      if (
        confirmationRequired[VERIFICATION_CONFIRM_FIELD_NAMES.notOwner] &&
        values.notOwner !== true
      ) {
        addConfirmationIssue(ctx, VERIFICATION_CONFIRM_FIELD_NAMES.notOwner);
      }

      if (
        confirmationRequired[VERIFICATION_CONFIRM_FIELD_NAMES.multipleOwners] &&
        values.multipleOwners !== true
      ) {
        addConfirmationIssue(
          ctx,
          VERIFICATION_CONFIRM_FIELD_NAMES.multipleOwners,
        );
      }

      if (
        confirmationRequired[
          VERIFICATION_CONFIRM_FIELD_NAMES.unguaranteedDeposits
        ] &&
        values.unguaranteedDeposits !== true
      ) {
        addConfirmationIssue(
          ctx,
          VERIFICATION_CONFIRM_FIELD_NAMES.unguaranteedDeposits,
        );
      }
    });
