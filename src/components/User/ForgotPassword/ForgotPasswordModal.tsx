'use client';

import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useFormState } from 'react-dom';

import Alert from '@/components/Alert/Alert';
import ButtonFormSubmit from '@/components/ButtonFormSubmit/ButtonFormSubmit';
import Input from '@/components/NextUi/Input/Input';
import { LinkButton } from '@/components/NextUi/LinkButton/LinkButton';
import Modal from '@/components/NextUi/Modal/Modal';
import { requestPassword } from '@/components/User/actions/actions';

export default function ForgotPasswordModal({
  onOpenChange,
  handleSignInClick,
}: {
  onOpenChange: () => void;
  handleSignInClick: () => void;
}) {
  const t = useTranslations();
  const [state, formAction] = useFormState(requestPassword, {
    error: '',
    success: false,
  });

  return (
    <Modal isOpen onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>{t('sharp_misty_poodle_grip')}</ModalHeader>
        <form action={formAction}>
          <ModalBody>
            {state?.error && <Alert color="danger">{state.error}</Alert>}
            {state?.success && (
              <Alert color="success">{t('civil_swift_hound_flop')}</Alert>
            )}
            <Input
              type="email"
              label={t('bold_still_lemming_clap')}
              name="email"
              isRequired
              disabled={state?.success}
            />
          </ModalBody>

          <ModalFooter className="flex justify-between">
            {!state?.success && (
              <>
                <LinkButton
                  onPress={handleSignInClick}
                  className="p-0 border-0 ms-2 grow-0"
                  size="lg"
                  variant="link"
                >
                  {t('knotty_proof_gecko_hunt')}
                </LinkButton>
                <ButtonFormSubmit color="primary" type="submit">
                  {t('home_sour_chipmunk_hack')}
                </ButtonFormSubmit>
              </>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
