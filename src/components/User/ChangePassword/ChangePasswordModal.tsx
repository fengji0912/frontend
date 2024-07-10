'use client';

import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

import Alert from '@/components/Alert/Alert';
import ButtonFormSubmit from '@/components/ButtonFormSubmit/ButtonFormSubmit';
import Input from '@/components/NextUi/Input/Input';
import Modal from '@/components/NextUi/Modal/Modal';
import {
  getUserData,
  updatePassword,
  User,
} from '@/components/User/actions/actions';

export default function ChangePasswordModal({
  onOpenChange,
}: {
  onOpenChange: () => void;
}) {
  const [user, setUser] = useState<User>(null);
  const t = useTranslations();
  const updateWithId = updatePassword.bind(null, user?.recordId || '');
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

  return (
    <Modal isOpen onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>{t('that_only_wombat_yell')}</ModalHeader>
        <form action={formAction}>
          <ModalBody>
            {state?.error && <Alert color="danger">{state.error}</Alert>}
            {state?.success ? (
              <Alert color="success">{t('cuddly_east_goose_evoke')}</Alert>
            ) : (
              <>
                <Input
                  label={t('fine_tiny_mare_talk')}
                  type="password"
                  name="oldPassword"
                  isRequired
                  isInvalid={!!state?.data?.oldPassword}
                  errorMessage={state?.data?.oldPassword?.message}
                />
                <Input
                  label={t('east_brief_seahorse_play')}
                  type="password"
                  name="password"
                  isRequired
                  isInvalid={!!state?.data?.password}
                  errorMessage={state?.data?.password?.message}
                />
                <Input
                  label={t('extra_gray_owl_hint')}
                  type="password"
                  name="passwordConfirm"
                  isRequired
                  isInvalid={!!state?.data?.passwordConfirm}
                  errorMessage={state?.data?.passwordConfirm?.message}
                />
              </>
            )}
          </ModalBody>
          {!state?.success && (
            <ModalFooter>
              <ButtonFormSubmit color="primary" type="submit">
                {t('polite_mild_shell_chop')}
              </ButtonFormSubmit>
            </ModalFooter>
          )}
        </form>
      </ModalContent>
    </Modal>
  );
}
