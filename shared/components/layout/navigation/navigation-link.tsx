import Link from 'next/link';
import { ListItem, NavLink } from './styles';
import { useRouter } from 'next/router';

export type NavigationLinkProps = {
  title: string;
  path: string;
  customPathname?: string;
  icon: JSX.Element;
};

export const NavigationLink = ({
  title,
  icon,
  path,
  customPathname,
}: NavigationLinkProps) => {
  const { pathname } = useRouter();

  const isActive = pathname === (customPathname ?? path);

  return (
    <ListItem key={path}>
      <Link href={path}>
        <NavLink active={isActive}>
          {icon}
          <span>{title}</span>
        </NavLink>
      </Link>
    </ListItem>
  );
};
