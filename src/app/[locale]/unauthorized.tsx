import { useTranslations } from 'next-intl';

export default function Unauthorized() {
  const t = useTranslations();

  return (
    <main>
      <div className="container flex justify-center items-center mt-10 box-white !py-10">
        <h1 className="text-4xl pe-5">{t('quick_inclusive_raven_greet')}</h1>{' '}
        <span>{t('fair_factual_swallow_jump')}</span>
      </div>
    </main>
  );
}
