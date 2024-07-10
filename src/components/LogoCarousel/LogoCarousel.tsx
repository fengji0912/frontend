'use client';

import 'slick-carousel/slick/slick-theme.scss';
import 'slick-carousel/slick/slick.scss';

import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Slider from 'react-slick';

import erc from '@/components/LogoCarousel/images/erc.png';
import eulist from '@/components/LogoCarousel/images/eulist.png';
import l3s from '@/components/LogoCarousel/images/l3s.png';
import leibnizAssociation from '@/components/LogoCarousel/images/leibniz-association.svg';
import nfdi from '@/components/LogoCarousel/images/nfdi.png';
import tib from '@/components/LogoCarousel/images/tib.png';
import uniHannover from '@/components/LogoCarousel/images/uni-hannover.png';

export default function LogoCarousel({
  autoplay = false,
}: {
  autoplay?: boolean;
}) {
  const t = useTranslations();

  const LOGOS = [
    {
      name: t('awake_giant_halibut_vent'),
      src: tib,
      width: 100,
    },
    {
      name: t('ideal_bright_jaguar_express'),
      src: l3s,
      width: 120,
    },
    {
      name: t('smart_crisp_jellyfish_hack'),
      src: eulist,
      width: 100,
    },
    {
      name: t('heroic_best_wallaby_fulfill'),
      src: nfdi,
      width: 250,
    },
    {
      name: t('tough_nimble_halibut_tickle'),
      src: erc,
      width: 90,
    },
    {
      name: t('lucky_major_oryx_grasp'),
      src: uniHannover,
      width: 170,
    },
    {
      name: t('ornate_antsy_newt_taste'),
      src: leibnizAssociation,
      width: 120,
    },
  ];

  return (
    <>
      <span className="mb-4">{t('cuddly_clean_hamster_inspire')}</span>
      <Slider
        dots
        arrows={false}
        infinite
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        autoplay={autoplay}
        className="[&_.slick-track]:flex [&_.slick-slide]:h-auto [&_.slick-slide_>_div]:h-full mb-5"
        customPaging={() => (
          <div className="[.slick-active_&]:text-primary text-secondary-400">
            <FontAwesomeIcon icon={faCircle} className="text-[0.5rem]" />
          </div>
        )}
      >
        {LOGOS.map((logo) => (
          <div
            className="!flex justify-center items-center h-full"
            key={logo.name}
          >
            <Image
              key={logo.name}
              src={logo.src}
              width={logo.width}
              height={120}
              alt={`${t('home_sound_spider_mend')} ${logo.name}`}
              fill={false}
            />
          </div>
        ))}
      </Slider>
    </>
  );
}
