'use client';

import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import Image from 'next/image';
import { useQueryState } from 'nuqs';
import { useContext, useMemo } from 'react';
import { CSVLink } from 'react-csv';

import { columnsParser } from '@/app/search/searchParams/searchParamsParsers';
import logo from '@/assets/images/orkg-logo-bw.svg';
import Alert from '@/components/Alert/Alert';
import Modal from '@/components/NextUi/Modal/Modal';
import tableDataContext from '@/components/TableDataProvider/tableDataContext';
import formatCslJsonAuthor from '@/lib/formatCslJsonAuthor';

type OrkgModalProps = {
  onOpenChange: () => void;
};

export default function OrkgModal({ onOpenChange }: OrkgModalProps) {
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
        <ModalHeader>ORKG export</ModalHeader>
        <ModalBody>
          <div>
            <Alert color="info">
              To import the content into the ORKG, you first need to download
              the <em>ORKG CSV</em> file which you then need to import into the{' '}
              <em>ORKG CSV import</em> tool.
            </Alert>
            <h1 className="text-lg">1. Download file</h1>
            <Button
              color="primary"
              startContent={<Image src={logo} alt="ORKG logo" width={20} />}
              as={CSVLink}
              data={csvData}
              filename="orkg_export.csv"
              className="!rounded-3xl"
            >
              Download ORKG CSV
            </Button>
            <h1 className="text-lg mt-5">2. Import in ORKG</h1>
            Import the file into the{' '}
            <a
              href="https://orkg.org/csv-import"
              target="_blank"
              rel="noreferrer"
              className="inline"
            >
              ORKG CSV Import tool
            </a>
            .
          </div>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
