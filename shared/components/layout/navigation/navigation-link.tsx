import Link from 'next/link';
import { ListItem, NavLink } from './styles';
import { useRouter } from 'next/router';

export type NavigationLinkProps = {
  title: string;
  path: string;
  customPathname?: string;
  icon: JSX.Element;
  external?: boolean;
};

export const NavigationLink = ({
  title,
  icon,
  path,
  customPathname,
  external,
}: NavigationLinkProps) => {
  const { pathname } = useRouter();

  const isActive = pathname === (customPathname ?? path);

  return (
    <ListItem key={path}>
      <Link href={path} target={external ? '_blank' : undefined}>
        <NavLink active={isActive}>
          {icon}
          <span>{title}</span>
        </NavLink>
      </Link>
    </ListItem>
  );
};
