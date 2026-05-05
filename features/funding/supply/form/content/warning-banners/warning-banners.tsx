import {
  MultipleOwners,
  NotOwner,
  UnguaranteedDeposits,
} from '../../components';

export const WarningBanners = () => {
  return (
    <>
      <NotOwner />
      <MultipleOwners />
      <UnguaranteedDeposits />
    </>
  );
};
