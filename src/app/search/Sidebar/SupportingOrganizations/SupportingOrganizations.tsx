'use client';

import Image from 'next/image';
import { useQueryState } from 'nuqs';

import { queryParser } from '@/app/search/searchParams/searchParamsParsers';
import nfdi4dsLogo from '@/app/search/Sidebar/SupportingOrganizations/Logos/nfdi4ds.png';
import nfdi4energyLogo from '@/app/search/Sidebar/SupportingOrganizations/Logos/nfdi4energy.svg';
import nfdi4ingLogo from '@/app/search/Sidebar/SupportingOrganizations/Logos/nfdi4ing.svg';

const ORGANIZATIONS = [
  {
    name: 'NFDI4DataScience',
    logo: nfdi4dsLogo,
    url: 'https://www.nfdi4datascience.de/',
    words: ['data'],
    domain: 'Data Science',
  },
  {
    name: 'NFDI4Energy',
    logo: nfdi4energyLogo,
    url: 'https://www.nfdi4energy.de/',
    words: ['energy'],
    domain: 'Energy Systems',
  },
  {
    name: 'NFDI4Ing',
    logo: nfdi4ingLogo,
    url: 'https://www.nfdi4ing.de/',
    words: ['engineering', 'construction'],
    domain: 'Engineering',
  },
];

export default function SupportingOrganizations() {
  const [query] = useQueryState('query', queryParser);

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
        The generation of this answer in the area of{' '}
        {supportingOrganization.domain} is supported by{' '}
        <a href={supportingOrganization.url} target="_blank">
          {supportingOrganization.name}
        </a>
        .
      </div>
    </div>
  ) : null;
}
