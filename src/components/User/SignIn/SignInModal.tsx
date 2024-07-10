'use client';

import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useSWRConfig } from 'swr';

import Alert from '@/components/Alert/Alert';
import ButtonFormSubmit from '@/components/ButtonFormSubmit/ButtonFormSubmit';
import Input from '@/components/NextUi/Input/Input';
import { LinkButton } from '@/components/NextUi/LinkButton/LinkButton';
import Modal from '@/components/NextUi/Modal/Modal';
import { signIn } from '@/components/User/actions/actions';

export default function SignInModal({
  onOpenChange,
  handleForgotPasswordClick,
  handleSignUpClick,
}: {
  onOpenChange: () => void;
  handleForgotPasswordClick: () => void;
  handleSignUpClick: () => void;
}) {
  const t = useTranslations();
  const { mutate } = useSWRConfig();
  const [state, formAction] = useFormState(signIn, {
    error: '',
    success: false,
  });

  useEffect(() => {
    if (state?.success) {
      mutate('checkIfAuthenticated', true);
    }
  }, [state?.success, mutate]);

  return (
    <Modal isOpen onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>{t('jolly_equal_jackal_promise')}</ModalHeader>
        <form action={formAction}>
          <ModalBody>
            {state?.error && <Alert color="danger">{state.error}</Alert>}
            <Input
              type="email"
              label={t('proud_merry_alligator_jolt')}
              name="email"
              isRequired
            />
            <Input
              type="password"
              label={t('tense_livid_tadpole_assure')}
              name="password"
              isRequired
            />
            <div className="flex content-end">
              <LinkButton variant="link" onPress={handleForgotPasswordClick}>
                {t('mad_strong_bison_clasp')}
              </LinkButton>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-between">
            <span className="flex items-center">
              {t('tough_slimy_okapi_enjoy')}
              <LinkButton
                onPress={handleSignUpClick}
                variant="link"
                size="md"
                className="p-0 border-0 ms-2"
              >
                {t('many_close_sawfish_delight')}
              </LinkButton>
            </span>
            <ButtonFormSubmit color="primary" type="submit">
              {t('game_quick_grebe_strive')}
            </ButtonFormSubmit>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
