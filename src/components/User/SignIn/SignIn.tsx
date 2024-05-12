'use client';

import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, useDisclosure } from '@nextui-org/react';

import ForgotPasswordModal from '@/components/User/ForgotPassword/ForgotPasswordModal';
import SignInModal from '@/components/User/SignIn/SignInModal';
import SignUpModal from '@/components/User/SignUp/SignUpModal';

export default function SignIn() {
  const {
    isOpen: isOpenSignInModal,
    onOpen: onOpenSignInModal,
    onClose: onCloseSignInModal,
    onOpenChange: onOpenChangeSignInModal,
  } = useDisclosure();

  const {
    isOpen: isOpenForgotPasswordModal,
    onOpen: onOpenForgotPasswordModal,
    onClose: onCloseForgotPasswordModal,
    onOpenChange: onOpenChangeForgotPasswordModal,
  } = useDisclosure();

  const {
    isOpen: isOpenSignUpModal,
    onOpen: onOpenSignUpModal,
    onClose: onCloseSignUpModal,
    onOpenChange: onOpenChangeSignUpModal,
  } = useDisclosure();

  const handleSignInClick = () => {
    onOpenSignInModal();
    onCloseSignUpModal();
    onCloseForgotPasswordModal();
  };

  const handleForgotPasswordClick = () => {
    onOpenForgotPasswordModal();
    onCloseSignInModal();
  };

  const handleSignUpClick = () => {
    onOpenSignUpModal();
    onCloseSignInModal();
  };

  return (
    <div>
      <Button
        color="secondary"
        className="md:me-2 px-4"
        variant="bordered"
        onPress={onOpenSignInModal}
      >
        <FontAwesomeIcon icon={faUser} className="hidden md:inline-block" />{' '}
        Sign in
      </Button>
      {isOpenSignInModal && (
        <SignInModal
          onOpenChange={onOpenChangeSignInModal}
          handleForgotPasswordClick={handleForgotPasswordClick}
          handleSignUpClick={handleSignUpClick}
        />
      )}
      {isOpenForgotPasswordModal && (
        <ForgotPasswordModal
          onOpenChange={onOpenChangeForgotPasswordModal}
          handleSignInClick={handleSignInClick}
        />
      )}
      {isOpenSignUpModal && (
        <SignUpModal
          onOpenChange={onOpenChangeSignUpModal}
          handleSignInClick={handleSignInClick}
        />
      )}
    </div>
  );
}
