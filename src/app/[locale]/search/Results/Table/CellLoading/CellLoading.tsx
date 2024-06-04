import ContentLoader from '@/components/ContentLoader/ContentLoader';

export default function CellLoading() {
  return (
    <ContentLoader speed={2} width={'100%'} height={150}>
      <rect x="0" y="10" rx="16" ry="16" width={'100%'} height="120" />
    </ContentLoader>
  );
}
