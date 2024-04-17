import {
  Date,
  DateFieldKey,
  IData,
  NumberFieldKey,
  Person,
  PersonFieldKey,
  StringFieldKey,
} from 'csl-json';
import { sortBy, upperFirst } from 'lodash';
export type Field = {
  title: string;
  cslType: keyof IData;
  type: string;
  options?: string[];
  value?: string | number | Date | Person[];
};

const stringTypes: StringFieldKey[] = [
  'DOI',
  'ISBN',
  'ISSN',
  'PMCID',
  'PMID',
  'URL',
  'abstract',
  'annote',
  'archive',
  'archive-place',
  'archive_location',
  'authority',
  'call-number',
  'citation-label',
  'citation-number',
  'collection-title',
  'container-title',
  'container-title-short',
  'dimensions',
  'event',
  'event-place',
  'first-reference-note-number',
  'genre',
  'journalAbbreviation',
  'jurisdiction',
  'keyword',
  'language',
  'locator',
  'medium',
  'note',
  'number',
  'original-publisher',
  'original-publisher-place',
  'original-title',
  'page',
  'page-first',
  'publisher',
  'publisher-place',
  'references',
  'reviewed-title',
  'scale',
  'section',
  'shortTitle',
  'source',
  'status',
  'title',
  'title-short',
  'version',
  'year-suffix',
];

const personTypes: PersonFieldKey[] = [
  'author',
  'collection-editor',
  'composer',
  'container-author',
  'director',
  'editor',
  'editorial-director',
  'illustrator',
  'interviewer',
  'original-author',
  'recipient',
  'reviewed-author',
  'translator',
];

const dateTypes: DateFieldKey[] = [
  'accessed',
  'container',
  'event-date',
  'issued',
  'original-date',
  'submitted',
];

const numberTypes: NumberFieldKey[] = [
  'chapter-number',
  'collection-number',
  'edition',
  'issue',
  'number-of-pages',
  'number-of-volumes',
  'volume',
];

function titleMapper(title: string) {
  const titleMap: { [key: string]: string } = {
    author: 'Authors',
    issued: 'Publication date',
  };
  return titleMap[title] || upperFirst(title);
}

export const FIELDS: Field[] = sortBy(
  [
    ...stringTypes.map((stringType) => ({
      title: titleMapper(stringType),
      cslType: stringType,
      type: 'string',
    })),
    ...dateTypes.map((dateType) => ({
      title: titleMapper(dateType),
      cslType: dateType,
      type: 'date',
    })),
    ...personTypes.map((personType) => ({
      title: titleMapper(personType),
      cslType: personType,
      type: 'person',
    })),
    ...numberTypes.map((numberType) => ({
      title: titleMapper(numberType),
      cslType: numberType,
      type: 'number',
    })),
    {
      title: 'Type',
      cslType: 'type' as StringFieldKey,
      type: 'select',
      options: [
        'article',
        'article-journal',
        'article-magazine',
        'article-newspaper',
        'bill',
        'book',
        'broadcast',
        'chapter',
        'classic',
        'collection',
        'dataset',
        'document',
        'entry',
        'entry-dictionary',
        'entry-encyclopedia',
        'event',
        'figure',
        'graphic',
        'hearing',
        'interview',
        'legal_case',
        'legislation',
        'manuscript',
        'map',
        'motion_picture',
        'musical_score',
        'pamphlet',
        'paper-conference',
        'patent',
        'performance',
        'periodical',
        'personal_communication',
        'post',
        'post-weblog',
        'regulation',
        'report',
        'review',
        'review-book',
        'software',
        'song',
        'speech',
        'standard',
        'thesis',
        'treaty',
        'webpage',
      ],
    },
  ],
  'title'
);
