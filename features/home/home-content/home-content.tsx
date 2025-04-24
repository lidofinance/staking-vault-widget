import { useRouter } from 'next/router';
import { MyVaults } from 'features/home/my-vaults';
import { AllVaults } from 'features/home/all-vaults';

export const HomeContent = () => {
  const router = useRouter();
  const {
    query: { mode },
  } = router;

  const showPersonal = mode === 'personal';

  return <>{showPersonal ? <MyVaults /> : <AllVaults />}</>;
};
