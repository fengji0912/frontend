import { getTranslations } from 'next-intl/server';

import CollectionItem from '@/app/[locale]/my-library/[[...collectionId]]/Collections/CollectionItem/CollectionItem';
import CreateCollection from '@/app/[locale]/my-library/[[...collectionId]]/Collections/CreateCollection/CreateCollection';
import getCollections from '@/app/[locale]/my-library/[[...collectionId]]/helpers/getCollections';

export default async function Collections({
  activeCollectionId,
}: {
  activeCollectionId: string | null;
}) {
  const collections = await getCollections();
  const t = await getTranslations();

  return (
    <div>
      <h1 className="h6 py-3 px-3 m-0 font-semibold text-base">
        {t('gaudy_gray_yak_dazzle')}
      </h1>
      <hr className="border-t-2 border-secondary-200" />
      {collections.length > 0 ? (
        <ul>
          {collections.map((collection) => (
            <CollectionItem
              item={collection}
              key={collection.id}
              isActive={activeCollectionId === collection.id}
            />
          ))}
        </ul>
      ) : (
        <div className="px-3 py-3 italic">{t('this_only_dingo_enchant')}</div>
      )}
      <hr className="border-t-2 border-secondary-200" />
      <CreateCollection />
    </div>
  );
}
