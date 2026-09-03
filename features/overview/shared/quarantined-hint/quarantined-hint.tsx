import { vaultTexts } from 'modules/vaults';

import { HintText } from '../styles';

const {
  quarantinedHighlight,
  quarantinedDescription,
  consolidationHighlight,
  consolidationDescription,
} = vaultTexts.metrics.modals.quarantinedHint;

export const QuarantinedHint = () => {
  return (
    <div>
      <HintText $strong>{quarantinedHighlight}</HintText>{' '}
      <HintText>{quarantinedDescription}</HintText>
      <br />
      <br />
      <HintText $strong>{consolidationHighlight}</HintText>{' '}
      <HintText>{consolidationDescription}</HintText>
    </div>
  );
};
