import { FC, ReactNode, useMemo } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

import { RadioInput, RadioInputProps } from 'shared/components';
import { useVaultConfirmingRoles } from 'modules/vaults';

import { Skeleton } from 'features/settings/main/styles';
import { useVaultSettingsData } from 'features/settings/main/hooks';
import { PolicyDescription } from './policy-description';
import { PDGPolicy } from 'features/settings/main/consts';
import type {
  PDGOptions,
  VaultMainSettingsData,
} from 'features/settings/main/types';
import { RadioSelectorContainer } from './styles';

type VotingSelectorProps = {
  vaultKey: keyof VaultMainSettingsData;
};

const radioContentMap: Record<PDGOptions, ReactNode> = {
  STRICT: <PolicyDescription option="STRICT" />,
  ALLOW_PROVE: <PolicyDescription option="ALLOW_PROVE" />,
  ALLOW_DEPOSIT_AND_PROVE: (
    <PolicyDescription option="ALLOW_DEPOSIT_AND_PROVE" />
  ),
};

const pdgOptionsList = Object.entries(PDGPolicy) as [PDGOptions, string][];

export const RadioPdgSelector: FC<VotingSelectorProps> = ({ vaultKey }) => {
  const { isLoading, disabled } = useFormState();
  const { register } = useFormContext();
  const { hasAdmin } = useVaultConfirmingRoles();
  const { data } = useVaultSettingsData();

  const isEditable = !disabled && hasAdmin;
  const renderData = useMemo(() => {
    return pdgOptionsList.map(([name, key]) => {
      const isCurrent = data?.pdgPolicy === key;
      const valueToDisplay = radioContentMap[name];
      const radioProps = {
        value: key,
        id: name,
        valueToDisplay,
        ...register(vaultKey),
      } as RadioInputProps;

      if (isCurrent) {
        radioProps.tags = ['Current'];
      }

      return radioProps;
    });
  }, [data?.pdgPolicy, register, vaultKey]);

  return (
    <RadioSelectorContainer data-testid={`${vaultKey}-container`}>
      {isLoading && <Skeleton />}
      {!isLoading && (
        <>
          {renderData.map((props) => {
            return (
              <RadioInput
                key={props.id}
                {...props}
                disabled={!isEditable}
                dataTestId={`${vaultKey}-radio`}
              />
            );
          })}
        </>
      )}
    </RadioSelectorContainer>
  );
};
