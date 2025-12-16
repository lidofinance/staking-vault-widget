import Link from 'next/link';
import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { ConfirmWrapper, InfoList, StyledCheckboxHookForm } from './styles';

import type { CreateFormInputProps } from './types';

const texts = vaultTexts.actions.createVault.fields.acceptTerms;

export const ConfirmInput = ({ name, dataTestId }: CreateFormInputProps) => {
  return (
    <ConfirmWrapper>
      <StyledCheckboxHookForm
        fieldName={name}
        data-testid={dataTestId ? `${dataTestId}-checkbox` : undefined}
      />
      <div>
        <Text size="xxs" color="secondary">
          {texts.placeholder}
        </Text>
        <InfoList>
          {texts.list.map(({ url, text, linkText }) => (
            <li key={url}>
              <Text size="xxs" color="secondary">
                {text}{' '}
                <Link target="_blank" href={url}>
                  {linkText}
                </Link>
              </Text>
            </li>
          ))}
        </InfoList>
      </div>
    </ConfirmWrapper>
  );
};
