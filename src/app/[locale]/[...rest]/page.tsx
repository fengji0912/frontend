import { notFound } from 'next/navigation';

/**
 * {@link https://next-intl-docs.vercel.app/docs/environments/error-files#catching-unknown-routes}
 */
export default function CatchAllPage() {
  notFound();
}
