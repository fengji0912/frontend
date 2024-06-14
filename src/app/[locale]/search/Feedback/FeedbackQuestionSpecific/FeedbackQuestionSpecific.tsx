'use client';

import { Slider } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import { md5 } from 'js-md5';
import { useCookies } from 'next-client-cookies';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

import { submitQuestionSpecificFeedback } from '@/app/[locale]/search/Feedback/actions';
import useFingerprint from '@/app/[locale]/search/Feedback/hooks/useFingerprint';
import { queryParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';
import ButtonFormSubmit from '@/components/ButtonFormSubmit/ButtonFormSubmit';
import { Link } from '@/components/Navigation/Navigation';
import ROUTES from '@/constants/routes';

export default function FeedbackQuestionSpecific({
  handleSubmitted,
}: {
  handleSubmitted: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const cookies = useCookies();
  const [question] = useQueryState('query', queryParser);
  const { fingerprint } = useFingerprint();

  const valueToTextSlider = (value: number): string => {
    const valueMap: { [key: number]: string } = {
      1: 'Strongly disagree',
      2: 'Disagree',
      3: 'Neutral',
      4: 'Agree',
      5: 'Strongly agree',
    };
    return valueMap[value] || 'Invalid value';
  };

  const createSavedSearchBound = submitQuestionSpecificFeedback.bind(null, {
    question,
    fingerprint,
  });
  const [state, formAction] = useFormState(createSavedSearchBound, {
    error: '',
    success: false,
  });

  useEffect(() => {
    if (state?.success) {
      try {
        const feedbackCookie = cookies.get(`submittedQuestionFeedback`);
        const questions = feedbackCookie ? JSON.parse(feedbackCookie) : [];
        cookies.set(
          `submittedQuestionFeedback`,
          JSON.stringify([...questions, md5(question)]),
          {
            expires: 7,
          }
        );
      } catch (error) {
        console.error('Error setting cookie', error);
      }
      handleSubmitted();
    }
  }, [cookies, handleSubmitted, question, state?.success]);

  return (
    <>
      <h2 className="text-lg !mb-0">What do you think?</h2>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            animate={{
              height: 'auto',
              opacity: 1,
            }}
          >
            <span className="w-full block leading-normal text-sm pb-3">
              Answer the questions below based on the current search and
              displayed information.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <hr className="border-t-2 border-t-secondary-100 my-2" />
      <form action={formAction}>
        <Slider
          getValue={(value) => `${valueToTextSlider(value as number)}`}
          step={1}
          color="primary"
          label="The displayed answers are helpful"
          showSteps={true}
          maxValue={5}
          minValue={1}
          defaultValue={3}
          className="my-2"
          onChangeEnd={() => setIsExpanded(true)}
          name="helpfulness"
        />
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              animate={{
                height: 'auto',
                opacity: 1,
              }}
            >
              <Slider
                getValue={(value) => `${valueToTextSlider(value as number)}`}
                step={1}
                color="primary"
                label="The displayed answers are correct"
                showSteps={true}
                maxValue={5}
                minValue={1}
                defaultValue={3}
                className="my-2"
                name="correctness"
              />
              <Slider
                getValue={(value) => `${valueToTextSlider(value as number)}`}
                step={1}
                color="primary"
                label="The displayed answers are complete"
                showSteps={true}
                maxValue={5}
                minValue={1}
                defaultValue={3}
                className="my-2"
                name="completeness"
              />

              <hr className="border-t-2 border-t-secondary-100 my-2" />
              <div className="flex items-center justify-between">
                <span className="text-xs mr-1 text-gray-500">
                  Data is collected and published anonymously per our{' '}
                  <Link href={ROUTES.DATA_PROTECTION} target="_blank">
                    data policy
                  </Link>
                  .
                </span>
                <ButtonFormSubmit type="submit" color="primary">
                  Submit
                </ButtonFormSubmit>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </>
  );
}
