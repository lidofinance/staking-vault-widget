import { Tooltip } from '@lidofinance/lido-ui';
import { QuestionIcon } from '../create-vault-form/stages/main-settings/create-vault-input/styles';

type HintProps = {
  hint?: string;
};
export const Hint = ({ hint }: HintProps) => {
  if (!hint) {
    return null;
  }

  return (
    <Tooltip placement="topLeft" title={hint}>
      <QuestionIcon />
    </Tooltip>
  );
};
