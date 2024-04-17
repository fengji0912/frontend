import { ListResult } from 'pocketbase';

import ItemsList, {
  MetaData,
} from '@/app/my-library/[[...collectionId]]/Items/ItemsList/ItemsList';
import Pagination from '@/app/my-library/[[...collectionId]]/Items/Pagination/Pagination';
import { CollectionItemsResponse } from '@/types/pocketbase-types';

export default function Items({
  items,
}: {
  items: ListResult<CollectionItemsResponse> | null;
}) {
  return items ? (
    <>
      <div className="box-white">
        {items.totalItems === 0 ? (
          <div className="italic p-2">No items in this collection yet</div>
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
      No collections created yet, create your first collection on the left.
    </div>
  );
}
