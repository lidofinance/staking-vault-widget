import { FormBlock, PageWrapper } from './styles';
import { Claim } from './claim';

export const ClaimPage = () => {
  return (
    <PageWrapper>
      <FormBlock>
        <Claim />
      </FormBlock>
    </PageWrapper>
  );
};
