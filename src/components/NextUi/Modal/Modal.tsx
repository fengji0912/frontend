import { extendVariants, Modal } from '@nextui-org/react';

export default extendVariants(Modal, {
  variants: {
    variant: {
      flat: {
        closeButton: 'mt-2 mr-2',
        base: '!shadow-box dark:border-1 border-secondary-200',
      },
    },
  },
  defaultVariants: {
    variant: 'flat',
    placement: 'top',
  },
});
