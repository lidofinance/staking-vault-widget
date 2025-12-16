import { appPaths } from 'consts/routing';
import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

import { AllVaultsPage } from 'features/home';

export default AllVaultsPage;

export const getStaticProps = getDefaultStaticProps(appPaths.vaults.all);
