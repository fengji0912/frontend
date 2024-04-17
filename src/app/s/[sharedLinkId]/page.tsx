import { notFound, redirect } from 'next/navigation';
import { createSerializer } from 'nuqs';

import { searchParamsSchema } from '@/app/search/searchParams/searchParams';
import { getSharedLink } from '@/app/search/Toolbar/ShareModal/actions';
import ROUTES from '@/constants/routes';

export default async function Page({
  params,
}: {
  params: { sharedLinkId: string };
}) {
  const serialize = createSerializer(searchParamsSchema);

  const shareLink = await getSharedLink(params.sharedLinkId);

  if (!shareLink) {
    notFound();
  }

  redirect(serialize(ROUTES.SEARCH, shareLink.searchData!));
}
