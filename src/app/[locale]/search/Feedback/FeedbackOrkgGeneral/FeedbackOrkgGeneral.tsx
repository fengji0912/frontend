'use client';

import {
  faFaceFrown,
  faFaceFrownOpen,
  faFaceLaughBeam,
  faFaceMeh,
  faFaceSmile,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Radio, RadioGroup } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import { times } from 'lodash';
import { useCookies } from 'next-client-cookies';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

import { submitOrkgGeneralFeedback } from '@/app/[locale]/search/Feedback/actions';
import useFingerprint from '@/app/[locale]/search/Feedback/hooks/useFingerprint';
import ButtonFormSubmit from '@/components/ButtonFormSubmit/ButtonFormSubmit';
import Textarea from '@/components/NextUi/Textarea/Textarea';

export default function FeedbackOrkgGeneral({
  handleSubmitted,
}: {
  handleSubmitted: () => void;
}) {
  const [satisfaction, setSatisfaction] = useState('');
  const [isVisibleComments, setIsVisibleComments] = useState(false);
  const cookies = useCookies();

  const { fingerprint } = useFingerprint();

  const LIKERT_QUESTIONS = [
    {
      question: "ORKG Ask's capabilities meet my requirements",
      scale: 7,
      name: 'meetsRequirements',
    },
    {
      question: 'ORKG Ask is easy to use',
      scale: 7,
      name: 'easyToUse',
    },
  ];

  const SATISFACTION_OPTIONS = [
    {
      score: '1',
      icon: faFaceFrown,
    },
    {
      score: '2',
      icon: faFaceFrownOpen,
    },
    {
      score: '3',
      icon: faFaceMeh,
    },
    {
      score: '4',
      icon: faFaceSmile,
    },
    {
      score: '5',
      icon: faFaceLaughBeam,
    },
  ];

  const createSavedSearchBound = submitOrkgGeneralFeedback.bind(null, {
    fingerprint,
  });
  const [state, formAction] = useFormState(createSavedSearchBound, {
    error: '',
    success: false,
  });

  useEffect(() => {
    if (state?.success) {
      cookies.set('hasSubmittedOrkgGeneralFeedback', 'true', {
        expires: 7,
      });

      handleSubmitted();
    }
  }, [cookies, handleSubmitted, state?.success]);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      transition={{ type: 'spring', duration: 0.5 }}
      animate={{
        height: 'auto',
        opacity: 1,
      }}
    >
      <form action={formAction}>
        <h2 className="text-lg !mb-0">What do you think?</h2>
        <div className="mt-3">How satisfied are you with ORKG Ask?</div>
        <div className="flex justify-between">
          {SATISFACTION_OPTIONS.map((option) => (
            <Button
              key={option.score}
              isIconOnly
              color="secondary"
              variant="light"
              size="lg"
              className={`border-3 border-transparent transition-colors ${
                satisfaction === option.score ? 'border-primary' : ''
              }`}
              onClick={() => setSatisfaction(option.score)}
            >
              <FontAwesomeIcon icon={option.icon} size="2x" />
            </Button>
          ))}
          <input type="hidden" name="satisfaction" value={satisfaction} />
        </div>
        <div className="flex justify-between">
          <div>Very dissatisfied</div>
          <div>Very satisfied</div>
        </div>
        <hr className="border-t-2 border-t-secondary-100 mt-4 mb-4" />
        {LIKERT_QUESTIONS.map((question) => (
          <>
            <div>{question.question}</div>
            <RadioGroup
              orientation="horizontal"
              className="mt-2"
              classNames={{
                wrapper: 'justify-between',
              }}
              name={question.name}
            >
              {times(question.scale, (i) => (
                <Radio
                  classNames={{
                    label: '-ml-2 text-sm',
                    base: 'flex items-center flex-col-reverse',
                  }}
                  value={(i + 1).toString()}
                >
                  {i + 1}
                </Radio>
              ))}
            </RadioGroup>
            <div className="flex justify-between mt-1">
              <div>Strongly disagree</div>
              <div>Strongly agree</div>
            </div>
            <hr className="border-t-2 border-t-secondary-100 mt-4 mb-4" />
          </>
        ))}
        <AnimatePresence>
          {isVisibleComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              animate={{
                height: 'auto',
                opacity: 1,
              }}
            >
              <Textarea
                placeholder="Enter any additional feedback and suggestions, do not enter any personal details"
                rows={3}
                name="comments"
              />
              <hr className="border-t-2 border-t-secondary-100 mt-4 pb-4" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center justify-between">
          <Button
            color="primary"
            variant="bordered"
            onClick={() => setIsVisibleComments((v) => !v)}
          >
            Add more comments
          </Button>
          <ButtonFormSubmit type="submit" color="primary">
            Submit
          </ButtonFormSubmit>
        </div>
      </form>
    </motion.div>
  );
}
