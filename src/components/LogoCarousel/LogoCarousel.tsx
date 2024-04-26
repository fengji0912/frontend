'use client';

import 'slick-carousel/slick/slick-theme.scss';
import 'slick-carousel/slick/slick.scss';

import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Slider from 'react-slick';

import erc from '@/components/LogoCarousel/images/erc.png';
import eulist from '@/components/LogoCarousel/images/eulist.png';
import l3s from '@/components/LogoCarousel/images/l3s.png';
import nfdi from '@/components/LogoCarousel/images/nfdi.png';
import tib from '@/components/LogoCarousel/images/tib.png';

const LOGOS = [
  {
    name: 'TIB Leibniz Information Centre for Science and Technology',
    src: tib,
    width: 100,
  },
  {
    name: 'L3S Research Center',
    src: l3s,
    width: 120,
  },
  {
    name: 'Eulist',
    src: eulist,
    width: 100,
  },
  {
    name: 'NFDI',
    src: nfdi,
    width: 250,
  },
  {
    name: 'European Research Council',
    src: erc,
    width: 90,
  },
];

export default function LogoCarousel({
  autoplay = false,
}: {
  autoplay?: boolean;
}) {
  return (
    <>
      <span className="mb-4">ORKG Ask is brought to you by</span>
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
              alt={`Logo of ${logo.name}`}
              fill={false}
            />
          </div>
        ))}
      </Slider>
    </>
  );
}
