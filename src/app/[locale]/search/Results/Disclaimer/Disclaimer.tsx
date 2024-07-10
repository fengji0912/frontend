'use client';

import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCookies } from 'next-client-cookies';
import { useTranslations } from 'next-intl';

import Alert from '@/components/Alert/Alert';

export default function Disclaimer() {
  const t = useTranslations();
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
            <div>{t('least_arable_spider_comfort')}</div>
            <Button
              onClick={handleDismiss}
              color="primary"
              size="sm"
              className="shrink-0"
            >
              {t('fuzzy_wide_mare_cheer')}
            </Button>
          </Alert>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
