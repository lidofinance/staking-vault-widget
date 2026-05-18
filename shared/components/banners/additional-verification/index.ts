export { VerificationErrorBanners } from './verification-error-banners';
export { VerificationWarningBanners } from './verification-warning-banners';
export {
  useVerificationBannerDefender,
  useDisableFormByVerification,
} from './hooks';
export {
  verificationConfirmDefaultValues,
  verificationConfirmSchema,
  getVerificationValidationContext,
} from './validation';
export type {
  AdditionalVerificationAction,
  VerificationBannerState,
  VerificationConfirmationFlags,
  VerificationConfirmFieldName,
  VerificationConfirmFieldValues,
} from './types';

export { NO_IDENTIFICATION_LINK, PDG_LINK } from './const';
