import {
  faBarcode,
  faBook,
  faBuildingColumns,
  faCalendar,
  faLanguage,
  faQuoteLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import useLanguages from '@/app/[locale]/search/Sidebar/Filters/helpers/useLanguages';
import doiIcon from '@/assets/images/doi-icon.svg';
import useCslJsonDateFormatter from '@/lib/useCslJsonDateFormatter';
import { IData } from '@/types/csl-json';

type MetadataGridProps = {
  item: IData;
};

export default function MetadataGrid({ item }: MetadataGridProps) {
  const t = useTranslations();
  const { LANGUAGES } = useLanguages();
  const { formatDate } = useCslJsonDateFormatter();

  const METADATA_GRID_ITEMS = [
    {
      label: t('mad_strong_mouse_engage'),
      icon: faCalendar,
      value: formatDate(item.issued),
    },
    {
      label: t('lofty_alert_zebra_dare'),
      icon: doiIcon,
      value: item?.DOI,
    },
    {
      label: t('round_suave_guppy_talk'),
      icon: faBuildingColumns,
      value: item?.publisher,
    },
    {
      label: t('spicy_salty_midge_quiz'),
      icon: faBarcode,
      value: item?.ISSN,
    },
    {
      label: t('brief_basic_spider_harbor'),
      icon: faBook,
      value: item?.journalAbbreviation,
    },
    {
      label: t('crazy_weak_flamingo_lift'),
      icon: faLanguage,
      value: item?.language ? LANGUAGES[item.language] : '',
    },
    {
      label: t('least_fancy_mare_chop'),
      icon: faQuoteLeft,
      value: item?.custom?.['citation-count'],
    },
  ];
  return (
    <div className="flex gap-1 rounded-2xl overflow-hidden flex-wrap flex-row">
      {METADATA_GRID_ITEMS.map((item) => {
        return item.value ? (
          <div
            className="py-4 px-4 bg-[#ffffff49] dark:bg-secondary-950 grow basis-[calc(25%-0.25rem)]"
            key={item.label}
          >
            <div className="text-secondary-700 text-small mb-1">
              {item.label === 'DOI' ? (
                <Image
                  src={item.icon}
                  width="17"
                  alt="Icon"
                  className="inline"
                />
              ) : (
                <FontAwesomeIcon
                  icon={item.icon}
                  className="text-secondary-600"
                />
              )}{' '}
              {item.label}
            </div>
            {item.label === 'DOI' ? (
              <a
                href={`https://doi.org/${item.value}`}
                target="_blank"
                className="whitespace-nowrap text-inherit !underline"
              >
                {item.value}
              </a>
            ) : (
              item.value
            )}
          </div>
        ) : null;
      })}
    </div>
  );
}
