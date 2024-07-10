'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { LinkButton } from '@/components/NextUi/LinkButton/LinkButton';

type ReadMoreProps = {
  text?: string;
  maxLength?: number;
};

export default function ReadMore({
  text = '',
  maxLength = 750,
}: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations();

  const textSliced = isExpanded ? text : text.slice(0, maxLength);
  const isExpandable = text.length > maxLength;
  return (
    <>
      <p>
        {textSliced}
        {isExpandable && (
          <>
            {!isExpanded ? '...' : ''}{' '}
            <LinkButton
              color="primary"
              size="md"
              variant="link"
              onPress={() => setIsExpanded((v) => !v)}
            >
              {isExpanded
                ? t('next_factual_liger_praise')
                : t('extra_every_polecat_engage')}
            </LinkButton>
          </>
        )}
      </p>
    </>
  );
}
