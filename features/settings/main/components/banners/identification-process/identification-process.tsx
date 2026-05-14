import { Text, Link } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';

import { useMitigateRisks } from 'modules/vaults';
import {
  NO_IDENTIFICATION_LINK,
  PDG_LINK,
  BannerWithoutTitle,
} from 'shared/components';

import { useMainSettingsData } from 'features/settings/main/contexts';
import { PDGPolicy } from 'features/settings/main/consts';
import type { MainSettingsFormValidatedValues } from 'features/settings/main/types';

export const IdentificationProcess = () => {
  const { nodeOperator, isNodeOperatorVerified, isLoading, isError } =
    useMitigateRisks();
  const { data } = useMainSettingsData();
  const selectedPdgPolicy = useWatch<MainSettingsFormValidatedValues>({
    name: 'pdgPolicy',
  });

  const showBanner =
    data?.pdgPolicy !== PDGPolicy.ALLOW_DEPOSIT_AND_PROVE &&
    selectedPdgPolicy === PDGPolicy.ALLOW_DEPOSIT_AND_PROVE;
  if (
    isNodeOperatorVerified ||
    !showBanner ||
    isLoading ||
    isError ||
    !nodeOperator
  ) {
    return null;
  }

  return (
    <BannerWithoutTitle>
      <Text size="xxs" color="warning">
        Operator{' '}
        <span style={{ fontWeight: 'bold' }}>{nodeOperator.toLowerCase()}</span>{' '}
        has not passed the{' '}
        <Link href={NO_IDENTIFICATION_LINK}>identification process</Link>.
      </Text>
      <Text size="xxs" color="warning">
        By allowing this Node Operator to perform{' '}
        <Link href={PDG_LINK}>unguaranteed deposits</Link>, you confirm that
        there is mutual off-chain trust between the Node Operator and the Vault
        Owner, and that you understand and accept the risks associated with the
        selected Predeposit Guarantee Policy.
      </Text>
    </BannerWithoutTitle>
  );
};
