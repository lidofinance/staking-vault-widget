import { MyVaults } from 'features/home/my-vaults';
import { AllVaults } from 'features/home/all-vaults';
import { useRouterPath } from 'shared/hooks/use-router-path';
import { AppPaths } from 'consts/urls';

export const HomeContent = () => {
  const pathname = useRouterPath();
  const showAll = pathname === AppPaths.main;
  const showMy = pathname === `${AppPaths.main}?mode=personal`;

  return (
    <>
      {showAll && <AllVaults />}
      {showMy && <MyVaults />}
    </>
  );
};
