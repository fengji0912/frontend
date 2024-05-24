'use server';

import '@citation-js/plugin-bibtex';
import '@citation-js/plugin-csl';
import '@citation-js/plugin-doi';
import '@citation-js/plugin-ris';

import { Cite } from '@citation-js/core';

import FORMATS from '@/components/CiteModal/constants/formats';
import { IData } from '@/types/csl-json';

export default async function generateCitation({
  type,
  items,
}: {
  type: string;
  items: IData[];
}): Promise<string> {
  const citation = await Cite.async(items);
  const format = FORMATS.find((format) => format.value === type)!;
  return citation.format(
    format.format,
    format.format === 'bibliography'
      ? {
          template: type,
          lang: 'en-US',
          append() {
            return `\n`;
          },
        }
      : {}
  );
}
