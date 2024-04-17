'use server';

import ky from 'ky';

const OrkgApi = ky.create({
  prefixUrl: 'https://orkg.org/api',
});

export type Paper = {
  id: string;
};
export type PaperResponse = {
  content: Paper[];
};

export async function getPaperByDoi(doi: string): Promise<Paper | null> {
  return OrkgApi.get(`papers?doi=${encodeURIComponent(doi)}`, {
    headers: {
      'Content-Type': 'application/vnd.orkg.paper.v2+json;charset=UTF-8',
      Accept: 'application/vnd.orkg.paper.v2+json',
    },
  })
    .json<PaperResponse>()
    .then((papers) => papers.content[0] ?? null);
}

export async function getPaperByTitle(title: string): Promise<Paper | null> {
  return OrkgApi.get(`papers?title=${encodeURIComponent(title)}`, {
    headers: {
      'Content-Type': 'application/vnd.orkg.paper.v2+json;charset=UTF-8',
      Accept: 'application/vnd.orkg.paper.v2+json',
    },
  })
    .json<PaperResponse>()
    .then((papers) => papers.content[0] ?? null);
}
