import { Text } from '@lidofinance/lido-ui';

import { formatExpiry } from 'utils/formats';

export const ExpiresInItem = ({
  expiryTimestamp,
  strong,
}: {
  expiryTimestamp?: bigint;
  strong?: boolean;
}) => {
  if (!expiryTimestamp) return null;

  const expiry = formatExpiry(expiryTimestamp);

  return (
    <Text size="xxs" strong={!!strong}>
      {expiry}
    </Text>
  );
};
