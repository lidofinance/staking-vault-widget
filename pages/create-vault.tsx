import { FC } from 'react';

import { CreateVaultPage } from 'features/create-vault';
import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

const CreateVault: FC = () => {
  return <CreateVaultPage />;
};

export const getStaticProps = getDefaultStaticProps(
  '/create-vault',
  async () => ({ props: {} }),
);

export default CreateVault;
