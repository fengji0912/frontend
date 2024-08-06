import {
  getFormatter,
  getTranslations,
  unstable_setRequestLocale,
} from 'next-intl/server';

import { getStats } from '@/services/backend';
import { components } from '@/services/backend/types';

async function StatsBox({
  title,
  value,
}: {
  title: string;
  value?: number | string | null;
}) {
  const format = await getFormatter();

  return (
    <div className="rounded-3xl shadow-box px-5 py-4 bg-white/50">
      <h2 className="mb-0">
        {typeof value === 'number' ? format.number(value ?? 0) : value}
      </h2>
      {title}
    </div>
  );
}

export default async function Stats({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
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
    | keyof components['schemas']['IndexingStats']['vector_config']
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
      num_collections: t('least_tired_kestrel_roam'),
      num_collection_items: t('merry_careful_marlin_dine'),
      num_registered_users: t('clear_pretty_rooster_clasp'),
      num_saved_searches: t('elegant_front_cod_blend'),
      num_shared_links: t('knotty_icy_haddock_amaze'),
      num_items_with_dbpedia_entities: t('level_quick_cowfish_care'),
      num_indexed_vectors: t('smug_sour_snail_peek'),
      distance_method: t('warm_empty_moose_spur'),
      vector_size: t('sharp_royal_spider_stop'),
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
            value={stats.usage.num_questions_asked}
          />
          <StatsBox
            title={getLabel('num_cache_hits')}
            value={stats.usage.num_cache_hits}
          />
          <StatsBox
            title={getLabel('num_collections')}
            value={stats.usage.num_collections}
          />
          <StatsBox
            title={getLabel('num_collection_items')}
            value={stats.usage.num_collection_items}
          />
          <StatsBox
            title={getLabel('num_registered_users')}
            value={stats.usage.num_registered_users}
          />
          <StatsBox
            title={getLabel('num_saved_searches')}
            value={stats.usage.num_saved_searches}
          />
          <StatsBox
            title={getLabel('num_shared_links')}
            value={stats.usage.num_shared_links}
          />
        </div>
        <h1 className="mt-10">{t('gaudy_direct_lynx_mix')}</h1>
        <div className="mt-5 grid-cols-1 md:grid-cols-3 lg:grid-cols-5 grid gap-4">
          <StatsBox
            title={getLabel('num_items_with_abstracts')}
            value={stats.dataset.num_items_with_abstracts}
          />
          <StatsBox
            title={getLabel('num_items_with_authors')}
            value={stats.dataset.num_items_with_authors}
          />
          <StatsBox
            title={getLabel('num_items_with_citations')}
            value={stats.dataset.num_items_with_citations}
          />
          <StatsBox
            title={getLabel('num_items_with_doi')}
            value={stats.dataset.num_items_with_doi}
          />
          <StatsBox
            title={getLabel('num_items_with_identifiers')}
            value={stats.dataset.num_items_with_identifiers}
          />
          <StatsBox
            title={getLabel('num_items_with_issn')}
            value={stats.dataset.num_items_with_issn}
          />
          <StatsBox
            title={getLabel('num_items_with_journal')}
            value={stats.dataset.num_items_with_journal}
          />
          <StatsBox
            title={getLabel('num_items_with_languages')}
            value={stats.dataset.num_items_with_languages}
          />
          <StatsBox
            title={getLabel('num_items_with_publication_date')}
            value={stats.dataset.num_items_with_publication_date}
          />
          <StatsBox
            title={getLabel('num_items_with_publisher')}
            value={stats.dataset.num_items_with_publisher}
          />
          <StatsBox
            title={getLabel('num_items_with_subjects')}
            value={stats.dataset.num_items_with_subjects}
          />
          <StatsBox
            title={getLabel('num_items_with_topics')}
            value={stats.dataset.num_items_with_topics}
          />
          <StatsBox
            title={getLabel('num_items_with_type')}
            value={stats.dataset.num_items_with_type}
          />
          <StatsBox
            title={getLabel('num_items_with_year')}
            value={stats.dataset.num_items_with_year}
          />
          <StatsBox
            title={getLabel('num_items_with_dbpedia_entities')}
            value={stats.dataset.num_items_with_dbpedia_entities}
          />
        </div>
        <h1 className="mt-10">{t('these_ago_fly_sprout')}</h1>
        <div className="mt-5 grid-cols-1 md:grid-cols-3 lg:grid-cols-5 grid gap-4">
          <StatsBox
            title={getLabel('num_indexed_vectors')}
            value={stats.indexing.num_indexed_vectors}
          />
          <StatsBox
            title={getLabel('distance_method')}
            value={stats.indexing.vector_config.distance_method}
          />
          <StatsBox
            title={getLabel('vector_size')}
            value={stats.indexing.vector_config.vector_size}
          />
        </div>
      </div>
    </div>
  );
}
