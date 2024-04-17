'use client';

import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  SelectItem,
  SelectSection,
} from '@nextui-org/react';
import { Date, IData, Person } from 'csl-json';
import { sortBy } from 'lodash';
import moment from 'moment';
import { useParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

import {
  createCollectionItem,
  updateCollectionItem,
} from '@/app/my-library/[[...collectionId]]/Items/actions/actions';
import AuthorInput from '@/app/my-library/[[...collectionId]]/Items/ItemsModal/AuthorInput/AuthorInput';
import {
  Field,
  FIELDS,
} from '@/app/my-library/[[...collectionId]]/Items/ItemsModal/constants/fields';
import Alert from '@/components/Alert/Alert';
import ButtonFormSubmit from '@/components/ButtonFormSubmit/ButtonFormSubmit';
import Input from '@/components/NextUi/Input/Input';
import Modal from '@/components/NextUi/Modal/Modal';
import Select from '@/components/NextUi/Select/Select';
import Textarea from '@/components/NextUi/Textarea/Textarea';

type ItemsModalProps = {
  onOpenChange: () => void;
  onClose: () => void;
  cslData?: IData;
  itemId?: string;
};

export default function ItemsModal({
  onOpenChange,
  onClose,
  cslData,
  itemId,
}: ItemsModalProps) {
  const FEATURED_FIELDS = ['DOI', 'author', 'issued'];
  const isEdit = !!cslData;

  const [additionalFields, setAdditionalFields] = useState<Field[]>(
    !cslData
      ? [FIELDS.find((field) => field.cslType === 'title')!]
      : sortBy(
          FIELDS.filter((field) =>
            Object.keys(cslData).includes(field.cslType)
          ).map((field) => ({ ...field, value: cslData[field.cslType] })),
          [(v) => v.cslType !== 'title', 'title']
        )
  );
  const params = useParams<{ collectionId: string }>();

  const actionWithId = isEdit
    ? updateCollectionItem.bind(null, itemId ?? '')
    : createCollectionItem.bind(null, params.collectionId?.[0]);

  const [state, formAction] = useFormState(actionWithId, {
    error: '',
    data: {},
    success: false,
  });

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAdditionalFields((prev) => [
      ...prev,
      FIELDS.find((f) => f.cslType === e.target.value)!,
    ]);
  };

  const handleDelete = (value: string) => {
    setAdditionalFields((prev) =>
      prev.filter((field) => field.cslType !== value)
    );
  };

  const fields = FIELDS.filter(
    (field) =>
      !additionalFields.some((_field) => field.cslType === _field.cslType)
  );

  return (
    <Modal isOpen onOpenChange={onOpenChange} size="xl">
      <ModalContent>
        <ModalHeader>{isEdit ? 'Edit' : 'Add'} item</ModalHeader>
        <form action={formAction}>
          <ModalBody>
            {state?.error && <Alert color="danger">{state.error}</Alert>}
            {additionalFields.map((field) => (
              <div
                key={field.cslType}
                className="flex border-b-1 border-b-secondary-100 pb-3"
              >
                {field.type === 'string' && (
                  <>
                    {field.cslType === 'abstract' ||
                    field.cslType === 'note' ? (
                      <Textarea
                        label={field.title}
                        name={field.cslType}
                        type="text"
                        defaultValue={field.value as string}
                      />
                    ) : (
                      <Input
                        label={field.title}
                        name={field.cslType}
                        type="text"
                        required={field.cslType === 'title'}
                        defaultValue={field.value as string}
                      />
                    )}
                  </>
                )}
                {field.type === 'number' && (
                  <Input
                    label={field.title}
                    name={field.cslType}
                    type="number"
                    defaultValue={field.value as string}
                  />
                )}
                {field.type === 'select' && (
                  <Input
                    label={field.title}
                    name={field.cslType}
                    type="select"
                    defaultValue={field.value as string}
                  >
                    {field.options?.map((option) => (
                      <option value={option} key={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                )}
                {field.type === 'date' && (
                  <div className="sm:flex grow space-x-0 md:space-x-1 space-y-1 sm:space-y-0">
                    <Select
                      label={field.title + ' month'}
                      name={field.cslType}
                      placeholder="Month"
                      className="me-1"
                      defaultSelectedKeys={
                        (field?.value as Date)?.['date-parts']?.[0]?.[1]
                          ? [
                              (field?.value as Date)?.[
                                'date-parts'
                              ]?.[0]?.[1]?.toString() as string,
                            ]
                          : []
                      }
                    >
                      {moment.months().map((el, index) => (
                        <SelectItem value={index + 1} key={index + 1}>
                          {el}
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      label={field.title + ' year'}
                      name={field.cslType}
                      type="number"
                      placeholder="Year"
                      defaultValue={
                        (field?.value as Date)?.[
                          'date-parts'
                        ]?.[0]?.[0] as string
                      }
                    />
                  </div>
                )}
                {field.type === 'person' && (
                  <div className="bg-secondary-50 rounded-3xl border-1 border-secondary-200 py-2 px-3 grow">
                    <div className="text-[.75rem] text-default-600">
                      {field.title}
                    </div>
                    <AuthorInput
                      cslType={field.cslType}
                      defaultValue={field.value as Person[]}
                    />
                  </div>
                )}
                <div>
                  {field.cslType !== 'title' && (
                    <Button
                      variant="light"
                      isIconOnly
                      className="text-secondary p-0 mr-[-5px] mt-[-5px]"
                      size="sm"
                      onPress={() => handleDelete(field.cslType)}
                    >
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        style={{ fontSize: '1.3rem' }}
                      />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </ModalBody>
          <ModalFooter className="flex justify-between items-center">
            <Select
              className="max-w-48"
              size="sm"
              placeholder="Add fields..."
              onChange={handleSelectChange}
              selectedKeys={new Set([])}
            >
              <SelectSection showDivider title="Recommended">
                {fields
                  .filter((field) => FEATURED_FIELDS.includes(field.cslType))
                  .map((field) => (
                    <SelectItem value={field.cslType} key={field.cslType}>
                      {field.title}
                    </SelectItem>
                  ))}
              </SelectSection>
              <SelectSection title="Other">
                {fields
                  .filter((field) => !FEATURED_FIELDS.includes(field.cslType))
                  .map((field) => (
                    <SelectItem value={field.cslType} key={field.cslType}>
                      {field.title}
                    </SelectItem>
                  ))}
              </SelectSection>
            </Select>
            <ButtonFormSubmit color="primary" type="submit">
              Save
            </ButtonFormSubmit>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
