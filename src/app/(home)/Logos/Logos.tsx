'use client';

import 'slick-carousel/slick/slick-theme.scss';
import 'slick-carousel/slick/slick.scss';

import { motion } from 'framer-motion';

import LogoCarousel from '@/components/LogoCarousel/LogoCarousel';

export default function Logos() {
  const TRANSITION_MOVE = {
    duration: 1,
    type: 'spring',
    stiffness: 70,
  };

  return (
    <motion.div
      className="text-center mt-4 box grow flex justify-center flex-col"
      initial={{ x: 100, y: 100, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={TRANSITION_MOVE}
    >
      <LogoCarousel autoplay />
    </motion.div>
  );
}
