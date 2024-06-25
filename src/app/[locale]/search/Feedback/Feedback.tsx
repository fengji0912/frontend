'use client';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import { md5 } from 'js-md5';
import { useCookies } from 'next-client-cookies';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

import FeedbackOrkgGeneral from '@/app/[locale]/search/Feedback/FeedbackOrkgGeneral/FeedbackOrkgGeneral';
import FeedbackQuestionSpecific from '@/app/[locale]/search/Feedback/FeedbackQuestionSpecific/FeedbackQuestionSpecific';
import Finished from '@/app/[locale]/search/Feedback/Finished/Finished';
import { queryParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';

export default function Feedback() {
  const cookies = useCookies();
  const [query] = useQueryState('query', queryParser);
  const [isManuallyHidden, setIsManuallyHidden] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasTimeoutPassed, setHasTimeoutPassed] = useState(false);
  const [hasSubmittedQuestionFeedback, setHasSubmittedQuestionFeedback] =
    useState(false);
  const [type, setType] = useState<'questionSpecific' | 'orkgGeneral'>(
    'questionSpecific'
  );

  const hasSubmittedOrkgGeneralFeedback = cookies.get(
    'hasSubmittedOrkgGeneralFeedback'
  );

  useEffect(() => {
    try {
      const feedbackCookie = cookies.get(`submittedQuestionFeedback`);
      const questions = feedbackCookie ? JSON.parse(feedbackCookie) : [];
      setHasSubmittedQuestionFeedback(questions.includes(md5(query)));
    } catch (error) {
      console.error('Error setting cookie', error);
    }
  }, [cookies, query]);

  const isFeedbackHiddenFor24Hours = cookies.get(`isFeedbackHiddenFor24Hours`);

  useEffect(() => {
    setIsManuallyHidden(false);
    setHasTimeoutPassed(false);
    setTimeout(() => {
      setHasTimeoutPassed(true);
    }, 7000); // show feedback after 7 seconds
  }, [query]);

  const handleHideFor24Hours = () => {
    cookies.set('isFeedbackHiddenFor24Hours', 'true', {
      expires: 1,
    });
  };

  const isVisible =
    !(hasSubmittedQuestionFeedback && !isSubmitted && type !== 'orkgGeneral') &&
    !isManuallyHidden &&
    hasTimeoutPassed &&
    !isFeedbackHiddenFor24Hours;

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          animate={{
            opacity: 1,
            height: 'auto',
          }}
        >
          <div
            className="w-[420px] box-white rounded-3xl shadow-box !p-6 fixed bottom-4 right-4 z-50 text-sm hidden sm:block"
            style={{ cursor: 'auto' }}
          >
            <Tooltip
              delay={500}
              isDisabled={isSubmitted}
              content={
                <div className="px-1 py-2 text-right">
                  Don&apos;t feel like giving feedback now? <br />
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={handleHideFor24Hours}
                  >
                    Hide for 24 hours
                  </Button>
                </div>
              }
            >
              <Button
                isIconOnly
                color="secondary"
                variant="light"
                className="absolute right-3 top-3"
                onClick={() => setIsManuallyHidden(true)}
                aria-label="close feedback form"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </Button>
            </Tooltip>

            <AnimatePresence>
              {isSubmitted && (
                <Finished
                  isVisibleFollowupFeedback={!hasSubmittedOrkgGeneralFeedback}
                  handleAcceptFollowup={() => {
                    setIsSubmitted(false);
                    setType('orkgGeneral');
                  }}
                  handleClose={() => setIsManuallyHidden(true)}
                />
              )}
            </AnimatePresence>

            {!isSubmitted && type === 'questionSpecific' && (
              <FeedbackQuestionSpecific
                handleSubmitted={() => {
                  setIsSubmitted(true);
                }}
              />
            )}
            {!isSubmitted && type === 'orkgGeneral' && (
              <FeedbackOrkgGeneral
                handleSubmitted={() => {
                  setIsSubmitted(true);
                }}
              />
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
