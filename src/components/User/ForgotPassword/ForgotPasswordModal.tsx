'use client';

import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
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
  const [state, formAction] = useFormState(requestPassword, {
    error: '',
    success: false,
  });

  return (
    <Modal isOpen onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Forgot password</ModalHeader>
        <form action={formAction}>
          <ModalBody>
            {state?.error && <Alert color="danger">{state.error}</Alert>}
            {state?.success && (
              <Alert color="success">
                If the email address exists, you will receive an email with
                further instructions shortly.
              </Alert>
            )}
            <Input
              type="email"
              label="Email address"
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
                  Sign in
                </LinkButton>
                <ButtonFormSubmit color="primary" type="submit">
                  Request password
                </ButtonFormSubmit>
              </>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
