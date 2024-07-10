import { useTranslations } from 'next-intl';
import { ListResult } from 'pocketbase';

import ItemsList, {
  MetaData,
} from '@/app/[locale]/my-library/[[...collectionId]]/Items/ItemsList/ItemsList';
import Pagination from '@/app/[locale]/my-library/[[...collectionId]]/Items/Pagination/Pagination';
import { CollectionItemsResponse } from '@/types/pocketbase-types';

export default function Items({
  items,
}: {
  items: ListResult<CollectionItemsResponse> | null;
}) {
  const t = useTranslations();

  return items ? (
    <>
      <div className="box-white">
        {items.totalItems === 0 ? (
          <div className="italic p-2">{t('factual_actual_earthworm_work')}</div>
        ) : (
          <ItemsList
            items={items.items as (CollectionItemsResponse & MetaData)[]}
          />
        )}
      </div>
      {items.totalItems > 0 && <Pagination totalItems={items.totalItems} />}
    </>
  ) : (
    <div className="box-white !px-4 !py-6 italic">
      {t('bright_proud_cuckoo_bake')}
    </div>
  );
}
