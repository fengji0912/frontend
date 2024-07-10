import { useTranslations } from 'next-intl';

export default function useColumnTranslator() {
  const t = useTranslations();

  const translateColumn = (column: string) => {
    const map: { [key: string]: string } = {
      Answer: t('dark_any_koala_dine'),
      Insights: t('quick_red_worm_trim'),
      'TL;DR': t('that_level_nuthatch_stab'),
      Conclusions: t('cuddly_tasty_nuthatch_dance'),
      Results: t('next_frail_okapi_pause'),
      Methods: t('cozy_warm_nuthatch_shine'),
    };
    return map[column] || column;
  };
  return { translateColumn };
}
