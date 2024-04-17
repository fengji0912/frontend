import { IData } from 'csl-json';

import ItemCarousel from '@/app/item/[id]/[[...slug]]/RelatedItems/ItemCarousel/ItemCarousel';
import { getRelatedItems } from '@/services/backend';

type RelatedItemsProps = {
  itemId: string;
};

export default async function RelatedItems({ itemId }: RelatedItemsProps) {
  let items: IData[] = [];
  try {
    items = await getRelatedItems({ document_id: itemId, limit: 15 });
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="container box-white mt-5 !px-5">
      <h2 className="text-xl font-semibold">Related items</h2>
      <ItemCarousel items={items} />
    </div>
  );
}
