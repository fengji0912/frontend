'use client';

import {
  ModalBody,
  ModalContent,
  ModalHeader,
  SelectItem,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';

import generateCitation from '@/components/CiteModal/actions/actions';
import FORMATS from '@/components/CiteModal/constants/formats';
import Modal from '@/components/NextUi/Modal/Modal';
import Select from '@/components/NextUi/Select/Select';
import Textarea from '@/components/NextUi/Textarea/Textarea';
import { IData } from '@/types/csl-json';

type CiteModalProps = {
  onOpenChange: () => void;
  items: IData[];
};

export default function CiteModal({ onOpenChange, items }: CiteModalProps) {
  const [citation, setCitation] = useState('');
  const [type, setType] = useState('apa');
  const [isLoading, startTransition] = useTransition();
  const t = useTranslations();

  useEffect(() => {
    startTransition(async () => {
      // use a server action to generate citation to prevent loading all citation-js plugins on the client
      let output = await generateCitation({ items, type });
      if (type === 'bibtex') {
        output = `% ${t('tense_bad_racoon_mend')} ${
          process.env.version
        } - https://ask.orkg.org\n\n${output}`;
      }
      setCitation(output);
    });
  }, [items, t, type]);

  return (
    <Modal isOpen onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        <ModalHeader>{t('sea_born_badger_pet')}</ModalHeader>

        <ModalBody>
          <Select
            selectedKeys={[type]}
            onChange={(e) => setType(e.target.value)}
            labelPlacement="outside"
            className="max-w-40"
            disallowEmptySelection
          >
            {FORMATS.map(({ value, label }) => (
              <SelectItem value={value} key={value}>
                {label}
              </SelectItem>
            ))}
          </Select>
          <Textarea
            className="mb-3"
            value={!isLoading ? citation : t('east_patchy_buzzard_soar')}
            isDisabled={isLoading}
            onClick={(e) => e.currentTarget.select()}
            isReadOnly
            maxRows={30}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
