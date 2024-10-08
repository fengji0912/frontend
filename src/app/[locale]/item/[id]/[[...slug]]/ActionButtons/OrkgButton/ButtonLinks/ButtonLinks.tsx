'use client';

import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import logo from '@/assets/images/orkg-logo.svg';
import { Link } from '@/components/Navigation/Navigation';
import { Paper } from '@/services/orkg';

type ButtonLinksProps = {
  paper: Paper | null;
  doi?: string;
  title?: string;
};

export default function OrkgButton({ paper, doi, title }: ButtonLinksProps) {
  const t = useTranslations();

  return paper ? (
    <Button
      color="secondary"
      variant="bordered"
      as={Link}
      href={`https://orkg.org/paper/${paper.id}`}
      target="_blank"
    >
      {t('aware_north_whale_tickle')}
    </Button>
  ) : (
    <Button
      color="secondary"
      variant="bordered"
      as={Link}
      href={
        doi
          ? `https://orkg.org/add-paper?entry=${doi}`
          : `https://orkg.org/add-paper?title=${encodeURIComponent(
              title ?? ''
            )}`
      }
      target="_blank"
    >
      <Image src={logo} alt="ORKG logo" width={20} />{' '}
      {t('strong_ideal_meerkat_lend')}
    </Button>
  );
}
