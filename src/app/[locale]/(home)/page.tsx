import { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import AnimatedSearchBar from '@/app/[locale]/(home)/AnimatedSearchBar/AnimatedSearchBar';
import Explainer from '@/app/[locale]/(home)/Explainer/Explainer';
import GettingStarted from '@/app/[locale]/(home)/GettingStarted/GettingStarted';
import ItemCount from '@/app/[locale]/(home)/ItemCount/ItemCount';
import Logos from '@/app/[locale]/(home)/Logos/Logos';
import logo from '@/assets/images/logo.svg';
import { getCount } from '@/services/backend';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: {
      absolute: t('just_even_mammoth_twist'),
    },
    description: t('knotty_dirty_mule_buzz'),
  };
}

type HomeProps = {
  params: { locale: string };
};

export default async function Home({ params: { locale } }: HomeProps) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations();
  let count = 0;
  try {
    count = (await getCount()).payload.count;
  } catch (error) {
    console.error(error);
  }

  return (
    <main>
      <div className="container mx-auto flex flex-col items-center">
        <div className="relative hidden md:block" style={{ marginTop: 50 }}>
          <Image
            src={logo}
            alt={t('fresh_same_ladybug_learn')}
            width={300}
            priority
          />
          <span className="bg-secondary-200 rounded-2xl font-semibold text-secondary-900 dark:text-foreground py-[1px] px-[10px] text-[0.9rem] absolute bottom-[5px] right-0">
            {
              // eslint-disable-next-line react/jsx-no-literals
            }
            Ask
          </span>
        </div>
        <h1
          className="text-2xl md:text-3xl font-semibold text-center"
          style={{ marginTop: 50 }}
        >
          {t.rich('born_trick_deer_heal', {
            em: (chunks) => <em>{chunks}</em>,
          })}
        </h1>
        <div className="container mt-10 max-w-[1000px]">
          <AnimatedSearchBar />
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="w-full md:w-8/12">
              <Explainer />

              <GettingStarted />
            </div>
            <div className="w-full md:w-4/12 flex flex-col">
              <ItemCount count={count} />

              <Logos />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
