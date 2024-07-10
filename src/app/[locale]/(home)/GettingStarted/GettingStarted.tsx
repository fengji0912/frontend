'use client';

import { motion } from 'framer-motion';
import { shuffle } from 'lodash';
import { useTranslations } from 'next-intl';
import { createSerializer } from 'nuqs';
import { useEffect, useState } from 'react';

import { searchParamsSchema } from '@/app/[locale]/search/searchParams/searchParams';
import { Link } from '@/components/Navigation/Navigation';
import ROUTES from '@/constants/routes';

export default function GettingStarted() {
  const serialize = createSerializer(searchParamsSchema);
  const [questions, setQuestions] = useState<string[]>([]);
  const t = useTranslations();

  const TRANSITION_MOVE = {
    duration: 1,
    type: 'spring',
    stiffness: 70,
  };

  useEffect(() => {
    const GETTING_STARTED_QUESTIONS = [
      t('game_plain_snake_care'),
      t('tired_gray_lark_flow'),
      t('sharp_happy_shad_borrow'),
      t('basic_ago_crab_imagine'),
      t('red_alert_pug_compose'),
      t('wild_known_angelfish_zip'),
      t('zesty_clear_duck_roar'),
      t('awake_elegant_puffin_clap'),
      t('plain_watery_shrimp_praise'),
      t('tangy_wild_hound_launch'),
      t('fine_dry_horse_revive'),
      t('cozy_quick_albatross_bend'),
      t('bold_last_martin_dream'),
      t('nice_watery_jackdaw_reside'),
      t('maroon_empty_snail_grin'),
      t('seemly_bald_ox_enjoy'),
      t('plane_suave_chipmunk_absorb'),
      t('every_major_florian_flow'),
      t('gray_misty_jan_aid'),
      t('good_front_lark_trim'),
      t('dull_sad_gibbon_smile'),
      t('sad_salty_shrike_bend'),
      t('due_swift_fox_treasure'),
      t('misty_raw_otter_coax'),
      t('front_bland_impala_charm'),
      t('patchy_ok_martin_fond'),
      t('novel_whole_herring_fold'),
      t('quiet_spare_ant_glow'),
      t('bland_proud_crocodile_pull'),
      t('just_tired_mink_accept'),
      t('next_any_finch_urge'),
      t('soft_fit_mare_assure'),
      t('hour_tired_mammoth_care'),
      t('sweet_bland_impala_tickle'),
      t('arable_agent_racoon_thrive'),
      t('still_lofty_cobra_pat'),
      t('careful_spare_eagle_zoom'),
      t('smart_heroic_crab_edit'),
      t('legal_honest_tadpole_twist'),
      t('fluffy_due_cat_blend'),
      t('sea_vexed_jaguar_dash'),
      t('sunny_top_sparrow_spark'),
      t('slimy_short_jackal_beam'),
      t('alert_crisp_gazelle_smile'),
    ];

    setQuestions(shuffle(GETTING_STARTED_QUESTIONS).slice(0, 5));
  }, [t]);

  return (
    <motion.div
      className="box"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={TRANSITION_MOVE}
    >
      <h2 className="text-2xl font-semibold mb-5">
        {t('civil_early_shark_cheer')}
      </h2>
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
