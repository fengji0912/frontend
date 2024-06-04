'use client';

import { motion } from 'framer-motion';

import SearchBar from '@/components/SearchBar/SearchBar';

export default function AnimatedSearchBar() {
  const TRANSITION_MOVE = {
    duration: 1,
    type: 'spring',
    stiffness: 70,
  };

  return (
    <motion.div
      className="rounded-3xl shadow-box"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={TRANSITION_MOVE}
    >
      <SearchBar />
    </motion.div>
  );
}
