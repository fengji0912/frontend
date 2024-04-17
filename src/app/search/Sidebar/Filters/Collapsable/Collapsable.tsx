import { AnimatePresence, motion } from 'framer-motion';

type CollapsibleProps = {
  isExpanded: boolean;
  children: React.ReactNode;
};

export default function Collapsible({
  isExpanded,
  children,
}: CollapsibleProps) {
  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: 'auto' },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{
            duration: 0.5,
            ease: [0.04, 0.62, 0.23, 0.98],
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
