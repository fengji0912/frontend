'use client';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import {
  faCircle,
  faCircleArrowLeft,
  faCircleArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { IData } from 'csl-json';
import Slider, { CustomArrowProps } from 'react-slick';

import Item from '@/app/item/[id]/[[...slug]]/RelatedItems/ItemCarousel/Item/Item';

type ItemCarouselProps = {
  items: IData[];
};

export default function ItemCarousel({ items }: ItemCarouselProps) {
  return (
    <div className="px-5 my-5">
      <Slider
        dots
        infinite
        speed={500}
        slidesToShow={3}
        slidesToScroll={3}
        nextArrow={<NextArrow />}
        prevArrow={<PrevArrow />}
        className="[&_.slick-track]:flex [&_.slick-slide]:h-auto [&_.slick-slide_>_div]:h-full"
        responsive={[
          {
            breakpoint: 900,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
            },
          },
          {
            breakpoint: 500,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: false,
            },
          },
        ]}
        customPaging={() => (
          <div className="[.slick-active_&]:text-primary text-secondary-400">
            <FontAwesomeIcon icon={faCircle} className="text-[0.5rem]" />
          </div>
        )}
      >
        {items.map((item, index) => (
          <Item key={index} item={item} />
        ))}
      </Slider>
    </div>
  );
}

function NextArrow({ style, onClick }: CustomArrowProps) {
  return (
    <Button
      isIconOnly
      color="secondary"
      variant="light"
      size="sm"
      className="absolute top-[50%] transform -translate-y-1/2  right-[-25px]"
      style={style}
      onClick={onClick}
    >
      <FontAwesomeIcon
        className="text-secondary text-xl"
        icon={faCircleArrowRight}
      />
    </Button>
  );
}

function PrevArrow({ style, onClick }: CustomArrowProps) {
  return (
    <Button
      isIconOnly
      color="secondary"
      variant="light"
      size="sm"
      className="absolute top-[50%] transform -translate-y-1/2 left-[-25px]"
      style={style}
      onClick={onClick}
    >
      <FontAwesomeIcon
        className="text-secondary text-xl"
        icon={faCircleArrowLeft}
      />
    </Button>
  );
}
