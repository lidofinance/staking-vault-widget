import { vaultTexts } from 'modules/vaults';

import { HintText } from '../styles';

const {
  offBookHighlight,
  offBookDescription,
  consolidationHighlight,
  consolidationDescription,
} = vaultTexts.metrics.modals.offBookDepositsHint;

export const OffBookHint = () => {
  return (
    <div>
      <HintText $strong>{offBookHighlight}</HintText>{' '}
      <HintText>{offBookDescription}</HintText>
      <br />
      <br />
      <HintText $strong>{consolidationHighlight}</HintText>{' '}
      <HintText>{consolidationDescription}</HintText>
    </div>
  );
};
