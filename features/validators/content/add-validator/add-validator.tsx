import { Text, Link } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { Container } from 'features/validators/shared';

import { ButtonStyled, Content, TextWrapper } from './styles';

const { title, description, action, linkToDocs } =
  vaultTexts.actions.validators.addValidator;

export const AddValidator = () => {
  // TODO: add hook
  // TODO: add link
  // TODO: show only for NO
  return (
    <Container>
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
    </Container>
  );
};
