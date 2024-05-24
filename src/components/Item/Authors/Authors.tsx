'use client';

import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';

import useIsOverflow from '@/components/Item/Authors/hooks/useIsOverflowing';
import { LinkButton } from '@/components/NextUi/LinkButton/LinkButton';
import formatCslJsonAuthor from '@/lib/formatCslJsonAuthor';
import { Person } from '@/types/csl-json';

type AuthorsProps = {
  authors?: Person[];
};

export default function Authors({ authors = [] }: AuthorsProps) {
  const ref = useRef<HTMLUListElement>(null);
  const isOverflow = useIsOverflow(ref);
  const [isShowMore, setIsShowMore] = useState(false);

  return authors.length > 0 ? (
    <div className="flex items-center min-w-0">
      <FontAwesomeIcon icon={faUser} className="opacity-75" />
      <ul
        className={`flex p-0 m-0 ${
          !isShowMore ? 'overflow-hidden' : 'flex-wrap mt-[6px]'
        }`}
        ref={ref}
      >
        {authors?.map((author, index) => (
          <li
            className="ml-2 whitespace-nowrap after:content-['•'] after:last:content-[''] after:ml-2"
            key={index}
          >
            {formatCslJsonAuthor(author)}
          </li>
        ))}
      </ul>
      {(isShowMore || isOverflow) && (
        <div className={`flex ${isShowMore ? 'self-start' : ''}`}>
          <LinkButton
            color="primary"
            variant="light"
            className="px-2"
            style={{ fontSize: 'inherit' }}
            onPress={() => setIsShowMore((v) => !v)}
          >
            {isShowMore ? 'Less...' : 'More...'}
          </LinkButton>
        </div>
      )}
    </div>
  ) : null;
}
