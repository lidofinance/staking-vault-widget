import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

const { description } = vaultTexts.actions.validators.modals.withdrawal;

export const Description = () => {
  return <Text size="xs">{description}</Text>;
};
