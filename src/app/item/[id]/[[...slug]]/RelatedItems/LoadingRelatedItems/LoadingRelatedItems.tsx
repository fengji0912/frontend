import { times } from 'lodash';

import ContentLoader from '@/components/ContentLoader/ContentLoader';

export default function LoadingRelatedItems() {
  return (
    <div className="my-4 container box-white">
      <div className="flex gap-7">
        {times(3, (i) => (
          <ContentLoader key={i} speed={2} width={'100%'} height={225}>
            <rect x="0" y="10" rx="16" ry="16" width={'100%'} height="200" />
          </ContentLoader>
        ))}
      </div>
    </div>
  );
}
