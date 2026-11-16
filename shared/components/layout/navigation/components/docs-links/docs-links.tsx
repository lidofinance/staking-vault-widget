import { External } from '@lidofinance/lido-ui';

import { docsLinks } from 'shared/components/layout/navigation/const';

import { List, Link } from './styles';

const toSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-');

export const DocsLinks = () => {
  return (
    <List>
      {docsLinks.map(({ title, href }) => (
        <li key={title}>
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`navDocsLink-${toSlug(title)}`}
          >
            <span>{title}</span>
            <External />
          </Link>
        </li>
      ))}
    </List>
  );
};
