'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';

import { queryParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';
import nfdi4dsLogo from '@/app/[locale]/search/Sidebar/SupportingOrganizations/Logos/nfdi4ds.png';
import nfdi4energyLogo from '@/app/[locale]/search/Sidebar/SupportingOrganizations/Logos/nfdi4energy.svg';
import nfdi4ingLogo from '@/app/[locale]/search/Sidebar/SupportingOrganizations/Logos/nfdi4ing.svg';

export default function SupportingOrganizations() {
  const t = useTranslations();
  const [query] = useQueryState('query', queryParser);

  const ORGANIZATIONS = [
    {
      name: 'NFDI4DataScience',
      logo: nfdi4dsLogo,
      url: 'https://www.nfdi4datascience.de/',
      words: [t('sharp_lime_shell_grace')],
      domain: t('flat_awful_tapir_adore'),
    },
    {
      name: 'NFDI4Energy',
      logo: nfdi4energyLogo,
      url: 'https://www.nfdi4energy.de/',
      words: [t('arable_jumpy_jay_drip')],
      domain: t('direct_zesty_puffin_grin'),
    },
    {
      name: 'NFDI4Ing',
      logo: nfdi4ingLogo,
      url: 'https://www.nfdi4ing.de/',
      words: [t('patchy_this_rat_chop'), t('solid_loose_toucan_breathe')],
      domain: t('brave_odd_nils_boost'),
    },
  ];

  const supportingOrganization = ORGANIZATIONS.find((organization) =>
    organization.words.some((word) =>
      query.toLocaleLowerCase().includes(word.toLocaleLowerCase())
    )
  );

  return supportingOrganization ? (
    <div className="box mt-4 flex items-center gap-3 !py-3">
      <div className="shrink-0">
        <Image
          src={supportingOrganization.logo}
          alt={supportingOrganization.name}
          width={120}
          fill={false}
          height={120}
        />
      </div>
      <div className="text-sm">
        {t('calm_grassy_maggot_quell', {
          domain: supportingOrganization.domain,
        })}{' '}
        <a href={supportingOrganization.url} target="_blank">
          {supportingOrganization.name}
        </a>
        .
      </div>
    </div>
  ) : null;
}
