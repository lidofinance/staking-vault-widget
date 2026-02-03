import type { FC } from 'react';
import Link from 'next/link';

type LearnMoreProps = {
  link: string;
};

export const LearnMore: FC<LearnMoreProps> = ({ link }) => {
  return (
    <Link href={link} target="_blank" rel="noopener noreferrer">
      Learn more.
    </Link>
  );
};
