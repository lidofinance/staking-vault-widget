import { FC, useMemo } from 'react';
import { Input } from '@lidofinance/lido-ui';

import { useMainSettingsData } from 'features/settings/main/contexts';

import {
  InputWithRadioDecorator,
  InputWithRadioControlled,
} from '../input-with-radio-decorator';
import { ChipDecorator } from '../input-with-radio-decorator/chip-decorator';
import { EditWrapper } from './styles';

import { VotingCustomKeys, VotingKeys } from 'features/settings/main/types';

interface EditPropertyProps {
  name: VotingKeys;
  textFieldName: VotingCustomKeys;
  editLabel: string;
  unitIndicator: '%' | ' hours';
}

export const EditProperty: FC<EditPropertyProps> = ({
  name,
  editLabel,
  unitIndicator,
  textFieldName,
}) => {
  const mainSettingsData = useMainSettingsData();
  const renderList = useMemo(() => {
    if (mainSettingsData) return mainSettingsData[name];
    return [];
  }, [mainSettingsData, name]);

  return (
    <EditWrapper>
      {renderList.map((field) => {
        if (field.type !== 'by_me')
          return (
            <InputWithRadioDecorator
              key={field.id}
              rightDecorator={<ChipDecorator field={field} />}
              placeholder={editLabel}
              value={field.value}
              unitIndicator={unitIndicator}
              name={name}
              defaultChecked={field.type === 'current'}
              defaultDisabled
            />
          );

        return (
          <Input
            key={field.id}
            value={`${field.value}${unitIndicator}`}
            rightDecorator={<ChipDecorator field={field} />}
            disabled
          />
        );
      })}

      {renderList.length > 0 && (
        <InputWithRadioControlled
          placeholder={editLabel}
          unitIndicator={unitIndicator}
          name={name}
          textFieldName={textFieldName}
          value="other"
        />
      )}
    </EditWrapper>
  );
};
