'use client';

import {
  ModalBody,
  ModalContent,
  ModalHeader,
  SelectItem,
} from '@nextui-org/react';
import { IData } from 'csl-json';
import { useEffect, useState, useTransition } from 'react';

import generateCitation from '@/components/CiteModal/actions/actions';
import FORMATS from '@/components/CiteModal/constants/formats';
import Modal from '@/components/NextUi/Modal/Modal';
import Select from '@/components/NextUi/Select/Select';
import Textarea from '@/components/NextUi/Textarea/Textarea';

type CiteModalProps = {
  onOpenChange: () => void;
  items: IData[];
};

export default function CiteModal({ onOpenChange, items }: CiteModalProps) {
  const [citation, setCitation] = useState('');
  const [type, setType] = useState('apa');
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      // use a server action to generate citation to prevent loading all citation-js plugins on the client
      const output = await generateCitation({ items, type });
      setCitation(output);
    });
  }, [items, type]);

  return (
    <Modal isOpen onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        <ModalHeader>Cite</ModalHeader>

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
            value={!isLoading ? citation : 'Loading...'}
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
