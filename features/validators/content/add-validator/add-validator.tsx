import { Text, Link } from '@lidofinance/lido-ui';

import {
  useVaultConfirmingRoles,
  useVaultPermission,
  vaultTexts,
} from 'modules/vaults';

import { Section } from 'features/validators/shared';

import { ButtonStyled, Content, TextWrapper } from './styles';

const { title, description, action, linkToDocs } =
  vaultTexts.actions.validators.addValidator;

export const AddValidator = () => {
  const { isNodeOperator } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission('proveUnknownValidatorsRole');
  const isValidatorsV2 = false;

  // TODO: remove isValidatorsV2 for second iteration
  if (
    (!(isNodeOperator || hasPermission) || isNodeOperator || hasPermission) &&
    !isValidatorsV2
  ) {
    return null;
  }

  return (
    <Section>
      <Content>
        <TextWrapper>
          <Text size="sm" strong>
            {title}
          </Text>
          <Text size="xs" color="secondary">
            {description}{' '}
            <Link href="#" target="_blank" rel="noreferrer noopener">
              {linkToDocs}
            </Link>
          </Text>
        </TextWrapper>
        <ButtonStyled variant="outlined" size="xs" fullwidth={false}>
          {action}
        </ButtonStyled>
      </Content>
    </Section>
  );
};
