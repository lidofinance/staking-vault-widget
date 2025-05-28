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
        const decoratorsList = [];
        const isEditField = field.type === 'edit';
        if (field.expiryDate) decoratorsList.push(field.expiryDate);
        if (!isEditField) decoratorsList.push(field.type);

        if (field.type !== 'by_me')
          return (
            <InputWithRadioDecorator
              key={`${field.value}${field.type}`}
              rightDecorator={<ChipDecorator list={decoratorsList} />}
              placeholder={editLabel}
              value={field.value}
              mask={mask}
              name={name}
              defaultChecked={field.type === 'current'}
              defaultDisabled={!isEditField}
            />
          );

        return (
          <Input
            key={`${field.value}${field.type}`}
            value={`${field.value}${mask}`}
            rightDecorator={<ChipDecorator list={decoratorsList} />}
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
