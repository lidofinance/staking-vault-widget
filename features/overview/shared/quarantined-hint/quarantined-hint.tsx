import { vaultTexts } from 'modules/vaults';

import { HintLink, HintText } from '../styles';

const { heading, body, cooldownHighlight, bodyTail, learnMoreLink } =
  vaultTexts.metrics.modals.quarantinedHint;

export const QuarantinedHint = () => {
  return (
    <div>
      <HintText $strong>{heading}</HintText>
      <br />
      <HintText>{body}</HintText>
      <HintText $strong>{cooldownHighlight}</HintText>
      <HintText>{bodyTail}</HintText>
      {!!learnMoreLink && (
        <>
          <br />
          <HintLink href={learnMoreLink}>Learn more</HintLink>
        </>
      )}
    </div>
  );
};
