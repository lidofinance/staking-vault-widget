import { useRouter } from 'next/router';
import { useSupply } from 'features/supply/contexts/supply-provider';

import { ToggleSwitch } from 'shared/components/toggle';
import { FormBlock, PageWrapper } from './styles';
import { Fund } from './fund';
import { Withdraw } from './withdraw';

import { SupplyPaths, supplyToggleList } from './const';
import { ManifestConfigPageEnum } from 'config/external-config';

export const SupplyTabs = () => {
  const router = useRouter();
  const initialPath = router.query.mode as SupplyPaths;
  const { isFundTab } = useSupply();

  const handleToggleCb = (value: SupplyPaths) => {
    void router.push(`${ManifestConfigPageEnum.supply}/${value}`);
  };

  return (
    <PageWrapper>
      <ToggleSwitch
        options={supplyToggleList}
        defaultActive={initialPath}
        onToggleCb={({ value }) => handleToggleCb(value as SupplyPaths)}
      />
      <FormBlock>{isFundTab ? <Fund /> : <Withdraw />}</FormBlock>
    </PageWrapper>
  );
};
