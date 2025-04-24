import { useRouter } from 'next/router';
import { MyVaults } from 'features/home/my-vaults';
import { AllVaults } from 'features/home/all-vaults';
import { AppPaths } from 'consts/urls';

export const HomeContent = () => {
  const router = useRouter();
  const {
    pathname,
    query: { mode },
  } = router;
  const showAll = pathname === AppPaths.main && !mode;
  const showMy = pathname === AppPaths.main && mode === 'personal';

  return (
    <>
      {showAll && <AllVaults />}
      {showMy && <MyVaults />}
    </>
  );
};
