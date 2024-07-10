import { getTranslations } from 'next-intl/server';

import ItemCarousel from '@/app/[locale]/item/[id]/[[...slug]]/RelatedItems/ItemCarousel/ItemCarousel';
import { getRelatedItems } from '@/services/backend';
import { IData } from '@/types/csl-json';

type RelatedItemsProps = {
  itemId: string;
};

export default async function RelatedItems({ itemId }: RelatedItemsProps) {
  const t = await getTranslations();

  let items: IData[] = [];
  try {
    items = await getRelatedItems({ document_id: itemId, limit: 15 });
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="container box-white mt-5 !px-5">
      <h2 className="text-xl font-semibold">
        {t('just_nimble_warthog_prosper')}
      </h2>
      <ItemCarousel items={items} />
    </div>
  );
}
