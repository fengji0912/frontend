import { parseAsInteger, parseAsString } from 'nuqs';

export const sortParser = parseAsString.withDefault('-created').withOptions({
  shallow: false,
});

export const pageParser = parseAsInteger.withDefault(1).withOptions({
  shallow: false,
});

export const pageSizeParser = parseAsInteger.withDefault(10).withOptions({
  shallow: false,
});
