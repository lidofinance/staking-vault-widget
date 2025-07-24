import { useState } from 'react';
import { Button, Text, Divider } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { SectionContainer } from 'features/settings/shared/components';
import { Title, RequestAdditionalInfo } from 'features/settings/tier/shared';

import { RequestWrapper, HeadingSection, ExpiresContainer } from './styles';

export const RequestChangeLimit = () => {
  const [showAdditionalInfo, setAdditionalInfoVisibility] = useState(false);
  const buttonText = showAdditionalInfo ? 'Hide details' : 'Review request';

  return (
    <RequestWrapper>
      <HeadingSection>
        <Title as="h2">{vaultTexts.actions.tier.requestTitle}</Title>
        <ExpiresContainer>
          <Text size="xxs">Expires in</Text>
          <Text size="xxs" strong>
            7d 23h
          </Text>
        </ExpiresContainer>
      </HeadingSection>
      <Divider />
      {showAdditionalInfo && <RequestAdditionalInfo />}
      <Divider />
      <SectionContainer>
        <Button
          variant="ghost"
          onClick={() => setAdditionalInfoVisibility(!showAdditionalInfo)}
        >
          {buttonText}
        </Button>
      </SectionContainer>
    </RequestWrapper>
  );
};
