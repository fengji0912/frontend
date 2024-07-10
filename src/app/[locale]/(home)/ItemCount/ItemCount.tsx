'use client';

import { motion } from 'framer-motion';
import { useFormatter, useTranslations } from 'next-intl';

type ItemCountProps = {
  count: number;
};

export default function ItemCount({ count }: ItemCountProps) {
  const t = useTranslations();
  const format = useFormatter();

  const TRANSITION_MOVE = {
    duration: 1,
    type: 'spring',
    stiffness: 70,
  };
  return (
    <motion.div
      className="text-center box grow flex justify-center flex-col"
      initial={{ x: 100, y: 100, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={TRANSITION_MOVE}
    >
      <div className="text-3xl font-semibold mb-0">{format.number(count)}</div>
      {t('witty_watery_elk_pinch')}
    </motion.div>
  );
}
