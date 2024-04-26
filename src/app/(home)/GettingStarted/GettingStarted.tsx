'use client';

import { motion } from 'framer-motion';
import { shuffle } from 'lodash';
import Link from 'next/link';
import { createSerializer } from 'nuqs';
import { useEffect, useState } from 'react';

import { searchParamsSchema } from '@/app/search/searchParams/searchParams';
import ROUTES from '@/constants/routes';

const GETTING_STARTED_QUESTIONS = [
  'How does climate change impact biodiversity?',
  'Why are aging Covid patients more susceptible to severe complications?',
  'How does social media affect the college selection process?',
  'What are the interesting theories about dark matter and dark energy?',
  'What is the significance of higher-dimensional algebra?',
  'How does social media usage impact mental health among adolescents?',
  'What are the long-term effects of income inequality on community well-being?',
  'How can we promote sustainable practices in urban transportation systems?',
  'What role does cultural diversity play in fostering creativity and innovation?',
  'How do educational policies influence student engagement and academic achievement?',
  'What are the ethical implications of using artificial intelligence in decision-making processes?',
  'How can we address food insecurity in marginalized communities?',
  'What factors contribute to successful intergenerational knowledge transfer?',
  'How does exposure to nature affect overall health and well-being?',
  'What strategies can enhance civic participation and democratic engagement?',
  'How does the availability of green spaces impact community health and well-being?',
  'What are the social and economic implications of an aging population?',
  'How can we enhance cybersecurity measures to protect against emerging threats?',
  'What factors contribute to successful cross-cultural communication in global organizations?',
  'How does exposure to art and culture influence cognitive development?',
  'What are the effects of automation on job displacement and workforce dynamics?',
  'What strategies can mitigate the impact of climate change on vulnerable populations?',
  'How do different parenting styles affect child development outcomes?',
  'What role does trust play in building resilient communities?',
  'How do social networks influence political polarization and echo chambers?',
  'What impact does access to quality early childhood education have on lifelong outcomes?',
  'How can we design inclusive urban spaces that cater to people of all abilities?',
  'What are the effects of mindfulness practices on stress reduction and mental well-being?',
  'How does exposure to green architecture affect occupants’ health and productivity?',
  'What factors contribute to successful cross-sector collaborations in addressing global challenges?',
  'How can we promote financial literacy and responsible financial decision-making?',
  'What role does cultural heritage play in shaping national identity?',
  'How do different parenting styles influence adolescents’ risk-taking behaviors?',
  'What strategies can enhance community resilience in the face of natural disasters?',
  'How does exposure to natural environments impact cognitive restoration and creativity?',
  'What are the social implications of widespread adoption of autonomous vehicles?',
  'How can we measure and enhance digital literacy skills across different age groups?',
  'What factors contribute to successful community-driven conservation efforts?',
  'How does cultural diversity influence team dynamics and decision-making in organizations?',
  'What are the effects of sleep deprivation on cognitive performance and overall health?',
  'How can we promote mental health awareness and reduce stigma in educational settings?',
  'What role does storytelling play in shaping collective memory and identity?',
  'How do social norms influence sustainable consumption behaviors?',
  'What strategies can improve disaster preparedness and response in vulnerable communities?',
];

export default function GettingStarted() {
  const serialize = createSerializer(searchParamsSchema);
  const [questions, setQuestions] = useState<string[]>([]);

  const TRANSITION_MOVE = {
    duration: 1,
    type: 'spring',
    stiffness: 70,
  };

  useEffect(() => {
    setQuestions(shuffle(GETTING_STARTED_QUESTIONS).slice(0, 5));
  }, []);

  return (
    <motion.div
      className="box"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={TRANSITION_MOVE}
    >
      <h2 className="text-2xl font-semibold mb-5">Getting started</h2>
      <ul className="list-disc px-5">
        {questions.map((question) => (
          <li key={question} className="pb-1">
            <Link
              href={serialize(ROUTES.SEARCH, {
                query: question,
              })}
            >
              {question}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
