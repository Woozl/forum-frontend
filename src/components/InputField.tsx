import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea
} from '@chakra-ui/react';
import { useField } from 'formik';

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  isTextArea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  isTextArea = false,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);

  const InputOrTextArea: any = isTextArea ? Textarea : Input;

  return (
    <FormControl isInvalid={Boolean(error)}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextArea
        height={isTextArea ? '400px' : undefined}
        {...field}
        {...props}
        id={field.name}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
