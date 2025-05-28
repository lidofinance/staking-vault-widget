import { FC, useMemo } from 'react';

import { Input } from '@lidofinance/lido-ui';
import { InputWithRadioDecorator } from '../input-with-radio-decorator';
import { ChipDecorator } from '../input-with-radio-decorator/chip-decorator';
import { EditWrapper } from './styles';

import { VotingKeys } from 'features/settings/main/types';
import { useMainSettingsData } from 'features/settings/main/contexts';
import { InputWithRadioControlled } from '../input-with-radio-decorator/input-with-radio-controlled';

interface EditPropertyProps {
  name: VotingKeys;
  editLabel: string;
  mask: '%' | ' hours';
}

export const EditProperty: FC<EditPropertyProps> = ({
  name,
  editLabel,
  mask,
}) => {
  // const { fields } = useFieldArray<
  //   EditMainSettingsSchema,
  //   'nodeOperatorFeeBP.options' | 'confirmExpiry.options',
  //   'id'
  // >({ name: `${name}.options` });

  const mainSettingsData = useMainSettingsData();
  const renderList = useMemo(() => {
    if (mainSettingsData) return mainSettingsData[name];
    return [];
  }, [mainSettingsData, name]);

  const textFieldName =
    name === 'confirmExpiry'
      ? 'confirmExpiryCustom'
      : 'nodeOperatorFeeBPCustom';

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
              mask={mask}
              name={name}
              defaultChecked={field.type === 'current'}
              defaultDisabled
            />
          );

        return (
          <Input
            key={field.id}
            value={`${field.value}${mask}`}
            rightDecorator={<ChipDecorator field={field} />}
            disabled
          />
        );
      })}

      {renderList.length > 0 && (
        <InputWithRadioControlled
          placeholder={editLabel}
          mask={mask}
          name={name}
          textFieldName={textFieldName}
          value="other"
        />
      )}
    </EditWrapper>
  );
};
