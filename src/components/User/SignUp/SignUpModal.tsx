'use client';

import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useState } from 'react';
import { useFormState } from 'react-dom';

import Alert from '@/components/Alert/Alert';
import ButtonFormSubmit from '@/components/ButtonFormSubmit/ButtonFormSubmit';
import { Link } from '@/components/Navigation/Navigation';
import Checkbox from '@/components/NextUi/Checkbox/Checkbox';
import Input from '@/components/NextUi/Input/Input';
import { LinkButton } from '@/components/NextUi/LinkButton/LinkButton';
import Modal from '@/components/NextUi/Modal/Modal';
import { signUp } from '@/components/User/actions/actions';
import ROUTES from '@/constants/routes';

export default function SignUpModal({
  onOpenChange,
  handleSignInClick,
}: {
  onOpenChange: () => void;
  handleSignInClick: () => void;
}) {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [hasAcceptedPrivacyStatement, setHasAcceptedPrivacyStatement] =
    useState(false);
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
                <Checkbox
                  size="sm"
                  isRequired
                  isSelected={hasAcceptedTerms}
                  onChange={(v) => setHasAcceptedTerms(v.target.checked)}
                >
                  I accept the{' '}
                  <Link href={ROUTES.TERMS_OF_USE} target="_blank">
                    Special Conditions ORKG
                  </Link>
                </Checkbox>
                <Checkbox
                  size="sm"
                  isRequired
                  isSelected={hasAcceptedPrivacyStatement}
                  onChange={(v) =>
                    setHasAcceptedPrivacyStatement(v.target.checked)
                  }
                >
                  I agree to the processing of my personal data provided here by
                  Technische Informationsbibliothek (TIB). In accordance with
                  the{' '}
                  <Link href={ROUTES.DATA_PROTECTION} target="_blank">
                    data protection declaration
                  </Link>{' '}
                  as well as the{' '}
                  <Link href="/infosheet-data-protection.pdf" target="_blank">
                    info sheet data protection
                  </Link>
                  , the data is processed exclusively by TIB in order to provide
                  services of our platform.
                </Checkbox>
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
              <ButtonFormSubmit
                color="primary"
                type="submit"
                isDisabled={!hasAcceptedTerms || !hasAcceptedPrivacyStatement}
              >
                Sign up
              </ButtonFormSubmit>
            </ModalFooter>
          )}
        </form>
      </ModalContent>
    </Modal>
  );
}
