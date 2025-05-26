import { FC } from 'react';

import { useFieldArray } from 'react-hook-form';

import { Input } from '@lidofinance/lido-ui';
import { InputWithRadioDecorator } from '../input-with-radio-decorator';
import { ChipDecorator } from '../input-with-radio-decorator/chip-decorator';
import { EditWrapper } from './styles';

import {
  EditMainSettingsSchema,
  VotingKeys,
} from 'features/settings/main/types';

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
  const { fields } = useFieldArray<
    EditMainSettingsSchema,
    'nodeOperatorFeeBP.options' | 'confirmExpiry.options',
    'id'
  >({ name: `${name}.options` });

  return (
    <EditWrapper>
      {fields.map((field, index) => {
        const decoratorsList = [];
        const isEditField = field.type === 'edit';
        if (field.expiryDate) decoratorsList.push(field.expiryDate);
        if (!isEditField) decoratorsList.push(field.type);

        if (field.type !== 'by_me')
          return (
            <InputWithRadioDecorator
              key={field.id}
              rightDecorator={<ChipDecorator list={decoratorsList} />}
              placeholder={editLabel}
              mask={mask}
              name={`${name}.options.${index}.value`}
              radioName={`${name}.selectedIndex`}
              index={index}
              defaultChecked={field.type === 'current'}
              defaultDisabled={!isEditField}
            />
          );

        return (
          <Input
            key={field.id}
            value={`${field.value}${mask}`}
            rightDecorator={<ChipDecorator list={decoratorsList} />}
            disabled
          />
        );
      })}
    </EditWrapper>
  );
};
