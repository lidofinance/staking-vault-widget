import { Text, Link } from '@lidofinance/lido-ui';
import NextLink from 'next/link';

import { useVaultSettingsLink } from '../../hooks';
import { PDG_LINK } from '../../const';

export const WarningBannerText = () => {
  const mainSettingsLink = useVaultSettingsLink('main');

  return (
    <Text size="xxs">
      Current <Link href={PDG_LINK}>Predeposit Guarantee Policy</Link> allows{' '}
      <NextLink href={mainSettingsLink}>unguaranteed deposits</NextLink>. By
      proceeding, you confirm that there is mutual off-chain trust between the
      Node Operator and the Vault Owner.
    </Text>
  );
};
