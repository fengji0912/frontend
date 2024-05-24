import Disclaimer from '@/app/search/Results/Disclaimer/Disclaimer';
import getItemsById from '@/app/search/Results/helpers/getItemsById';
import Table from '@/app/search/Results/Table/Table';
import { searchParamsCache } from '@/app/search/searchParams/searchParams';
import Synthesis from '@/app/search/Synthesis/Synthesis';
import { checkIfAuthenticated } from '@/components/User/actions/actions';
import { IData } from '@/types/csl-json';
import {
  CollectionItemsResponse,
  CollectionsResponse,
} from '@/types/pocketbase-types';

export default async function Results() {
  const collectionItemIds = searchParamsCache.get('collectionItemIds');

  let collectionItems: CollectionItemsResponse<
    IData,
    { collection: CollectionsResponse }
  >[] = [];
  const isAuthenticated = await checkIfAuthenticated();

  if (isAuthenticated) {
    if (collectionItemIds?.length > 0) {
      collectionItems = (await getItemsById(collectionItemIds)).items;
    }
  }

  return (
    <div className="ms-0 lg:ms-4 grow" style={{ minWidth: 0 }}>
      <Disclaimer />
      <Synthesis />
      <Table collectionItems={collectionItems} />
    </div>
  );
}
