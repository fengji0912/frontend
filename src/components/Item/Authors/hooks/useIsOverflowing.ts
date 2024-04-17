import { RefObject, useLayoutEffect, useState } from 'react';

export default function useIsOverflow(ref: RefObject<HTMLElement>) {
  const [isOverflow, setIsOverflow] = useState<boolean | undefined>(undefined);

  useLayoutEffect(() => {
    const current: HTMLElement | null = ref.current;

    if (current) {
      const trigger = () => {
        const hasOverflow = current.scrollWidth > current.clientWidth;

        setIsOverflow(hasOverflow);
      };

      if ('ResizeObserver' in window) {
        new ResizeObserver(trigger).observe(current);
      }

      trigger();
    }
  }, [ref]);

  return isOverflow;
}
