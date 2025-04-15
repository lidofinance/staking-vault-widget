import { FormBlock, PageWrapper } from './styles';
import { Claim } from './claim-form';

export const ClaimPage = () => {
  return (
    <PageWrapper>
      <FormBlock>
        <Claim />
      </FormBlock>
    </PageWrapper>
  );
};
