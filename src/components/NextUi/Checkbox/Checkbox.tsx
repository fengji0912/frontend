import { Checkbox, extendVariants } from '@nextui-org/react';

export default extendVariants(Checkbox, {
  variants: {
    variant: {
      flat: {
        wrapper:
          'rounded-md before:rounded-md after:rounded-md dark:before:border-secondary-600',
      },
    },
  },
  defaultVariants: {
    variant: 'flat',
  },
});
