import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useEffect, useState } from 'react';

export default function useFingerprint() {
  const [visitorId, setVisitorId] = useState('');

  useEffect(() => {
    const fpPromise = FingerprintJS.load();

    fpPromise
      .then((fp) => {
        return fp.get();
      })
      .then((result) => {
        const visitorId = result.visitorId;
        setVisitorId(visitorId);
      })
      .catch((error) => {
        console.error('Error getting visitor ID:', error);
      });
  }, []);

  return {
    fingerprint: visitorId,
  };
}
