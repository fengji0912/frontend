import { Button, extendVariants } from '@nextui-org/react';

export const LinkButton = extendVariants(Button, {
  variants: {
    variant: {
      link: 'p-0 h-auto data-[hover=true]:bg-transparent text-primary hover:underline min-w-0',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'link',
    size: 'sm',
  },
});
