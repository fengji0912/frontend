import { Button } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';

import logo from '@/assets/images/orkg-logo.svg';
import { getPaperByDoi, getPaperByTitle, Paper } from '@/services/orkg';

type OrkgButtonProps = {
  doi?: string;
  title?: string;
};

export default async function OrkgButton({ doi, title }: OrkgButtonProps) {
  let paper: Paper | null = null;
  if (doi) {
    paper = await getPaperByDoi(doi);
  }
  if (!paper && title) {
    paper = await getPaperByTitle(title);
  }

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
