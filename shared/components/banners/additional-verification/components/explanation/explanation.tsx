import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults/consts/texts';

import { ExplanationList, ExplanationDescription } from './styles';

const { title, list } =
  vaultTexts.actions.additionalVerification.banners.multipleOwners.explanation;

export const Explanation = () => {
  return (
    <div>
      <Text size="xxs">{title}</Text>
      <ExplanationList>
        {list.map((definition) => (
          <ExplanationDescription key={definition}>
            {definition}
          </ExplanationDescription>
        ))}
      </ExplanationList>
    </div>
  );
};
