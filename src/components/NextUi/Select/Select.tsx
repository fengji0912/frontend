import { extendVariants, Select } from '@nextui-org/react';

export default extendVariants(Select, {
  variants: {
    variant: {
      flat: {
        trigger:
          'bg-secondary-50 data-[hover=true]:bg-secondary-50 data-[focus=true]:border-secondary-400 transition-colors shadow-none border border-secondary-200',
        popoverContent: '!shadow-box rounded-3xl',
      },
    },
  },
  defaultVariants: {
    variant: 'flat',
  },
});
