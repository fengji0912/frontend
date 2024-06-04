import ButtonLinks from '@/app/[locale]/item/[id]/[[...slug]]/ActionButtons/OrkgButton/ButtonLinks/ButtonLinks';
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

  return <ButtonLinks paper={paper} doi={doi} />;
}
