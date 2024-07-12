import { getFormatter, getTranslations } from 'next-intl/server';

import { getStats } from '@/services/backend';
import { components } from '@/services/backend/types';

async function StatsBox({
  title,
  count,
}: {
  title: string;
  count?: number | null;
}) {
  const format = await getFormatter();

  return (
    <div className="rounded-3xl shadow-box px-5 py-4 bg-white/50">
      <h2 className="mb-0">{format.number(count ?? 0)}</h2>
      {title}
    </div>
  );
}

export default async function Stats() {
  const t = await getTranslations();

  let stats;
  try {
    stats = (await getStats())?.payload ?? {};
  } catch (e) {
    console.error(e);
  }

  type Keys =
    | keyof components['schemas']['DatasetStats']
    | keyof components['schemas']['IndexingStats']
    | keyof components['schemas']['UsageStats'];

  const getLabel = (key: Keys) => {
    const labelMap: Partial<{
      [key in Keys]: string;
    }> = {
      num_items_with_abstracts: t('white_drab_trout_fear'),
      num_items_with_authors: t('sharp_full_turtle_accept'),
      num_items_with_citations: t('mean_patient_cobra_flop'),
      num_items_with_doi: t('tired_aqua_husky_radiate'),
      num_items_with_identifiers: t('sharp_house_lemming_expand'),
      num_items_with_issn: t('livid_antsy_emu_spark'),
      num_items_with_journal: t('front_this_jurgen_dance'),
      num_items_with_languages: t('chunky_same_rook_evoke'),
      num_items_with_publication_date: t('ideal_wide_wallaby_evoke'),
      num_items_with_publisher: t('spare_deft_larva_fold'),
      num_items_with_subjects: t('moving_flat_dachshund_tickle'),
      num_items_with_topics: t('alert_merry_shark_swim'),
      num_items_with_type: t('fuzzy_tidy_pony_trip'),
      num_items_with_year: t('trite_lucky_owl_pat'),
      num_cache_hits: t('fit_ornate_impala_value'),
      num_questions_asked: t('alive_mealy_lamb_heart'),
    };
    return labelMap[key] ?? '';
  };

  if (!stats) {
    return null;
  }

  return (
    <div>
      <div className="container mt-5 md:mt-14 px-5 py-5">
        <h1>{t('stout_bland_snail_soar')}</h1>
        <div className="mt-5 grid-cols-1 md:grid-cols-3 lg:grid-cols-5 grid gap-4">
          <StatsBox
            title={getLabel('num_questions_asked')}
            count={stats.usage.num_questions_asked}
          />
          <StatsBox
            title={getLabel('num_cache_hits')}
            count={stats.usage.num_cache_hits}
          />
        </div>
        <h1 className="mt-10">{t('gaudy_direct_lynx_mix')}</h1>
        <div className="mt-5 grid-cols-1 md:grid-cols-3 lg:grid-cols-5 grid gap-4">
          <StatsBox
            title={getLabel('num_items_with_abstracts')}
            count={stats.dataset.num_items_with_abstracts}
          />
          <StatsBox
            title={getLabel('num_items_with_authors')}
            count={stats.dataset.num_items_with_authors}
          />
          <StatsBox
            title={getLabel('num_items_with_citations')}
            count={stats.dataset.num_items_with_citations}
          />
          <StatsBox
            title={getLabel('num_items_with_doi')}
            count={stats.dataset.num_items_with_doi}
          />
          <StatsBox
            title={getLabel('num_items_with_identifiers')}
            count={stats.dataset.num_items_with_identifiers}
          />
          <StatsBox
            title={getLabel('num_items_with_issn')}
            count={stats.dataset.num_items_with_issn}
          />
          <StatsBox
            title={getLabel('num_items_with_journal')}
            count={stats.dataset.num_items_with_journal}
          />
          <StatsBox
            title={getLabel('num_items_with_languages')}
            count={stats.dataset.num_items_with_languages}
          />
          <StatsBox
            title={getLabel('num_items_with_publication_date')}
            count={stats.dataset.num_items_with_publication_date}
          />
          <StatsBox
            title={getLabel('num_items_with_publisher')}
            count={stats.dataset.num_items_with_publisher}
          />
          <StatsBox
            title={getLabel('num_items_with_subjects')}
            count={stats.dataset.num_items_with_subjects}
          />
          <StatsBox
            title={getLabel('num_items_with_topics')}
            count={stats.dataset.num_items_with_topics}
          />
          <StatsBox
            title={getLabel('num_items_with_type')}
            count={stats.dataset.num_items_with_type}
          />
          <StatsBox
            title={getLabel('num_items_with_year')}
            count={stats.dataset.num_items_with_year}
          />
        </div>
      </div>
    </div>
  );
}
