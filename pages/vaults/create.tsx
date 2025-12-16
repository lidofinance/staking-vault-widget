import { appPaths } from 'consts/routing';
import { CreateVaultPage } from 'features/create-vault';
import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

export default CreateVaultPage;

export const getStaticProps = getDefaultStaticProps(appPaths.vaults.create);
