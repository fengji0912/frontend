import { Metadata } from 'next';
import Image from 'next/image';

import AnimatedSearchBar from '@/app/(home)/AnimatedSearchBar/AnimatedSearchBar';
import Explainer from '@/app/(home)/Explainer/Explainer';
import GettingStarted from '@/app/(home)/GettingStarted/GettingStarted';
import ItemCount from '@/app/(home)/ItemCount/ItemCount';
import logo from '@/assets/images/logo.svg';
import { getCount } from '@/services/backend';

export const metadata: Metadata = {
  title: {
    absolute: 'ORKG Ask | Find research you are actually looking for',
  },
  description:
    'ORKG Ask lets you find research you are actually looking for. No more endless search results, just the answers you need. Powered by LLMs, Knowledge Graphs, Semantic Search and more.',
};

export default async function Home() {
  const count = await getCount();

  return (
    <main>
      <div className="container mx-auto flex flex-col items-center">
        <div className="relative hidden md:block" style={{ marginTop: 50 }}>
          <Image src={logo} alt="ORKG Ask Logo" width={300} priority />
          <span className="bg-secondary-200 rounded-2xl font-semibold text-secondary-900 dark:text-foreground py-[1px] px-[10px] text-[0.9rem] absolute bottom-[5px] right-0">
            Ask
          </span>
        </div>
        <h1
          className="text-2xl md:text-3xl font-semibold text-center"
          style={{ marginTop: 50 }}
        >
          Find research you are <em>actually</em> looking for
        </h1>
        <div className="mt-10 max-w-[1000px]">
          <AnimatedSearchBar />
          <div className="md:flex gap-4 mt-4">
            <div className="w-full md:w-8/12">
              <GettingStarted />
            </div>
            <div className="w-full md:w-4/12 flex flex-col">
              <Explainer />

              <ItemCount count={count.payload.count} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
