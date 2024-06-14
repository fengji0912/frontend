import { push } from '@socialgouv/matomo-next';
import { useEffect, useState } from 'react';

export default function useLoadingTime({
  isValidating,
  actionLabel,
}: {
  isValidating: boolean;
  actionLabel: string;
}) {
  const [startTime, setStartTime] = useState(0);

  const trackLoadingTime = () => {
    try {
      const endTime = new Date().getTime();
      const totalTime = (endTime - startTime) / 1000;
      push(['trackEvent', actionLabel, totalTime]);
    } catch (error) {
      console.error('Error tracking loading time', error);
    }
  };

  useEffect(() => {
    if (isValidating) {
      setStartTime(new Date().getTime());
    }
  }, [isValidating]);

  return { trackLoadingTime };
}
