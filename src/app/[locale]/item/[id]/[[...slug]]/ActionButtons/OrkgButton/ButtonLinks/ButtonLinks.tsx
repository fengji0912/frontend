'use client';

import { Button } from '@nextui-org/react';
import Image from 'next/image';

import logo from '@/assets/images/orkg-logo.svg';
import { Link } from '@/components/Navigation/Navigation';
import { Paper } from '@/services/orkg';

type ButtonLinksProps = {
  paper: Paper | null;
  doi?: string;
};

export default function OrkgButton({ paper, doi }: ButtonLinksProps) {
  return paper ? (
    <Button
      color="secondary"
      variant="bordered"
      as={Link}
      href={`https://orkg.org/paper/${paper.id}`}
      target="_blank"
    >
      View in ORKG
    </Button>
  ) : (
    <Button
      color="secondary"
      variant="bordered"
      as={Link}
      href={
        doi
          ? `https://orkg.org/add-paper?entry=${doi}`
          : `https://orkg.org/add-paper`
      }
      target="_blank"
    >
      <Image src={logo} alt="ORKG logo" width={20} /> Add to ORKG
    </Button>
  );
}
