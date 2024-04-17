'use client';

import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
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
        <ModalHeader>Change password</ModalHeader>
        <form action={formAction}>
          <ModalBody>
            {state?.error && <Alert color="danger">{state.error}</Alert>}
            {state?.success ? (
              <Alert color="success">Settings update successfully.</Alert>
            ) : (
              <>
                <Input
                  label="Current password"
                  type="password"
                  name="oldPassword"
                  isRequired
                  isInvalid={!!state?.data?.oldPassword}
                  errorMessage={state?.data?.oldPassword?.message}
                />
                <Input
                  label="New password"
                  type="password"
                  name="password"
                  isRequired
                  isInvalid={!!state?.data?.password}
                  errorMessage={state?.data?.password?.message}
                />
                <Input
                  label="Repeat new password"
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
                Save
              </ButtonFormSubmit>
            </ModalFooter>
          )}
        </form>
      </ModalContent>
    </Modal>
  );
}
