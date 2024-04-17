'use client';

import {
  Button,
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
import { signUp } from '@/components/User/actions/actions';

export default function SignUpModal({
  onOpenChange,
  handleSignInClick,
}: {
  onOpenChange: () => void;
  handleSignInClick: () => void;
}) {
  const [state, formAction] = useFormState(signUp, {
    error: '',
    data: {},
    success: false,
  });

  return (
    <Modal isOpen onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Sign up</ModalHeader>
        <form action={formAction}>
          <ModalBody>
            {state?.error && <Alert color="danger">{state.error}</Alert>}
            {state?.success ? (
              <Alert color="success">
                Account created successfully.{' '}
                <Button
                  color="primary"
                  className="ms-2"
                  onPress={handleSignInClick}
                >
                  Sign in
                </Button>
              </Alert>
            ) : (
              <>
                <Input
                  label="Name"
                  type="text"
                  name="name"
                  isRequired
                  isInvalid={!!state?.data?.name}
                  errorMessage={state?.data?.name?.message}
                />
                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  isRequired
                  isInvalid={!!state?.data?.email}
                  errorMessage={state?.data?.email?.message}
                />
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  isRequired
                  isInvalid={!!state?.data?.password}
                  errorMessage={state?.data?.password?.message}
                />
              </>
            )}
          </ModalBody>
          {!state?.success && (
            <ModalFooter className="flex justify-between ">
              <span className="flex items-center">
                Already an account?
                <LinkButton
                  variant="link"
                  onPress={handleSignInClick}
                  className="ms-2"
                  size="md"
                >
                  Sign in
                </LinkButton>
              </span>
              <ButtonFormSubmit color="primary" type="submit">
                Sign up
              </ButtonFormSubmit>
            </ModalFooter>
          )}
        </form>
      </ModalContent>
    </Modal>
  );
}
