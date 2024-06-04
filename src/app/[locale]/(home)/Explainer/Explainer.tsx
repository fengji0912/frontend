'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Link } from '@/components/Navigation/Navigation';
import ROUTES from '@/constants/routes';

export default function Explainer() {
  const t = useTranslations('Explainer');

  const TRANSITION_MOVE = {
    duration: 1,
    type: 'spring',
    stiffness: 70,
  };
  return (
    <motion.div
      className="text-center box grow flex flex-col justify-center mb-4 md:mt-0"
      initial={{ x: 100, y: -100, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={TRANSITION_MOVE}
    >
      <div>
        {t('text')}{' '}
        <strong className="text-semibold">{t('vectorSearch')}</strong>,{' '}
        <strong className="text-semibold">{t('llms')}</strong> {t('and')}{' '}
        <strong className="text-semibold">{t('kgs')}</strong>.{' '}
        <Link href={`${ROUTES.PAGES}/about`}>{t('learnMore')}</Link>.
      </div>
    </motion.div>
  );
}
