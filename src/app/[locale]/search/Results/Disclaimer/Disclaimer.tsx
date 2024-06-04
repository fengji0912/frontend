'use client';

import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCookies } from 'next-client-cookies';

import Alert from '@/components/Alert/Alert';

export default function Disclaimer() {
  const cookies = useCookies();
  const COOKIE_NAME = 'isDisclaimerWarningDismissed';
  const isDisclaimerWarningDismissed = cookies.get(COOKIE_NAME);

  const handleDismiss = () => {
    cookies.set(COOKIE_NAME, 'true', { expires: 7 });
  };

  return (
    <AnimatePresence>
      {!isDisclaimerWarningDismissed ? (
        <motion.div
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          animate={{
            height: 'auto',
            opacity: 1,
          }}
        >
          <Alert
            color="warning"
            className="gap-3 mb-4 !py-3 max-h-[400px] overflow-y-auto flex items-center !rounded-3xl"
          >
            <FontAwesomeIcon
              icon={faExclamationCircle}
              color="#cecc96"
              size="lg"
            />
            <div>
              The answer and the extracted information was obtained with a large
              language model and might contain errors and inaccuracies. All
              information presented by ORKG Ask needs to be carefully checked.
            </div>
            <Button
              onClick={handleDismiss}
              color="primary"
              size="sm"
              className="shrink-0"
            >
              Got it
            </Button>
          </Alert>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
