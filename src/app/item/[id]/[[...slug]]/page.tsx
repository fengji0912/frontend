import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { IData } from 'csl-json';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import slugify from 'slugify';

import ActionButtons from '@/app/item/[id]/[[...slug]]/ActionButtons/ActionsButtons';
import OrkgButton from '@/app/item/[id]/[[...slug]]/ActionButtons/OrkgButton/OrkgButton';
import LlmData from '@/app/item/[id]/[[...slug]]/LlmData/LlmData';
import MetadataGrid from '@/app/item/[id]/[[...slug]]/MetadataGrid/MetadataGrid';
import ReadMore from '@/app/item/[id]/[[...slug]]/ReadMore/ReadMore';
import LoadingRelatedItems from '@/app/item/[id]/[[...slug]]/RelatedItems/LoadingRelatedItems/LoadingRelatedItems';
import RelatedItems from '@/app/item/[id]/[[...slug]]/RelatedItems/RelatedItems';
import AddToCollection from '@/components/Item/AddToCollection/AddToCollection';
import Authors from '@/components/Item/Authors/Authors';
import { checkIfAuthenticated } from '@/components/User/actions/actions';
import ROUTES from '@/constants/routes';
import { getItem } from '@/services/backend';

type PageProps = {
  params: { id: string; slug?: string[] };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const item: IData | null = await getItem(params.id);
  return item
    ? {
        title: item?.title,
        description: item?.abstract,
      }
    : {};
}

export default async function Page({ params }: PageProps) {
  const item: IData | null = await getItem(params.id);
  if (!item) {
    notFound();
  }
  const isAuthenticated = await checkIfAuthenticated();

  if (
    item.title &&
    (!params.slug?.[0] ||
      slugify(item.title) !== decodeURIComponent(params.slug[0]))
  ) {
    redirect(`${ROUTES.ITEM}/${item.id}/${slugify(item.title)}`);
  }

  return (
    <div>
      <div className="container-box">
        <h1 className="text-2xl font-semibold">{item.title}</h1>
        <div className="text-secondary-800 mt-1">
          <Authors authors={item.author} />
        </div>
        <ActionButtons
          item={item}
          addToCollection={
            <AddToCollection
              itemId={item.id}
              trigger={
                <Button
                  color="primary"
                  variant="bordered"
                  startContent={<FontAwesomeIcon icon={faBookmark} />}
                  isDisabled={!isAuthenticated}
                >
                  Bookmark
                </Button>
              }
            />
          }
          orkgButton={<OrkgButton doi={item.DOI} title={item.title} />}
        />
      </div>
      <div className="container mt-5">
        <MetadataGrid item={item} />
      </div>
      <div className="flex container !mt-5 gap-x-5">
        <div className="box-white w-1/2">
          <h2 className="text-xl font-semibold">Abstract</h2>
          <ReadMore text={item.abstract} />
        </div>
        <div className="box-white w-1/2">
          <LlmData />
        </div>
      </div>
      <Suspense fallback={<LoadingRelatedItems />}>
        <RelatedItems itemId={params.id} />
      </Suspense>
    </div>
  );
}
