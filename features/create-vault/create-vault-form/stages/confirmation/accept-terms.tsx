import Link from 'next/link';
import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { ConfirmWrapper, StyledCheckboxHookForm } from './styles';

const texts = vaultTexts.actions.createVault.fields.acceptTerms;

export const AcceptTerms = () => {
  return (
    <ConfirmWrapper data-testid="createVault-acceptTerms-inputContainer">
      <StyledCheckboxHookForm
        fieldName="acceptTerms"
        data-testid="createVault-acceptTerms-checkbox"
      />
      <Text size="xxs" color="secondary">
        {texts.text}{' '}
        <Link target="_blank" href={texts.url}>
          {texts.linkText}
        </Link>
        .
      </Text>
    </ConfirmWrapper>
  );
};
