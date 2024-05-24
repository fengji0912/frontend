import { IPerson } from '@/types/csl-json';

export default function formatCslJsonAuthor(
  author: IPerson | undefined
): string | null {
  if (author?.given || author?.family) {
    return `${author.given ?? ''} ${author.family ?? ''}`;
  }
  return author?.literal ?? '';
}
