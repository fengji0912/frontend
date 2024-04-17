import { extendVariants, Textarea } from '@nextui-org/react';

export default extendVariants(Textarea, {
  variants: {
    variant: {
      flat: {
        inputWrapper:
          'bg-secondary-50 data-[hover=true]:bg-secondary-50 data-[focus=true]:border-secondary-400 transition-colors shadow-none border border-secondary-200',
      },
    },
  },
  defaultVariants: {
    variant: 'flat',
  },
});
