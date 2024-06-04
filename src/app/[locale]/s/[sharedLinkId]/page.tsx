import { notFound } from 'next/navigation';
import { createSerializer } from 'nuqs';

import { searchParamsSchema } from '@/app/[locale]/search/searchParams/searchParams';
import { getSharedLink } from '@/app/[locale]/search/Toolbar/ShareModal/actions';
import { redirect } from '@/components/Navigation/Navigation';
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
