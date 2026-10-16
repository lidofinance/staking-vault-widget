import { DocsLinks, HomeNavigationList, NavSection } from '../components';

export const RootNavigation = () => {
  return (
    <>
      <HomeNavigationList />
      <NavSection>
        <DocsLinks />
      </NavSection>
    </>
  );
};
