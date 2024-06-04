import { times } from 'lodash';

import { searchParamsCache } from '@/app/[locale]/search/searchParams/searchParams';
import ContentLoader from '@/components/ContentLoader/ContentLoader';

export default function LoadingResults() {
  const pages = searchParamsCache.get('pages');

  return (
    <div className="ms-4 grow" style={{ minWidth: 0 }}>
      <div className="box-white">
        {times(pages, (i) => (
          <ContentLoader key={i} speed={2} width={'100%'} height={180}>
            <rect x="0" y="15" rx="16" ry="16" width="100%" height="60" />
            <rect x="0%" y="90" rx="16" ry="16" width="20%" height="60" />
            <rect x="21%" y="90" rx="16" ry="16" width="20%" height="60" />
            <rect x="42%" y="90" rx="16" ry="16" width="20%" height="60" />
            <rect x="63%" y="90" rx="16" ry="16" width="20%" height="60" />
            <rect x="84%" y="90" rx="16" ry="16" width="15%" height="60" />
          </ContentLoader>
        ))}
      </div>
    </div>
  );
}
