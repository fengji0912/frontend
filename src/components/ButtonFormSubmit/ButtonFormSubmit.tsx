import { Button, ButtonProps } from '@nextui-org/react';
import { useFormStatus } from 'react-dom';

export default function ButtonFormSubmit({ children, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button isLoading={pending} {...props}>
      {children}
    </Button>
  );
}
