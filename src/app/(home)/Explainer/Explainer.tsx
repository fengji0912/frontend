'use client';

import { motion } from 'framer-motion';

export default function Explainer() {
  const TRANSITION_MOVE = {
    duration: 1,
    type: 'spring',
    stiffness: 70,
  };
  return (
    <motion.div
      className="text-center box grow flex flex-col justify-center mt-4 md:mt-0"
      initial={{ x: 100, y: -100, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={TRANSITION_MOVE}
    >
      <div>
        ORKG Ask is a scholarly search and exploration system powered by{' '}
        <strong className="text-semibold">LLMs</strong> and{' '}
        <strong className="text-semibold">Knowledge Graphs</strong>.
      </div>
    </motion.div>
  );
}
