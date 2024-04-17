import { Dropdown, extendVariants } from '@nextui-org/react';

export default extendVariants(Dropdown, {
  variants: {
    variant: {
      flat: {
        content: '!shadow-box rounded-3xl',
      },
    },
  },
  defaultVariants: {
    variant: 'flat',
  },
});
