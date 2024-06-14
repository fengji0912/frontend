'use client';

import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion';

export default function Finished({
  handleAcceptFollowup,
  handleClose,
  isVisibleFollowupFeedback,
}: {
  handleAcceptFollowup: () => void;
  handleClose: () => void;
  isVisibleFollowupFeedback: boolean;
}) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      transition={{ type: 'spring', duration: 0.5 }}
      animate={{
        height: 'auto',
        opacity: 1,
      }}
    >
      <div className="py-5">
        <div className="text-center">
          <FontAwesomeIcon icon={faCircleCheck} size="4x" color="#3B9E22" />
          <div className="mt-4 text-3xl font-semibold ">Thank you!</div>
        </div>

        {isVisibleFollowupFeedback ? (
          <>
            <hr className="border-t-2 border-t-secondary-100 mt-4 mb-4" />
            <div className="text-sm">
              Can we ask you 3 more questions? This will only take one more
              minute and helps us a lot.
            </div>
            <div className="flex justify-center gap-3 mt-4">
              <Button color="primary" onClick={handleAcceptFollowup}>
                Yes
              </Button>
              <Button color="primary" variant="bordered" onClick={handleClose}>
                No
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-3 text-center">
            We&apos;ll ask you again for feedback in case you try different
            questions.
          </div>
        )}
      </div>
    </motion.div>
  );
}
