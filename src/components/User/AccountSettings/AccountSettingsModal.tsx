'use client';

import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Avatar,
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useState } from 'react';
import { useFormState } from 'react-dom';

import Alert from '@/components/Alert/Alert';
import ButtonFormSubmit from '@/components/ButtonFormSubmit/ButtonFormSubmit';
import Input from '@/components/NextUi/Input/Input';
import Modal from '@/components/NextUi/Modal/Modal';
import { getUserData, update, User } from '@/components/User/actions/actions';

export default function AccountSettingsModal({
  onOpenChange,
  handleChangePasswordClick,
}: {
  onOpenChange: () => void;
  handleChangePasswordClick: () => void;
}) {
  const [user, setUser] = useState<User>(null);
  const id = useId();
  const t = useTranslations();

  const updateWithId = update.bind(null, user?.recordId || '');
  const [state, formAction] = useFormState(updateWithId, {
    error: '',
    data: {},
    success: false,
  });
  useEffect(() => {
    const getUser = async () => {
      setUser(await getUserData());
    };
    getUser();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <Modal isOpen onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>{t('pretty_slimy_finch_create')}</ModalHeader>
        <form action={formAction}>
          <ModalBody>
            {state?.error && <Alert color="danger">{state.error}</Alert>}
            {state?.success && (
              <Alert color="success">{t('bold_awful_crocodile_spin')}</Alert>
            )}
            <Input
              label={t('slimy_aware_snake_quiz')}
              name="name"
              type="text"
              id={`${id}-name`}
              required
              isInvalid={!!state?.data?.name}
              errorMessage={state?.data?.name?.message}
              defaultValue={user?.name}
            />
            <Input
              label={t('lime_small_hound_clip')}
              name="email"
              type="email"
              required
              isInvalid={!!state?.data?.email}
              errorMessage={state?.data?.email?.message}
              defaultValue={user?.email}
            />
            <div className="mt-3 flex items-center">
              <Avatar
                src={`https://gravatar.com/avatar/${user?.emailHash}?d=retro&r=g&s=100`}
              />

              <a
                href="https://en.gravatar.com/"
                target="_blank"
                rel="noreferrer"
                className="ms-2 text-decoration-underline"
              >
                {t('big_simple_ocelot_ask')}{' '}
                <FontAwesomeIcon icon={faExternalLink} />
              </a>
            </div>
          </ModalBody>
          <ModalFooter className="justify-between items-center">
            <Button
              color="secondary"
              size="md"
              onPress={handleChangePasswordClick}
              className="dark:!bg-secondary-200"
            >
              {t('fair_grassy_albatross_treasure')}
            </Button>
            <ButtonFormSubmit color="primary" type="submit">
              {t('known_knotty_slug_walk')}
            </ButtonFormSubmit>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
