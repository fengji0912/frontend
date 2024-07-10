'use client';

import {
  Button,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useContext, useMemo } from 'react';
import { CSVLink } from 'react-csv';

import { columnsParser } from '@/app/[locale]/search/searchParams/searchParamsParsers';
import logo from '@/assets/images/orkg-logo-bw.svg';
import Alert from '@/components/Alert/Alert';
import Modal from '@/components/NextUi/Modal/Modal';
import tableDataContext from '@/components/TableDataProvider/tableDataContext';
import formatCslJsonAuthor from '@/lib/formatCslJsonAuthor';

type OrkgModalProps = {
  onOpenChange: () => void;
};

export default function OrkgModal({ onOpenChange }: OrkgModalProps) {
  const t = useTranslations();
  const [columns] = useQueryState('columns', columnsParser);
  const { items, llmData } = useContext(tableDataContext);

  const csvData = useMemo(
    () => [
      [
        'paper:title',
        'paper:doi',
        'paper:authors',
        'paper:publication_month',
        'paper:publication_year',
        'paper:url',
        'paper:research_field',
        ...columns,
      ],
      ...items.map((item) => [
        item.cslData?.title ?? '',
        item.cslData?.DOI ?? '',
        item.cslData?.author
          ?.map((author) => formatCslJsonAuthor(author))
          .join('; ') ?? '',
        item.cslData?.issued?.['date-parts']?.[0]?.[1] ?? '',
        item.cslData?.issued?.['date-parts']?.[0]?.[0] ?? '',
        item.cslData?.URL ?? '',
        'R11',
        ...columns.map((column) => llmData?.[item.cslData!.id]?.[column] ?? ''),
      ]),
    ],
    [columns, items, llmData]
  );

  return (
    <Modal isOpen onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        <ModalHeader>{t('jumpy_ok_impala_lock')}</ModalHeader>
        <ModalBody>
          <div className="mb-4">
            <Alert color="info">
              {t.rich('antsy_main_barbel_surge', {
                em: (chunks) => <em>{chunks}</em>,
              })}
            </Alert>
            <h1 className="text-lg">{t('cozy_noble_iguana_belong')}</h1>
            <Button
              color="primary"
              startContent={<Image src={logo} alt="ORKG logo" width={20} />}
              as={CSVLink}
              data={csvData}
              filename="orkg_export.csv"
              className="!rounded-3xl"
            >
              {t('noisy_keen_pelican_clip')}
            </Button>
            <h1 className="text-lg mt-5">{t('simple_gray_shrike_spin')}</h1>
            {t.rich('ornate_bland_mare_fond', {
              link: (chunks) => (
                <a
                  href="https://orkg.org/csv-import"
                  target="_blank"
                  rel="noreferrer"
                  className="inline"
                >
                  {chunks}
                </a>
              ),
            })}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
