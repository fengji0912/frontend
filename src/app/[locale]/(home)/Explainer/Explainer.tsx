'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Link } from '@/components/Navigation/Navigation';
import ROUTES from '@/constants/routes';

export default function Explainer() {
  const t = useTranslations();

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
        {t('cozy_flat_myna_mend')}{' '}
        <strong className="text-semibold">
          {t('spicy_strong_goldfish_stab')}
        </strong>
        , <strong className="text-semibold">{t('top_vexed_wasp_scold')}</strong>{' '}
        {t('tasty_glad_wren_cherish')}{' '}
        <strong className="text-semibold">{t('funny_home_pug_wave')}</strong>.{' '}
        <Link href={`${ROUTES.PAGES}/about`}>
          {t('free_seemly_baboon_flow')}
        </Link>
        .
      </div>
    </motion.div>
  );
}
