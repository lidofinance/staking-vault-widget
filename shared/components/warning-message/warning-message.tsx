import { ErrorMessageWrapper, WarningIcon } from './styles';

type WarningMessageProps = React.ComponentProps<typeof ErrorMessageWrapper>;

export const WarningMessage: React.FC<
  React.PropsWithChildren<WarningMessageProps>
> = ({ children, ...props }) => {
  return (
    <ErrorMessageWrapper {...props}>
      <WarningIcon />
      {children}
    </ErrorMessageWrapper>
  );
};
