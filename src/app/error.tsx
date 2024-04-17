'use client';

import { Button } from '@nextui-org/react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <div className="container mt-10 box-white !py-10 flex items-center flex-col ">
        <div className="flex  items-center">
          <h1 className="text-4xl pe-5">Error</h1> <span>{error.message}</span>{' '}
        </div>
        <Button color="primary" onPress={() => reset()} className="mt-2">
          Try again
        </Button>
      </div>
      <div className="flex justify-center items-center mt-5 text-secondary-800 italic">
        Digest: {error.digest}
      </div>
    </main>
  );
}
