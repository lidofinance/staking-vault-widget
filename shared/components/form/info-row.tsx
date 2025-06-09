import type { ComponentProps, PropsWithChildren } from 'react';
import { Text, Loader } from '@lidofinance/lido-ui';

import { Row } from './styles';

export type InfoRowProps = PropsWithChildren<
  {
    isLoading?: boolean;
    label?: string;
  } & ComponentProps<typeof Row>
>;

export const InfoRow = ({
  isLoading,
  children,
  label,
  ...props
}: InfoRowProps) => {
  return (
    <Row {...props}>
      <Text size="xxs" color="secondary">
        {label}
      </Text>
      {isLoading ? <Loader size="small" /> : children}
    </Row>
  );
};
