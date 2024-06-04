import moment from 'moment';

import { SearchResponse } from '@/services/backend';
import { IData } from '@/types/csl-json';

/**
 * Transforms an item object from a backend response into a CSL-JSON format.
 * @remarks
 * This function is not yet complete, either all available metadata, or all available relevant metadata should be transformed
 * @param item - The item object from the backend response.
 * @returns The item object transformed into CSL-JSON format.
 */
export default function transformBackendToJsonCsl(item: SearchResponse): IData {
  return {
    id: item.id.toString(),
    type: 'article',
    title: item.title,
    author: item.authors?.map((author) => ({ literal: author })),
    DOI: item.doi ?? undefined,
    URL: item.download_url ?? undefined,
    abstract: item.abstract ?? undefined,
    publisher: item.publisher?.replaceAll("'", '') ?? undefined, // fix issue with unneeded quotes in publisher name
    issued: item.date_published
      ? {
          'date-parts': [
            [
              moment(item.date_published).year() ?? undefined,
              moment(item.date_published).month() + 1, // moment JS months range form 0 to 11
            ],
          ],
        }
      : undefined,
    journalAbbreviation: item.journals?.[0] ?? undefined,
    ISSN: item.issn ?? undefined,
    language: item.language ?? undefined,
    custom: {
      'citation-count': item.citation_count,
    },
  };
}
