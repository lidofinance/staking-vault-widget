import {
  MultipleOwnersError,
  NotOwnerError,
  UnguaranteedDepositsError,
} from '../../components';

export const ErrorBanners = () => {
  return (
    <>
      <NotOwnerError />
      <MultipleOwnersError />
      <UnguaranteedDepositsError />
    </>
  );
};
