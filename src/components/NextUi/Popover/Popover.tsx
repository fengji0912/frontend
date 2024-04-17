import { extendVariants, Popover } from '@nextui-org/react';

export default extendVariants(Popover, {
  variants: {
    variant: {
      flat: {
        content: 'rounded-3xl !shadow-box',
        box: '',
      },
    },
  },
  defaultVariants: {
    variant: 'flat',
  },
});
