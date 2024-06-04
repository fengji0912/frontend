import ContentLoader from '@/components/ContentLoader/ContentLoader';

export default function LoadingPage() {
  return (
    <>
      <div className="container">
        <ContentLoader speed={2} width={'100%'} height={110} className="mt-16">
          <rect x="0" y="10" rx="16" ry="16" width={'100%'} height="100" />
        </ContentLoader>
        <ContentLoader speed={2} width={'100%'} height={320} className="mt-6">
          <rect x="0" y="10" rx="16" ry="16" width={'100%'} height="300" />
        </ContentLoader>
      </div>
    </>
  );
}
