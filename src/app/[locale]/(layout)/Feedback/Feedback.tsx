'use client';

import { Button, useDisclosure } from '@nextui-org/react';

import FeedbackModal from '@/app/[locale]/(layout)/Feedback/FeedbackModal/FeedbackModal';

const Feedback = () => {
  const {
    isOpen: isOpenFeedbackModal,
    onOpenChange: onOpenChangeFeedbackModal,
    onOpen: onOpenFeedbackModal,
  } = useDisclosure();

  return (
    <div>
      <Button
        color="primary"
        className="fixed right-0 top-[50%] rotate-90 -translate-y-1/2 translate-x-full origin-top-left rounded-t-none px-5 z-50"
        onClick={onOpenFeedbackModal}
      >
        Feedback
      </Button>
      {isOpenFeedbackModal && (
        <FeedbackModal onOpenChange={onOpenChangeFeedbackModal} />
      )}
    </div>
  );
};

export default Feedback;
