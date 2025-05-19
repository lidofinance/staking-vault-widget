import { MouseEvent, FC, PropsWithChildren } from 'react';

import { Button } from './styles';
import Link from 'next/link';

export type CloseButtonProps = {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  href?: string;
};

export const ButtonLink: FC<PropsWithChildren<CloseButtonProps>> = ({
  onClick,
  children,
  href,
}) => {
  const content = (
    <Button onClick={onClick} type="button">
      {children}
    </Button>
  );

  if (href) {
    <Link href={href}>{content}</Link>;
  }

  return content;
};
