import ContentLoader from '@/components/ContentLoader/ContentLoader';

export default function LlmDataLoading() {
  return (
    <ContentLoader speed={2} width={'100%'} height={300}>
      <rect x="0" y="10" rx="16" ry="16" width={'100%'} height="40" />
      <rect x="0" y="60" rx="16" ry="16" width={'100%'} height="40" />
      <rect x="0" y="110" rx="16" ry="16" width={'100%'} height="40" />
      <rect x="0" y="160" rx="16" ry="16" width={'100%'} height="40" />
      <rect x="0" y="210" rx="16" ry="16" width={'100%'} height="40" />
      <rect x="0" y="260" rx="16" ry="16" width={'100%'} height="40" />
    </ContentLoader>
  );
}
