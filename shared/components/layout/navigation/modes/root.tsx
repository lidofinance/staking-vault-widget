import { DocsLinks, HomeNavigationList, NavSection } from '../components';

// root layout is looser than the vault one: see Figma node 5946:21389
const HOME_LIST_GAP = 12;
const DOCS_SECTION_OFFSET = 32;

export const RootNavigation = () => {
  return (
    <>
      <HomeNavigationList gap={HOME_LIST_GAP} />
      <NavSection contentOffset={DOCS_SECTION_OFFSET}>
        <DocsLinks />
      </NavSection>
    </>
  );
};
